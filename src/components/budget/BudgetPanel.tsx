import React, { useState } from "react";
import { BudgetItem, SupportedCurrency } from "@/types/schema";
import {
  getBudgetSummary,
  getCategorySummaries,
  formatCurrency,
} from "@/lib/engines/budget";
import { ProvenanceBadge } from "../common/ProvenanceBadge";
import {
  Lock,
  Unlock,
  Plus,
  Trash2,
  AlertCircle,
  Users,
  CheckCircle,
} from "lucide-react";

interface BudgetPanelProps {
  items: BudgetItem[];
  totalBudgetMinor: number;
  currency: SupportedCurrency;
  guestCount: number;
  onToggleLock: (id: string) => void;
  onToggleIncluded: (id: string) => void;
  onAddItem: (item: BudgetItem) => void;
  onDeleteItem: (id: string) => void;
}

export function BudgetPanel({
  items,
  totalBudgetMinor,
  currency,
  guestCount,
  onToggleLock,
  onToggleIncluded,
  onAddItem,
  onDeleteItem,
}: BudgetPanelProps) {
  const summary = getBudgetSummary(totalBudgetMinor, items);
  const categories = getCategorySummaries(totalBudgetMinor, items);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAdding, setIsAdding] = useState(false);

  // New item form state
  const [newLabel, setNewLabel] = useState("");
  const [newCategory, setNewCategory] = useState("Catering");
  const [newAmountDollars, setNewAmountDollars] = useState("");
  const [newIsPerGuest, setNewIsPerGuest] = useState(false);
  const [newPerGuestDollars, setNewPerGuestDollars] = useState("");
  const [newNote, setNewNote] = useState("");

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    let amountMinor = 0;
    let perGuestMinor: number | undefined = undefined;

    if (newIsPerGuest && newPerGuestDollars) {
      perGuestMinor = Math.round(parseFloat(newPerGuestDollars) * 100);
      amountMinor = perGuestMinor * guestCount;
    } else {
      amountMinor = Math.round((parseFloat(newAmountDollars) || 0) * 100);
    }

    const newItem: BudgetItem = {
      id: `custom-b-${Date.now()}`,
      label: newLabel.trim(),
      category: newCategory.trim() || "General",
      amountMinor,
      included: true,
      provenance: "user-entered",
      locked: false,
      isPerGuest: newIsPerGuest,
      perGuestAmountMinor: perGuestMinor,
      note: newNote.trim() || undefined,
    };

    onAddItem(newItem);
    setNewLabel("");
    setNewAmountDollars("");
    setNewIsPerGuest(false);
    setNewPerGuestDollars("");
    setNewNote("");
    setIsAdding(false);
  };

  return (
    <div className="space-y-6" aria-label="Budget Workspace">
      {/* Budget Overrun Alert */}
      {summary.isOverBudget && (
        <div
          className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 shadow-sm"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold">Budget Overrun Detected</h3>
            <p className="text-xs text-rose-700 mt-0.5">
              Current planned expenses ({formatCurrency(summary.plannedTotalMinor, currency)}) exceed your total budget by{" "}
              <strong>{formatCurrency(summary.overBudgetAmountMinor, currency)}</strong>. Consider adjusting per-guest items or unlocking fixed costs to simulate rebalancing.
            </p>
          </div>
        </div>
      )}

      {/* Category Spend Distribution Bar */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-stone-900 tracking-tight">Category Allocation</h2>
          <span className="text-xs font-semibold text-stone-500">
            {summary.percentageUsed}% Allocated
          </span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden flex" aria-hidden="true">
          {categories.map((cat, idx) => {
            const colors = [
              "bg-violet-600",
              "bg-sky-500",
              "bg-emerald-500",
              "bg-amber-500",
              "bg-rose-500",
              "bg-indigo-400",
            ];
            const color = colors[idx % colors.length];
            return (
              <div
                key={cat.category}
                style={{ width: `${Math.min(100, cat.percentageOfBudget)}%` }}
                className={`${color} transition-all`}
                title={`${cat.category}: ${formatCurrency(cat.totalMinor, currency)} (${cat.percentageOfBudget}%)`}
              />
            );
          })}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mt-4" role="tablist" aria-label="Filter budget by category">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              selectedCategory === "all"
                ? "bg-stone-900 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            All Items ({items.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategory(cat.category)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                selectedCategory === cat.category
                  ? "bg-violet-700 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {cat.category} ({cat.itemCount}) • {formatCurrency(cat.totalMinor, currency)}
            </button>
          ))}
        </div>
      </div>

      {/* Line Items Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Budget Line Items</h3>
            <p className="text-xs text-stone-500">
              Lock items to protect them from automated constraint replanning
            </p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        {/* Add Item Form */}
        {isAdding && (
          <form onSubmit={handleCreateItem} className="p-4 bg-stone-50 border-b border-stone-200">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              New Budget Line Item
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="new-item-label" className="block text-xs font-semibold text-stone-700 mb-1">
                  Item Description
                </label>
                <input
                  id="new-item-label"
                  type="text"
                  required
                  placeholder="e.g., Hors d'oeuvres"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
                />
              </div>

              <div>
                <label htmlFor="new-item-category" className="block text-xs font-semibold text-stone-700 mb-1">
                  Category
                </label>
                <input
                  id="new-item-category"
                  type="text"
                  required
                  placeholder="e.g., Catering, Decor"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
                />
              </div>

              <div>
                <label htmlFor="new-item-amount" className="block text-xs font-semibold text-stone-700 mb-1">
                  {newIsPerGuest ? "Cost Per Guest ($)" : "Total Amount ($)"}
                </label>
                <input
                  id="new-item-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  placeholder="e.g. 50"
                  value={newIsPerGuest ? newPerGuestDollars : newAmountDollars}
                  onChange={(e) =>
                    newIsPerGuest
                      ? setNewPerGuestDollars(e.target.value)
                      : setNewAmountDollars(e.target.value)
                  }
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 mt-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newIsPerGuest}
                  onChange={(e) => setNewIsPerGuest(e.target.checked)}
                  className="rounded text-violet-600 focus:ring-violet-500"
                />
                <span>Scale with guest count (Per Guest)</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 mt-3">
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
                Save Line Item
              </button>
            </div>
          </form>
        )}

        {/* Table Rows */}
        <div className="divide-y divide-stone-200 overflow-x-auto">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                !item.included ? "bg-stone-50/60 opacity-60" : "hover:bg-stone-50/40"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Include/Exclude checkbox */}
                <input
                  type="checkbox"
                  checked={item.included}
                  onChange={() => onToggleIncluded(item.id)}
                  className="mt-1 rounded text-violet-600 focus:ring-violet-500 cursor-pointer"
                  title={item.included ? "Included in total budget" : "Excluded (Optional)"}
                  aria-label={`Include ${item.label} in budget`}
                />

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-stone-900">{item.label}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">
                      {item.category}
                    </span>
                    <ProvenanceBadge provenance={item.provenance} />
                    {item.isPerGuest && (
                      <span className="inline-flex items-center gap-1 text-xs text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded font-medium">
                        <Users className="w-3 h-3" />
                        <span>
                          {item.perGuestAmountMinor
                            ? `${formatCurrency(item.perGuestAmountMinor, currency)}/guest`
                            : "Per Guest"}
                        </span>
                      </span>
                    )}
                  </div>
                  {item.note && <p className="text-xs text-stone-500 mt-1">{item.note}</p>}
                </div>
              </div>

              {/* Amount, Lock, and Delete actions */}
              <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
                <span className="text-sm font-bold text-stone-900">
                  {formatCurrency(item.amountMinor, currency)}
                </span>

                {/* Decision Lock Button */}
                <button
                  type="button"
                  onClick={() => onToggleLock(item.id)}
                  className={`p-1.5 rounded-lg border text-xs transition-colors ${
                    item.locked
                      ? "bg-amber-50 border-amber-300 text-amber-800"
                      : "bg-stone-100 border-stone-200 text-stone-400 hover:text-stone-700"
                  }`}
                  title={
                    item.locked
                      ? "Decision Locked: Protected from replanning recalculations"
                      : "Decision Unlocked: Subject to constraint replanning"
                  }
                  aria-label={item.locked ? `Unlock ${item.label}` : `Lock ${item.label}`}
                >
                  {item.locked ? (
                    <Lock className="w-3.5 h-3.5 text-amber-700" />
                  ) : (
                    <Unlock className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => onDeleteItem(item.id)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete item"
                  aria-label={`Delete ${item.label}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="p-8 text-center text-xs text-stone-500">
              No budget items found in category &quot;{selectedCategory}&quot;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

