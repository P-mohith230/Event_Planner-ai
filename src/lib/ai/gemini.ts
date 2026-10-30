import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  AISuggestionsRequest,
  AISuggestionsResponse,
  AISuggestionsResponseSchema,
} from "./validator";
import { SAMPLE_PLANS } from "../data/samplePlans";

/**
 * Server-side Gemini AI integration with bounded timeouts, schema validation,
 * and guaranteed deterministic fallback if the API key is not configured or fails.
 */

const TIMEOUT_MS = 8000;

export async function generateEventSuggestions(
  request: AISuggestionsRequest
): Promise<AISuggestionsResponse> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // 1. Safe offline fallback if no API key is set
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return generateFallbackSuggestions(request, "API key not configured; using offline deterministic model");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";

    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4, // Lower temperature for more grounded suggestions
      },
    });

    const prompt = `
You are an expert event architect helping a user organize a celebration:
- Event Type: ${request.eventType}
- Event Title: "${request.title}"
- Guest Count: ${request.guestCount}
- Total Budget: ${request.totalBudgetMinor / 100} ${request.currency}
- User Priorities: ${request.priorities.join(", ") || "General excellence"}
${request.currentBudgetSummary ? `- Budget Status: ${request.currentBudgetSummary.isOverBudget ? "OVER BUDGET" : "ON TRACK"}, Remaining: ${request.currentBudgetSummary.remainingMinor / 100} ${request.currency}` : ""}

Return a JSON object strictly adhering to this structure:
{
  "ideas": [
    {
      "title": "Short title (string)",
      "description": "Specific, actionable description (string)",
      "category": "Category such as Decor, Food, Experience, Music (string)",
      "rationale": "Why this aligns with guest count and priorities (string)",
      "estimatedCostMinor": integer amount in cents/paise (e.g. 5000 for $50),
      "assumptions": ["assumption 1", "assumption 2"]
    }
  ],
  "executiveAdvice": "1-2 sentences of strategic advice regarding the budget and guest count constraints."
}

Generate 3 to 5 realistic, distinctive, tailored suggestions. Do NOT output markdown code fences, only valid JSON.
`;

    // Timeout protection
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Gemini API call timed out after 8000ms")), TIMEOUT_MS)
    );

    const callPromise = model.generateContent(prompt);
    const response = await Promise.race([callPromise, timeoutPromise]);

    const responseText = response.response.text();
    const rawParsed = JSON.parse(responseText);

    const validated = AISuggestionsResponseSchema.safeParse({
      ...rawParsed,
      source: "gemini-live",
    });

    if (validated.success) {
      return validated.data;
    } else {
      console.warn("Gemini response failed Zod schema validation, falling back:", validated.error);
      return generateFallbackSuggestions(request, "AI response schema mismatch");
    }
  } catch (error) {
    console.error("Gemini API execution error, falling back to deterministic engine:", error);
    return generateFallbackSuggestions(request, error instanceof Error ? error.message : "Provider error");
  }
}

/**
 * Deterministic fallback generator ensuring the application never breaks.
 */
export function generateFallbackSuggestions(
  request: AISuggestionsRequest,
  reason?: string
): AISuggestionsResponse {
  const sample = SAMPLE_PLANS[request.eventType] || SAMPLE_PLANS.wedding;

  const fallbackIdeas = sample.ideas.map((idea, index) => ({
    title: `${idea.title} (Curated)`,
    description: idea.description,
    category: idea.category,
    rationale: `${idea.rationale} Scaled for ${request.guestCount} guests.`,
    estimatedCostMinor: idea.estimatedCostMinor,
    assumptions: idea.assumptions || ["Curated from verified event template"],
  }));

  const advice =
    request.currentBudgetSummary && request.currentBudgetSummary.isOverBudget
      ? `Your plan is currently over budget. Consider prioritizing per-guest savings in Catering and Bar before trimming fixed venue costs.`
      : `With ${request.guestCount} guests and a ${request.totalBudgetMinor / 100} ${request.currency} budget, focus allocations on high-touch guest experiences.`;

  return {
    ideas: fallbackIdeas,
    executiveAdvice: `${advice}${reason ? ` [Note: ${reason}]` : ""}`,
    source: "deterministic-fallback",
  };
}

