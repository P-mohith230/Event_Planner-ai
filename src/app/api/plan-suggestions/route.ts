import { NextRequest, NextResponse } from "next/server";
import { AISuggestionsRequestSchema } from "@/lib/ai/validator";
import { generateEventSuggestions } from "@/lib/ai/gemini";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => null);

    if (!rawBody) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const validationResult = AISuggestionsRequestSchema.safeParse(rawBody);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Request validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const suggestions = await generateEventSuggestions(validationResult.data);

    return NextResponse.json(suggestions, { status: 200 });
  } catch (error) {
    console.error("Unhandled API error in /api/plan-suggestions:", error);
    return NextResponse.json(
      {
        error: "Internal server error processing suggestions",
      },
      { status: 500 }
    );
  }
}

