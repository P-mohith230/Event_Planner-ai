import React, { useState } from "react";
import { Idea, SupportedCurrency } from "@/types/schema";
import { formatCurrency } from "@/lib/engines/budget";
import { ProvenanceBadge } from "../common/ProvenanceBadge";
import {
  Sparkles,
  PlusCircle,
  Lightbulb,
  Check,
  RefreshCw,
  Coins,
} from "lucide-react";

interface IdeasPanelProps {
  ideas: Idea[];
  currency: SupportedCurrency;
  isGenerating: boolean;
  onGenerateIdeas: () => void;
  onAdoptIdea: (idea: Idea) => void;
}

export function IdeasPanel({
  ideas,
  currency,
  isGenerating,
  onGenerateIdeas,
  onAdoptIdea,
}: IdeasPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [adoptedIds, setAdoptedIds] = useState<Set<string>>(new Set());

  const categories = Array.from(new Set(ideas.map((i) => i.category)));

  const filteredIdeas =
    selectedCategory === "all"
      ? ideas
      : ideas.filter((idea) => idea.category === selectedCategory);

  const handleAdopt = (idea: Idea) => {
    onAdoptIdea(idea);
    setAdoptedIds((prev) => new Set([...Array.from(prev), idea.id]));
  };

  return (
    <div className="space-y-6" aria-label="Personalized Ideas Workspace">
      {/* Header Banner */}
      <div className="p-5 bg-gradient-to-r from-violet-600 to-indigo-700 rounded-xl text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-200" />
            <h2 className="text-base font-bold tracking-tight">Personalized GenAI Ideas & Enhancements</h2>
          </div>
          <p className="text-xs text-violet-100 mt-1 max-w-xl">
            Tailored suggestions grounded in your guest count, budget constraints, and priorities. Adopting an idea adds both an execution task to your timeline and a corresponding line item to your budget.
          </p>
        </div>

        <button
          onClick={onGenerateIdeas}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-violet-900 hover:bg-violet-50 disabled:opacity-70 text-xs font-bold rounded-lg shadow-sm transition-all flex-shrink-0"
          aria-label="Generate new ideas using Gemini AI"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin text-violet-600" : ""}`} />
          <span>{isGenerating ? "Consulting Gemini..." : "Generate More Ideas"}</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter ideas by category">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
            selectedCategory === "all"
              ? "bg-stone-900 text-white"
              : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
          }`}
        >
          All Ideas ({ideas.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              selectedCategory === cat
                ? "bg-violet-700 text-white"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            {cat} ({ideas.filter((i) => i.category === cat).length})
          </button>
        ))}
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIdeas.map((idea) => {
          const isAdopted = adoptedIds.has(idea.id);

          return (
            <div
              key={idea.id}
              className="p-5 bg-white rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between hover:border-violet-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-100">
                    {idea.category}
                  </span>
                  <ProvenanceBadge provenance={idea.provenance} />
                </div>

                <h3 className="text-sm font-bold text-stone-900">{idea.title}</h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">{idea.description}</p>

                {/* Strategic Rationale */}
                <div className="mt-3 p-2.5 bg-stone-50 rounded-lg border border-stone-100 text-xs text-stone-700">
                  <span className="font-bold text-stone-800">Why it fits: </span>
                  {idea.rationale}
                </div>

                {/* Assumptions */}
                {idea.assumptions && idea.assumptions.length > 0 && (
                  <div className="mt-2 text-[11px] text-stone-500">
                    <span className="font-semibold">Assumptions: </span>
                    {idea.assumptions.join("; ")}
                  </div>
                )}
              </div>

              {/* Cost & Action Footer */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <div>
                  {idea.estimatedCostMinor !== undefined ? (
                    <span className="text-xs font-bold text-stone-800 inline-flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-stone-500" />
                      {formatCurrency(idea.estimatedCostMinor, currency)}
                    </span>
                  ) : (
                    <span className="text-xs text-stone-400">Zero Cost / DIY</span>
                  )}
                </div>

                <button
                  onClick={() => handleAdopt(idea)}
                  disabled={isAdopted}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    isAdopted
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                      : "bg-violet-600 text-white hover:bg-violet-700 shadow-sm"
                  }`}
                >
                  {isAdopted ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Added to Plan</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add to Plan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
