# EventPilot — The Living Plan
**Google Prompt Wars Virtual — Challenge 5: Celebration & Event Planner**

EventPilot is a GenAI-assisted event planning workspace that connects **Budgets**, **Timelines**, **Vendor Checklists**, and **Personalized Ideas**. Its core differentiator is **The Living Plan**: an explainable, constraint-aware replanning engine that calculates the ripple effects of real-world event changes (guest count, date shifts, budget cuts) with exact deterministic math, while leveraging Google Gemini for creative rebalancing and strictly preserving user-locked decisions.

---

## 1. Problem Statement Alignment (Challenge 5)
Challenge 5 asks for:
> *"A GenAI-powered planning assistant that helps users organize weddings, birthdays, and community events with budgets, timelines, vendor checklists, and personalized ideas."*

EventPilot satisfies this with complete, production-ready workspaces:
1. **Event Types:** Dedicated first-class archetypes for **Weddings**, **Birthdays**, and **Community Galas**.
2. **Budgets:** Pure integer minor unit math (cents/paise), category allocations, per-guest scaling items, and overrun warnings.
3. **Timelines:** Chronological milestone scheduling, relative date offsets, and DAG dependency validation with cycle detection.
4. **Vendor Checklists:** Multi-stage vendor pipeline (`not-contacted` → `contacted` → `quoted` → `booked`) with quoted vs. confirmed costs.
5. **Personalized Ideas:** GenAI-generated themes, entertainment concepts, and budget savers with one-click adoption directly into the timeline and budget.

---

## 2. Signature Innovation: The Living Plan

### The Real-World Dilemma
Event plans change constantly. In traditional apps (e.g. The Knot, Zola), changing your guest count or budget requires manual recalculation across disconnected spreadsheets. In raw AI chat assistants (e.g. ChatGPT, Gemini), re-prompting hallucinates math and wipes out user customizations.

### EventPilot's Hybrid Solution
1. **Deterministic Constraint Engine:** When guest count changes, variable items (catering, bar, table rentals) scale instantly with exact math. When the event date moves, unlocked relative milestones cascade automatically.
2. **Explainable Change Review Panel:** Ripple effects are surfaced in a side-by-side **Before/After Change Review Panel** displaying previous values, proposed values, stated rationales, and net financial impact.
3. **Decision Lock Protection:** Users can lock any budget item, task, or date. Locked items are treated as immutable boundary conditions.
4. **Epistemic Financial Provenance:** Every figure is tagged:
   - `Confirmed Quote` (User-verified vendor quote or contract)
   - `AI Estimate` (Machine-generated estimate)
   - `User Entered` (Manually entered figure)

---

## 3. Technology Stack & Architecture

- **Framework:** Next.js 14 (App Router) with TypeScript in strict mode (`strict: true`, `noImplicitAny: true`, `strictNullChecks: true`).
- **Styling:** Tailwind CSS with Lucide icons (WCAG 2.1 AA accessible, responsive 375px to 1440px+).
- **Engines:** Pure TypeScript modules with zero external runtime dependencies (`src/lib/engines/`).
- **AI Integration:** `@google/generative-ai` calling Gemini API exclusively server-side via `POST /api/plan-suggestions` (zero client key leakage).
- **Validation:** Zod schemas enforcing input and structured output contracts (`src/types/schema.ts`, `src/lib/ai/validator.ts`).
- **Testing:** Vitest running 19 automated unit tests covering financial arithmetic, DAG graph cycle detection, and replan diff generation.

---

## 4. Quick Start & Setup

### Prerequisites
- Node.js `v18.17+` or `v20+` or `v22+` (Tested on `v22.16.0`)
- pnpm `v9+` or `v10+` (or npm)

### Installation
```bash
# Clone or navigate to the repository
cd eventplanner_ai

# Install dependencies
pnpm install
```

### Environment Configuration (Optional)
EventPilot is **100% operational offline** without an API key using built-in deterministic templates. To enable live Google Gemini calls:
```bash
# Copy example environment file
cp .env.example .env.local

# Add your Gemini API key from https://aistudio.google.com/
GEMINI_API_KEY=your_actual_gemini_api_key
```

### Running Locally
```bash
# Start development server
pnpm dev

# Open http://localhost:3000 in your browser
```

---

## 5. Verification & Testing

Every quality gate is verified and passing:
```bash
# Run strict TypeScript typecheck (0 errors)
pnpm typecheck

# Run ESLint (0 errors, 0 warnings)
pnpm lint

# Run automated unit tests (19/19 passing)
pnpm test

# Build production bundle (Zero build warnings)
pnpm build
```

---

## 6. 90-Second Competition Demo Script

1. **Load EventPilot:** The app opens with *Alex & Jordan's Coastal Garden Wedding* (120 guests, $28,000 budget).
2. **Inspect Provenance:** Notice the **Confirmed Quote**, **AI Estimate**, and **User Entered** badges on budget items.
3. **Observe Decision Locks:** Notice that the Venue ($6,500) and Photography ($3,200) items have active **Lock** icons.
4. **Trigger Constraint Simulation:** Click **Simulate Constraint Change**. Increase guest count from `120` to `150` (+30 guests). Click **Simulate Impact & Review Diffs**.
5. **Review the Diff:** The **Change Review Modal** appears:
   - Farm-to-Table Plated Dinner scales from `$9,600` → `$12,000` (+`$2,400`) based on $80/guest.
   - Artisanal Wine & Craft Beer Open Bar scales from `$3,600` → `$4,500` (+`$900`).
   - Notice that the locked Venue rental was **not touched**!
6. **Accept / Reject Agency:** Reject the bar increase and accept the dinner increase. Notice how only accepted items commit to the plan.
7. **Personalized Ideas:** Switch to the **Personalized Ideas** tab. Click **Add to Plan** on *"Audio Guestbook Rotary Phone"*. Notice that it automatically adds an execution task to the Timeline and a line item to the Budget.
8. **Switch Archetypes:** Click **Birthday** or **Community Gala** in the header to observe distinct planning models.

---

## 7. Documentation Index
- `docs/BASELINE-AUDIT.md` — Initial repository & environment audit
- `docs/CHALLENGE-RULES-VERIFICATION.md` — Verified Challenge 5 rules & scoring evidence
- `docs/LEADERBOARD-STRATEGY.md` — Leaderboard strategy targeting Top 10 (score ≥ 97.50)
- `docs/COMPETITOR-RESEARCH.md` — Detailed competitor matrix across 6 categories
- `docs/COMPETITIVE-GAP-ANALYSIS.md` — Gap analysis & defensible differentiation
- `docs/INNOVATION-DECISION.md` — Signature innovation evaluation & selection
- `docs/EVALUATION-TRACEABILITY-MATRIX.md` — Traceability of 6 evaluation dimensions
- `docs/TEST-AND-RELEASE-REPORT.md` — Verified test, lint, and build execution report
- `PROMPT.md` — Master prompt instructions & phase execution checklist
- `context.md` — Permanent project memory with 22 structured sections
