# CONTEXT.MD — PERMANENT PROJECT MEMORY
**Project:** EventPilot — The Living Plan  
**Competition:** Google Prompt Wars Virtual — Challenge 5: Celebration & Event Planner  
**Created:** 2026-10-29  
**Last Updated:** 2026-10-30  
**Status:** ALL PHASES IMPLEMENTED & VERIFIED — RELEASE READY

---

## 1. PROJECT IDENTITY & COMPETITION
- **Project Name:** EventPilot — The Living Plan
- **Competition:** Google Prompt Wars Virtual (Prompt Wars 2026)
- **Challenge:** Challenge 5 — Celebration & Event Planner
- **Objective:** GenAI-assisted event-planning workspace connecting budgets, timelines, vendor checklists, and personalized ideas, featuring a dynamic, constraint-aware replanning engine ("The Living Plan").

---

## 2. CURRENT PROJECT STATUS
- **Current Phase:** Phase 9 — Competition Readiness & Final Certification
- **Overall Status:** `PASS / RELEASE READY`
- **Milestones Completed:**
  - Phase 1: Audit, Rules Verification & Leaderboard Strategy (`PASS`)
  - Phase 2: Competitor Research & Signature Innovation Decision (`PASS`)
  - Phase 3: Technical Architecture & Core System Contracts (`PASS`)
  - Phase 4: Deterministic Core Engines (`PASS`)
  - Phase 5: Signature Innovation — The Living Plan Replan Engine (`PASS`)
  - Phase 6: Server-Side AI Integration & Deterministic Fallback (`PASS`)
  - Phase 7: UI/UX Design Polish & Accessibility Engineering (`PASS`)
  - Phase 8: Quality Assurance & Release Gates (`PASS`)
  - Phase 9: Competition Readiness & Demo Scripts (`PASS`)

---

## 3. OFFICIAL RULES AND VERIFIED FACTS
- **Problem Statement (OBSERVED from official screenshot `screenshots/challenge5_problem_statement.jpg`):**
  *"Create a GenAI-powered planning assistant that helps users organize weddings, birthdays, and community events with budgets, timelines, vendor checklists, and personalized ideas."*
- **Evaluation Parameters (OBSERVED from official evaluation interface screenshot):**
  Six evaluation dimensions: Code Quality, Security, Efficiency, Testing, Accessibility, Problem Statement Alignment.
- **Empirical Scoring Evidence (OBSERVED from Challenge 3 breakdown screenshot):**
  Total: 96.16 / 100. Dimension scores: Code Quality 88, Security 99, Efficiency 100, Testing 96, Accessibility 98, Problem Statement Alignment 99.
- **Leaderboard Top Scores (OBSERVED from official Challenge 5 leaderboard screenshot):**
  Rank 1: 97.50, Rank 3: 97.48, Rank 5: 97.44. Total participants: ~5,161 pages (~50,000+ competitors).
  Top 10 Target Benchmark: Score ≥ 97.50.

---

## 4. SOURCE-OF-TRUTH HIERARCHY
1. Official Challenge 5 screenshots & submission portal rules (`VERIFIED / OBSERVED`).
2. Official Google Gemini API documentation (`VERIFIED`).
3. First-party competitor documentation and inspectable demos (`OBSERVED`).
4. Reputable independent engineering and research literature (`OBSERVED`).
5. Supplied project documents (`docs/00` to `docs/08`) (`INFERRED / HYPOTHESIS`).
6. Internal engineering hypotheses (`VERIFIED` by automated test suites).

---

## 5. RESEARCH FINDINGS AND CITATIONS
- Competitor matrix documented in `docs/COMPETITOR-RESEARCH.md`.
- Competitors investigated: The Knot, Zola, Wedbox/Wedsly, ChatGPT, Gemini, Lindy.ai, Asana.
- Key findings: Traditional wedding tools offer static spreadsheets and uncoordinated vendor lists; raw LLMs hallucinate financial sums and vendor prices and suffer context drift.

---

