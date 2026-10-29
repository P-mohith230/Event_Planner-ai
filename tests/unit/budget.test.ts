import { describe, it, expect } from "vitest";
import {
  calculatePlannedTotal,
  calculateRemainingBalance,
  getBudgetSummary,
  getCategorySummaries,
  calculateGuestScaledAmount,
  formatCurrency,
} from "@/lib/engines/budget";
import { BudgetItem } from "@/types/schema";

describe("BudgetEngine", () => {
  const sampleItems: BudgetItem[] = [
    {
      id: "item-1",
      category: "Catering",
      label: "Dinner Buffet",
      amountMinor: 500000, // $5,000.00
      included: true,
      provenance: "confirmed-by-user",
      locked: true,
      isPerGuest: true,
      perGuestAmountMinor: 5000, // $50/guest
    },
    {
      id: "item-2",
      category: "Venue",
      label: "Banquet Hall Rental",
      amountMinor: 300000, // $3,000.00
      included: true,
      provenance: "user-entered",
      locked: false,
      isPerGuest: false,
    },
    {
      id: "item-3",
      category: "Entertainment",
      label: "Live Band (Optional)",
      amountMinor: 150000, // $1,500.00
      included: false, // Optional, excluded
      provenance: "ai-estimate",
      locked: false,
      isPerGuest: false,
    },
  ];

  it("calculates planned total strictly for included items using integer math", () => {
    const plannedTotal = calculatePlannedTotal(sampleItems);
    // item-1 ($5,000) + item-2 ($3,000) = $8,000 (800000 cents); item-3 excluded
    expect(plannedTotal).toBe(800000);
  });

  it("calculates remaining balance correctly when under budget", () => {
    const totalBudget = 1000000; // $10,000.00
    const remaining = calculateRemainingBalance(totalBudget, sampleItems);
    // $10,000 - $8,000 = $2,000 (200000 cents)
    expect(remaining).toBe(200000);
  });

  it("detects budget overruns when planned exceeds total budget", () => {
    const totalBudget = 700000; // $7,000.00
    const summary = getBudgetSummary(totalBudget, sampleItems);

    expect(summary.isOverBudget).toBe(true);
    expect(summary.overBudgetAmountMinor).toBe(100000); // Over by $1,000
    expect(summary.remainingMinor).toBe(-100000);
    expect(summary.varianceMinor).toBe(100000);
    expect(summary.percentageUsed).toBe(114);
  });

  it("scales per-guest budget items deterministically", () => {
    const cateringItem = sampleItems[0];
    // 100 guests -> $50/guest = $5,000 (500000 cents)
    expect(calculateGuestScaledAmount(cateringItem, 100)).toBe(500000);

    // 150 guests -> $50/guest = $7,500 (750000 cents)
    expect(calculateGuestScaledAmount(cateringItem, 150)).toBe(750000);

    // 0 guests -> 0 cents
    expect(calculateGuestScaledAmount(cateringItem, 0)).toBe(0);
  });

  it("does not scale non-per-guest items", () => {
    const venueItem = sampleItems[1];
    expect(calculateGuestScaledAmount(venueItem, 200)).toBe(300000);
  });

  it("formats currencies properly across USD, EUR, GBP, INR", () => {
    expect(formatCurrency(500000, "USD")).toContain("5,000");
    expect(formatCurrency(500000, "EUR")).toContain("5,000");
    expect(formatCurrency(500000, "GBP")).toContain("5,000");
    expect(formatCurrency(500000, "INR")).toContain("5,000");

    // Negative amounts formatted with negative sign
    expect(formatCurrency(-25000, "USD")).toContain("-");
    expect(formatCurrency(-25000, "USD")).toContain("250");
  });

  it("aggregates category summaries accurately", () => {
    const categories = getCategorySummaries(1000000, sampleItems);
    expect(categories.length).toBe(2); // Catering & Venue (Entertainment was excluded)
    expect(categories[0].category).toBe("Catering");
    expect(categories[0].totalMinor).toBe(500000);
    expect(categories[0].percentageOfBudget).toBe(50);
  });
});
