# INNOVATION DECISION & ARCHITECTURAL SELECTION
**Competition:** Google Prompt Wars Virtual — Challenge 5: Celebration & Event Planner  
**Project:** EventPilot — The Living Plan  
**Date:** 2026-10-29  
**Decision Authority:** Senior Product Architect & Competition Lead

---

## 1. EVALUATION OF CANDIDATE CONCEPTS

To arrive at the most defensible, competition-winning product, we evaluated four distinct architectural concepts across nine weighted criteria:

| Evaluation Criterion | Weight | Concept A: The Constraint-Aware Living Plan (Selected) | Concept B: Pure Budget Stress-Tester | Concept C: Autonomous Agent Coordinator | Concept D: Generative Chat-First Copilot |
|---|---|---|---|---|---|
| **User Value** | High | **Very High:** Solves the #1 user pain point when plans change mid-stream. | **Moderate:** High for financial nerds, incomplete for events. | **High:** Exciting, but prone to autonomy failures. | **Moderate:** High novelty initially, poor utility for ongoing edits. |
| **Evidence of Unmet Need** | High | **Strong:** Competitors have static trackers or raw chat; neither does reviewable replanning. | **Moderate:** Addressed by specialized spreadsheets. | **Weak:** High enterprise demand, low consumer trust for weddings. | **Strong:** Well-documented user frustration with chat amnesia. |
| **Competitive Differentiation** | High | **Exceptional:** Novel hybrid architecture combining deterministic math + AI creativity. | **Low:** Look and feels like an Excel clone. | **Moderate:** Similar to B2B tools like Lindy/Zapier. | **Very Low:** Commodity wrapper around standard LLM prompts. |
| **Challenge Requirement Alignment** | Critical | **100%:** Covers Budgets, Timelines, Checklists, and Ideas across all 3 event types. | **Partial (40%):** Strong on budget, weak on timeline/ideas. | **Partial (60%):** Strong on schedule, weak on creative personalization. | **100%:** Covers all 4 in text, but lacks structured UX. |
| **Feasibility & Deadline Execution** | Critical | **High:** Core engines are pure TypeScript; AI calls are bounded and schema-constrained. | **Very High:** Pure math formulas, easy to ship. | **Very Low:** Requires dozens of external API connectors and WebSockets. | **Very High:** Trivial prompt wrapper, but low quality. |
| **Reliability & Testability** | Critical | **100% Testable:** Math and DAG scheduling tested with 100% deterministic unit tests. | **100% Testable.** | **Low:** Flaky asynchronous agent handoffs. | **Low:** Probabilistic text responses cannot be strictly unit-tested. |
| **AI Contribution** | Medium | **High Quality:** Gemini provides structured creative proposals and rationales without corrupting math. | **Low:** AI is an afterthought. | **High:** AI drives execution. | **High:** AI does everything (and makes math mistakes). |
| **Demo Clarity (90s Pitch)** | High | **Unmatched:** Change guest count -> instant diff -> accept/reject -> locked item stays locked. | **Dry:** Spreadsheet demo. | **Complex:** Waiting for email webhooks to trigger. | **Unimpressive:** Watching text stream into a chat bubble. |
| **Engineering Risk** | High | **Low to Moderate:** Contained scope, zero heavy external services, clean client/server boundary. | **Very Low.** | **Extreme:** External failure modes, auth tokens, rate limits. | **Low.** |
| **TOTAL VERDICT** | — | **WINNER (SELECTED)** | *Rejected (First fallback only)* | *Rejected (Over-scoped)* | *Rejected (Commodity)* |

---

## 2. THE CHOSEN INNOVATION: "THE CONSTRAINT-AWARE LIVING PLAN"

### 2.1 The Core Insight
In real-world celebrations, **an event plan is never static**. Budgets get cut, guest RSVPs exceed expectations, and venue dates shift. 
- Traditional apps force the user into tedious manual recalculations across dozens of disconnected rows.
- Raw AI chats hallucinate numbers, make arithmetic mistakes, and wipe out custom user edits upon regeneration.

### 2.2 EventPilot's Architectural Solution
EventPilot implements a **Hybrid Deterministic-Generative Architecture**:
1. **Deterministic Foundation:** 
   - Pure TypeScript engines calculate variable per-guest budget items (catering, alcohol, favors) with exact integer math.
   - A Directed Acyclic Graph (DAG) validates task dependencies and recalculates relative deadlines without cycle bugs.
2. **Generative Intelligence (Google Gemini):**
   - Server-side structured API generates personalized event themes, curated vendor requirements, and contextual rebalancing proposals when constraints change.
3. **Transparent Change Simulator:**
   - Instead of silently overwriting user data, all proposed adjustments are surfaced in an interactive **Before/After Change Review Panel**.
   - Each suggested change displays its category, current value, proposed value, stated rationale, and impact.
4. **Decision Lock Protection:**
   - Users can lock any budget item, task, or date. The replan engine treats locked items as immutable boundary conditions.
5. **Epistemic Financial Provenance:**
   - Every financial figure carries an explicit badge: `user-entered`, `ai-estimate`, or `confirmed-by-user`.

---

## 3. SCOPE BOUNDARIES FOR MVP

### What We Will Build:
- Three distinct event archetypes: **Wedding**, **30th Birthday Celebration**, **Community Charity Gala**.
- Full interactive setup flow with client-side validation.
- Four unified planning workspaces: **Budget**, **Timeline**, **Vendor Checklist**, **Personalized Ideas**.
- Real-time constraint adjustments: **Guest Count**, **Event Date**, **Total Budget**.
- Interactive Before/After Change Review modal with granular Accept/Reject mechanics.
- Decision locking on line items and tasks.
- Financial provenance badges across all monetary values.
- Server-side Google Gemini integration via Next.js API route with strict Zod validation.
- Zero-dependency offline/sample mode that runs completely locally without requiring an API key.

### What is Explicitly Deferred:
- Live external payment gateways and Stripe checkout.
- Web scraping of local venue websites.
- Real-time multi-user WebSockets.
- Weather radar API integrations.

