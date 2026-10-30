import React, { useState } from "react";
import { EventTask, TaskStatus, TaskPriority } from "@/types/schema";
import { validateSchedule, subtractDaysFromDate } from "@/lib/engines/schedule";
import { ProvenanceBadge } from "../common/ProvenanceBadge";
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lock,
  Unlock,
  Plus,
  Trash2,
  ArrowRight,
  GitBranch,
} from "lucide-react";

interface TimelinePanelProps {
  tasks: EventTask[];
  eventDate: string;
  onToggleLock: (id: string) => void;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onAddTask: (task: EventTask) => void;
  onDeleteTask: (id: string) => void;
}

export function TimelinePanel({
  tasks,
  eventDate,
  onToggleLock,
  onUpdateStatus,
  onAddTask,
  onDeleteTask,
}: TimelinePanelProps) {
  const conflicts = validateSchedule(tasks, eventDate);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isAdding, setIsAdding] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Planning");
  const [newDaysBefore, setNewDaysBefore] = useState("30");
  const [newPriority, setNewPriority] = useState<TaskPriority>("medium");
  const [newDependsOn, setNewDependsOn] = useState<string>("");

  const completedCount = tasks.filter((t) => t.status === "done").length;
  const progressPercent =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks =
    filterStatus === "all"
      ? tasks
      : tasks.filter((task) => task.status === filterStatus);

  // Sort tasks chronologically by due date
  const sortedTasks = [...filteredTasks].sort((a, b) =>
    a.dueDate.localeCompare(b.dueDate)
  );

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const days = parseInt(newDaysBefore, 10) || 0;
    const computedDueDate = subtractDaysFromDate(eventDate, days);

    const newTask: EventTask = {
      id: `task-custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory.trim() || "General",
      status: "todo",
      dueDate: computedDueDate,
      daysBeforeEvent: days,
      dependsOn: newDependsOn ? [newDependsOn] : [],
      priority: newPriority,
      locked: false,
      provenance: "user-entered",
    };

    onAddTask(newTask);
    setNewTitle("");
    setNewDaysBefore("30");
    setNewPriority("medium");
    setNewDependsOn("");
    setIsAdding(false);
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case "done":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "in-progress":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "blocked":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-stone-100 text-stone-700 border-stone-200";
    }
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case "high":
        return "text-rose-700 bg-rose-50 border-rose-200";
      case "medium":
        return "text-amber-700 bg-amber-50 border-amber-200";
      default:
        return "text-stone-600 bg-stone-50 border-stone-200";
    }
  };

  return (
    <div className="space-y-6" aria-label="Timeline and Schedule Workspace">
      {/* Schedule Conflicts Alert */}
      {conflicts.length > 0 && (
        <div
          className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 shadow-sm"
          role="alert"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <h3 className="text-sm font-bold">
              Schedule Dependency Warning ({conflicts.length} conflict{conflicts.length > 1 ? "s" : ""})
            </h3>
          </div>
          <ul className="mt-2 text-xs space-y-1 list-disc list-inside text-amber-800">
            {conflicts.map((c, idx) => (
              <li key={idx}>
                <strong>{c.taskTitle}:</strong> {c.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Progress & Milestone Header */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-sm font-bold text-stone-900 tracking-tight">Timeline Progress</h2>
            <p className="text-xs text-stone-500">
              {completedCount} of {tasks.length} tasks completed ({progressPercent}%)
            </p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden mt-3" aria-hidden="true">
          <div
            className="h-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2 mt-4" role="tablist" aria-label="Filter tasks by status">
          {(["all", "todo", "in-progress", "done"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors ${
                filterStatus === status
                  ? "bg-violet-700 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {status} ({status === "all" ? tasks.length : tasks.filter((t) => t.status === status).length})
            </button>
          ))}
        </div>
      </div>

      {/* New Task Form */}
      {isAdding && (
        <form onSubmit={handleCreateTask} className="p-4 bg-white rounded-xl border border-stone-200 shadow-sm">
          <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3">
            Add New Timeline Task
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="new-task-title" className="block text-xs font-semibold text-stone-700 mb-1">
                Task Title
              </label>
              <input
                id="new-task-title"
                type="text"
                required
                placeholder="e.g. Schedule final walkthrough"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
              />
            </div>

            <div>
              <label htmlFor="new-task-category" className="block text-xs font-semibold text-stone-700 mb-1">
                Category
              </label>
              <input
                id="new-task-category"
                type="text"
                required
                placeholder="e.g. Venue, Catering"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
              />
            </div>

            <div>
              <label htmlFor="new-task-days" className="block text-xs font-semibold text-stone-700 mb-1">
                Days Before Event
              </label>
              <input
                id="new-task-days"
                type="number"
                min="0"
                max="730"
                required
                value={newDaysBefore}
                onChange={(e) => setNewDaysBefore(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div>
              <label htmlFor="new-task-priority" className="block text-xs font-semibold text-stone-700 mb-1">
                Priority
              </label>
              <select
                id="new-task-priority"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="new-task-prereq" className="block text-xs font-semibold text-stone-700 mb-1">
                Prerequisite Dependency (Optional)
              </label>
              <select
                id="new-task-prereq"
                value={newDependsOn}
                onChange={(e) => setNewDependsOn(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
              >
                <option value="">None (Can start immediately)</option>
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} (Due {t.dueDate})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg"
            >
              Save Task
            </button>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm divide-y divide-stone-200 overflow-hidden">
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
              task.status === "done" ? "bg-stone-50/50 opacity-70" : "hover:bg-stone-50/40"
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Status cycle button */}
              <button
                type="button"
                onClick={() => {
                  const nextStatus: Record<TaskStatus, TaskStatus> = {
                    todo: "in-progress",
                    "in-progress": "done",
                    done: "todo",
                    blocked: "todo",
                  };
                  onUpdateStatus(task.id, nextStatus[task.status]);
                }}
                className={`mt-0.5 p-1 rounded-md border text-xs font-bold transition-all ${
                  task.status === "done"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : task.status === "in-progress"
                    ? "bg-amber-100 text-amber-700 border-amber-300"
                    : "bg-white text-stone-400 border-stone-300 hover:border-violet-500"
                }`}
                title={`Status: ${task.status}. Click to advance.`}
                aria-label={`Current status: ${task.status}. Click to change.`}
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-sm font-bold ${
                      task.status === "done"
                        ? "line-through text-stone-500"
                        : "text-stone-900"
                    }`}
                  >
                    {task.title}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">
                    {task.category}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded border capitalize font-semibold ${getStatusBadge(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded border uppercase font-bold text-[10px] ${getPriorityBadge(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                  <ProvenanceBadge provenance={task.provenance} />
                </div>

                <div className="flex items-center gap-3 text-xs text-stone-500 mt-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    Due: <strong>{task.dueDate}</strong>
                    {task.daysBeforeEvent !== undefined && (
                      <span className="text-stone-400">({task.daysBeforeEvent}d before event)</span>
                    )}
                  </span>

                  {task.dependsOn && task.dependsOn.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
                      <GitBranch className="w-3 h-3" />
                      <span>
                        Prerequisite: {tasks.find((t) => t.id === task.dependsOn[0])?.title || "Prerequisite Task"}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Lock and Delete actions */}
            <div className="flex items-center justify-between sm:justify-end gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => onToggleLock(task.id)}
                className={`p-1.5 rounded-lg border text-xs transition-colors ${
                  task.locked
                    ? "bg-amber-50 border-amber-300 text-amber-800"
                    : "bg-stone-100 border-stone-200 text-stone-400 hover:text-stone-700"
                }`}
                title={
                  task.locked
                    ? "Decision Locked: Due date will NOT shift when event is rescheduled"
                    : "Decision Unlocked: Will automatically cascade with event date changes"
                }
                aria-label={task.locked ? `Unlock ${task.title}` : `Lock ${task.title}`}
              >
                {task.locked ? (
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                ) : (
                  <Unlock className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => onDeleteTask(task.id)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete task"
                aria-label={`Delete task ${task.title}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {sortedTasks.length === 0 && (
          <div className="p-8 text-center text-xs text-stone-500">
            No tasks match the filter &quot;{filterStatus}&quot;.
          </div>
        )}
      </div>
    </div>
  );
}

