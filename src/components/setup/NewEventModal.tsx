import React, { useState, useEffect } from "react";
import { EventPlan, EventType, SupportedCurrency } from "@/types/schema";
import { SAMPLE_PLANS } from "@/lib/data/samplePlans";
import { X, Sparkles, Calendar, Users, DollarSign } from "lucide-react";

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlan: (plan: EventPlan) => void;
}

export function NewEventModal({ isOpen, onClose, onCreatePlan }: NewEventModalProps) {
  const [eventType, setEventType] = useState<EventType>("wedding");
  const [title, setTitle] = useState("Our Special Celebration");
  const [eventDate, setEventDate] = useState("2026-12-31");
  const [guestCount, setGuestCount] = useState(100);
  const [totalBudgetDollars, setTotalBudgetDollars] = useState(15000);
  const [currency, setCurrency] = useState<SupportedCurrency>("USD");
  const [prioritiesText, setPrioritiesText] = useState("Catering, Photography, Music");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide a celebration title.");
      return;
    }
    if (guestCount < 1) {
      setError("Guest count must be at least 1.");
      return;
    }
    if (totalBudgetDollars < 0) {
      setError("Budget cannot be negative.");
      return;
    }

    const baseSample = SAMPLE_PLANS[eventType] || SAMPLE_PLANS.wedding;
    const priorities = prioritiesText
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    // Seed new plan adapted to user constraints
    const newPlan: EventPlan = {
      ...baseSample,
      id: `custom-plan-${Date.now()}`,
      eventType,
      title: title.trim(),
      eventDate,
      guestCount,
      currency,
      totalBudgetMinor: Math.round(totalBudgetDollars * 100),
      priorities,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onCreatePlan(newPlan);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-event-title"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <h2 id="new-event-title" className="text-base font-bold">
              Create New Event Plan
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="px-6 py-2 bg-rose-50 text-rose-700 text-xs font-semibold border-b border-rose-200">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Event Type */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
              Event Archetype
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["wedding", "birthday", "community"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setEventType(type);
                    if (type === "wedding") setTitle("Our Wedding Celebration");
                    if (type === "birthday") setTitle("Milestone Birthday Party");
                    if (type === "community") setTitle("Community Gala & Charity Dinner");
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold capitalize border text-center transition-all ${
                    eventType === type
                      ? "border-violet-600 bg-violet-50 text-violet-900 font-bold shadow-sm"
                      : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="plan-title" className="block text-xs font-semibold text-stone-700 mb-1">
              Celebration Title
            </label>
            <input
              id="plan-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-violet-600 bg-white"
            />
          </div>

          {/* Date & Guests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="plan-date" className="block text-xs font-semibold text-stone-700 mb-1">
                Event Date
              </label>
              <input
                id="plan-date"
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-violet-600 bg-white"
              />
            </div>

            <div>
              <label htmlFor="plan-guests" className="block text-xs font-semibold text-stone-700 mb-1">
                Estimated Guest Count
              </label>
              <input
                id="plan-guests"
                type="number"
                min="1"
                max="50000"
                required
                value={guestCount}
                onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-violet-600 bg-white"
              />
            </div>
          </div>

          {/* Budget & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="plan-budget" className="block text-xs font-semibold text-stone-700 mb-1">
                Total Budget
              </label>
              <input
                id="plan-budget"
                type="number"
                min="0"
                step="100"
                required
                value={totalBudgetDollars}
                onChange={(e) => setTotalBudgetDollars(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-violet-600 bg-white"
              />
            </div>

            <div>
              <label htmlFor="plan-currency" className="block text-xs font-semibold text-stone-700 mb-1">
                Currency
              </label>
              <select
                id="plan-currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-violet-600 bg-white"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="CAD">CAD (CA$)</option>
                <option value="AUD">AUD (A$)</option>
              </select>
            </div>
          </div>

          {/* Priorities */}
          <div>
            <label htmlFor="plan-priorities" className="block text-xs font-semibold text-stone-700 mb-1">
              Top Priorities (Comma-separated)
            </label>
            <input
              id="plan-priorities"
              type="text"
              value={prioritiesText}
              onChange={(e) => setPrioritiesText(e.target.value)}
              placeholder="e.g. Gourmet Catering, Candid Photography, Live Band"
              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-violet-600 bg-white"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
            >
              Create Living Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