## 6. COMPETITOR COMPARISON SUMMARY
- Neither traditional platforms nor chat LLMs provide a **constraint-aware living plan** that recalculates variable costs deterministically, cascades timeline deadlines, emits typed before/after diffs, and protects user decision locks.

---

## 7. INNOVATION DECISION AND REASONS
- **Selected Innovation:** *The Constraint-Aware Living Plan with Explainable Change Preview & Financial Provenance*.
- **Documentation:** `docs/INNOVATION-DECISION.md` and `docs/COMPETITIVE-GAP-ANALYSIS.md`.
- Rationale: High user value, fully addressable within competition constraints, 100% testable with deterministic math, and highly differentiated in a 90-second demo.

---

## 8. FEATURES IMPLEMENTED
- [x] Full support for **Weddings**, **Birthdays**, and **Community Events**.
- [x] Complete **Budget Workspace** with integer minor unit math, category allocations, overrun alerts, and item locks.
- [x] Complete **Timeline Workspace** with calendar math, dependency DAG tracking, cycle conflict detection, and lock protection.
- [x] Complete **Vendor Checklist Workspace** with multi-stage pipeline and quoted vs. confirmed costs.
- [x] Complete **Personalized Ideas Workspace** with category filters, estimated costs, assumptions, and one-click "Add to Plan" adoption.
- [x] **Constraint Change Simulator** allowing instant adjustments to guest count, event date, and total budget.
- [x] **Change Review Modal** displaying Before/After diffs with rationale, financial impact, and granular accept/reject controls.
- [x] **Financial Provenance Badging** (`confirmed-by-user`, `ai-estimate`, `user-entered`).
- [x] **Server-side Gemini AI integration** (`POST /api/plan-suggestions`) with Zod validation, 8000ms timeout, and guaranteed deterministic fallback.
- [x] **Interactive New Event creation modal** and **Reset to Default** functionality.
- [x] **Local storage persistence** with clean client hydration.

---

## 9. FEATURES NOT IMPLEMENTED (DEFERRED)
- Real-time payment processing (Stripe/PayPal) — out of MVP scope.
- Live external venue scraping — out of MVP scope.
- Multi-user WebSockets — out of MVP scope.

---

## 10. ARCHITECTURE AND TECHNOLOGY DECISIONS
- **Framework:** Next.js 14 (App Router) with TypeScript in strict mode.
- **Styling:** Tailwind CSS with Lucide icons.
- **Engines:** Pure TypeScript modules (`budget.ts`, `schedule.ts`, `replan.ts`).
- **Validation:** Zod schemas (`schema.ts`, `validator.ts`).
- **AI Integration:** `@google/generative-ai` on server side; zero client key leakage.
- **Testing:** Vitest for pure, fast unit testing.

---

## 11. IMPORTANT FILE PATHS
- `PROMPT.md` — Master prompt instructions & phase checklist
- `context.md` — Permanent project memory (this file)
- `README.md` — Project overview, architecture, and demo guide
- `src/types/schema.ts` — TypeScript types & Zod schemas
- `src/lib/engines/budget.ts` — Pure budget calculation engine
- `src/lib/engines/schedule.ts` — Pure calendar & DAG schedule engine
- `src/lib/engines/replan.ts` — Constraint replan & diff generator
- `src/lib/ai/gemini.ts` — Server-side Gemini integration & fallback
- `src/lib/ai/validator.ts` — Zod request/response validation
- `src/lib/hooks/useEventPlan.ts` — Core state & persistence hook
- `src/components/*` — Accessible React UI components
- `src/app/page.tsx` — Main application dashboard
- `src/app/api/plan-suggestions/route.ts` — Server API route
- `docs/BASELINE-AUDIT.md` — Workspace audit
- `docs/CHALLENGE-RULES-VERIFICATION.md` — Challenge rules & scoring evidence
- `docs/LEADERBOARD-STRATEGY.md` — Leaderboard strategy (Top 10 cutoff: ≥97.50)
- `docs/COMPETITOR-RESEARCH.md` — Multi-category competitor matrix
- `docs/COMPETITIVE-GAP-ANALYSIS.md` — Gap analysis & defensible differentiation
- `docs/INNOVATION-DECISION.md` — Signature innovation evaluation & selection
- `docs/EVALUATION-TRACEABILITY-MATRIX.md` — Traceability of 6 evaluation dimensions
- `docs/TEST-AND-RELEASE-REPORT.md` — Verified test and build results

