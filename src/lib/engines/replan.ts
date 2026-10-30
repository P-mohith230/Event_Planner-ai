import {
  EventPlan,
  PlanChange,
  BudgetItem,
  EventTask,
} from "@/types/schema";
import { calculateGuestScaledAmount, formatCurrency } from "./budget";
import { subtractDaysFromDate } from "./schedule";

/**
 * Pure deterministic engine for constraint-driven replanning.
 * Computes a structured PlanChange diff set when the user modifies:
 * - guestCount
 * - eventDate
 * - totalBudgetMinor
 */

export interface ReplanRequest {
  currentPlan: EventPlan;
  newGuestCount?: number;
  newEventDate?: string;
  newTotalBudgetMinor?: number;
}

export interface ReplanResult {
  changes: PlanChange[];
  totalFinancialImpactMinor: number;
  deterministicChangeCount: number;
  affectedBudgetItemsCount: number;
  affectedTasksCount: number;
}

/**
 * Generates typed PlanChange proposals based on updated constraints.
 * Strictly honors item locks.
 */
export function generateConstraintChanges(request: ReplanRequest): ReplanResult {
  const { currentPlan, newGuestCount, newEventDate, newTotalBudgetMinor } = request;
  const changes: PlanChange[] = [];
  let totalFinancialImpactMinor = 0;
  let affectedBudgetItemsCount = 0;
  let affectedTasksCount = 0;

  // ----------------------------------------------------
  // 1. Guest Count Change
  // ----------------------------------------------------
  if (
    typeof newGuestCount === "number" &&
    newGuestCount !== currentPlan.guestCount &&
    newGuestCount > 0
  ) {
    const guestDelta = newGuestCount - currentPlan.guestCount;
    const direction = guestDelta > 0 ? "increase" : "decrease";
    const absGuestDelta = Math.abs(guestDelta);

    for (const item of currentPlan.budgetItems) {
      // If item is locked by user, skip it!
      if (item.locked) continue;

      if (item.isPerGuest && typeof item.perGuestAmountMinor === "number") {
        const proposedAmountMinor = calculateGuestScaledAmount(item, newGuestCount);
        const itemDelta = proposedAmountMinor - item.amountMinor;

        if (itemDelta !== 0) {
          const formattedBefore = formatCurrency(item.amountMinor, currentPlan.currency);
          const formattedAfter = formatCurrency(proposedAmountMinor, currentPlan.currency);
          const perGuestFormatted = formatCurrency(item.perGuestAmountMinor, currentPlan.currency);

          changes.push({
            id: `change-budget-${item.id}`,
            entityType: "budget-item",
            entityId: item.id,
            entityTitle: item.label,
            field: "amountMinor",
            beforeValue: item.amountMinor,
            proposedValue: proposedAmountMinor,
            reason: `Scales proportionally with ${direction} of ${absGuestDelta} guests (${perGuestFormatted}/guest): ${formattedBefore} → ${formattedAfter}`,
            isDeterministic: true,
            financialImpactMinor: itemDelta,
            requiresApproval: true,
            status: "pending",
          });

          totalFinancialImpactMinor += itemDelta;
          affectedBudgetItemsCount++;
        }
      }
    }
  }

  // ----------------------------------------------------
  // 2. Event Date Change
  // ----------------------------------------------------
  if (
    typeof newEventDate === "string" &&
    newEventDate !== currentPlan.eventDate &&
    /^\d{4}-\d{2}-\d{2}$/.test(newEventDate)
  ) {
    for (const task of currentPlan.tasks) {
      // Locked tasks are NEVER modified by schedule replanner
      if (task.locked) continue;

      if (typeof task.daysBeforeEvent === "number" && task.daysBeforeEvent >= 0) {
        const proposedDueDate = subtractDaysFromDate(newEventDate, task.daysBeforeEvent);

        if (proposedDueDate !== task.dueDate) {
          changes.push({
            id: `change-task-${task.id}`,
            entityType: "task",
            entityId: task.id,
            entityTitle: task.title,
            field: "dueDate",
            beforeValue: task.dueDate,
            proposedValue: proposedDueDate,
            reason: `Shifted to remain ${task.daysBeforeEvent} days before the rescheduled event date (${newEventDate})`,
            isDeterministic: true,
            financialImpactMinor: 0,
            requiresApproval: true,
            status: "pending",
          });

          affectedTasksCount++;
        }
      }
    }
  }

  // ----------------------------------------------------
  // 3. Total Budget Change
  // ----------------------------------------------------
  if (
    typeof newTotalBudgetMinor === "number" &&
    newTotalBudgetMinor !== currentPlan.totalBudgetMinor &&
    newTotalBudgetMinor >= 0
  ) {
    const budgetDelta = newTotalBudgetMinor - currentPlan.totalBudgetMinor;
    const formattedBefore = formatCurrency(currentPlan.totalBudgetMinor, currentPlan.currency);
    const formattedAfter = formatCurrency(newTotalBudgetMinor, currentPlan.currency);

    changes.push({
      id: `change-event-totalBudgetMinor`,
      entityType: "event",
      entityId: currentPlan.id,
      entityTitle: "Total Event Budget",
      field: "totalBudgetMinor",
      beforeValue: currentPlan.totalBudgetMinor,
      proposedValue: newTotalBudgetMinor,
      reason: `Updated overall financial ceiling: ${formattedBefore} → ${formattedAfter}`,
      isDeterministic: true,
      financialImpactMinor: budgetDelta,
      requiresApproval: true,
      status: "pending",
    });
  }

  return {
    changes,
    totalFinancialImpactMinor,
    deterministicChangeCount: changes.filter((c) => c.isDeterministic).length,
    affectedBudgetItemsCount,
    affectedTasksCount,
  };
}

