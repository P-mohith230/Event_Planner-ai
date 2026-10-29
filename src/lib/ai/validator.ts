import { z } from "zod";
import { EventTypeSchema, SupportedCurrencySchema } from "@/types/schema";

// ==========================================
// API Request Schema
// ==========================================
export const AISuggestionsRequestSchema = z.object({
  eventType: EventTypeSchema,
  title: z.string().min(1).max(200),
  guestCount: z.number().int().positive(),
  totalBudgetMinor: z.number().int().nonnegative(),
  currency: SupportedCurrencySchema.default("USD"),
  priorities: z.array(z.string()).default([]),
  currentBudgetSummary: z
    .object({
      plannedTotalMinor: z.number().int(),
      remainingMinor: z.number().int(),
      isOverBudget: z.boolean(),
    })
    .optional(),
  constraintChanged: z.enum(["guestCount", "eventDate", "totalBudgetMinor", "initial"]).optional(),
});
export type AISuggestionsRequest = z.infer<typeof AISuggestionsRequestSchema>;

// ==========================================
// AI Raw Response Schema
// ==========================================
export const AISuggestionItemSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  category: z.string().min(1).max(100),
  rationale: z.string().min(1).max(500),
  estimatedCostMinor: z.number().int().nonnegative().optional(),
  assumptions: z.array(z.string()).default([]),
});

export const AISuggestionsResponseSchema = z.object({
  ideas: z.array(AISuggestionItemSchema).min(1).max(10),
  executiveAdvice: z.string().max(800).optional(),
  source: z.enum(["gemini-live", "deterministic-fallback"]),
});
export type AISuggestionsResponse = z.infer<typeof AISuggestionsResponseSchema>;
