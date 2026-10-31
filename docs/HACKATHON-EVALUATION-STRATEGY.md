# HACKATHON EVALUATION STRATEGY
**Project:** EventPilot, The Living Plan | **Date:** 30 October 2026 | **Status:** Draft for team review
**Evidence labels:** V = retrieved/observed; P = project document, not re-verified; H = hypothesis; R = recommendation.
No official scoring formula is known. Nothing here predicts or promises a rank.

---

## 0. Confirm before investing: is the leaderboard still open?

The parameters screenshot shows a window of **18/08/2026 11:00 to 14:56 IST** (V, from the screenshot). Today is 30 Oct 2026, and the project was started 29 Oct (P). It is unclear whether (a) that window belongs to a different challenge, (b) submissions are still open, or (c) a resubmission replaces your current score. **If scores are final, none of the improvements below affect the leaderboard.** Ask the organizers or check the portal before spending effort, and tell Antigravity the answer (Phase 0 of the master prompt).

## 1. What the screenshots establish, and what the project documents over-claim

| Fact (V) | Project document claim | Correction |
|---|---|---|
| Rank 1 on the visible page is 97.50; ranks 3 and 5 are 97.48 and 97.44. About 5,161 pages of 10 rows | `LEADERBOARD-STRATEGY` and `context.md`: "Top 10 target: score ≥ 97.50" | **97.50 is the Rank 1 score, not a Top-10 cutoff.** Rows 7 to 10 were not in the screenshot and are ≤ 97.44. The real Top-10 threshold is *unknown*; capture rows 7 to 10 and use that |
| Challenge 3 sub-scores 88, 99, 100, 96, 98, 99 produce 96.16 | "Treat all 6 as equally critical"; "projected score 98.50" as the plain mean of self-set targets | The plain mean of the sample is 96.67, not 96.16, so the real aggregation is not a simple mean (V arithmetic). A "projected 98.50" is the average of numbers the team assigned itself. **Delete it.** It is not evidence |
| Screenshots show the problem statement, the six parameter names, one sample score and the leaderboard | `CHALLENGE-RULES-VERIFICATION`: rows such as "Offline/Fallback Resilience: VERIFIED" and "Zero Crash/Console Errors: VERIFIED" as *official rules* | Those are the team's own engineering constraints. Relabel them "self-imposed". Only the problem statement, parameter names and score examples are observed |
| One example where Code Quality was lowest (88) | "Code Quality is the primary deduction point across submissions" | It was lowest in **your** Challenge 3 result. Whether that holds across submissions is unknown |
| Release report lists typecheck, lint, 19 tests, build | `context.md`: every dimension `PASS`; "Known bugs: none"; "RELEASE READY" | See Section 2. Four of the six dimensions have claims no executed check supports |

**Hypothesis H1 (labeled as such):** because the score is called an "AI Evaluation Score", an automated reviewer probably reads the repository and README as well as running the app. If so, repository clarity (structure, naming, docs that match the code, tests visible, scripts that work) feeds Code Quality directly. Optimize for it, but don't treat it as known.

## 2. Gaps between claimed and evidenced quality (priority order)

| # | Gap | Evidence in the documents | Risk |
|---|---|---|---|
| G1 | **No deployment or public URL.** Status is "production-built `.next` artifact verified" | `context.md` §19 | An evaluator cannot open the product |
| G2 | **Live Gemini may be absent for evaluators.** App works without a key via a deterministic fallback; the next step lists configuring the key as *optional* | `context.md` §20, release report §4 | A judge may see no generative AI, against a "GenAI-powered" brief |
| G3 | **Deprecated Gemini SDK.** Project uses `@google/generative-ai`. Google's JS repo for it is archived and marked deprecated; the replacement is `@google/genai`. One source notes the old Vertex AI generative modules also leave on 24 Jun 2026 | V: [archived repo](https://github.com/google-gemini/deprecated-generative-ai-js), [Google migration notice](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/deprecations/genai-vertexai-sdk) | A reviewer reading dependencies sees an end-of-life library; the model names it supports may also be stale |
| G4 | **No browser-level evidence.** No e2e run, no console inspection, no network log | Release report command table has four commands | "Zero console errors" is asserted, not tested |
| G5 | **No accessibility scan.** "WCAG AA compliant" is stated; the command log has no axe, Lighthouse or manual run | `TEST-AND-RELEASE-REPORT` §3 vs §2 | The claim is unsupported |
| G6 | **No secret scan or dependency audit** | Same | Security "PASS" rests on inspection |
| G7 | **Test depth is thin for the signature feature.** 19 tests total; `replan` has 3. Currency tests cover USD, EUR, GBP, INR only, but the TRD requires not assuming two decimal digits | Release report §3 | Zero-decimal (JPY) and three-decimal (KWD) bugs would go unseen |
| G8 | **Contradictory documents.** Next 15 planned vs 14.2.35 built; competitor claims contradicted by V sources; unverified Devpost URL; rule labels | Sections 1 and the research doc | Reviewer confusion; Code Quality and Alignment risk |
| G9 | **Personalization depth unknown.** Documents show sample plans and an AI suggestions route; unclear whether a *user-created* event yields ideas that reflect their priorities and style | `context.md` §8 | "Personalized ideas" is a core requirement |

