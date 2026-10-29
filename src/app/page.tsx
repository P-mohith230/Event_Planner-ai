"use client";

import React from "react";
import { useEventPlan } from "@/lib/hooks/useEventPlan";
import { Navbar } from "@/components/layout/Navbar";
import { EventSummaryStrip } from "@/components/layout/EventSummaryStrip";
import { BudgetPanel } from "@/components/budget/BudgetPanel";
import { TimelinePanel } from "@/components/timeline/TimelinePanel";
import { VendorChecklistPanel } from "@/components/vendors/VendorChecklistPanel";
import { IdeasPanel } from "@/components/ideas/IdeasPanel";
import { ChangeReviewModal } from "@/components/replan/ChangeReviewModal";
import { NewEventModal } from "@/components/setup/NewEventModal";
import {
  DollarSign,
  Calendar,
  Briefcase,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function HomePage() {
  const {
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
  } = useEventPlan();

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfd]">
        <div className="flex items-center gap-2 text-stone-500 text-sm font-medium">
          <div className="w-5 h-5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading EventPilot Workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfd]">
      {/* 1. Header Navigation */}
      <Navbar
        currentType={plan.eventType}
        onSwitchType={switchSamplePlan}
        onOpenNewEvent={() => setIsNewPlanModalOpen(true)}
        onReset={resetToDefault}
      />

      {/* 2. Event Summary & Constraint Simulator */}
      <EventSummaryStrip
        plan={plan}
        pendingChangesCount={pendingChanges.length}
        onOpenChangeReview={() => setIsChangeModalOpen(true)}
        onRequestConstraintChange={requestConstraintChange}
      />

      {/* 3. Main Planning Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Workspace Tab Bar */}
        <div className="border-b border-stone-200 mb-6">
          <nav className="flex space-x-2 sm:space-x-8" aria-label="Planning Sections">
            <button
              onClick={() => setActiveTab("budget")}
              className={`inline-flex items-center gap-2 py-3 px-1 border-b-2 text-xs sm:text-sm font-bold transition-all ${
                activeTab === "budget"
                  ? "border-violet-600 text-violet-700"
                  : "border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300"
              }`}
              aria-current={activeTab === "budget" ? "page" : undefined}
            >
              <DollarSign className="w-4 h-4" />
              <span>Budget</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-semibold">
                {plan.budgetItems.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("timeline")}
              className={`inline-flex items-center gap-2 py-3 px-1 border-b-2 text-xs sm:text-sm font-bold transition-all ${
                activeTab === "timeline"
                  ? "border-violet-600 text-violet-700"
                  : "border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300"
              }`}
              aria-current={activeTab === "timeline" ? "page" : undefined}
            >
              <Calendar className="w-4 h-4" />
              <span>Timeline & Schedule</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-semibold">
                {plan.tasks.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("vendors")}
              className={`inline-flex items-center gap-2 py-3 px-1 border-b-2 text-xs sm:text-sm font-bold transition-all ${
                activeTab === "vendors"
                  ? "border-violet-600 text-violet-700"
                  : "border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300"
              }`}
              aria-current={activeTab === "vendors" ? "page" : undefined}
            >
              <Briefcase className="w-4 h-4" />
              <span>Vendor Checklist</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-semibold">
                {plan.vendorItems.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("ideas")}
              className={`inline-flex items-center gap-2 py-3 px-1 border-b-2 text-xs sm:text-sm font-bold transition-all ${
                activeTab === "ideas"
                  ? "border-violet-600 text-violet-700"
                  : "border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300"
              }`}
              aria-current={activeTab === "ideas" ? "page" : undefined}
            >
              <Sparkles className="w-4 h-4 text-violet-500" />
              <span>Personalized Ideas</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-semibold">
                {plan.ideas.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Tab Content Panels */}
        {activeTab === "budget" && (
          <BudgetPanel
            items={plan.budgetItems}
            totalBudgetMinor={plan.totalBudgetMinor}
            currency={plan.currency}
            guestCount={plan.guestCount}
            onToggleLock={toggleBudgetItemLock}
            onToggleIncluded={toggleBudgetItemIncluded}
            onAddItem={addBudgetItem}
            onDeleteItem={deleteBudgetItem}
          />
        )}

        {activeTab === "timeline" && (
          <TimelinePanel
            tasks={plan.tasks}
            eventDate={plan.eventDate}
            onToggleLock={toggleTaskLock}
            onUpdateStatus={updateTaskStatus}
            onAddTask={addTask}
            onDeleteTask={deleteTask}
          />
        )}

        {activeTab === "vendors" && (
          <VendorChecklistPanel
            vendors={plan.vendorItems}
            currency={plan.currency}
            onUpdateStatus={updateVendorStatus}
            onAddVendor={addVendorItem}
          />
        )}

        {activeTab === "ideas" && (
          <IdeasPanel
            ideas={plan.ideas}
            currency={plan.currency}
            isGenerating={isGeneratingIdeas}
            onGenerateIdeas={fetchAIIdeas}
            onAdoptIdea={adoptIdeaIntoPlan}
          />
        )}
      </main>

      {/* 4. Change Review Modal (The Signature Innovation) */}
      <ChangeReviewModal
        isOpen={isChangeModalOpen}
        changes={pendingChanges}
        currency={plan.currency}
        onAcceptChange={acceptChange}
        onRejectChange={rejectChange}
        onAcceptAll={acceptAllChanges}
        onRejectAll={rejectAllChanges}
        onClose={() => setIsChangeModalOpen(false)}
      />

      {/* 5. New Event Creation Modal */}
      <NewEventModal
        isOpen={isNewPlanModalOpen}
        onClose={() => setIsNewPlanModalOpen(false)}
        onCreatePlan={createCustomPlan}
      />

      {/* 6. Notification Toast */}
      {notification && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2 transition-all ${
            notification.type === "success"
              ? "bg-emerald-900 text-white border-emerald-700"
              : notification.type === "error"
              ? "bg-rose-900 text-white border-rose-700"
              : "bg-stone-900 text-white border-stone-800"
          }`}
          role="status"
          aria-live="polite"
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : notification.type === "error" ? (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          ) : (
            <Info className="w-4 h-4 text-violet-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* 7. Footer */}
      <footer className="bg-white border-t border-stone-200 py-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-stone-700">
            EventPilot — The Living Plan • Built for Google Prompt Wars Virtual Challenge 5
          </p>
          <p className="mt-1">
            Deterministic Financial & Schedule Engines with Server-Side Gemini Intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
}
