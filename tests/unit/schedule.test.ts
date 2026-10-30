import { describe, it, expect } from "vitest";
import {
  parseISODateParts,
  subtractDaysFromDate,
  daysBetween,
  detectDependencyCycles,
  validateSchedule,
  recalculateScheduleForNewEventDate,
} from "@/lib/engines/schedule";
import { EventTask } from "@/types/schema";

describe("ScheduleEngine", () => {
  it("parses valid and invalid ISO dates reliably", () => {
    expect(parseISODateParts("2026-11-20")).toEqual({ year: 2026, month: 11, day: 20 });
    expect(parseISODateParts("invalid-date")).toBeNull();
    expect(parseISODateParts("2026-13-01")).toBeNull(); // Month out of range
  });

  it("calculates exact calendar day subtractions without timezone distortion", () => {
    // 60 days before 2026-12-15 = 2026-10-16
    expect(subtractDaysFromDate("2026-12-15", 60)).toBe("2026-10-16");
    // Cross-year boundary: 30 days before 2027-01-15 = 2026-12-16
    expect(subtractDaysFromDate("2027-01-15", 30)).toBe("2026-12-16");
  });

  it("calculates days between two ISO dates", () => {
    expect(daysBetween("2026-10-01", "2026-10-31")).toBe(30);
    expect(daysBetween("2026-10-31", "2026-10-01")).toBe(-30);
  });

  it("detects circular dependencies in task graphs", () => {
    const cyclicTasks: EventTask[] = [
      {
        id: "task-A",
        title: "Task A",
        category: "Planning",
        status: "todo",
        dueDate: "2026-10-01",
        dependsOn: ["task-B"],
        priority: "medium",
        locked: false,
        provenance: "user-entered",
      },
      {
        id: "task-B",
        title: "Task B",
        category: "Planning",
        status: "todo",
        dueDate: "2026-10-05",
        dependsOn: ["task-C"],
        priority: "medium",
        locked: false,
        provenance: "user-entered",
      },
      {
        id: "task-C",
        title: "Task C",
        category: "Planning",
        status: "todo",
        dueDate: "2026-10-10",
        dependsOn: ["task-A"], // Cycles back to A!
        priority: "medium",
        locked: false,
        provenance: "user-entered",
      },
    ];

    const cycles = detectDependencyCycles(cyclicTasks);
    expect(cycles.length).toBeGreaterThan(0);

    const conflicts = validateSchedule(cyclicTasks, "2026-12-31");
    const cycleConflict = conflicts.find((c) => c.conflictType === "cycle");
    expect(cycleConflict).toBeDefined();
    expect(cycleConflict?.message).toContain("Circular dependency detected");
  });

  it("detects chronological dependency conflicts (due before prerequisite)", () => {
    const invalidTasks: EventTask[] = [
      {
        id: "task-1",
        title: "Prerequisite Task",
        category: "Venue",
        status: "todo",
        dueDate: "2026-10-20", // Due LATER
        dependsOn: [],
        priority: "high",
        locked: false,
        provenance: "user-entered",
      },
      {
        id: "task-2",
        title: "Dependent Task",
        category: "Venue",
        status: "todo",
        dueDate: "2026-10-10", // Due EARLIER than its prerequisite!
        dependsOn: ["task-1"],
        priority: "high",
        locked: false,
        provenance: "user-entered",
      },
    ];

    const conflicts = validateSchedule(invalidTasks, "2026-12-31");
    const depConflict = conflicts.find((c) => c.conflictType === "dependency-after");
    expect(depConflict).toBeDefined();
    expect(depConflict?.message).toContain("is due before its prerequisite");
  });

  it("recalculates schedule when event date shifts while strictly preserving locked tasks", () => {
    const tasks: EventTask[] = [
      {
        id: "task-unlocked",
        title: "Finalize Menu",
        category: "Catering",
        status: "todo",
        dueDate: "2026-11-01",
        daysBeforeEvent: 30, // 30 days before event
        dependsOn: [],
        priority: "high",
        locked: false, // Unlocked
        provenance: "user-entered",
      },
      {
        id: "task-locked",
        title: "Book Photographer Deposit",
        category: "Photo",
        status: "done",
        dueDate: "2026-09-15",
        daysBeforeEvent: 60,
        dependsOn: [],
        priority: "high",
        locked: true, // User LOCKED this date!
        provenance: "confirmed-by-user",
      },
    ];

    // New event date: 2026-12-31
    const { updatedTasks, changedCount } = recalculateScheduleForNewEventDate(
      tasks,
      "2026-12-31"
    );

    expect(changedCount).toBe(1);

    const unlocked = updatedTasks.find((t) => t.id === "task-unlocked")!;
    // 30 days before 2026-12-31 = 2026-12-01
    expect(unlocked.dueDate).toBe("2026-12-01");

    const locked = updatedTasks.find((t) => t.id === "task-locked")!;
    // Locked date remains unchanged at 2026-09-15!
    expect(locked.dueDate).toBe("2026-09-15");
  });
});

