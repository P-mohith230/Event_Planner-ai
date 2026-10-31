# AUDIT-V2.MD — INDEPENDENT BASELINE AUDIT REPORT
**Project:** EventPilot — The Living Plan  
**Competition:** Google Prompt Wars Virtual — Challenge 5: Celebration & Event Planner  
**Date of Audit:** 2026-10-30  
**Auditor:** Lead Systems & QA Engineer (Antigravity)  
**Git Baseline Tag:** `baseline-pre-improvement` (`1c8cf4f1591408de74e06a299ff0837762878552`)  
**Git Working Branch:** `improve/living-plan-v2`  
**Execution Environment:** Windows 11, Node.js v22.16.0, pnpm v10.16.1, Google Chrome 134.0.6998.88  

---

## 1. EXECUTIVE SUMMARY

An empirical, evidence-based audit of the existing `EventPilot` repository was conducted to replace all prior documentation assertions with measured facts.

### Key Headline Findings
1. **Core Engines & Architecture:** The fundamental TypeScript engines (`budget.ts`, `schedule.ts`, `replan.ts`) and Zod schemas (`src/types/schema.ts`) are well-architected, completely deterministic, and pass all existing unit tests with zero failures.
2. **Interactive Flows:** In real browser testing on a production build (`next start -p 3009`), all 11 core user interactions (switching archetypes, timeline task toggling, vendor checklist updates, idea adoption, replan change review, and modal actions) function without crash.
3. **Security Vulnerabilities:** `pnpm audit --prod` reveals **30 vulnerabilities** (3 Critical, 12 High, 13 Moderate, 2 Low), all originating from `next@14.2.35` (e.g. Next.js cache poisoning, Server Actions SSRF, DoS CVEs).
4. **SDK Deprecation & Model Invalidation:** The codebase uses `@google/generative-ai` (deprecated by Google in favor of `@google/genai`) and specifies `gemini-2.5-flash` in `.env.example` and `gemini.ts` (a non-existent model name; valid models are `gemini-1.5-flash` or `gemini-2.0-flash`).
5. **Accessibility Flaws:** While Lighthouse gave a 100 accessibility score on the raw landing page, automated `@axe-core/playwright` analysis revealed **critical and serious accessibility defects**:
   - `aria-required-children` (Critical): Container with `role="tablist"` contains `<button>` elements lacking `role="tab"`.
   - `label-content-name-mismatch` (Serious): Mismatch between button visible text and `aria-label` in badges.
   - `color-contrast` (Serious): Modal surfaces fall below WCAG 2 AA 4.5:1 ratio.
6. **Console Issues:** A `404 (Not Found)` error occurs on every initial load due to a missing `/favicon.ico`.

---

## 2. BASELINE COMMAND EXECUTION RESULTS

Every standard baseline command was executed from the clean repository baseline. Real outputs and exit codes are recorded in `docs/audit/baseline/`.

