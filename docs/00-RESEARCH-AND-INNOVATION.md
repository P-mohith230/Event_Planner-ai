# 00 — Research and Innovation Analysis
**Project:** Google Prompt Wars Virtual — Challenge 5: Celebration & Event Planner  
**Status:** Consolidated research baseline for Stage 2  
**Prepared:** 29 October 2026  
**Evidence note:** This document incorporates the supplied Claude research file. External product and competition claims below are not treated as independently re-verified unless explicitly marked.

## 1. Challenge interpretation

The supplied challenge screenshot describes a GenAI-powered planning assistant for weddings, birthdays, and community events, including:
- Budgets
- Timelines
- Vendor checklists
- Personalized ideas

The supplied evaluation screenshot names six dimensions:
1. Code Quality
2. Security
3. Efficiency
4. Testing
5. Accessibility
6. Problem Statement Alignment

The supplied Challenge 3 score is an example only. Its score aggregation and weights must not be assumed to apply to Challenge 5. The leaderboard screenshot is a point-in-time snapshot; the visible leading scores are tightly grouped around 97.44–97.50. The cutoff for the top 10 is not established by the supplied screenshot.

### Open challenge facts
- Exact Challenge 5 deadline and submission window: **verify from the current official challenge page**.
- Allowed frameworks, AI services, hosting and external APIs: **verify from official rules**.
- Required submission URL, source repository format, demo format, and judging procedure: **verify from official rules**.
- Official scoring weights or score formula: **unknown unless officially published**.

Do not present these unknowns as confirmed facts.

## 2. Research summary inherited from the supplied research

The supplied research compared established wedding platforms (including The Knot, WeddingWire, Zola, Wedsly/Wedbox and VowTrack-style budget tracking) with general chat assistants and agent-based approaches. It identifies common capabilities such as checklists, budgets, countdowns, vendor directories, and AI-generated suggestions as **not sufficient differentiation by themselves**.

The supplied research cites secondary sources and individual reviews for several pain points. These are useful hypotheses, not conclusive market proof:
- Estimates may feel generic or not reflect a user's actual numbers.
- Planning data can be spread across budgets, guest counts and timelines.
- Chat-generated plans may be difficult to edit and operationalize.
- Users may not know whether a number is an estimate or a confirmed quote.
- Changes to one major constraint may require manual rework.

The supplied research explicitly acknowledges that not finding a competing product is not proof that no such product exists. Preserve that distinction.

## 3. Candidate concepts and decision

| Concept | Strength | Main weakness | Decision |
|---|---|---|---|
| A. EventPilot — Living Plan | Integrates budget, schedule, checklist, ideas, and explainable replanning | More engineering risk | **Selected, with strict MVP boundaries** |
| B. Budget Stress Tester | Easy to test; measurable calculations | Does not fully address the challenge | Keep as first fallback / first implementation slice |
| C. Contingency Radar | Memorable risk-first experience | Less complete without a sound base plan | Defer advanced version |
| D. Chat-first Copilot | Fast to build | Common pattern; output may remain unstructured | Do not use as the primary product |

## 4. Proposed product

**EventPilot — The Living Plan** turns event details into a structured, editable plan. It uses deterministic application logic for arithmetic and scheduling. Gemini is used for bounded proposal generation and explanations, not as the authority for money math or dates.

The signature workflow:
1. User selects an event type and enters event date, location/region (optional), guest count, budget, currency, priorities, and constraints.
2. The app creates a plan with a budget, timeline, vendor checklist, and personalized ideas.
3. The user changes one supported constraint: guest count, date, or total budget.
4. Deterministic logic recalculates affected totals and dates.
5. AI may propose changes to flexible items, with explicit assumptions and reasons.
6. The UI presents a before/after change review.
7. User accepts or rejects individual proposed changes; locked decisions remain protected.

### Provenance labels
- **User-entered:** directly supplied by the user.
- **AI estimate:** generated suggestion; not a quote or verified market price.
- **Confirmed by user:** user has explicitly marked a vendor quote or detail as confirmed.

The application must not label user-entered information as independently verified.

## 5. Differentiation hypothesis

The proposed differentiator is not “AI can make a checklist.” It is the connected behavior:
- Constraint-aware plan state
- Deterministic budget calculations
- Dependency-aware task scheduling where feasible
- Transparent before/after change review
- Preserved user-locked decisions
- Provenance labels for numbers and claims
- Explicit conflicts and uncertainty instead of fabricated certainty

