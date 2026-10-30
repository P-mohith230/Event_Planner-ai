# COMPETITOR AND MARKET RESEARCH (v2: corrects and extends `COMPETITOR-RESEARCH.md`)
**Project:** EventPilot, The Living Plan | **Challenge:** Google Prompt Wars Virtual, Challenge 5
**Research date:** 30 October 2026 | **Status:** Draft for team review

**Evidence labels:** **V** = stated on a first-party page or press release I retrieved this session. **S** = secondary source (blog, review site, aggregator). **A** = anecdotal. **P** = taken from the project's own earlier documents, not re-verified. **H** = hypothesis. **R** = recommendation.

---

## 1. Scope and honest limits of this research

- Retrieved this session: press releases and news on Zola and The Knot AI launches, app-store and review-site complaints, Partiful/Eventbrite descriptions, and Google SDK deprecation notices.
- **Not done:** I did not open live product UIs, test sign-up flows, or read official Zola/Knot help centers. Features below are what these companies and reviewers say, not what I clicked.
- **Birthday and community-event tooling is thinly researched** (two searches). Treat conclusions there as **H**.
- The project's source code, `PROMPT.md`, UI screenshots and any live URL were **not provided**. Nothing here assumes how the current UI looks.

## 2. Market snapshot (what is commonplace in 2026)