## 3. Strategy by evaluation dimension

For each: what to do, how to measure it, and what evidence to save. Targets are internal, not official.

### 3.1 Code Quality
**Do**
1. Migrate to `@google/genai` (G3). Pin the version and re-run the AI tests. Verify the chosen model name against the current Gemini docs before coding.
2. Enforce the architecture, not just describe it: ESLint `no-restricted-imports` so `src/lib/engines/**` cannot import React, Next or the AI module; cap `complexity` (≤ 10) and `max-lines-per-function` (≤ 60); keep `--max-warnings 0`.
3. Add Prettier (`format:check`) and a dead-code check (`knip` or equivalent).
4. Split any file over about 300 lines, starting with `src/app/page.tsx` if it is the monolith the docs suggest.
5. JSDoc the public engine functions with input, output and invariants; add short ADRs (`docs/decisions/`) for the hybrid deterministic/AI design, the SDK choice and the deployment target.
6. Reconcile documents (G8) so README, `context.md` and `PROMPT.md` agree with the code.
**Acceptance:** `typecheck`, `lint`, `format:check` all exit 0 with 0 warnings; dead-code tool reports nothing or each item is justified in a file; no source file over 300 lines without a written reason; every public engine export has a doc comment.
**Evidence:** command output, the lint config diff, ADR list.

### 3.2 Security
**Do**
1. API hardening on every route: Content-Type check, body-size cap, Zod parse, per-IP rate limit (note: an in-memory limiter is per instance on serverless and only a best-effort guard; document that), safe error mapping, no logging of user text or keys.
2. Security headers in `next.config` or middleware: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, framing protection, and a Content-Security-Policy. Introduce CSP in report-only first, because Next.js inline scripts need a nonce-based policy; ship an enforcing CSP only after the console is clean.
3. Prompt-injection posture: user text goes in a data field, never concatenated into system instructions; the model may only return the schema's fields; reject any out-of-schema output; strip control characters; cap lengths.
4. Validate localStorage on load with the existing Zod schemas; on failure discard or migrate and show a notice. Never trust stored data.
5. Run a secret scan over the repo and git history, grep the production bundle for key prefixes, run `pnpm audit --prod`, commit the lockfile, and enable Dependabot or equivalent.
**Acceptance:** secret scan 0 findings; bundle grep 0 matches; audit 0 high/critical (any exception documented with reason); `curl -I` on the deployed URL shows the headers; API tests cover oversize, wrong type, injection-style strings, rate-limit and missing-key cases.
**Evidence:** tool output, header capture, test report.

### 3.3 Efficiency
**Do**
1. One Gemini request per explicit user action; in-flight dedupe; `AbortController` on navigation or a newer request; debounce free-text.
2. Cache validated AI responses by a hash of the relevant inputs (bounded LRU, `sessionStorage` or in-memory); never let a stale response overwrite a newer plan.
3. Use `responseSchema`, a low `maxOutputTokens`, and the smallest suitable model; send only the plan summary, not the whole plan.
4. Lazy-load rarely used UI (modals, Scenario Compare) with `next/dynamic`; limit fonts per the design doc; keep First Load JS near the current 109 kB (P) and record the delta after each feature.
5. Compute scenarios on demand only; memoize engine calls on stable inputs.
**Acceptance:** Playwright network log shows ≤ 1 AI request per user action and 0 duplicates on the core journeys; Lighthouse (mobile profile, production build) numbers are recorded, not assumed; First Load JS ≤ 150 kB or the overage is justified.
**Evidence:** network log, Lighthouse JSON, `next build` size table.

