# ANTIGRAVITY IMPROVEMENT MASTER PROMPT: EventPilot, The Living Plan
**Paste this into Antigravity IDE from the repository root.** It improves an existing, working application. It is not a rebuild.
**Prepared:** 30 October 2026 from the project's own documents plus new research. Source code, `PROMPT.md`, UI screenshots and the deployment were **not available to the author**, so every statement about the current code is a claim to verify in Phase 1.

---

## 0. Mission, context and ground rules

You are the lead engineer improving **EventPilot, The Living Plan**, built for **Google Prompt Wars Virtual, Challenge 5: Celebration & Event Planner**. Official problem statement (observed from the portal): *"Create a GenAI-powered planning assistant that helps users organize weddings, birthdays, and community events with budgets, timelines, vendor checklists, and personalized ideas."* The six evaluation dimensions are Code Quality, Security, Efficiency, Testing, Accessibility and Problem Statement Alignment. The official weights are unknown. Never invent them, never claim a rank, never write a "projected score".

**Read first, in this order:** `PROMPT.md`, `context.md`, `README.md`, `docs/00` to `docs/08`, `docs/BASELINE-AUDIT.md`, `docs/CHALLENGE-RULES-VERIFICATION.md`, `docs/COMPETITOR-RESEARCH.md`, `docs/COMPETITIVE-GAP-ANALYSIS.md`, `docs/INNOVATION-DECISION.md`, `docs/EVALUATION-TRACEABILITY-MATRIX.md`, `docs/LEADERBOARD-STRATEGY.md`, `docs/TEST-AND-RELEASE-REPORT.md`, and the five new documents: `COMPETITOR-AND-MARKET-RESEARCH.md`, `INNOVATION-OPPORTUNITY-ANALYSIS.md`, `UI-UX-AND-VISUAL-DESIGN-RESEARCH.md`, `HACKATHON-EVALUATION-STRATEGY.md`, and this file.

### Non-negotiable rules
1. **Inspect before changing.** Run `git status` and `git log`. Create a tag `baseline-pre-improvement` and a branch `improve/living-plan-v2`. Commit at the end of each phase so any phase can be reverted.
2. **Preserve what works.** Keep the pure engines (`budget.ts`, `schedule.ts`, `replan.ts`), the Zod schemas, the diff/accept/reject/lock/provenance model, zero-key sample mode, localStorage persistence and the existing public function signatures. Extend; do not rewrite. If you believe a rewrite is justified, write a short justification in `docs/decisions/` and obtain human approval first.
3. **Real functionality only.** No mock UI, fake data presented as live, simulated AI output, or buttons without behavior. Fallback content must be labeled "Template fallback", never "AI".
4. **Gemini never does arithmetic or date math.** It may parse language, propose ideas and explain. All money, dates and diffs come from the deterministic engines.
5. **Never expose or commit secrets.** `GEMINI_API_KEY` stays server-side. Never print it, log it or place it in the client bundle.
6. **Evidence over assertion.** A check counts as passed only if you ran it and recorded the command, the exit code and the relevant output. If you cannot run something, mark it `BLOCKED` with the reason. Do not write "PASS" from reading code.
7. **Keep memory current.** At the end of every phase update `context.md` (status, features, known issues, change log with dates) and the checklist in `PROMPT.md`. If a document makes a claim you find to be false, correct the document and record the correction.
8. **Honest scope.** Build in the priority order given. If time is short, stop at the last phase whose gates are green and report the rest as deferred.

### Questions to ask the human before Phase 6 if you cannot determine the answer yourself
- Are Challenge 5 submissions still open, and does a resubmission replace the current score? (The portal screenshot showed a window of 18/08/2026 11:00 to 14:56 IST, which may not apply.)
- What hosting does the challenge require or allow, and is a public URL mandatory?
- Is a `GEMINI_API_KEY` available for local testing and for the deployed build?
- Is there an existing logo or brand color to keep?

---

## Phase 1: Existing project audit

