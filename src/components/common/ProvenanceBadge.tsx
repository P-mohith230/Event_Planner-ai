import React from "react";
import { Provenance } from "@/types/schema";
import { CheckCircle2, Sparkles, User } from "lucide-react";

interface ProvenanceBadgeProps {
  provenance: Provenance;
  className?: string;
}

export function ProvenanceBadge({ provenance, className = "" }: ProvenanceBadgeProps) {
  if (provenance === "confirmed-by-user") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium badge-provenance-confirmed ${className}`}
        title="Confirmed by user through verified vendor quote or invoice"
        aria-label="Provenance: Confirmed by user"
      >
        <CheckCircle2 className="w-3 h-3 text-emerald-600" aria-hidden="true" />
        <span>Confirmed Quote</span>
      </span>
    );
  }

  if (provenance === "ai-estimate") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium badge-provenance-ai ${className}`}
        title="AI estimate — confirm before relying on this amount"
        aria-label="Provenance: AI estimate"
      >
        <Sparkles className="w-3 h-3 text-violet-600" aria-hidden="true" />
        <span>AI Estimate</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium badge-provenance-user ${className}`}
      title="Entered directly by user"
      aria-label="Provenance: User-entered"
    >
      <User className="w-3 h-3 text-sky-600" aria-hidden="true" />
      <span>User Entered</span>
    </span>
  );
}

