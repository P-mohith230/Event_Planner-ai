# INNOVATION OPPORTUNITY ANALYSIS
**Project:** EventPilot, The Living Plan | **Date:** 30 October 2026 | **Status:** Draft for team review
**Evidence labels:** V = retrieved and checked; P = project documents, not re-verified in code; H = hypothesis; R = recommendation.

---

## 1. Starting point: what exists (as documented, not as verified)

I received `context.md`, the PRD/TRD/flow/schema/plan/quality documents, and the research and release reports. I did **not** receive `PROMPT.md`, source code, UI screenshots, or a deployed URL. Every "implemented" row below is therefore a **claim in `context.md` and `TEST-AND-RELEASE-REPORT.md`** until Antigravity confirms it in the repository (Phase 1 of the master prompt).

| Area | Documented state (P) | What would confirm it |
|---|---|---|
| Stack | Next.js 14.2.35 App Router, TypeScript strict, Tailwind, Lucide, Zod, Vitest, pnpm. (`BASELINE-AUDIT` planned Next 15; release report says 14, so the docs disagree) | `package.json`, lockfile |
| Engines | Pure TS: `budget.ts`, `schedule.ts`, `replan.ts` | Files exist; imports contain no React |
| Four workspaces | Budget, Timeline, Vendors, Ideas | Components render for all three sample plans |
| Signature feature | Constraint change (guests, date, budget) → before/after diff → per-item accept/reject; locks; provenance badges | Manual and automated run of the flow |
| AI | `POST /api/plan-suggestions` with Zod validation, 8000 ms timeout, deterministic fallback, via `@google/generative-ai` | Route file and package list |
| Persistence | localStorage with reset | Hook `useEventPlan.ts` |
| Quality evidence | Four commands passed: typecheck, lint, 19 Vitest tests, build | Re-run, because the report is the only evidence |
| **Not evidenced anywhere** | Browser/e2e tests, console and network inspection, automated accessibility scan, secret scan, dependency audit, deployment, public URL | Absent from the release report's command log |
| Unclear | Export/copy summary (PRD "if feasible"), landing page, event-type theming | Check in code |

**Preserve (R):** the three pure engines, the Zod schemas, the diff/lock/provenance model, the zero-key sample mode, and the existing docs structure. They are the project's real strengths and map directly to the evaluation dimensions.

## 2. Judgement on the current signature innovation

**Keep it. It is the right identity (R).** It is differentiated in behavior, honest about AI limits, and testable. But three weaknesses limit how it will land with judges:

1. **Gemini is peripheral.** Per the docs, the AI only produces ideas and suggestions, and with no key the app serves a deterministic fallback. If the deployed build lacks `GEMINI_API_KEY`, a judge sees **no generative AI at all**, which risks the "GenAI-powered" requirement. (H, depends on deployment.)
2. **The change flow is a form.** Changing a number in a simulator is clear but not memorable. The moment where AI understands a messy real-world update is missing.
3. **The diff answers "what changes" but not "which option should I choose".** The user cannot compare alternatives before committing.

## 3. Candidate innovations

| ID | Idea | What it is | Uses |
|---|---|---|---|
| I1 | **Living Plan** (existing) | Constraint change → deterministic recompute → reviewable diff → locks → provenance | Built (P) |
| I2 | **Tell the Pilot** | Free-text update ("90 guests now, and push it two weeks") parsed by Gemini into a typed constraint change, shown as editable chips, then run through I1 | Gemini structured output + existing replan engine |
| I3 | **Scenario Compare** | Run 2 or 3 hypothetical constraint sets side by side without committing; compare remaining budget, confidence, schedule slack; open any one in the existing review modal | Existing replan engine (pure) |
| I4 | **Plan Confidence and Readiness** | Deterministic metrics derived from provenance: share of spend that is confirmed vs estimated, budget range if estimates shift, overdue/blocked/conflicting tasks, unquoted vendors | Existing provenance + schedule engine |
| I5 | **Contingency Playbook** | Gemini proposes backup tasks and costs for a named risk (rain, vendor falls through, late headcount); user adopts into timeline | Gemini + existing "Add to plan" |
| I6 | Guest-personalized experiences | Aggregate guest preferences into ideas | Needs guest data and privacy handling |
| I7 | Quote comparator | Compare user-entered quotes per category | Existing vendor quotes |
| I8 | Live weather contingency | Forecast API drives contingencies | External API, false precision for far dates |
| I9 | Calendar (.ics) and printable summary export | Practical hand-off | Deterministic |
| I10 | Multi-user collaboration | Shared plans | Needs backend and auth |

## 4. Evaluation matrix

Scores 1 to 5, higher is better. **Implementation complexity is scored inversely (5 = simple).** Weights are my own decision aids, not official scoring. Totals are out of 100.