---

## 12. DATA MODELS AND API CONTRACTS
- All models strictly defined via Zod in `src/types/schema.ts` (`EventPlan`, `BudgetItem`, `EventTask`, `VendorItem`, `Idea`, `PlanChange`, `Provenance`).
- Server route `POST /api/plan-suggestions` accepts `AISuggestionsRequest` and returns `AISuggestionsResponse`.

---

## 13. SECURITY DECISIONS
- Zero client-side API keys (`GEMINI_API_KEY` accessed exclusively server-side via `process.env`).
- Zod schema validation on incoming request payloads and outgoing AI responses.
- React default escaping for all generated text (no raw unescaped HTML injection).
- Safe localStorage persistence with clear user reset controls.

---

## 14. EVALUATION DIMENSIONS AND QUALITY GATES
- Code Quality: `PASS` (0 TS errors, 0 ESLint warnings, pure modular engines).
- Security: `PASS` (0 client secrets, Zod validation, sanitized rendering).
- Efficiency: `PASS` (First load JS: 109 kB; synchronous sub-ms local calculations).
- Testing: `PASS` (19/19 unit tests passing across 4 test suites).
- Accessibility: `PASS` (Semantic landmarks, ARIA live regions, visible focus, ESC dialog dismiss).
- Problem Statement Alignment: `PASS` (3 event archetypes, 4 planning workspaces, Living Plan replanner).

---

## 15. TESTS RUN AND ACTUAL OUTCOMES
1. `pnpm typecheck` (`tsc --noEmit`) -> **Exit code 0** (0 type errors).
2. `pnpm lint` (`eslint "src/**/*.{ts,tsx}" --max-warnings 0`) -> **Exit code 0** (0 warnings, 0 errors).
3. `pnpm test` (`vitest run`) -> **Exit code 0** (19/19 passed in 1.02s).
4. `pnpm build` (`next build`) -> **Exit code 0** (Production bundle compiled cleanly).

---

## 16. KNOWN BUGS AND UNRESOLVED WARNINGS
- None. Zero known blocking build errors, zero test failures, zero lint warnings.

---

## 17. CURRENT BLOCKERS
- None.

---

## 18. DEFERRED FEATURES
- See section 9.

---

## 19. DEPLOYMENT AND SUBMISSION STATUS
- Codebase is production-built (`.next` build artifact verified).
- Demo mode is 100% functional offline without external credentials.

---

## 20. NEXT RECOMMENDED ACTIONS
- The application is complete, tested, and competition-ready.
- Optional: Configure `GEMINI_API_KEY` in `.env.local` if live Gemini model calls are desired during evaluator walkthrough.

---

## 21. ASSUMPTIONS AND UNVERIFIED CLAIMS
- Top 10 cutoff is empirically observed at ≥ 97.44–97.50 based on archived official screenshot `screenshots/challenge5_leaderboard.png`.

---

## 22. CHANGE LOG WITH DATES
- **2026-10-29:** Initial audit, documentation inspection, and official screenshot archiving.
- **2026-10-29:** Phase 1 (Audit & Verification) and Phase 2 (Competitor Research & Innovation Decision) completed.
- **2026-10-30:** Next.js project scaffolded with TypeScript strict mode, Tailwind CSS, Lucide icons, Vitest.
- **2026-10-30:** Deterministic engines (`budget.ts`, `schedule.ts`, `replan.ts`) implemented with 100% passing tests.
- **2026-10-30:** Server-side Gemini integration and deterministic fallback implemented with route handler.
- **2026-10-30:** Full accessible UI implemented (Budget, Timeline, Vendors, Ideas, Replan Review Modal).
- **2026-10-30:** All release quality gates passed (`typecheck`, `lint`, `test`, `build`). Release report generated.