| Product | Positioning | AI features found | Evidence |
|---|---|---|---|
| **The Knot** (Knot Worldwide, also owns WeddingWire) | Largest wedding platform and vendor marketplace | Sept 2025: AI "Make it Yours" matches couples to vendors from visual preferences, part of a reworked planning experience; press release says more AI features are coming. Feb 2026: launched a ChatGPT app | **V** [BusinessWire, 25 Sep 2025](https://www.businesswire.com/news/home/20250925665882/en/The-Knot-Launches-New-AI-Powered-Planning-Experience); [Digital Commerce 360, 4 Feb 2026](https://www.digitalcommerce360.com/2026/02/04/the-knot-launches-openai-chatgpt-app/) |
| **Zola** | All-in-one: checklist, budget, guests, website, registry | Apr 2024: "Split the Decisions" GPT that divides planning decisions between partners; says 54% of couples were planning or considering AI | **V** [BusinessWire, Apr 2024](https://businesswire.com/news/home/20240403905368/en/Zola-Expands-into-Emerging-Technology-with-Launch-of-Split-the-Decisions-GPT) (the 54% is Zola's own survey claim) |
| **WeddingWire** | Vendor marketplace; same parent as The Knot | An AI planning assistant is listed in one 2026 comparison | **S** [knowledgelib](https://knowledgelib.io/lifestyle/wedding/wedding-planning-apps/2026) |
| **Joy** | Free website/RSVP platform | "Writer's Block AI" copy assistant | **S** [completewedo blog](https://completewedo.com/albany/?p=12631) |
| **David's Bridal (Pearl)** | Retailer platform | "Agentic" wedding planner features, beta, June 2025 | **V** (reported in [Digital Commerce 360](https://www.digitalcommerce360.com/2026/02/04/the-knot-launches-openai-chatgpt-app/)) |
| **Partiful** | Invites and RSVP for personal events | Not researched | Its own description centers on invite pages, RSVP tracking, reminders ([profile](https://yespress.io/partiful.md)) **S** |
| **Eventbrite / Luma / OddCircles / Eventifai** | Ticketing, event pages, community and small-team events | Not researched | **S** ([AlternativeTo](https://alternativeto.net/software/partiful/)). Eventifai claims budgets, checklists, seating and vendor tools for many event types (**vendor claim**) |

**Implication (R):** an "AI wedding planner" is no longer a differentiator. The incumbents already ship checklist, budget, vendor matching and AI assistants. EventPilot must win on *behavior under change* and *trustworthiness of numbers*, not on "has AI".

## 3. Corrections to the project's existing competitor research

The earlier `COMPETITOR-RESEARCH.md` and `COMPETITIVE-GAP-ANALYSIS.md` contain claims that this pass contradicts or cannot support. **Fix these before they appear in any README, demo script or submission text.**

| Existing claim | Finding | Action |
|---|---|---|
| Zola: AI "Minimal / Rule-based"; "No AI suggestion engine" | Zola launched a GPT-based decision-splitting tool in 2024 (**V**) | Rewrite: Zola has AI features, but they target decision division, not budget/schedule replanning |
| The Knot: AI "Limited (algorithmic vendor recommendations; basic chat search)" | The Knot shipped AI vendor matching in Sept 2025 and a ChatGPT app in Feb 2026 (**V**) | Rewrite with the dated facts above |
| "No major consumer event platform automatically recalculates affected variable budget items with an explainable before/after change review" | Absence claim, not proven. The Knot's app description says it shows per-vendor estimates derived from the overall budget (**S**), so *partial* auto-scaling exists | Soften to "we did not observe a reviewable, lock-respecting diff in the products we examined" |
| "None explicitly tag whether a line item is user-entered, an AI estimate, or a confirmed vendor quote" | Plausible, **unverified** | Same softening. One budget-tool listing (VowTrack) compares real quotes to benchmarks, which is adjacent (**A**) |
| Citations such as `https://theknot.com`, `https://zola.com`, `engini.ai`, "Zola Cost Index 2026" | Home-page links do not support the specific claims | Replace with deep links and retrieval dates, or delete the claim |
| `TRD` references `https://prompt-wars-2026.devpost.com/` as the official challenge page | I could not confirm this URL. It may be wrong | Verify against the portal the team actually registered on. Remove if unverified |

## 4. User pain points with evidence quality

| # | Pain point | Evidence | Grade |
|---|---|---|---|
| P1 | Vendor-inquiry spam and sync bugs dominate 1-star reviews of big wedding apps | [Unstar 2026 comparison](https://unstar.app/blog/zola-the-knot-joy-weddingwire-minted-wedding-planning-apps-ranked-2026) | S |
| P2 | Budget estimates are generic and hard to edit; one reviewer reports the max budget not updating | [Wedsly reviews](https://justuseapp.com/en/app/1391129545/wedding-planner-by-wedbox/reviews) | A |
| P3 | Most tools are "task lists with a date countdown"; budget, guests and timeline live in separate places | [RaftLabs](https://www.raftlabs.com/industries/wedding/wedding-planning-software) (a vendor selling custom software) | S, biased |
| P4 | LLMs invent events and are unreliable for local prices; "AI gives national averages that should be verified locally" | [PromptLayer EventChat summary](https://www.promptlayer.com/research-papers/eventchat-implementation-and-user-centric-evaluation-of-a-large-language-model-driven-conversational-recommender-system-for-exploring-leisure-events-in-an-sme-context); [completewedo](https://completewedo.com/colorado-springs/?p=14530) | S |
| P5 | Changing one big input forces manual rework across budget and schedule | Not directly measured | **H** |
| P6 | Users cannot tell guesses from confirmed quotes | Not directly measured | **H** |
| P7 | Birthday/community organizers are served mainly by invite/RSVP tools; budget-and-dependency planning looks underserved | Thin: Partiful and Eventbrite descriptions only | **H** |

## 5. Opportunity map for EventPilot

| Opportunity | Why it is credible | Why it is not guaranteed |
|---|---|---|
| **Trustworthy numbers**: deterministic math plus provenance on every figure | P4, P6; hallucination is documented | Incumbents could add labels cheaply |
| **Change-resilient plans**: reviewable diff, locks | P3, P5 | P5 is a hypothesis |
| **AI as proposer and parser, not calculator** | Matches P4; also fits the challenge's "meaningful assistance" wording | Needs a live, visible Gemini path (see strategy doc) |
| **Non-wedding focus** (birthday, community) | P7 | Thin evidence; wedding is the best-documented category |
| **No marketplace, no vendor spam** | P1 | Also means no real vendor data. Position honestly as a planning tool |

## 6. What judges can and cannot conclude

A hackathon judge likely compares EventPilot with other Challenge 5 submissions, not with The Knot. Most submissions will be "Gemini generates checklist, budget table and ideas" (**H**, based on the commodity pattern in Section 2). The relevant bar is: *does ours demonstrably do something those do not, and does it work cleanly when opened?*

## 7. Open research items (not done)

1. Hands-on pass of The Knot and Zola budget tools to confirm what scaling they perform when guest count changes.
2. Birthday and community-event tools beyond invites (checklists, budgets, volunteer coordination).
3. Cultural and multi-day event structures (several ceremonies, regional customs) and how incumbents handle them.
4. A real user conversation or two to test P5 and P6.