**Objective:** replace documentation claims with verified facts.
**Depends on:** nothing.
**Tasks**
1. Inventory: framework and library versions from `package.json` and the lockfile; scripts; routes; components; engines; tests; env files; `.gitignore`; `next.config`.
2. Run the real baseline and save output to `docs/audit/baseline/`: install from lockfile, `typecheck`, `lint`, `test`, `build`. Start the production build (`next build && next start`) and run the app.
3. Exercise every claimed feature by hand in the browser for each of the three sample plans and for a user-created event. For each feature in `context.md` §8, record `WORKS`, `PARTIAL` or `MISSING`, with evidence.
4. Capture screenshots at 375, 768 and 1440 px of every screen and modal into `docs/audit/screenshots/before/`.
5. Open the browser console and network panel during the core journeys; record every error, warning and failed request.
6. Check specifically: does a *user-created* event produce ideas and tasks that reflect its priorities? What exactly is sent to Gemini? Is `/api/plan-suggestions` rate limited? Are request bodies size-capped? Is localStorage data validated on load? Do currency tests cover JPY and KWD? Which file is largest? Which SDK package and model id are used?
7. Run and record: a secret scan (e.g., gitleaks) on the repo and history; `pnpm audit --prod`; a grep of `.next` output for key prefixes; a Lighthouse run on the production build; an axe scan of each view.
8. Produce a discrepancy list comparing `context.md`, the release report and the traceability matrix against what you found.
**Expected outputs:** `docs/AUDIT-V2.md` with a feature table (claimed vs verified), baseline results, console and network findings, security and accessibility findings, a ranked defect list, and the discrepancy list; `docs/audit/**` artifacts.
**Completion criteria:** every feature in `context.md` has a verified status; every command run has its exit code recorded; defects are ranked P0 to P2; nothing in the audit is inferred from documentation alone.

**Known items to confirm (from the document review):** the project uses `@google/generative-ai`, which Google has deprecated in favor of `@google/genai`; no deployment exists; no e2e, console, accessibility, secret or dependency checks were recorded; `replan` has 3 tests; documents disagree on Next.js 14 vs 15; and several self-imposed constraints are labeled "VERIFIED" as if they were official rules.

## Phase 2: Competitor research findings

**Objective:** make the project's competitive claims accurate.
**Depends on:** Phase 1.
**Tasks**
1. Read `COMPETITOR-AND-MARKET-RESEARCH.md`. Open each cited link once to confirm it still supports the claim; note the retrieval date.
2. Update `docs/COMPETITOR-RESEARCH.md` and `docs/COMPETITIVE-GAP-ANALYSIS.md` with the corrections in Section 3 of the research document: Zola and The Knot both ship AI features; absence claims are softened to "not observed"; weak home-page citations are replaced by deep links or removed.
3. Remove or relabel unverified items: the Devpost URL in the TRD unless the team confirms it; any statement implying incumbents lack AI.
4. Add a "Claims we must not make" list to the README's limitations section.
**Expected outputs:** corrected research files; a change note in `context.md`.
**Completion criteria:** no remaining claim that contradicts a retrieved source; every competitor statement carries a label (verified, observed, hypothesis) and a dated link.

## Phase 3: Innovation selection

**Objective:** lock the identity and the supporting features against the real code.
**Depends on:** Phases 1 and 2.
**Tasks**
1. Confirm the signature innovation stays: **the Constraint-Aware Living Plan** (deterministic recompute, reviewable diff, locks, provenance).
2. Confirm feasibility of the three supporting features against the code you audited, in this build order: **(I4) Plan Confidence and Readiness**, **(I3) Scenario Compare**, **(I2) Tell the Pilot**. Stretch only after all gates are green: calendar (.ics) export, then Contingency Playbook.
3. If the audit shows any of these already exist or conflict with the architecture, adjust and record why.
4. Write `docs/decisions/ADR-001-innovation-scope.md` and `docs/decisions/ADR-002-hybrid-ai-boundary.md` (what Gemini may and may not do).
**Expected outputs:** two ADRs; an updated `docs/INNOVATION-DECISION.md` pointing to them.
**Completion criteria:** each selected feature has a one-paragraph acceptance statement that a test can verify.

## Phase 4: Product and feature improvements (specifications)

Write the specs into `docs/FEATURE-SPECS-V2.md` before coding. Reuse existing types where they exist; the names below are targets.

**4.1 Plan Confidence and Readiness (I4), deterministic**
- `computeConfidence(plan, options)` returns: `confirmedShare`, `aiShare`, `userShare` (of planned spend), `bandPct` (default 20, labeled in the UI as an *app assumption*, configurable), `rangeLowMinor`, `rangeHighMinor` (applying the band to `ai-estimate` items only), `varianceAtHighMinor`, and `readiness` counts: `overdue`, `blocked`, `conflicts`, `unquotedVendors`.
- Integer minor units only; divide-by-zero safe; empty plan returns zeros.
- UI: a Confidence card in the plan strip with a text alternative, never color alone.

**4.2 Scenario Compare (I3), pure**
- `runScenarios(plan, changes: ConstraintChange[])` with at most 3 entries. For each: the proposed change set (from the existing replan engine), planned total, remaining, confidence metrics, schedule slack in days before the event date, number of locked-item conflicts.
- **Must not mutate `plan`.** Each scenario can be opened in the existing Change Review modal and applied through the existing accept/reject path.
- UI: up to 3 comparison cards with a clear "Review this scenario" action. No scenario is ever applied without review.

