import { generateEventSuggestions } from "../src/lib/ai/gemini.ts";

async function runTest() {
  console.log("Testing generateEventSuggestions with live Gemini API key...");
  
  const sampleRequest = {
    eventType: "wedding",
    title: "Eco-chic Vineyard Wedding",
    guestCount: 120,
    totalBudgetMinor: 3500000, // $35,000
    currency: "USD",
    priorities: ["Sustainable Decor", "Farm-to-Table Catering", "Live Acoustic Music"],
    currentBudgetSummary: {
      totalBudgetMinor: 3500000,
      plannedTotalMinor: 3200000,
      remainingMinor: 300000,
      isOverBudget: false
    }
  };

  const response = await generateEventSuggestions(sampleRequest);
  console.log("\n=== GEMINI SUGGESTIONS RESPONSE ===");
  console.log("Source:", response.source);
  console.log("Executive Advice:", response.executiveAdvice);
  console.log("Ideas Count:", response.ideas?.length);
  console.log("\nSample Ideas Returned:");
  response.ideas.forEach((idea, i) => {
    console.log(`\n[${i + 1}] ${idea.title} (${idea.category})`);
    console.log(`    Cost: $${idea.estimatedCostMinor / 100}`);
    console.log(`    Description: ${idea.description}`);
    console.log(`    Rationale: ${idea.rationale}`);
    console.log(`    Assumptions:`, idea.assumptions);
  });

  if (response.source === "gemini-live") {
    console.log("\n>>> LIVE GEMINI DATA FETCH VERIFIED! <<<");
  } else {
    console.error("\n>>> Returned fallback instead of live data! <<<");
  }
}

runTest();

