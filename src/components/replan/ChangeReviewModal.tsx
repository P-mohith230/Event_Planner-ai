import React, { useEffect, useRef } from "react";
import { PlanChange, SupportedCurrency } from "@/types/schema";
import { formatCurrency } from "@/lib/engines/budget";
import {
  SlidersHorizontal,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  Calculator,
  Calendar,
  AlertCircle,
} from "lucide-react";

interface ChangeReviewModalProps {
  isOpen: boolean;
  changes: PlanChange[];
  currency: SupportedCurrency;
  onAcceptChange: (id: string) => void;
  onRejectChange: (id: string) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onClose: () => void;
}

export function ChangeReviewModal({
  isOpen,
  changes,
  currency,
  onAcceptChange,
  onRejectChange,
  onAcceptAll,
  onRejectAll,
  onClose,
}: ChangeReviewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalFinancialDelta = changes.reduce(
    (sum, c) => sum + (c.financialImpactMinor || 0),
    0
  );

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-violet-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/50 border border-violet-400/30 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5 text-violet-200" />
            </div>
            <div>
              <h2 id="change-modal-title" className="text-lg font-bold tracking-tight">
                Review Simulated Plan Changes
              </h2>
              <p className="text-xs text-violet-200">
                The Living Plan • Explainable Change Impact & Decision Preservation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-violet-200 hover:text-white hover:bg-violet-800 rounded-lg transition-colors"
            aria-label="Close change review dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Protection Banner */}
        <div className="px-6 py-3 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2 text-xs text-emerald-800 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            <strong>Decision Lock Active:</strong> All items you marked as locked have been strictly preserved and excluded from automatic changes.
          </span>
        </div>

        {/* Changes List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {changes.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-xs">
              <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="font-bold text-stone-700">All proposed changes resolved!</p>
              <p className="mt-1">Your plan is fully synchronized with current constraints.</p>
            </div>
          ) : (
            changes.map((change) => {
              const isBudget = change.entityType === "budget-item";
              const isTask = change.entityType === "task";

              const beforeDisplay =
                isBudget && typeof change.beforeValue === "number"
                  ? formatCurrency(change.beforeValue, currency)
                  : String(change.beforeValue);

              const proposedDisplay =
                isBudget && typeof change.proposedValue === "number"
                  ? formatCurrency(change.proposedValue, currency)
                  : String(change.proposedValue);

              return (
                <div
                  key={change.id}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-stone-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-stone-900">
                        {change.entityTitle}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-stone-200 text-stone-700 uppercase font-semibold">
                        {change.entityType.replace("-", " ")}
                      </span>
                      {change.isDeterministic && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded font-medium">
                          <Calculator className="w-3 h-3 text-sky-600" />
                          <span>Deterministic Math</span>
                        </span>
                      )}
                    </div>

                    {/* Diff comparison */}
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <span className="line-through text-stone-500 bg-stone-200/70 px-2 py-0.5 rounded">
                        {beforeDisplay}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                      <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {proposedDisplay}
                      </span>
                      {change.financialImpactMinor !== 0 && (
                        <span
                          className={`text-xs font-bold ${
                            change.financialImpactMinor > 0
                              ? "text-rose-600"
                              : "text-emerald-600"
                          }`}
                        >
                          ({change.financialImpactMinor > 0 ? "+" : ""}
                          {formatCurrency(change.financialImpactMinor, currency)})
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 mt-2 italic">
                      Reason: {change.reason}
                    </p>
                  </div>

                  {/* Accept / Reject controls */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onRejectChange(change.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
                      aria-label={`Reject change for ${change.entityTitle}`}
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => onAcceptChange(change.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors"
                      aria-label={`Accept change for ${change.entityTitle}`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-stone-600">
            {changes.length > 0 && (
              <span>
                Net Financial Impact:{" "}
                <strong
                  className={
                    totalFinancialDelta > 0 ? "text-rose-600" : "text-emerald-700"
                  }
                >
                  {totalFinancialDelta > 0 ? "+" : ""}
                  {formatCurrency(totalFinancialDelta, currency)}
                </strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 justify-end">
            {changes.length > 0 ? (
              <>
                <button
                  onClick={onRejectAll}
                  className="px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={onAcceptAll}
                  className="px-4 py-2 text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white rounded-lg shadow-sm transition-colors"
                >
                  Accept All ({changes.length})
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold bg-stone-900 text-white rounded-lg"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
