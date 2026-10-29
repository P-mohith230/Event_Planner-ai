import { EventTask } from "@/types/schema";

/**
 * Pure deterministic functions for event schedule and task dependency calculations.
 * Avoids JavaScript Date timezone quirks by strictly working with ISO calendar date components (YYYY-MM-DD).
 */

export interface ScheduleConflict {
  taskId: string;
  taskTitle: string;
  conflictType: "cycle" | "dependency-after" | "overdue" | "invalid-date";
  message: string;
  conflictingTaskId?: string;
}

/**
 * Parse YYYY-MM-DD string into UTC midnight timestamp to prevent timezone shifts.
 */
export function parseISODateParts(isoDate: string): {
  year: number;
  month: number;
  day: number;
} | null {
  const parts = isoDate.split("-");
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;

  return { year, month, day };
}

/**
 * Formats date object to YYYY-MM-DD strictly in UTC.
 */
export function formatToISODate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Computes offset date: targetDate minus offsetDays.
 */
export function subtractDaysFromDate(isoDate: string, days: number): string {
  const parsed = parseISODateParts(isoDate);
  if (!parsed) return isoDate;

  // Use UTC Date constructor to prevent daylight saving / timezone distortion
  const d = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day));
  d.setUTCDate(d.getUTCDate() - days);
  return formatToISODate(d);
}

/**
 * Computes difference in calendar days between two ISO dates (dateB - dateA).
 */
export function daysBetween(isoDateA: string, isoDateB: string): number {
  const a = parseISODateParts(isoDateA);
  const b = parseISODateParts(isoDateB);
  if (!a || !b) return 0;

  const utcA = Date.UTC(a.year, a.month - 1, a.day);
  const utcB = Date.UTC(b.year, b.month - 1, b.day);
  const msPerDay = 1000 * 60 * 60 * 24;

  return Math.round((utcB - utcA) / msPerDay);
}

/**
 * Validates dependencies for missing references and cycles.
 * Uses Depth First Search (DFS) with 3-color marking:
 * 0 = unvisited, 1 = visiting (in recursion stack), 2 = visited.
 */
export function detectDependencyCycles(tasks: EventTask[]): string[][] {
  const taskMap = new Map<string, EventTask>();
  for (const t of tasks) {
    taskMap.set(t.id, t);
  }

  const visited = new Map<string, number>(); // 0: unvisited, 1: visiting, 2: done
  const cycles: string[][] = [];

  function dfs(currentId: string, path: string[]) {
    visited.set(currentId, 1);
    path.push(currentId);

    const task = taskMap.get(currentId);
    if (task && Array.isArray(task.dependsOn)) {
      for (const depId of task.dependsOn) {
        if (!taskMap.has(depId)) continue; // missing dependency handled separately

        const state = visited.get(depId) || 0;
        if (state === 1) {
          // Found cycle!
          const cycleStartIdx = path.indexOf(depId);
          cycles.push(path.slice(cycleStartIdx).concat(depId));
        } else if (state === 0) {
          dfs(depId, path);
        }
      }
    }

    path.pop();
    visited.set(currentId, 2);
  }

  for (const t of tasks) {
    if (!visited.get(t.id)) {
      dfs(t.id, []);
    }
  }

  return cycles;
}

/**
 * Validates the full schedule for cycles, invalid dates, and dependency order violations.
 */
export function validateSchedule(
  tasks: EventTask[],
  eventDate: string
): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = [];
  const taskMap = new Map<string, EventTask>();

  for (const t of tasks) {
    taskMap.set(t.id, t);
    const parsed = parseISODateParts(t.dueDate);
    if (!parsed) {
      conflicts.push({
        taskId: t.id,
        taskTitle: t.title,
        conflictType: "invalid-date",
        message: `Invalid due date format: "${t.dueDate}". Must be YYYY-MM-DD.`,
      });
    }
  }

  // 1. Check Cycles
  const cycles = detectDependencyCycles(tasks);
  for (const cycle of cycles) {
    const cycleNames = cycle
      .map((id) => taskMap.get(id)?.title || id)
      .join(" -> ");
    conflicts.push({
      taskId: cycle[0],
      taskTitle: taskMap.get(cycle[0])?.title || cycle[0],
      conflictType: "cycle",
      message: `Circular dependency detected: ${cycleNames}`,
    });
  }

  // 2. Check Dependency Chronology:
  // If Task A depends on Task B, Task B must be due ON or BEFORE Task A.
  for (const task of tasks) {
    if (!task.dependsOn || task.dependsOn.length === 0) continue;

    for (const depId of task.dependsOn) {
      const depTask = taskMap.get(depId);
      if (!depTask) {
        conflicts.push({
          taskId: task.id,
          taskTitle: task.title,
          conflictType: "dependency-after",
          message: `Task depends on missing task ID: "${depId}".`,
          conflictingTaskId: depId,
        });
        continue;
      }

      // Check if dependency is due after this task
      if (task.dueDate && depTask.dueDate && depTask.dueDate > task.dueDate) {
        conflicts.push({
          taskId: task.id,
          taskTitle: task.title,
          conflictType: "dependency-after",
          message: `Task "${task.title}" (due ${task.dueDate}) is due before its prerequisite "${depTask.title}" (due ${depTask.dueDate}).`,
          conflictingTaskId: depId,
        });
      }
    }
  }

  return conflicts;
}

/**
 * Recalculates due dates when the event date shifts.
 * Preserves locked tasks strictly.
 */
export function recalculateScheduleForNewEventDate(
  tasks: EventTask[],
  newEventDate: string
): { updatedTasks: EventTask[]; changedCount: number } {
  let changedCount = 0;

  const updatedTasks = tasks.map((task) => {
    // If user locked this task, DO NOT change its due date
    if (task.locked) {
      return task;
    }

    // If task has a relative offset in daysBeforeEvent, recompute from new event date
    if (typeof task.daysBeforeEvent === "number" && task.daysBeforeEvent >= 0) {
      const newDueDate = subtractDaysFromDate(newEventDate, task.daysBeforeEvent);
      if (newDueDate !== task.dueDate) {
        changedCount++;
        return {
          ...task,
          dueDate: newDueDate,
        };
      }
    }

    return task;
  });

  return { updatedTasks, changedCount };
}
