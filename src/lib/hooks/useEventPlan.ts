"use client";

import { useState, useEffect, useCallback } from "react";
import {
  EventPlan,
  PlanChange,
  BudgetItem,
  EventTask,
  VendorItem,
  Idea,
  TaskStatus,
} from "@/types/schema";
import { SAMPLE_WEDDING_PLAN, SAMPLE_PLANS } from "../data/samplePlans";
import {
  generateConstraintChanges,
  applyAcceptedChanges,
} from "../engines/replan";
import { AISuggestionsResponse } from "../ai/validator";

const STORAGE_KEY = "eventpilot_active_plan_v1";

export function useEventPlan() {
  const [plan, setPlan] = useState<EventPlan>(SAMPLE_WEDDING_PLAN);
  const [activeTab, setActiveTab] = useState<"budget" | "timeline" | "vendors" | "ideas">("budget");
  const [pendingChanges, setPendingChanges] = useState<PlanChange[]>([]);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = useState(false);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.eventType) {
          setPlan(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to read plan from localStorage:", e);
    }
  }, []);

  // Save to localStorage when plan updates
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch (e) {
      console.warn("Failed to persist plan to localStorage:", e);
    }
  }, [plan, isMounted]);

  const showNotification = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 4000);
    },
    []
  );

  // Switch between sample templates
  const switchSamplePlan = useCallback(
    (type: "wedding" | "birthday" | "community") => {
      const template = SAMPLE_PLANS[type];
      if (template) {
        setPlan(template);
        setPendingChanges([]);
        setIsChangeModalOpen(false);
        showNotification(`Loaded ${template.title}`, "success");
      }
    },
    [showNotification]
  );

  // Create a new customized plan
  const createCustomPlan = useCallback(
    (newPlan: EventPlan) => {
      setPlan(newPlan);
      setPendingChanges([]);
      setIsChangeModalOpen(false);
      setIsNewPlanModalOpen(false);
      showNotification(`Created plan: "${newPlan.title}"`, "success");
    },
    [showNotification]
  );

  // Trigger constraint change preview
  const requestConstraintChange = useCallback(
    (params: {
      newGuestCount?: number;
      newEventDate?: string;
      newTotalBudgetMinor?: number;
    }) => {
      const result = generateConstraintChanges({
        currentPlan: plan,
        newGuestCount: params.newGuestCount,
        newEventDate: params.newEventDate,
        newTotalBudgetMinor: params.newTotalBudgetMinor,
      });

      if (result.changes.length > 0) {
        setPendingChanges(result.changes);
        setIsChangeModalOpen(true);
        showNotification(
          `Simulated impact: ${result.changes.length} proposed change(s) require review.`,
          "info"
        );
      } else {
        // Direct update if no dependent items were affected
        setPlan((prev) => ({
          ...prev,
          guestCount: params.newGuestCount ?? prev.guestCount,
          eventDate: params.newEventDate ?? prev.eventDate,
          totalBudgetMinor: params.newTotalBudgetMinor ?? prev.totalBudgetMinor,
          updatedAt: new Date().toISOString(),
        }));
        showNotification("Event constraints updated directly (no dependent items affected).", "success");
      }
    },
    [plan, showNotification]
  );

  // Accept a single change
  const acceptChange = useCallback(
    (changeId: string) => {
      setPlan((prev) => {
        const accepted = new Set([changeId]);
        return applyAcceptedChanges(prev, accepted, pendingChanges);
      });
      setPendingChanges((prev) => prev.filter((c) => c.id !== changeId));
      showNotification("Proposed change accepted and committed to plan.", "success");
    },
    [pendingChanges, showNotification]
  );

  // Reject a single change
  const rejectChange = useCallback(
    (changeId: string) => {
      setPendingChanges((prev) => prev.filter((c) => c.id !== changeId));
      showNotification("Proposed change rejected. Original value preserved.", "info");
    },
    [showNotification]
  );

  // Accept all pending changes
  const acceptAllChanges = useCallback(() => {
    const allIds = new Set(pendingChanges.map((c) => c.id));
    setPlan((prev) => applyAcceptedChanges(prev, allIds, pendingChanges));
    setPendingChanges([]);
    setIsChangeModalOpen(false);
    showNotification("All proposed changes accepted and plan updated.", "success");
  }, [pendingChanges, showNotification]);

  // Reject all pending changes
  const rejectAllChanges = useCallback(() => {
    setPendingChanges([]);
    setIsChangeModalOpen(false);
    showNotification("All proposed changes rejected. Your plan remains intact.", "info");
  }, [showNotification]);

  // Toggle decision lock on budget item
  const toggleBudgetItemLock = useCallback((itemId: string) => {
    setPlan((prev) => ({
      ...prev,
      budgetItems: prev.budgetItems.map((item) =>
        item.id === itemId ? { ...item, locked: !item.locked } : item
      ),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Toggle included state on budget item
  const toggleBudgetItemIncluded = useCallback((itemId: string) => {
    setPlan((prev) => ({
      ...prev,
      budgetItems: prev.budgetItems.map((item) =>
        item.id === itemId ? { ...item, included: !item.included } : item
      ),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Add new budget item
  const addBudgetItem = useCallback(
    (item: BudgetItem) => {
      setPlan((prev) => ({
        ...prev,
        budgetItems: [...prev.budgetItems, item],
        updatedAt: new Date().toISOString(),
      }));
      showNotification(`Added budget item: "${item.label}"`, "success");
    },
    [showNotification]
  );

  // Delete budget item
  const deleteBudgetItem = useCallback(
    (itemId: string) => {
      setPlan((prev) => ({
        ...prev,
        budgetItems: prev.budgetItems.filter((i) => i.id !== itemId),
        updatedAt: new Date().toISOString(),
      }));
      showNotification("Budget item deleted.", "info");
    },
    [showNotification]
  );

  // Toggle decision lock on task
  const toggleTaskLock = useCallback((taskId: string) => {
    setPlan((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId ? { ...task, locked: !task.locked } : task
      ),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Update task status
  const updateTaskStatus = useCallback((taskId: string, status: TaskStatus) => {
    setPlan((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === taskId ? { ...task, status } : task
      ),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Add task
  const addTask = useCallback(
    (task: EventTask) => {
      setPlan((prev) => ({
        ...prev,
        tasks: [...prev.tasks, task],
        updatedAt: new Date().toISOString(),
      }));
      showNotification(`Added task: "${task.title}"`, "success");
    },
    [showNotification]
  );

  // Delete task
  const deleteTask = useCallback(
    (taskId: string) => {
      setPlan((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((t) => t.id !== taskId),
        updatedAt: new Date().toISOString(),
      }));
      showNotification("Task deleted.", "info");
    },
    [showNotification]
  );

  // Update vendor status
  const updateVendorStatus = useCallback(
    (vendorId: string, status: "not-contacted" | "contacted" | "quoted" | "booked") => {
      setPlan((prev) => ({
        ...prev,
        vendorItems: prev.vendorItems.map((v) =>
          v.id === vendorId ? { ...v, status } : v
        ),
        updatedAt: new Date().toISOString(),
      }));
    },
    []
  );

  // Add vendor item
  const addVendorItem = useCallback(
    (vendor: VendorItem) => {
      setPlan((prev) => ({
        ...prev,
        vendorItems: [...prev.vendorItems, vendor],
        updatedAt: new Date().toISOString(),
      }));
      showNotification(`Added vendor: "${vendor.role}"`, "success");
    },
    [showNotification]
  );

  // Add idea to budget and checklist
  const adoptIdeaIntoPlan = useCallback(
    (idea: Idea) => {
      const budgetItemId = `b-idea-${Date.now()}`;
      const taskId = `t-idea-${Date.now()}`;

      // 1. Create matching budget item if cost exists
      const newBudgetItem: BudgetItem | null = idea.estimatedCostMinor
        ? {
            id: budgetItemId,
            category: idea.category,
            label: idea.title,
            amountMinor: idea.estimatedCostMinor,
            included: true,
            provenance: "ai-estimate",
            locked: false,
            isPerGuest: false,
            note: idea.rationale,
          }
        : null;

      // 2. Create matching execution task
      const newTask: EventTask = {
        id: taskId,
        title: `Execute: ${idea.title}`,
        category: idea.category,
        status: "todo",
        dueDate: plan.eventDate,
        daysBeforeEvent: 14,
        dependsOn: [],
        priority: "medium",
        locked: false,
        provenance: "ai-estimate",
        notes: idea.description,
      };

      setPlan((prev) => ({
        ...prev,
        budgetItems: newBudgetItem ? [...prev.budgetItems, newBudgetItem] : prev.budgetItems,
        tasks: [...prev.tasks, newTask],
        updatedAt: new Date().toISOString(),
      }));

      showNotification(`Adopted idea "${idea.title}" into timeline & budget!`, "success");
    },
    [plan.eventDate, showNotification]
  );

  // Fetch AI generated ideas from server endpoint
  const fetchAIIdeas = useCallback(async () => {
    setIsGeneratingIdeas(true);
    try {
      const response = await fetch("/api/plan-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: plan.eventType,
          title: plan.title,
          guestCount: plan.guestCount,
          totalBudgetMinor: plan.totalBudgetMinor,
          currency: plan.currency,
          priorities: plan.priorities,
          currentBudgetSummary: {
            plannedTotalMinor: plan.budgetItems.reduce(
              (sum, i) => (i.included ? sum + i.amountMinor : sum),
              0
            ),
            remainingMinor:
              plan.totalBudgetMinor -
              plan.budgetItems.reduce(
                (sum, i) => (i.included ? sum + i.amountMinor : sum),
                0
              ),
            isOverBudget:
              plan.budgetItems.reduce(
                (sum, i) => (i.included ? sum + i.amountMinor : sum),
                0
              ) > plan.totalBudgetMinor,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: AISuggestionsResponse = await response.json();

      if (data.ideas && data.ideas.length > 0) {
        const formattedIdeas: Idea[] = data.ideas.map((item, idx) => ({
          id: `ai-idea-${Date.now()}-${idx}`,
          title: item.title,
          description: item.description,
          rationale: item.rationale,
          category: item.category,
          estimatedCostMinor: item.estimatedCostMinor,
          provenance: "ai-estimate",
          assumptions: item.assumptions,
        }));

        setPlan((prev) => ({
          ...prev,
          ideas: [...formattedIdeas, ...prev.ideas],
          updatedAt: new Date().toISOString(),
        }));

        showNotification(
          `Generated ${formattedIdeas.length} personalized ideas (${data.source === "gemini-live" ? "Gemini Live" : "Deterministic Fallback"}).`,
          "success"
        );
      }
    } catch (e) {
      console.error("Failed to generate AI ideas:", e);
      showNotification("Could not reach AI provider; plan remains fully editable.", "error");
    } finally {
      setIsGeneratingIdeas(false);
    }
  }, [plan, showNotification]);

  // Reset plan to default
  const resetToDefault = useCallback(() => {
    setPlan(SAMPLE_WEDDING_PLAN);
    setPendingChanges([]);
    setIsChangeModalOpen(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    showNotification("Reset plan to default wedding template.", "info");
  }, [showNotification]);

  return {
    plan,
    isMounted,
    activeTab,
    setActiveTab,
    pendingChanges,
    isChangeModalOpen,
    setIsChangeModalOpen,
    isNewPlanModalOpen,
    setIsNewPlanModalOpen,
    isGeneratingIdeas,
    notification,
    switchSamplePlan,
    createCustomPlan,
    requestConstraintChange,
    acceptChange,
    rejectChange,
    acceptAllChanges,
    rejectAllChanges,
    toggleBudgetItemLock,
    toggleBudgetItemIncluded,
    addBudgetItem,
    deleteBudgetItem,
    toggleTaskLock,
    updateTaskStatus,
    addTask,
    deleteTask,
    updateVendorStatus,
    addVendorItem,
    adoptIdeaIntoPlan,
    fetchAIIdeas,
    resetToDefault,
  };
}

