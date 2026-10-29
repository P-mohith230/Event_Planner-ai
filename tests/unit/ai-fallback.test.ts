import { describe, it, expect } from "vitest";
import { generateFallbackSuggestions } from "@/lib/ai/gemini";
import { AISuggestionsRequest, AISuggestionsResponseSchema } from "@/lib/ai/validator";

describe("AI Integration & Fallback Engine", () => {
  const sampleRequest: AISuggestionsRequest = {
    eventType: "wedding",
    title: "Test Coastal Wedding",
    guestCount: 150,
    totalBudgetMinor: 3000000,
    currency: "USD",
    priorities: ["Catering", "Live Music"],
    currentBudgetSummary: {
      plannedTotalMinor: 2800000,
      remainingMinor: 200000,
      isOverBudget: false,
    },
  };

  it("generates deterministic fallback suggestions conforming strictly to response schema", () => {
    const fallback = generateFallbackSuggestions(sampleRequest, "Unit Test Fallback");

    expect(fallback.source).toBe("deterministic-fallback");
    expect(fallback.ideas.length).toBeGreaterThan(0);
    expect(fallback.executiveAdvice).toBeDefined();

    // Validate against Zod response schema
    const parseResult = AISuggestionsResponseSchema.safeParse(fallback);
    expect(parseResult.success).toBe(true);
  });

  it("handles over-budget state in executive advice", () => {
    const overBudgetRequest: AISuggestionsRequest = {
      ...sampleRequest,
      currentBudgetSummary: {
        plannedTotalMinor: 3500000,
        remainingMinor: -500000,
        isOverBudget: true,
      },
    };

    const fallback = generateFallbackSuggestions(overBudgetRequest);
    expect(fallback.executiveAdvice).toContain("over budget");
  });

  it("provides tailored ideas across birthday and community event types", () => {
    const bdayFallback = generateFallbackSuggestions({
      ...sampleRequest,
      eventType: "birthday",
    });
    expect(bdayFallback.ideas.length).toBeGreaterThan(0);

    const commFallback = generateFallbackSuggestions({
      ...sampleRequest,
      eventType: "community",
    });
    expect(commFallback.ideas.length).toBeGreaterThan(0);
  });
});
