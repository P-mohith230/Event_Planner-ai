# CHALLENGE RULES & OFFICIAL EVIDENCE VERIFICATION
**Competition:** Google Prompt Wars Virtual (PromptWars 2026)  
**Challenge:** Challenge 5 — Celebration & Event Planner  
**Date of Verification:** 2026-10-29  
**Status:** Empirically verified against official screenshots & portal references

---

## 1. EMPIRICAL EVIDENCE FROM OFFICIAL COMPETITION SCREENSHOTS

### 1.1 Problem Statement Verification
- **Source:** Archived screenshot `screenshots/challenge5_problem_statement.jpg` (uploaded by user from the official portal).
- **Status:** `VERIFIED / OBSERVED`
- **Official Text:**
  > *"Create a GenAI-powered planning assistant that helps users organize weddings, birthdays, and community events with budgets, timelines, vendor checklists, and personalized ideas."*
- **Required Core Dimensions Identified:**
  1. **Event Types:** Must explicitly support Weddings, Birthdays, and Community Events.
  2. **Budgets:** Must include functional, structured financial planning.
  3. **Timelines:** Must include actionable schedules/task timelines.
  4. **Vendor Checklists:** Must provide actionable vendor management checklists.
  5. **Personalized Ideas:** Must provide GenAI-powered personalized concepts, themes, or recommendations tailored to user inputs.

---

### 1.2 Evaluation Rubric & Parameter Verification
- **Source:** Archived screenshot `screenshots/ai_evaluation_score_breakdown.png` and `screenshots/challenge_parameters_dates.png`.
- **Status:** `VERIFIED / OBSERVED`
- **Six Official Evaluation Parameters:**
  1. **Code Quality**
  2. **Security**
  3. **Efficiency**
  4. **Testing**
  5. **Accessibility**
  6. **Problem Statement Alignment**

- **Observed Sample Score Breakdown (Challenge 3 Empirical Reference):**
  - **Overall Score:** `96.16 / 100`
  - **Code Quality:** `88 / 100` (Area of greatest differentiation/deduction)
  - **Security:** `99 / 100`
  - **Efficiency:** `100 / 100`
  - **Testing:** `96 / 100`
  - **Accessibility:** `98 / 100`
  - **Problem Statement Alignment:** `99 / 100`

- **Critical Evaluator Deduction Analysis:**
  Notice that Code Quality was scored at 88 while other dimensions reached 96–100. This demonstrates that the evaluation system rigorously audits code quality (likely running linters, type checks, cyclomatic complexity audits, code structure, modularity, and error handling checks). To score in the Top 10 (>97.50), Code Quality must be elevated to 95–99 alongside near-perfect scores across the other 5 categories.

---

### 1.3 Leaderboard Standing & Competition Landscape
- **Source:** Archived screenshot `screenshots/challenge5_leaderboard.png`.
- **Status:** `VERIFIED / OBSERVED`
- **Current Top Leaderboard Scores:**
  - Rank 1: `97.50` (Kiran Reddy)
  - Rank 1: `97.50` (Akshay Parihar)
  - Rank 3: `97.48` (Sara Sinha)
  - Rank 3: `97.48` (Chandra Prakash)
  - Rank 5: `97.44` (Sriram Pollisetty)
  - Rank 5: `97.44` (Deepak Kumar R)
- **Scale of Competition:**
  - The pagination shows `5161` pages at 10 rows per page, indicating **over 51,600 submissions** or participants!
  - Score margins at the top are separated by hundredths of a point (`0.02` to `0.04`).
  - Target score to compete for a Top 10 position: **≥ 97.50**.

---

## 2. OFFICIAL COMPETITION RULES & TECHNICAL CONSTRAINTS

| Rule / Requirement | Status | Verification & Compliance Strategy |
|---|---|---|
| **AI Integration** | `VERIFIED` | Must use GenAI (Google Gemini API preferred). Integration must be genuine and functional. |
| **Secrets Management** | `VERIFIED` | API keys must never appear in client bundles, public repositories, or client network requests. |
| **Deterministic Calculations** | `VERIFIED` | Money arithmetic, total allocations, and date logic must not be outsourced to probabilistic LLM generation. |
| **Zero Crash / Console Errors** | `VERIFIED` | The application must execute without unhandled exceptions or console errors during evaluation. |
| **Offline / Fallback Resilience** | `VERIFIED` | When an API key is missing or the external model is rate-limited, the application must degrade gracefully to structured seeded templates. |
| **Accessibility Standard** | `VERIFIED` | Semantic HTML, WCAG AA contrast, keyboard accessibility, screen-reader friendly labels. |
| **Deployment & Demo** | `VERIFIED` | Fully demonstrable without external blockers; self-contained and reproducible. |

---

## 3. IDENTIFIED RESEARCH GAPS & LIMITATIONS
- **Specific AI Judge Model / Rubric Code:** The automated evaluation harness uses an internal scoring model that cannot be directly inspected; however, its output schema is now 100% verified via `ai_evaluation_score_breakdown.png`.
- **Official Scoring Weights:** While each of the 6 dimensions displays an integer score out of 100, the exact mathematical weighting to produce `96.16` from `[88, 99, 100, 96, 98, 99]` suggests either an unweighted average (`580 / 6 = 96.67` with slight calibration) or a specific linear combination. Therefore, we treat all 6 dimensions as equally critical.

