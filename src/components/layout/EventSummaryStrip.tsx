import React, { useState } from "react";
import { EventPlan } from "@/types/schema";
import { getBudgetSummary, formatCurrency } from "@/lib/engines/budget";
import { daysBetween } from "@/lib/engines/schedule";
import {
  Calendar,
  Users,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  SlidersHorizontal,
  Check,
} from "lucide-react";

interface EventSummaryStripProps {
  plan: EventPlan;
  pendingChangesCount: number;
  onOpenChangeReview: () => void;
  onRequestConstraintChange: (params: {
    newGuestCount?: number;
    newEventDate?: string;
    newTotalBudgetMinor?: number;
  }) => void;
}

export function EventSummaryStrip({
  plan,
  pendingChangesCount,
  onOpenChangeReview,
  onRequestConstraintChange,
}: EventSummaryStripProps) {
  const budgetSummary = getBudgetSummary(plan.totalBudgetMinor, plan.budgetItems);
  const todayISO = new Date().toISOString().split("T")[0];
  const daysLeft = daysBetween(todayISO, plan.eventDate);

  // Quick edit local state
  const [isEditingConstraints, setIsEditingConstraints] = useState(false);
  const [draftGuests, setDraftGuests] = useState<number>(plan.guestCount);
  const [draftDate, setDraftDate] = useState<string>(plan.eventDate);
  const [draftBudgetDollars, setDraftBudgetDollars] = useState<number>(
    plan.totalBudgetMinor / 100
  );

  const handleApplyConstraints = (e: React.FormEvent) => {
    e.preventDefault();
    const guestDelta = draftGuests !== plan.guestCount ? draftGuests : undefined;
    const dateDelta = draftDate !== plan.eventDate ? draftDate : undefined;
    const budgetDelta =
      draftBudgetDollars * 100 !== plan.totalBudgetMinor
        ? draftBudgetDollars * 100
        : undefined;

    if (guestDelta !== undefined || dateDelta !== undefined || budgetDelta !== undefined) {
      onRequestConstraintChange({
        newGuestCount: guestDelta,
        newEventDate: dateDelta,
        newTotalBudgetMinor: budgetDelta,
      });
    }
    setIsEditingConstraints(false);
  };

  return (
    <section className="bg-white border-b border-stone-200 py-4 shadow-sm" aria-label="Event Summary and Constraint Controls">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                {plan.title}
              </h1>
              <span className="capitalize text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                {plan.eventType}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Priorities: {plan.priorities.join(" • ") || "None specified"}
            </p>
          </div>

          {/* Quick simulation button or pending changes button */}
          <div className="flex items-center gap-2">
            {pendingChangesCount > 0 ? (
              <button
                onClick={onOpenChangeReview}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-sm animate-pulse transition-all"
                aria-label={`Review ${pendingChangesCount} pending plan changes`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Review Changes ({pendingChangesCount} Pending)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setIsEditingConstraints(!isEditingConstraints)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-violet-300 text-violet-700 bg-violet-50 hover:bg-violet-100 transition-colors"
                aria-expanded={isEditingConstraints}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{isEditingConstraints ? "Close Simulator" : "Simulate Constraint Change"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Constraint Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {/* Date */}
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-stone-600" aria-hidden="true" />
              <span>Event Date</span>
            </div>
            <p className="text-sm font-bold text-stone-900 mt-1">{plan.eventDate}</p>
            <p className="text-xs text-stone-500">{daysLeft > 0 ? `${daysLeft} days to go` : "Event passed"}</p>
          </div>

          {/* Guests */}
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
              <Users className="w-3.5 h-3.5 text-stone-600" aria-hidden="true" />
              <span>Guest Count</span>
            </div>
            <p className="text-sm font-bold text-stone-900 mt-1">{plan.guestCount} Attending</p>
            <p className="text-xs text-stone-500">Per-guest items scale automatically</p>
          </div>

          {/* Total Budget */}
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
              <DollarSign className="w-3.5 h-3.5 text-stone-600" aria-hidden="true" />
              <span>Total Budget</span>
            </div>
            <p className="text-sm font-bold text-stone-900 mt-1">
              {formatCurrency(plan.totalBudgetMinor, plan.currency)}
            </p>
            <p className="text-xs text-stone-500">
              Planned: {formatCurrency(budgetSummary.plannedTotalMinor, plan.currency)}
            </p>
          </div>

          {/* Remaining / Overrun */}
          <div
            className={`p-3 rounded-lg border ${
              budgetSummary.isOverBudget
                ? "bg-rose-50 border-rose-200 text-rose-900"
                : "bg-emerald-50 border-emerald-200 text-emerald-900"
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              {budgetSummary.isOverBudget ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" aria-hidden="true" />
                  <span className="text-rose-700">Budget Overrun!</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  <span className="text-emerald-700">Remaining Balance</span>
                </>
              )}
            </div>
            <p className="text-sm font-bold mt-1">
              {formatCurrency(budgetSummary.remainingMinor, plan.currency)}
            </p>
            <p className="text-xs font-medium opacity-80">
              {budgetSummary.isOverBudget
                ? `Exceeds budget by ${formatCurrency(budgetSummary.overBudgetAmountMinor, plan.currency)}`
                : `${budgetSummary.percentageUsed}% of budget allocated`}
            </p>
          </div>
        </div>

        {/* Expandable Constraint Simulator Form */}
        {isEditingConstraints && (
          <form
            onSubmit={handleApplyConstraints}
            className="mt-4 p-4 bg-violet-50/70 border border-violet-200 rounded-xl transition-all"
            aria-label="Constraint Change Simulator"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-violet-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-violet-900">
                  Constraint Change Simulator (The Living Plan)
                </h3>
              </div>
              <span className="text-xs text-violet-600 font-medium hidden sm:inline">
                Changes will generate a reviewable Before/After diff
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Guest input */}
              <div>
                <label htmlFor="sim-guests" className="block text-xs font-semibold text-stone-700 mb-1">
                  Adjust Guest Count
                </label>
                <div className="flex items-center gap-1">
                  <input
                    id="sim-guests"
                    type="number"
                    min="1"
                    max="10000"
                    value={draftGuests}
                    onChange={(e) => setDraftGuests(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-violet-600 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setDraftGuests((g) => g + 25)}
                    className="px-2 py-1.5 text-xs bg-stone-200 hover:bg-stone-300 font-bold rounded text-stone-800"
                    title="Add 25 guests"
                  >
                    +25
                  </button>
                  <button
                    type="button"
                    onClick={() => setDraftGuests((g) => Math.max(1, g - 25))}
                    className="px-2 py-1.5 text-xs bg-stone-200 hover:bg-stone-300 font-bold rounded text-stone-800"
                    title="Subtract 25 guests"
                  >
                    -25
                  </button>
                </div>
              </div>

              {/* Date input */}
              <div>
                <label htmlFor="sim-date" className="block text-xs font-semibold text-stone-700 mb-1">
                  Reschedule Event Date
                </label>
                <input
                  id="sim-date"
                  type="date"
                  value={draftDate}
                  onChange={(e) => setDraftDate(e.target.value)}
                  className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-violet-600 bg-white"
                />
              </div>

              {/* Total budget input */}
              <div>
                <label htmlFor="sim-budget" className="block text-xs font-semibold text-stone-700 mb-1">
                  Adjust Total Budget ({plan.currency})
                </label>
                <input
                  id="sim-budget"
                  type="number"
                  min="0"
                  step="100"
                  value={draftBudgetDollars}
                  onChange={(e) => setDraftBudgetDollars(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-violet-600 bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setDraftGuests(plan.guestCount);
                  setDraftDate(plan.eventDate);
                  setDraftBudgetDollars(plan.totalBudgetMinor / 100);
                  setIsEditingConstraints(false);
                }}
                className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <span>Simulate Impact & Review Diffs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

