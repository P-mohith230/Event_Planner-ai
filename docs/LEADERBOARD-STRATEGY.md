# LEADERBOARD STRATEGY: TARGETING TOP 10 (SCORE ≥ 97.50)
**Competition:** Google Prompt Wars Virtual — Challenge 5: Celebration & Event Planner  
**Date:** 2026-10-29  
**Status:** Active Competitive Strategy

---

## 1. EMPIRICAL LEADERBOARD AUDIT

Based on direct inspection of the official Challenge 5 leaderboard screenshot (`screenshots/challenge5_leaderboard.png`):

| Rank | Innovator | Score | Status / Badge |
|---|---|---|---|
| **1** | Kiran Reddy | **97.50** | Gold Crown |
| **1** | Akshay Parihar | **97.50** | Gold Crown |
| **3** | Sara Sinha | **97.48** | Bronze Crown |
| **3** | Chandra Prakash | **97.48** | Bronze Crown |
| **5** | Sriram Pollisetty | **97.44** | Standard Rank |
| **5** | Deepak Kumar R | **97.44** | Standard Rank |

### Key Observations:
1. **Extreme Competitiveness:** Over 5,161 pages (~50,000+ entries).
2. **Micro-margins:** Ranks 1 to 5 are separated by merely **0.06 points** (`97.50` vs `97.44`).
3. **Current Benchmark:** To enter the Top 10 leaderboard, our overall evaluation score must achieve **≥ 97.50**.

---

## 2. THE BOTTLENECK ANALYSIS: HOW TO WIN

Examining the empirical AI Evaluation Score breakdown (`screenshots/ai_evaluation_score_breakdown.png`):
- **Security:** 99
- **Efficiency:** 100
- **Problem Statement Alignment:** 99
- **Accessibility:** 98
- **Testing:** 96
- **Code Quality:** **88** ← *The primary deduction point across submissions!*

### Why Code Quality Drops to 88 in Typical Submissions:
1. Monolithic files or tight coupling between UI and business logic.
2. Inconsistent type safety (e.g. liberal use of `any`, unsafe type assertions, missing error handling).
3. Probabilistic arithmetic (relying on LLMs to calculate sums or balances, resulting in rounding discrepancies).
4. Uncaught edge cases (negative values, divide-by-zero, date-parsing timezone bugs).
5. Code duplication between components and routes.

### Our Strategy to Maximize Each Dimension:

| Dimension | Target Score | Implementation Countermeasure |
|---|---|---|
| **Code Quality** | **≥ 96 / 100** | • Modular architecture separating pure business logic (`BudgetEngine`, `ScheduleEngine`, `ReplanEngine`) from UI.<br>• TypeScript strict mode (`noImplicitAny`, `strictNullChecks`).<br>• Integer minor unit arithmetic (cents/paise) to prevent IEEE 754 floating point errors.<br>• Comprehensive Zod validation at all boundaries.<br>• Clean code metrics: zero ESLint warnings, clear function responsibilities. |
| **Security** | **99–100 / 100** | • Zero client-side API key leakage (`GEMINI_API_KEY` accessed exclusively server-side).<br>• Server-side payload validation prevents prompt injection and oversized inputs.<br>• Text sanitization on all rendered AI outputs (no raw unescaped HTML injection).<br>• Transparent local storage disclosure with user-triggered data reset. |
| **Efficiency** | **100 / 100** | • Deterministic instant calculations done locally on the client without redundant network round-trips.<br>• Debounced user inputs and single in-flight request locking to prevent duplicate AI invocations.<br>• Bounded timeouts (8000ms) and circuit breaker fallback to avoid UI blocking.<br>• Minimal bundle footprint, tree-shaken icons, zero bloated heavyweight dependencies. |
| **Testing** | **≥ 98 / 100** | • High unit test coverage using Vitest covering pure calculation engines.<br>• Explicit testing of edge cases: negative budgets, leap years, date inversions, dependency cycles, large guest counts.<br>• Dedicated tests for constraint replanning, before/after diff generation, and locked-item preservation.<br>• Integration tests for AI API failure, rate limiting, and fallback behavior. |
| **Accessibility** | **≥ 98 / 100** | • 100% semantic HTML (`header`, `main`, `section`, `nav`, `article`).<br>• Visible, high-contrast keyboard focus indicators (`focus-visible:ring-2`).<br>• Full keyboard navigability (Tab, Enter, Escape for drawers/modals).<br>• WCAG 2.1 AA compliant color contrast ratios across all states.<br>• Screen reader-friendly labels (`aria-label`, `aria-describedby`, `aria-live` for status announcements).<br>• Respect `prefers-reduced-motion`. |
| **Problem Statement Alignment** | **99–100 / 100** | • Full support for all 3 required event types: **Weddings**, **Birthdays**, **Community Events**.<br>• Complete implementation of all 4 challenge areas: **Budgets**, **Timelines**, **Vendor Checklists**, **Personalized Ideas**.<br>• Distinctive, memorable signature innovation: **The Constraint-Aware Living Plan with Explainable Change Preview and Financial Provenance**. |

---

## 3. PROJECTED SCORECARD

$$\text{Projected Score} = \frac{96 + 99 + 100 + 98 + 98 + 100}{6} = \mathbf{98.50}$$

A projected score of **98.50** (or even conservative **97.80–98.10**) positions EventPilot solidly within the Top 10 leaderboard bracket (surpassing the current Rank 1 score of 97.50).