| Command | Working Directory | Exit Code | Observed Output Summary | Log Artifact |
| :--- | :--- | :--- | :--- | :--- |
| `pnpm install --frozen-lockfile` | `M:\eventplanner_ai` | **0** | Lockfile up-to-date; 332 packages installed cleanly | [`install.txt`](file:///M:/eventplanner_ai/docs/audit/baseline/install.txt) |
| `pnpm typecheck` (`tsc --noEmit`) | `M:\eventplanner_ai` | **0** | Clean run. 0 TypeScript errors | [`typecheck.txt`](file:///M:/eventplanner_ai/docs/audit/baseline/typecheck.txt) |
| `pnpm lint` (`eslint "src/**/*.{ts,tsx}" --max-warnings 0`) | `M:\eventplanner_ai` | **0** | Clean run. 0 ESLint warnings, 0 errors | [`lint.txt`](file:///M:/eventplanner_ai/docs/audit/baseline/lint.txt) |
| `pnpm test` (`vitest run`) | `M:\eventplanner_ai` | **0** | 4 test files, 19 tests passed, 0 failures, 1.02s duration | [`test.txt`](file:///M:/eventplanner_ai/docs/audit/baseline/test.txt) |
| `pnpm build` (`next build`) | `M:\eventplanner_ai` | **0** | Compiled successfully. First Load JS: 109 kB (`/`: 109 kB, `/api/plan-suggestions`: 0 B) | [`build.txt`](file:///M:/eventplanner_ai/docs/audit/baseline/build.txt) |

---

## 3. FEATURE AUDIT: CLAIMED VS. VERIFIED (CONTEXT.MD §8)

All 11 features claimed in `context.md` §8 were evaluated against the running production server using automated Playwright test scripts and manual browser verification.

| Feature Claimed in `context.md` §8 | Claimed Status | Verified Status | Verification Evidence / Inspection Notes |
| :--- | :--- | :--- | :--- |
| **Weddings, Birthdays, Community Events Archetypes** | Implemented | **WORKS** | Verified switching between all 3 presets in browser. Seed data renders correct budgets, guests, tasks, and vendors. |
| **Budget Workspace** (integer math, categories, locks, overrun alerts) | Implemented | **WORKS** | Sums, remaining balance, and locks render accurately. Calculated via pure `BudgetEngine`. Zero float math. |
| **Timeline Workspace** (calendar math, DAG dependencies, locks) | Implemented | **WORKS** | Task status toggling, days-before-event sorting, and lock toggles function smoothly. |
| **Vendor Checklist Workspace** (multi-stage pipeline, quoted vs confirmed) | Implemented | **WORKS** | Vendor status progression (Researching -> Contacted -> Booked) and cost allocations render properly. |
| **Personalized Ideas Workspace** (category filters, add-to-plan) | Implemented | **WORKS** | Filters by category; clicking "Add to Plan" successfully creates a new budget item and adds a timeline task. |
| **Constraint Change Simulator** (guest count, date, budget shifts) | Implemented | **WORKS** | Simulator drawer opens; sliders/inputs adjust guest count, date, budget; triggers replan calculation. |
| **Change Review Modal** (before/after diff, accept/reject) | Implemented | **WORKS** | Before/After cards render changes; individual Reject/Accept buttons correctly update draft changes. |
| **Financial Provenance Badging** (`confirmed-by-user`, `ai-estimate`, `user-entered`) | Implemented | **WORKS** | Badges render across all items. However, `aria-label` content mismatch triggers an a11y violation. |
| **Server-side Gemini AI Integration** (`POST /api/plan-suggestions`) | Implemented | **PARTIAL** | Fallback works 100% when key is omitted. However: uses deprecated `@google/generative-ai` SDK; invalid model `gemini-2.5-flash`; no request body size cap; no rate-limiting. |
| **Interactive New Event Modal & Reset to Default** | Implemented | **PARTIAL** | Modal creates new event and resets plan. However, new event creation only deep clones static sample tasks rather than adapting to user priorities. |
| **Local Storage Persistence** | Implemented | **PARTIAL** | Persists to browser `localStorage`. However, `useEventPlan.ts` does NOT validate payload with `EventPlanSchema.safeParse` upon load (vulnerable to schema drift). |

Detailed browser run log saved in: [`docs/audit/browser-audit-results.json`](file:///M:/eventplanner_ai/docs/audit/browser-audit-results.json).

---

## 4. BROWSER AUDIT, CONSOLE & SCREENSHOT RECORD

The application was run on a local production server (`http://localhost:3009`) and audited across 3 standard viewports: Desktop (1440px), Tablet (768px), and Mobile (375px).

### 4.1 Screenshots Captured (`docs/audit/screenshots/before/`)
1. [`desktop-1440px-wedding-budget.png`](file:///M:/eventplanner_ai/docs/audit/screenshots/before/desktop-1440px-wedding-budget.png) — Desktop Wedding Budget view.
2. [`desktop-1440px-birthday.png`](file:///M:/eventplanner_ai/docs/audit/screenshots/before/desktop-1440px-birthday.png) — Desktop Birthday Archetype view.
3. [`desktop-1440px-community.png`](file:///M:/eventplanner_ai/docs/audit/screenshots/before/desktop-1440px-community.png) — Desktop Community Gala Archetype view.
4. [`desktop-1440px-timeline.png`](file:///M:/eventplanner_ai/docs/audit/screenshots/before/desktop-1440px-timeline.png) — Desktop Timeline Workspace with dependencies.
5. [`desktop-1440px-vendors.png`](file:///M:/eventplanner_ai/docs/audit/screenshots/before/desktop-1440px-vendors.png) — Desktop Vendor Checklist Workspace.
6. [`desktop-1440px-ideas.png`](file:///M:/eventplanner_ai/docs/audit/screenshots/before/desktop-1440px-ideas.png) — Desktop Personalized Ideas Workspace with filters.
7. [`desktop-1440px-simulator-open.png`](file:///M:/eventplanner_ai/docs/audit/screenshots/before/desktop-1440px-simulator-open.png) — Constraint Simulator open in sidebar.
8. [`modal-change-review-1440px.png`](file:///M:/eventplanner_ai/docs/audit/screenshots/before/modal-change-review-1440px.png) — Change Review Modal (1440px).
9. [`modal-change-review-375px.png`](file:///M:/eventplanner_ai/docs/audit/screenshots/before/modal-change-review-375px.png) — Change Review Modal (375px mobile).
10. [`modal-new-event-1440px.png`](file:///M:/eventplanner_ai/docs/audit/screenshots/before/modal-new-event-1440px.png) — New Event Creation Modal (1440px).
11. [`modal-new-event-375px.png`](file:///M:/eventplanner_ai/docs/audit/screenshots/before/modal-new-event-375px.png) — New Event Creation Modal (375px mobile).
12. [`tablet-768px-wedding-budget.png`](file:///M:/eventplanner_ai/docs/audit/screenshots/before/tablet-768px-wedding-budget.png) — Tablet (768px) view.
13. [`mobile-375px-wedding-budget.png`](file:///M:/eventplanner_ai/docs/audit/screenshots/before/mobile-375px-wedding-budget.png) — Mobile (375px) view.

### 4.2 Browser Console & Network Log Findings
- **Console Errors:**
  - `Failed to load resource: the server responded with a status of 404 (Not Found)`: requesting `/favicon.ico`.
- **Console Warnings:** 0 JavaScript warnings.
- **Network Failures:** 0 network failures on API calls (AI suggestion route returns 200 with deterministic fallback).

---

## 5. ACCESSIBILITY & LIGHTHOUSE AUDIT

### 5.1 Lighthouse Audit (Production Build, Desktop)
Saved in [`docs/audit/lighthouse-summary.json`](file:///M:/eventplanner_ai/docs/audit/lighthouse-summary.json) and [`docs/audit/lighthouse-baseline.json`](file:///M:/eventplanner_ai/docs/audit/lighthouse-baseline.json):
- **Performance:** **100 / 100**
- **Accessibility:** **100 / 100** (automated rules subset on initial page render)
- **Best Practices:** **96 / 100**
- **SEO:** **91 / 100**

### 5.2 Deep In-Browser Axe-Core Scan Results (`@axe-core/playwright`)
While Lighthouse passed the initial page render, running deep Axe accessibility checks across interaction states revealed **serious and critical violations** (detailed in [`docs/audit/axe-scan-results.json`](file:///M:/eventplanner_ai/docs/audit/axe-scan-results.json)):

| View / State | Violation ID | Impact | Nodes | Issue Description |
| :--- | :--- | :--- | :--- | :--- |
| **Main View** | `aria-required-children` | **Critical** | 1 | Elements with `role="tablist"` must contain children with `role="tab"`. Workspace navigation buttons lack `role="tab"`. |
| **Main View** | `label-content-name-mismatch` | **Serious** | 1 | `ProvenanceBadge` visible text differs from its accessible `aria-label`, failing speech-input user navigation. |
| **Change Review Modal** | `aria-required-children` | **Critical** | 1 | Modal contains unmapped tablist/tab structure. |
| **Change Review Modal** | `color-contrast` | **Serious** | 4 | Low contrast between foreground text and badge backgrounds in modal diff cards (< 4.5:1). |
| **Change Review Modal** | `label-content-name-mismatch` | **Serious** | 2 | Action buttons in review diffs have mismatched accessible names. |
| **New Event Modal** | `aria-required-children` | **Critical** | 1 | Type selector contains unmapped tablist container. |
| **New Event Modal** | `color-contrast` | **Serious** | 1 | Subtitle/caption contrast below 4.5:1 on modal backdrop. |
| **New Event Modal** | `label-content-name-mismatch` | **Serious** | 2 | Mismatched accessible name on close and archetype buttons. |

---

## 6. SECURITY & SECRETS AUDIT

### 6.1 Secret Leaks Scan
- **Git History Key Scan:** Clean. Executed git log search across all commits for `AIzaSy` and generic key prefixes: **0 secrets found**.
- **Build Output Grep:** Clean. Grepped `.next/` directory for `AIza`: **0 occurrences**.
- **Client Bundle Exposure:** `process.env.GEMINI_API_KEY` is referenced solely in `src/lib/ai/gemini.ts` (server-side only). No `NEXT_PUBLIC_` secret prefix is used.

### 6.2 Dependency Vulnerability Audit (`pnpm audit --prod`)
- **Total Vulnerabilities:** **30**
  - **Critical:** 3
  - **High:** 12
  - **Moderate:** 13
  - **Low:** 2
- **Source:** All 30 vulnerabilities trace back to `next@14.2.35` (e.g., SSRF in Server Actions, cache poisoning in ISR, memory exhaustion in image optimizer, HTTP request smuggling).
- **Remediation Target:** Upgrade Next.js to safe patched release or isolate server components according to upstream security advisories.

---

## 7. SPECIFIC CODEBASE INVESTIGATIONS

As mandated by Section 31 (Phase 1 tasks):

1. **User-Created Event Personalization Depth:**
   - *Observation:* When a user creates a new event via `NewEventModal`, `useEventPlan.ts` simply initializes the new plan by deep-cloning hardcoded seed arrays (`defaultWeddingTasks`, `defaultBirthdayTasks`, etc.). It does not incorporate the user's specific custom notes or dynamically re-rank ideas based on priorities.
2. **Data Sent to Gemini:**
   - *Observation:* In `src/lib/ai/gemini.ts`, the prompt sends raw prompt text without a bounded JSON schema constraint or token budget limit.
3. **API Hardening (Rate Limiting & Body Size):**
   - *Observation:* `src/app/api/plan-suggestions/route.ts` lacks body-size limits (`Content-Length` checks) and has no rate-limiting middleware or headers.
4. **LocalStorage Validation on Load:**
   - *Observation:* `useEventPlan.ts` performs a weak sanity check: `if (parsed.id && parsed.eventType)` and casts the parsed object without calling `EventPlanSchema.safeParse(parsed)`. An invalid or corrupted storage item will corrupt the application state.
5. **Currency Unit Test Coverage:**
   - *Observation:* `tests/unit/budget.test.ts` only tests 2-decimal currencies (`USD`, `EUR`, `GBP`). Zero-decimal currencies (like `JPY`) and 3-decimal currencies (like `KWD`) are not tested.
6. **Codebase Sizing & Complexity:**
   - *Observation:* `src/app/page.tsx` is the largest single file at **436 lines of code**, containing inline state management, tab switching, and multiple drawer triggers that should be decomposed into dedicated components.
7. **AI SDK & Model ID:**
   - *Observation:* The package uses `@google/generative-ai` (deprecated). The model string in `.env.example` and `gemini.ts` is `gemini-2.5-flash`, which is an invalid model identifier that will fail if invoked against the real Gemini API.

---

## 8. DISCREPANCY LIST: CLAIMED VS. OBSERVED

| Claimed in Documentation | Observed in Reality | Discrepancy Analysis |
| :--- | :--- | :--- |
| `context.md` §14: "Security: PASS (0 client secrets, Zod validation)" | 30 production CVEs in `next@14.2.35` | While secrets are protected, dependencies have critical unpatched CVEs. |
| `context.md` §14: "Accessibility: PASS (Semantic landmarks, ARIA live regions)" | 8 Axe violations across main view and modals | Mismatched labels, invalid tablist child roles, and contrast failures exist in interactive states. |
| `context.md` §10: "SDK: @google/generative-ai" | Deprecated by Google in favor of `@google/genai` | SDK must be migrated to modern `@google/genai` for 2026 challenge standards. |
| `.env.example`: `GEMINI_MODEL=gemini-2.5-flash` | Model does not exist | Must be corrected to `gemini-1.5-flash` or `gemini-2.0-flash`. |
| `context.md` §8: "Interactive New Event creation modal" | Clones static sample arrays verbatim | Lacks personalization depth based on user preferences/traditions. |
| `context.md` §16: "Zero known blocking build errors, zero test failures, zero lint warnings" | Console 404 on `favicon.ico` | Minor asset omission causes 404 error in browser console. |

---

## 9. RANKED DEFECT & GAP LIST

### Priority P0: Critical / Blocker
1. **P0-1:** Upgrade/Mitigate Next.js dependency vulnerabilities (`next@14.2.35` -> 30 CVEs).
2. **P0-2:** Migrate from deprecated `@google/generative-ai` to `@google/genai`, and fix invalid model identifier (`gemini-2.5-flash` -> `gemini-1.5-flash` or `gemini-2.0-flash`).

### Priority P1: Major / High Impact
3. **P1-1:** Fix Axe accessibility violations:
   - Provide proper `role="tab"` and `aria-selected` to tablist children in workspace tabs and modal archetype selectors.
   - Align visible text with `aria-label` on `ProvenanceBadge` and action buttons to satisfy `label-content-name-mismatch`.
   - Adjust modal card background/text tints to achieve WCAG AA ≥ 4.5:1 contrast.
4. **P1-2:** Harden API routes: add request body size limits (< 100 KB), Content-Type verification, and rate limiting.
5. **P1-3:** Enforce strict Zod validation on `localStorage` load in `useEventPlan.ts` with graceful fallback on corruption.
6. **P1-4:** Personalization depth: ensure user-created events incorporate custom priorities, traditions, and style notes into tasks and ideas.
7. **P1-5:** Decompose monolithic `src/app/page.tsx` (436 lines) into modular subcomponents and hooks.

### Priority P2: Minor / Polish
8. **P2-1:** Add missing `public/favicon.ico` (or `src/app/favicon.ico`) to eradicate console 404.
9. **P2-2:** Extend unit tests in `budget.test.ts` to explicitly verify 0-decimal (`JPY`) and 3-decimal (`KWD`) currency behavior.
10. **P2-3:** Add security response headers (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and Report-Only CSP) in `next.config.mjs`.

---

## 10. CONCLUSION & PHASE 1 EXIT STATUS

Phase 1 audit is **COMPLETE**. All 11 claimed features and 6 evaluation dimensions have been audited with verified evidence, commands, exit codes, screenshots, and logs. We are ready to proceed to **Phase 2 (Competitor Research Findings & Corrections)** upon user confirmation.