This is a **differentiation hypothesis**. Stage 2 research should verify current competitors' workflows and update the claim if comparable capabilities are found.

## 6. MVP boundary

### Must ship
- Three event types: wedding, birthday, community event.
- A structured event setup form.
- One usable plan view with Budget, Timeline, Vendor Checklist, and Ideas sections.
- Deterministic budget arithmetic.
- A practical task schedule with due dates and dependencies for seeded/template tasks.
- Three replan triggers: guest count, event date, total budget.
- Before/after diff for supported changes.
- User acceptance/rejection of proposed flexible changes.
- AI-generated personalized ideas and optional task/vendor-category suggestions, with schema validation and fallback behavior.
- Sample/demo data so the app remains demonstrable if the AI API is unavailable.
- Responsive, keyboard-accessible UI.

### Explicitly out of scope for MVP
- Vendor marketplace, live vendor search, booking, payments, contracts, or email outreach.
- Guest RSVP management or registry.
- Multi-user collaboration and account management unless the challenge explicitly requires it.
- Claims of real-time market prices or externally verified vendors.
- Complex weather forecasting or integrations.
- Autonomous AI changes without user approval.

## 7. Feasibility and fallback

Build the deterministic budget and plan state first. Then add timeline dependencies, change comparison, and AI assistance. If the deadline is short, reduce advanced dependency scheduling rather than shipping a broken end-to-end workflow.

Recommended implementation order:
1. Static shell, form, sample plan.
2. Pure budget functions and tests.
3. Task list and date calculations with tests.
4. Replan trigger and diff model.
5. Gemini server-side integration with validation and fallback.
6. Accessibility, responsive polish, test suite, deployment.

## 8. Risk register

| Risk | Impact | Mitigation |
|---|---|---|
| Deadline/rules misread | Submission invalid or rushed | Verify official challenge page before implementation |
| AI schema mismatch or outage | Broken generation | Server-side validation, bounded retry, fallback sample/template |
| Budget/date logic bug | Trust loss | Pure functions, integer minor units, edge-case tests |
| Over-scoped scheduler | Incomplete MVP | Keep a deterministic simple scheduler; defer advanced optimization |
| Fabricated vendor/price | Misleading output | No fake listings; label estimates; no external verification claims |
| Exposed API key | Security issue | Server-side secrets only; never ship keys to browser |
| Unverified uniqueness claim | Weak credibility | Phrase as hypothesis; run competitor workflow comparison |
| Build warnings/errors | Evaluation penalty | Automated quality gate and documented run output |

## 9. Source and evidence handling

The original research supplied these starting points (re-verify before making factual claims in a submission):
- The Knot comparison: https://unitq.com/unitq-scorecards/theknot
- Wedding planning app comparison: https://newly.app/build-wedding-planning-app
- Wedding app comparison: https://unstar.app/blog/zola-the-knot-joy-weddingwire-minted-wedding-planning-apps-ranked-2026
- WeddingWire apps article: https://www.weddingwire.com/wedding-ideas/the-10-apps-you-need-to-plan-your-wedding
- Wedsly reviews: https://justuseapp.com/en/app/1391129545/wedding-planner-by-wedbox/reviews
- VowTrack listing: https://hunted.space/product/vowtrack
- Eventtia article: https://landing.eventtia.com/chatgpt-alternatives-for-event-organizers/
- Whova article: https://whova.com/?p=36120
- Lindy AI event-planning agent: https://www.lindy.ai/tools/ai-event-planner-agent
- EventChat research summary: https://www.promptlayer.com/research-papers/eventchat-implementation-and-user-centric-evaluation-of-a-large-language-model-driven-conversational-recommender-system-for-exploring-leisure-events-in-an-sme-context
- Google AI documentation to verify directly: https://ai.google.dev/gemini-api/docs
- PromptWars event page to verify directly: https://prompt-wars-2026.devpost.com/

## 10. Decisions required before implementation

1. Confirm official deadline, submission format, stack restrictions and deployment requirements.
2. Confirm the simplest permitted stack after checking official documentation.
3. Decide whether persistence is browser-local or server-backed; default to browser-local for MVP if allowed.
4. Verify current Gemini model/API, structured-output support, quotas, pricing and terms from official docs.
5. Confirm the complete six-document package is internally consistent.