/**
 * Applies only accepted changes to the event plan.
 * Pure function returning a new immutable EventPlan instance.
 */
export function applyAcceptedChanges(
  plan: EventPlan,
  acceptedChangeIds: Set<string>,
  allChanges: PlanChange[]
): EventPlan {
  let updatedGuestCount = plan.guestCount;
  let updatedEventDate = plan.eventDate;
  let updatedTotalBudgetMinor = plan.totalBudgetMinor;

  // Maps for quick updates
  const budgetUpdates = new Map<string, number>();
  const taskUpdates = new Map<string, string>();

  for (const change of allChanges) {
    if (!acceptedChangeIds.has(change.id)) continue;

    if (change.entityType === "event") {
      if (change.field === "totalBudgetMinor" && typeof change.proposedValue === "number") {
        updatedTotalBudgetMinor = change.proposedValue;
      }
    } else if (change.entityType === "budget-item") {
      if (change.field === "amountMinor" && typeof change.proposedValue === "number") {
        budgetUpdates.set(change.entityId, change.proposedValue);
      }
    } else if (change.entityType === "task") {
      if (change.field === "dueDate" && typeof change.proposedValue === "string") {
        taskUpdates.set(change.entityId, change.proposedValue);
      }
    }
  }

  const updatedBudgetItems: BudgetItem[] = plan.budgetItems.map((item) => {
    if (budgetUpdates.has(item.id)) {
      return {
        ...item,
        amountMinor: budgetUpdates.get(item.id)!,
      };
    }
    return item;
  });

  const updatedTasks: EventTask[] = plan.tasks.map((task) => {
    if (taskUpdates.has(task.id)) {
      return {
        ...task,
        dueDate: taskUpdates.get(task.id)!,
      };
    }
    return task;
  });

  return {
    ...plan,
    guestCount: updatedGuestCount,
    eventDate: updatedEventDate,
    totalBudgetMinor: updatedTotalBudgetMinor,
    budgetItems: updatedBudgetItems,
    tasks: updatedTasks,
    updatedAt: new Date().toISOString(),
  };
}