### 3.4 Testing
**Do**
1. **Property-based tests** (fast-check) for invariants: planned total equals the sum of included items; locked items never change under any constraint change; applying zero changes is the identity; rejecting all changes leaves the plan deep-equal; `runScenarios` never mutates its input; schedule results are idempotent.
2. **Edge-case tables:** leap day, month-end shifts, zero and maximum guests, maximum safe integers, JPY (0 decimals), KWD (3 decimals), INR formatting, empty plan, cyclic and missing dependencies.
3. **Route tests** with a mocked Gemini client: valid, invalid JSON, schema violation, timeout, 429, missing key, oversized body.
4. **Component tests** (Testing Library): form validation messages, Change Review accept/reject, lock toggle, error and empty states.
5. **E2E (Playwright) against `next build && next start`:** (a) sample plan loads for each event type, (b) create custom event, (c) change guests → review → accept/reject → totals correct, (d) locked item survives, (e) AI unavailable path, (f) reset. Add a shared fixture that **fails the test on any `console.error`, uncaught exception or failed request**; this turns "zero console errors" into a repeatable check.
6. Coverage with thresholds (engines ≥ 95% lines and ≥ 90% branches; overall ≥ 80%). Do not chase 100%; meaningful assertions matter more.
7. CI workflow that runs every gate on each push.
**Acceptance:** all suites pass; thresholds met; e2e green with the console fixture; CI green.
**Evidence:** test and coverage reports, CI run link.

### 3.5 Accessibility
**Do** everything in Section 9 of the UI/UX document, plus:
1. axe scan inside Playwright on every primary view and both modals at 375 and 1440 px.
2. Manual keyboard run of the core journey; one screen-reader pass (NVDA or VoiceOver) with notes saved.
3. 200% zoom and 320 px reflow check; `prefers-reduced-motion` and `forced-colors` emulation.
4. Lighthouse accessibility run, recorded as a supporting signal only (it covers a subset of issues).
**Acceptance:** 0 serious or critical axe violations; keyboard run completes; no horizontal scroll at 320 px; contrast ratios documented.
**Evidence:** axe JSON, screen-reader notes, screenshots.

### 3.6 Problem Statement Alignment
**Do**
1. Make GenAI undeniable and honest: live Gemini is configured on the deployed build; ideas and the Tell the Pilot feature call it; every AI result carries a visible source label ("Gemini" or "Template fallback"). Never present fallback output as AI.
2. Verify that a **user-created** event produces ideas shaped by its priorities and style notes (G9). Add a free-text "traditions, style, must-haves" field so personalization is real and culturally open-ended.
3. Keep all three event types and four workspaces working end to end on the deployed URL.
4. Add an alignment checklist to the README that maps each phrase of the challenge statement to a screen and a test.
**Acceptance:** an acceptance table (Section 5) passes on the deployed URL; changing priorities changes ideas when the key is live.
**Evidence:** deployed-URL walkthrough recording or screenshots with timestamps.

## 4. Deployment and demo readiness (R)
- Host option aligned with Google's ecosystem: Cloud Run (Next.js `output: "standalone"`, Dockerfile) with `GEMINI_API_KEY` in Secret Manager. **I have not verified the challenge's hosting requirements, quotas or costs**; check the rules and the current Cloud Run and Gemini free-tier terms first. A simpler Next.js host is acceptable if the rules allow it.
- Add `/api/health` (no secrets) and verify it after deploy.
- Demo: the 90-second script in the innovation document, run on the deployed URL, with a fallback clearly labeled if Gemini is down.
- Submission package: URL, repo, README with run and test commands, short demo video, and an honest limitations section.

## 5. Alignment acceptance table

| Challenge phrase | Where in the product | Test |
|---|---|---|
| "weddings, birthdays, and community events" | Three event types and themes | e2e: create and load each type |
| "budgets" | Budget workspace, confidence, scenarios | unit and property tests; e2e totals |
| "timelines" | Timeline with dependencies and conflicts | unit date/DAG tests; e2e date change |
| "vendor checklists" | Vendors pipeline with quoted vs confirmed | component and e2e |
| "personalized ideas" | Ideas from priorities and style notes via Gemini | route test; e2e with mocked and live key |
| "GenAI-powered planning assistant" | Tell the Pilot, ideas, contingency (stretch) | route tests; live walkthrough |
| "meaningful assistance rather than paragraphs" | Editable plan, diffs, locks | e2e change flow |

## 6. Realistic expectations
The top of the visible board is separated by hundredths of a point across roughly 51,600 entries (V arithmetic from the screenshot). At that margin, outcomes depend on details no one outside the evaluator can see. The strategy raises the *probability* of a strong score by removing verifiable weaknesses and adding one clear, working differentiator. It cannot guarantee a Top 10 or first place, and the team should not claim otherwise in the submission.

