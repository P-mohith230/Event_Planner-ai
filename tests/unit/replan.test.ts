import { describe, it, expect } from "vitest";
import {
  generateConstraintChanges,
  applyAcceptedChanges,
} from "@/lib/engines/replan";
import { EventPlan } from "@/types/schema";

describe("ReplanEngine", () => {
  const basePlan: EventPlan = {
    id: "plan-test",
    eventType: "wedding",
    title: "Alex & Jordan Wedding",
    eventDate: "2026-11-20",
    guestCount: 100,
    currency: "USD",
    totalBudgetMinor: 2000000, // $20,000.00
    priorities: ["Catering", "Photography"],
    budgetItems: [
      {
        id: "item-catering",
        category: "Catering",
        label: "Dinner & Drinks",
        amountMinor: 800000, // $8,000.00
        included: true,
        provenance: "confirmed-by-user",
        locked: false,
        isPerGuest: true,
        perGuestAmountMinor: 8000, // $80/guest
      },
      {
        id: "item-locked-rental",
        category: "Rentals",
        label: "Tent & Chairs",
        amountMinor: 200000, // $2,000.00
        included: true,
        provenance: "user-entered",
        locked: true, // User LOCKED this item
        isPerGuest: true,
        perGuestAmountMinor: 2000,
      },
      {
        id: "item-fixed-venue",
        category: "Venue",
        label: "Barn Venue Fee",
        amountMinor: 500000, // $5,000.00
        included: true,
        provenance: "confirmed-by-user",
        locked: false,
        isPerGuest: false, // Fixed fee
      },
    ],
    tasks: [
      {
        id: "task-catering",
        title: "Final Guest Count to Caterer",
        category: "Catering",
        status: "todo",
        dueDate: "2026-11-06",
        daysBeforeEvent: 14, // 14 days before
        dependsOn: [],
        priority: "high",
        locked: false,
        provenance: "user-entered",
      },
      {
        id: "task-locked-tasting",
        title: "Cake Tasting",
        category: "Catering",
        status: "done",
        dueDate: "2026-09-01",
        daysBeforeEvent: 80,
        dependsOn: [],
        priority: "medium",
        locked: true, // User LOCKED
        provenance: "confirmed-by-user",
      },
    ],
    vendorItems: [],
    ideas: [],
    createdAt: "2026-10-01T00:00:00.000Z",
    updatedAt: "2026-10-01T00:00:00.000Z",
  };

  it("generates deterministic budget changes when guest count changes", () => {
    // Increase guests from 100 to 125 (+25 guests)
    const result = generateConstraintChanges({
      currentPlan: basePlan,
      newGuestCount: 125,
    });

    expect(result.changes.length).toBe(1); // Only unlocked catering item
    const cateringChange = result.changes[0];

    expect(cateringChange.entityType).toBe("budget-item");
    expect(cateringChange.entityId).toBe("item-catering");
    expect(cateringChange.beforeValue).toBe(800000); // $8,000
    // 125 guests * $80 = $10,000 (1000000 cents)
    expect(cateringChange.proposedValue).toBe(1000000);
    expect(cateringChange.financialImpactMinor).toBe(200000); // +$2,000
    expect(cateringChange.isDeterministic).toBe(true);

    // The locked rental item MUST NOT be modified
    const lockedChange = result.changes.find(
      (c) => c.entityId === "item-locked-rental"
    );
    expect(lockedChange).toBeUndefined();
  });

  it("generates deterministic schedule changes when event date shifts", () => {
    // Reschedule event from 2026-11-20 to 2026-12-25
    const result = generateConstraintChanges({
      currentPlan: basePlan,
      newEventDate: "2026-12-25",
    });

    expect(result.changes.length).toBe(1); // Only unlocked task
    const taskChange = result.changes[0];

    expect(taskChange.entityType).toBe("task");
    expect(taskChange.entityId).toBe("task-catering");
    // 14 days before 2026-12-25 = 2026-12-11
    expect(taskChange.proposedValue).toBe("2026-12-11");

    // The locked task MUST NOT be modified
    const lockedTaskChange = result.changes.find(
      (c) => c.entityId === "task-locked-tasting"
    );
    expect(lockedTaskChange).toBeUndefined();
  });

  it("applies accepted changes and ignores rejected changes", () => {
    // Generate both guest and date changes
    const replanResult = generateConstraintChanges({
      currentPlan: basePlan,
      newGuestCount: 150, // Catering -> $12,000 (+$4,000)
      newEventDate: "2026-12-25", // Task -> 2026-12-11
    });

    expect(replanResult.changes.length).toBe(2);

    const cateringChange = replanResult.changes.find(
      (c) => c.entityId === "item-catering"
    )!;
    const taskChange = replanResult.changes.find(
      (c) => c.entityId === "task-catering"
    )!;

    // Simulate user ACCEPTING catering change, but REJECTING task date change
    const acceptedChangeIds = new Set([cateringChange.id]);

    const updatedPlan = applyAcceptedChanges(
      basePlan,
      acceptedChangeIds,
      replanResult.changes
    );

    // Catering was accepted: amount updated to 150 * $80 = $12,000 (1200000 cents)
    const updatedCatering = updatedPlan.budgetItems.find(
      (i) => i.id === "item-catering"
    )!;
    expect(updatedCatering.amountMinor).toBe(1200000);

    // Task date was REJECTED: dueDate remains original 2026-11-06!
    const unchangedTask = updatedPlan.tasks.find(
      (t) => t.id === "task-catering"
    )!;
    expect(unchangedTask.dueDate).toBe("2026-11-06");

    // Locked items untouched
    const lockedRental = updatedPlan.budgetItems.find(
      (i) => i.id === "item-locked-rental"
    )!;
    expect(lockedRental.amountMinor).toBe(200000);
  });
});

