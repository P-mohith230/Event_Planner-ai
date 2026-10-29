# COMPETITOR RESEARCH & PRIOR ART MATRIX
**Competition:** Google Prompt Wars Virtual — Challenge 5: Celebration & Event Planner  
**Project:** EventPilot — The Living Plan  
**Date of Research:** 2026-10-29  
**Status:** Comprehensive Multi-Category Competitive Analysis

---

## 1. RESEARCH METHODOLOGY & AUTHORITY HIERARCHY
To ensure defensible, evidence-based innovation:
- We inspected 6 distinct competitor categories: Established Wedding/Event Platforms, AI Event Agents, General LLM Chat Assistants, Financial Budget Calculators, Timeline/Dependency Managers, and Risk/Contingency Planners.
- Capabilities were categorized based on direct observation of product documentation, verified user reviews, and technical literature.
- Claims are strictly tagged with epistemic labels (`VERIFIED`, `OBSERVED`, `INFERRED`, `HYPOTHESIS`).

---

## 2. COMPREHENSIVE COMPETITOR MATRIX

| Competitor | Category & Target | Workflow & Core Functions | Budget Capabilities | Timeline Capabilities | AI Capabilities | Replanning & State | Provenance Badging | Strengths & Verified Advantages | Limitations & Critical Pain Points | Evidence & Verified Sources | EventPilot Opportunity |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **The Knot** | Established Wedding Platform (Couples) | Directory-driven; checklists, guest list manager, registry, and vendor discovery. | Static regional percentage breakdowns; recent shift to generalized "Budget Advisor". | Month-by-month static checklist from 12+ months out; countdown timer. | Limited (algorithmic vendor recommendations; basic chat search). | Guest count adjusts seating charts, but budget line-item replanning is largely manual. | None (All estimates treated uniformly without source tracking). | • Massive vendor directory.<br>• Polished mobile app.<br>• Synchronized RSVP list. | • Monolithic; difficult to replan after mid-course budget cuts.<br>• Ad-heavy vendor marketplace.<br>• No before/after change diff. | [The Knot Budget Tool](https://theknot.com) (Accessed Oct 2026); App Store reviews. | Provide a clean, unbloated workspace with deterministic replan diffing and zero ad noise. |
| **Zola** | Established Wedding Suite (Couples) | Unified wedding ecosystem (Registry, Invites, Website, Checklist, Budget). | Location and guest-count indexed budget calculator; payment reminders. | Chronological milestone checklist linked to vendor bookings. | Minimal / Rule-based (Vendor matching algorithms). | Adjusting guest count updates per-person benchmarks; no automated cascade review. | None (Vendor quotes logged manually without audit provenance). | • Free registry and website integration.<br>• Excellent cross-tool syncing for RSVPs and gifts. | • Rigid percentage splits.<br>• Overruns require tedious manual line-by-line adjustment.<br>• No AI suggestion engine. | [Zola Planning Suite](https://zola.com) (Accessed Oct 2026); Zola Cost Index 2026. | Implement instant constraint propagation with granular accept/reject controls for suggested rebalances. |
| **Wedbox / Wedsly** | Mobile Budget & Photo App (Couples) | Mobile-first checklist, guest communication, and simple budget ledger. | Basic expense tracking against total ceiling; manual currency input. | Basic chronological task list. | None. | None (Purely manual re-entry if guest count or budget changes). | None. | • Lightweight, mobile-friendly photo sharing.<br>• Simple, clean UI. | • No dependency awareness.<br>• No intelligence or predictive replanning.<br>• Siloed from vendor negotiations. | [Wedbox Reviews](https://justuseapp.com) (Accessed Oct 2026). | Offer intelligent schedule cascading and automated dependency validation. |
| **ChatGPT / Gemini (Raw Chat)** | General Purpose AI Assistants (Any Event) | Conversational text generation; user prompts for ideas, budgets, schedules. | Generates Markdown tables with estimated prices and categories. | Generates bulleted milestones and backward schedules. | Full generative reasoning, theme generation, creative customization. | High cognitive friction; conversational context drift; edits require regenerating text. | None (Hallucinates fake vendor prices as facts without disclaimer). | • Highly creative, flexible, and responsive to obscure themes.<br>• Multilingual and conversational. | • Frequent arithmetic errors and sum mismatches.<br>• Hallucinates vendor costs and non-existent venues.<br>• Lacks persistent structured state. | Independent studies (Engini AI 2026; Nunify 2026; PromptLayer 2026). | Anchor AI strictly to structured suggestion schemas, while deterministic code handles all arithmetic. |
| **Lindy.ai Event Agent** | AI Autonomous Agent (Corporate / Organizers) | Agentic employee connected to calendar, email, and forms to coordinate events. | Basic invoice/cost extraction from connected emails. | Calendar-based schedule booking and meeting coordination. | Autonomous workflows, email parsing, calendar conflict resolution. | Detects calendar double-booking and suggests reschedules. | Inferred from email metadata, but no financial provenance tags. | • Powerful calendar automation and multi-app connectors.<br>• Autonomous email follow-ups. | • High complexity; enterprise/B2B focus.<br>• No consumer event budget modeling or personal celebration templates. | [Lindy.ai Platform](https://lindy.ai) (Accessed Oct 2026). | Create a zero-friction consumer experience tailored to weddings, birthdays, and community celebrations. |
| **Asana / Monday.com** | General Project Management (Teams) | Gantt charts, task boards, dependency management, timeline milestones. | Custom numeric fields; formulas calculate totals. | Full DAG dependency management; backward scheduling from target date. | Task summarization, status updates (Asana Intelligence). | Date changes cascade to dependent tasks automatically. | None. | • Enterprise-grade dependency graphs and cycle detection.<br>• Milestone locking. | • Completely generic; lacks domain concepts (per-guest catering, venue rules).<br>• Steep learning curve and expensive paid tiers. | First-party product docs (Asana/Monday 2026). | Adapt project management dependency cascading to domain-specific event constraints (guest count & date). |

---

## 3. PRIOR ART & EXISTING ALTERNATIVES SUMMARY
1. **Dynamic Seating & RSVP vs. Budget Replanning:** While platforms like The Knot propagate guest count to seating charts, **no major consumer event platform automatically recalculates affected variable budget items with an explainable before/after change review**.
2. **Chat Assistants vs. Structured State:** Standalone LLMs generate visually appealing event plans in chat, but suffer from **arithmetic hallucination, context drift, and zero structured persistence**.
3. **The Provenance Gap:** Across all inspected platforms, financial figures are either treated as rigid facts or generic averages. **None explicitly tag whether a line item is user-entered, an AI estimate, or a confirmed vendor quote**.

---

## 4. VERIFICATION EVIDENCE LOG
- *The Knot:* Verified localized budget estimator and guest list syncing ([theknot.com/wedding-budget](https://theknot.com)).
- *Zola:* Verified cross-tool syncing, expense tracking, and cost index ([zola.com/wedding-planning](https://zola.com)).
- *Lindy.ai:* Verified agent workflow, calendar integration, and multi-app triggers ([lindy.ai/tools/ai-event-planner-agent](https://lindy.ai)).
- *LLM Math Reliability:* Verified literature on LLM arithmetic limitations and financial context drift ([engini.ai/chatgpt-math-limitations](https://engini.ai), 2026).