**4.3 Tell the Pilot (I2), Gemini as parser only**
- New route `POST /api/interpret-change`. Request: `{ text: string (≤ 500 chars), planSummary }`. Response (Zod-validated, bounded): `{ guestCount?: int, newEventDate?: YYYY-MM-DD, dateShiftDays?: int, totalBudgetMinor?: int, budgetChangePct?: number, ambiguities: string[] }`.
- Gemini call: `responseMimeType: "application/json"` with a response schema; temperature 0; low `maxOutputTokens`. System instruction (adapt as needed): *"Extract only the changes the user states about guest count, event date and total budget. Output JSON matching the schema. If a value is not stated, omit it. If something is unclear, list it in `ambiguities`. Never invent numbers."* User text is passed as data, never merged into the instruction.
- UI: a text box under the plan strip; results appear as **editable chips** ("Guests: 140", "Date: +21 days"); the user confirms, then the existing constraint-change flow runs. Nothing applies automatically.
- Failure behavior: no key, timeout, 429 or invalid output shows a clear message and leaves the manual controls usable. **Do not implement a pretend parser.**

**4.4 Personalization depth**
- Add an optional "Traditions, style and must-haves" free-text field (bounded, sanitized) to event creation and to the AI ideas request. Verify the ideas visibly change when priorities or notes change (with a live key) and that the fallback does vary by event type and priorities.
- Every AI result shows a source badge: **Gemini** or **Template fallback**.

**4.5 Stretch (only if all gates are green):** `.ics` export of the timeline (deterministic, no dependency if feasible); Contingency Playbook (Gemini proposes backup tasks and costs for a named risk; adopted into the timeline through the existing "Add to plan" path, with a deterministic fallback template).

**Expected outputs:** `docs/FEATURE-SPECS-V2.md` with types, edge cases and acceptance tests per feature.
**Completion criteria:** each spec lists inputs, outputs, failure behavior and at least five named test cases.

## Phase 5: UI/UX redesign

**Objective:** a premium, calm, editorial product that does not look like a generic AI chatbot or admin dashboard. Follow `UI-UX-AND-VISUAL-DESIGN-RESEARCH.md`.
**Depends on:** Phase 1 screenshots; Phase 4 specs.
**Tasks**
1. Record the current tokens, then introduce a token layer (CSS variables mapped through the Tailwind config): brand, status, and per-event theme tokens (`data-theme="wedding|birthday|community"`) with the HEX values and measured contrast ratios in the design document. Keep the existing brand violet if it is the established brand.
2. Fonts via `next/font/google`: Inter (UI), Fraunces (wedding and community display), Bricolage Grotesque (birthday display). Verify availability; at most three families, minimal weights, Latin subset.
3. Landing screen: headline, three event cards that preview their themes, "Try a sample plan" primary action, three-step explanation, honesty line. Inline SVG motifs only, `aria-hidden`.
4. Event creation as a three-step flow (type, essentials, style notes) with inline accessible validation and determinate progress.
5. Workspace: plan strip (title, countdown, guests, budget, Confidence card), accessible tabs, redesigned Budget, Timeline, Vendors and Ideas views, and a **Pilot panel** (Tell the Pilot, Scenario Compare, Change Review). Desktop 12-column grid; tablet drawer; mobile bottom tab bar with stacked cards.
6. Components: `ProvenanceBadge` (icon + text + shape), `LockToggle`, `AiSourceBadge`, `StatusChip`, `ConfidenceCard`, `ScenarioCard`, `DiffRow`. Respect `prefers-reduced-motion` and `forced-colors`.
7. Capture "after" screenshots to `docs/audit/screenshots/after/` for each theme at 375, 768 and 1440 px.
**Expected outputs:** token files, redesigned screens, before/after screenshots, a short `docs/DESIGN-SYSTEM.md`.
**Completion criteria:** no behavior regressions (existing tests still pass); 0 serious/critical axe violations; no horizontal scroll at 320 px; all text and UI contrast ≥ 4.5:1 / 3:1 with ratios recorded.

## Phase 6: Technical architecture improvements