| ID | User value (20) | Originality (10) | Feasibility (15) | Simplicity (10) | Demo impact (20) | Challenge relevance (15) | Differentiation (10) | **Total** |
|---|---|---|---|---|---|---|---|---|
| I1 Living Plan | 5 | 4 | 5 | 4 | 5 | 5 | 5 | **96** (biased up: already built) |
| I3 Scenario Compare | 5 | 4 | 4 | 3 | 4 | 5 | 4 | **85** |
| I4 Plan Confidence | 4 | 4 | 5 | 4 | 4 | 4 | 4 | **83** |
| I2 Tell the Pilot | 4 | 4 | 4 | 3 | 5 | 4 | 4 | **82** |
| I5 Contingency Playbook | 4 | 3 | 4 | 3 | 3 | 4 | 3 | 70 |
| I7 Quote comparator | 3 | 3 | 4 | 4 | 3 | 4 | 3 | 68 |
| I9 .ics / print export | 3 | 2 | 5 | 5 | 2 | 3 | 2 | 62 |
| I6 Guest-personalized | 3 | 3 | 2 | 2 | 3 | 3 | 3 | 55 |
| I8 Weather API | 3 | 3 | 2 | 2 | 3 | 3 | 3 | 55 |
| I10 Collaboration | 4 | 3 | 1 | 1 | 3 | 2 | 3 | 51 |

The scores are subjective. I2, I3 and I4 are within 3 points, so the ranking among them matters less than the fact that all three clearly beat the rest and all three **reuse engines that already exist**.

## 5. Selection

**Signature innovation (identity): the Constraint-Aware Living Plan.** Tagline suggestion (R): *"Change one thing. See everything it touches. Keep what you've decided."*

**Supporting innovations (build in this order):**

1. **I4 Plan Confidence and Readiness.** Cheapest and safest. Turns provenance from decoration into a number people use: "62% of planned spend is confirmed; if estimates move ±20%, you land between X and Y." The ±20% band is an **app assumption**, labeled as such in the UI and configurable, not a market fact.
2. **I3 Scenario Compare.** Converts the diff from "what happens" to "which option". Pure functions on top of the replan engine.
3. **I2 Tell the Pilot.** Makes Gemini visible and central in the signature flow while keeping Gemini out of the arithmetic. Gemini only translates language into a validated constraint object. The deterministic engine does all math and scheduling.

**Stretch only if everything else passes its gates:** I9 calendar export (small, real utility), then I5 Contingency Playbook.

**Explicitly rejected for now:** I6, I8, I10 (external data, privacy, or backend cost out of proportion to benefit), I7 (folded into I4's "unquoted vendors" metric).

## 6. Why these are meaningfully different (H, to be tested)

- Chat assistants regenerate. EventPilot **edits a structured plan and preserves locks**.
- Incumbent AI (Knot, Zola) targets vendor matching, copy and decision splitting (V, see research doc). We target **replanning and number trust**, which I did not find in the products examined (an observation, not proof of absence).
- Gemini is used where language understanding is genuinely needed (intent parsing, ideas, contingencies) and **never** for money or dates.

## 7. Implementation sketch on the existing stack

Names follow the documented structure. Adjust to the real repository during the audit.

| Feature | New or changed files | Contract | Failure behavior |
|---|---|---|---|
| I4 | `src/lib/engines/confidence.ts`, `src/components/budget/ConfidenceCard.tsx`, `tests/unit/confidence.test.ts` | `computeConfidence(plan, opts) → { confirmedShare, aiShare, userShare, rangeLowMinor, rangeHighMinor, bandPct, readiness: { overdue, blocked, conflicts, unquotedVendors } }` | Pure; empty plan returns zeros and an "add items" state |
| I3 | `src/lib/engines/scenario.ts`, `src/components/replan/ScenarioCompare.tsx`, tests | `runScenarios(plan, ConstraintChange[] ≤ 3) → ScenarioResult[]` each with `changes`, metrics from I4, schedule slack in days. **Must not mutate `plan`** | Invalid scenario shows its validation error inline; others still render |
| I2 | `src/lib/ai/intent.ts`, `src/app/api/interpret-change/route.ts`, `src/components/replan/TellThePilot.tsx`, tests | Request `{ text ≤ 500 chars, planSummary }`. Gemini returns `{ guestCount?, newEventDate?, dateShiftDays?, totalBudgetMinor?, budgetChangePct?, ambiguities[] }` (Zod-validated with bounds). UI shows editable chips; **nothing applies until the user confirms**, then the existing change flow runs | No key, timeout, rate limit or invalid JSON → clear message, manual controls remain. **No fake parsing** |

Security notes for I2: treat `text` as untrusted; never echo model output as HTML; accept only the schema's fields; enforce server-side length and rate limits.

## 8. How judges experience it (90-second demo)

1. **0:00** Load the wedding sample. Point at the Confidence card: "41% of spend is confirmed, and this is the range if estimates shift."
2. **0:15** Type in Tell the Pilot: "Aunt's family is coming. About 140 guests now, and let's move it three weeks later." Chips appear: guests 140, date +21 days. Confirm.
3. **0:35** Scenario Compare shows "as typed" vs "keep 120 guests, move date" vs "cut budget 10%". Remaining budget, confidence and schedule slack differ.
4. **0:55** Open one scenario in the review modal. Reject a catering change, accept a venue-deposit change. A locked item stays untouched.
5. **1:15** Close on provenance badges and the "template fallback / Gemini" source label. State plainly what is estimated.

**Demo rule:** every step above must run against the real build with the real key configured. A recorded fallback is acceptable only if labeled.

## 9. Risks

| Risk | Mitigation |
|---|---|
| I2 mis-parses and the user applies a wrong change | Confirmation chips, editable fields, existing diff review remains the last gate |
| Scenario mutation bugs corrupt the plan | Property test: plan deep-equals its snapshot after `runScenarios` |
| Scope creep on a plan that already passes gates | Each feature is behind its own gate; regress-test existing suites first |
| Gemini quota or key missing at evaluation time | Verify deployed env; visible source label; honest fallback message |
