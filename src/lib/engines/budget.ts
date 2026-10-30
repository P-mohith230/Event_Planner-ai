import { BudgetItem, SupportedCurrency } from "@/types/schema";

/**
 * Pure deterministic functions for event financial calculations.
 * All monetary values are handled as integer minor units (e.g. cents/paise)
 * to eliminate IEEE 754 floating-point rounding errors.
 */

export interface BudgetSummary {
  totalBudgetMinor: number;
  plannedTotalMinor: number;
  remainingMinor: number;
  varianceMinor: number;
  isOverBudget: boolean;
  overBudgetAmountMinor: number;
  percentageUsed: number;
  includedCount: number;
  totalCount: number;
}

export interface CategorySummary {
  category: string;
  totalMinor: number;
  itemCount: number;
  percentageOfBudget: number;
}

/**
 * Sums only the items that have included === true.
 */
export function calculatePlannedTotal(items: BudgetItem[]): number {
  return items.reduce((acc, item) => {
    if (item.included) {
      return acc + (Number.isSafeInteger(item.amountMinor) ? item.amountMinor : 0);
    }
    return acc;
  }, 0);
}

/**
 * Calculates remaining balance: totalBudgetMinor - plannedTotalMinor.
 * Can be negative if planned exceeds total budget.
 */
export function calculateRemainingBalance(
  totalBudgetMinor: number,
  items: BudgetItem[]
): number {
  const planned = calculatePlannedTotal(items);
  return totalBudgetMinor - planned;
}

/**
 * Generates a complete budget summary with safety checks.
 */
export function getBudgetSummary(
  totalBudgetMinor: number,
  items: BudgetItem[]
): BudgetSummary {
  const safeTotalBudget = Math.max(0, totalBudgetMinor);
  const plannedTotalMinor = calculatePlannedTotal(items);
  const remainingMinor = safeTotalBudget - plannedTotalMinor;
  const isOverBudget = remainingMinor < 0;
  const overBudgetAmountMinor = isOverBudget ? Math.abs(remainingMinor) : 0;
  const varianceMinor = plannedTotalMinor - safeTotalBudget;
  const percentageUsed =
    safeTotalBudget > 0
      ? Math.min(999, Math.round((plannedTotalMinor / safeTotalBudget) * 100))
      : plannedTotalMinor > 0
      ? 100
      : 0;

  const includedCount = items.filter((i) => i.included).length;

  return {
    totalBudgetMinor: safeTotalBudget,
    plannedTotalMinor,
    remainingMinor,
    varianceMinor,
    isOverBudget,
    overBudgetAmountMinor,
    percentageUsed,
    includedCount,
    totalCount: items.length,
  };
}

/**
 * Group included items by category and compute sub-totals.
 */
export function getCategorySummaries(
  totalBudgetMinor: number,
  items: BudgetItem[]
): CategorySummary[] {
  const groups: Record<string, { totalMinor: number; itemCount: number }> = {};

  for (const item of items) {
    if (!item.included) continue;
    if (!groups[item.category]) {
      groups[item.category] = { totalMinor: 0, itemCount: 0 };
    }
    groups[item.category].totalMinor += item.amountMinor;
    groups[item.category].itemCount += 1;
  }

  return Object.entries(groups)
    .map(([category, data]) => ({
      category,
      totalMinor: data.totalMinor,
      itemCount: data.itemCount,
      percentageOfBudget:
        totalBudgetMinor > 0
          ? Math.round((data.totalMinor / totalBudgetMinor) * 100)
          : 0,
    }))
    .sort((a, b) => b.totalMinor - a.totalMinor);
}

/**
 * Scales variable per-guest budget items (e.g. catering, bar, chair rentals)
 * given a new guest count.
 */
export function calculateGuestScaledAmount(
  item: BudgetItem,
  newGuestCount: number
): number {
  if (!item.isPerGuest || item.perGuestAmountMinor === undefined) {
    return item.amountMinor;
  }
  const safeGuests = Math.max(0, Math.floor(newGuestCount));
  return safeGuests * item.perGuestAmountMinor;
}

/**
 * Pure currency formatter using Intl.NumberFormat with fallback.
 */
export function formatCurrency(
  amountMinor: number,
  currency: SupportedCurrency = "USD"
): string {
  const isNegative = amountMinor < 0;
  const absAmount = Math.abs(amountMinor);
  const majorUnits = absAmount / 100;

  try {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(majorUnits);

    return isNegative ? `-${formatted}` : formatted;
  } catch {
    // Fallback if currency symbol not supported
    const symbolMap: Record<SupportedCurrency, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      INR: "₹",
      CAD: "CA$",
      AUD: "A$",
    };
    const symbol = symbolMap[currency] || "$";
    const fixed = majorUnits.toFixed(2);
    return isNegative ? `-${symbol}${fixed}` : `${symbol}${fixed}`;
  }
}