**Depends on:** Phase 1. Do this **before** Phase 7 because `/api/interpret-change` needs the new SDK.
**Tasks**
1. **SDK migration:** replace `@google/generative-ai` with `@google/genai`. Read the current Gemini API docs for the exact client, structured-output and model-id usage. Put the model id in `GEMINI_MODEL` (documented default, verified current) and verify free-tier or pricing limits before choosing. Keep the deterministic fallback. Update `.env.example`. Re-run and extend the AI tests.
2. **Enforce architecture with lint:** `no-restricted-imports` so `src/lib/engines/**` cannot import React, Next or `src/lib/ai/**`; `complexity` ≤ 10; `max-lines-per-function` ≤ 60; keep `--max-warnings 0`. Add Prettier with `format:check`, and a dead-code check.
3. **Split large files** (start with `src/app/page.tsx` if it is large) into focused components and hooks without changing behavior.
4. **API hardening** for every route: content-type check, body-size cap, Zod parse, per-IP rate limit (document its best-effort nature on serverless), safe error taxonomy using the existing error codes, no logging of user text or secrets.
5. **Security headers** in `next.config` or middleware: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, framing protection, and a Content-Security-Policy introduced **report-only first** (Next.js inline scripts need a nonce-based policy); enforce only when the console is clean.
6. **Persistence safety:** parse localStorage with the Zod schemas on load; discard or migrate invalid data with a visible notice; handle storage failure with session-only mode.
7. **Efficiency:** in-flight dedupe and `AbortController` for AI calls; a bounded cache keyed by a hash of relevant inputs; `next/dynamic` for modals and Scenario Compare; send only a plan summary to Gemini.
8. **Deployment config:** add `output: "standalone"` and a Dockerfile if targeting Cloud Run; add `/api/health`; document how `GEMINI_API_KEY` is provided as a secret. Verify current Google Cloud and Gemini terms before relying on them.
9. **Scripts:** add `format:check`, `test:coverage`, `test:e2e`, `audit`, and `verify` (runs typecheck, lint, format:check, test:coverage, build, and e2e).
10. Write `docs/decisions/ADR-003-sdk-migration.md` and `ADR-004-deployment.md`.
**Expected outputs:** code changes, ADRs, updated `.env.example`, updated README setup.
**Completion criteria:** `typecheck`, `lint`, `format:check`, `test`, `build` all exit 0 with 0 warnings; no occurrence of `@google/generative-ai` remains; AI route tests pass against the new SDK with a mocked client; bundle contains no key.

## Phase 7: Feature implementation

**Order, with tests written alongside each feature:** I4, then I3, then I2, then personalization depth, then stretch items only if gates are green.
**Per feature**
1. Write the pure engine function and its unit and property tests first.
2. Add Zod types in the existing schema module.
3. Build the UI using the Phase 5 components.
4. Add component tests and one e2e path.
5. Update `context.md` and tick `PROMPT.md`.

**Suggested files** (adapt to the repository): `src/lib/engines/confidence.ts`, `src/lib/engines/scenario.ts`, `src/lib/ai/intent.ts`, `src/app/api/interpret-change/route.ts`, `src/components/budget/ConfidenceCard.tsx`, `src/components/replan/ScenarioCompare.tsx`, `src/components/replan/TellThePilot.tsx`, `src/components/common/AiSourceBadge.tsx`, and matching tests under `tests/`.

**Invariants every feature must keep** (turn these into property tests):
- planned total equals the sum of included item amounts, in integer minor units;
- locked items never change under any constraint change or scenario;
- rejecting every proposed change leaves the plan deep-equal to its snapshot;
- `runScenarios` leaves its input plan deep-equal to its snapshot;
- no engine imports React, Next or AI modules;
- no AI output is applied without explicit user confirmation.

**Completion criteria per feature:** its acceptance tests pass; the e2e path passes with zero console errors; the UI is keyboard-operable; behavior is unchanged for pre-existing features.

## Phase 8: Testing and quality assurance

**Objective:** replace asserted quality with executed evidence.
**Tasks**
1. **Unit and property tests** (fast-check): the invariants above plus date edge cases (leap day, month ends), zero and maximum guests, maximum safe integers, empty plan, cyclic and missing dependencies, and currency cases for USD, EUR, GBP, INR, **JPY (0 decimals)** and **KWD (3 decimals)**.
2. **Route tests** with a mocked Gemini client for both routes: valid, invalid JSON, schema violation, timeout, 429, missing key, oversized body, wrong content type, injection-style text.
3. **Component tests** (Testing Library): form validation, Change Review accept/reject, lock toggle, Scenario Compare, Tell the Pilot chips and failure states.
4. **E2E (Playwright)** against `next build && next start`: load each sample plan; create a custom event; change guests, review, accept one and reject one, verify totals; locked item survives; Tell the Pilot with a mocked route; AI-unavailable path; reset. Add a shared fixture that **fails any test on `console.error`, uncaught exception or failed request**, and counts AI requests per action.
5. **Accessibility:** axe inside Playwright on each primary view and both modals at 375 and 1440 px; a manual keyboard run; a screen-reader pass with notes; 200% zoom; `prefers-reduced-motion` and `forced-colors` emulation.
6. **Coverage** with thresholds: engines ≥ 95% lines and ≥ 90% branches; overall ≥ 80%. Do not weaken tests to hit a number.
7. **CI:** a workflow that runs the `verify` script on every push.
**Expected outputs:** test suites, CI config, `docs/TEST-AND-RELEASE-REPORT.md` rewritten with the real command log (command, exit code, summary).
**Completion criteria:** all suites green; thresholds met; e2e green with the console fixture; axe 0 serious/critical; CI green. If anything fails, fix the cause, do not suppress the check.

## Phase 9: Evaluation optimization

**Objective:** close the gaps against the six dimensions with recorded evidence.
**Tasks**
1. For each dimension, run the checks in `HACKATHON-EVALUATION-STRATEGY.md` §3 and fill a table: check, command, result, artifact path.
2. **Code Quality:** all lint/format/type/dead-code checks clean; no file over about 300 lines without a written reason; JSDoc on public engine functions.
3. **Security:** secret scan clean (repo and history); bundle grep clean; `pnpm audit --prod` with 0 high/critical or documented exceptions; headers verified with `curl -I` on the deployed URL; route tests cover abuse cases.
4. **Efficiency:** Lighthouse (mobile profile, production build) recorded; First Load JS compared to the 109 kB baseline and justified if above 150 kB; network log shows no duplicate AI calls.
5. **Testing:** coverage report and test counts recorded.
6. **Accessibility:** axe JSON, keyboard and screen-reader notes, contrast table.
7. **Alignment:** walk the acceptance table in the strategy document on the production build.
8. Reconcile documents: remove the "≥ 97.50 Top-10 target" and the "projected 98.50" statements; relabel self-imposed rules; correct the Next.js version mismatch; update `EVALUATION-TRACEABILITY-MATRIX.md` with real statuses and artifact links (`PASS`, `FAIL` or `BLOCKED`, never assumed).
**Expected outputs:** `docs/QUALITY-EVIDENCE.md`, updated traceability matrix, updated release report.
**Completion criteria:** every dimension has at least one executed, recorded check; any unresolved warning or error has a documented cause, impact and mitigation.

## Phase 10: Final demo and deployment preparation

**Tasks**
1. Deploy according to the Phase-0 answers and ADR-004. Provide `GEMINI_API_KEY` as a server-side secret. Verify on the deployed URL: home page, all three sample plans, a custom event, the AI routes, `/api/health`, headers, and the browser console and network panel.
2. Confirm the deployed build uses **live Gemini** for ideas and Tell the Pilot, and that the source badge says so. If the key or quota is unavailable, say so plainly in the README and the demo, and show the labeled fallback.
3. Write the 90-second demo script from `INNOVATION-OPPORTUNITY-ANALYSIS.md` §8 into `docs/DEMO-SCRIPT.md` and rehearse it on the deployed URL. Record a short video only of real behavior.
4. Update `README.md`: product overview, problem statement, the signature innovation, architecture diagram, setup, environment variables, every script, how to run each test layer, deployment, an alignment checklist, and an honest limitations section (localStorage only, no vendor data, estimates are not quotes, the ±band is an assumption, rate limiting is best-effort).
5. Update `context.md` and `PROMPT.md` to final truth, including anything `BLOCKED` or deferred.
6. Final clean-clone check: clone to a new folder, install from the lockfile, run `verify`, start the app.
**Expected outputs:** deployed URL, demo script, final README, final `context.md`.
**Completion criteria:** clean-clone `verify` passes; the deployed URL passes the walkthrough with no console errors and no failed essential requests; the final report below is delivered.

---

## Final report format (required)

1. Files changed and why, grouped by phase.
2. Features: implemented, partial, deferred (with reasons).
3. Every command run with its exit code and a one-line result.
4. Test counts and coverage numbers.
5. Console and network findings from the deployed URL.
6. Security findings and resolutions (secret scan, audit, headers).
7. Accessibility findings (axe, keyboard, screen reader).
8. Lighthouse and bundle numbers, with the baseline for comparison.
9. Documents corrected during the work.
10. Deployment URL and status, or the reason it is blocked.
11. Remaining risks and exact next actions.

Do not state or imply a leaderboard rank or score. Do not mark anything complete without evidence. If a gate fails and you cannot fix it, report it as failed and explain.
