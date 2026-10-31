# UI/UX AND VISUAL DESIGN RESEARCH AND DIRECTION
**Project:** EventPilot, The Living Plan | **Date:** 30 October 2026 | **Status:** Draft for team review
**Evidence labels:** V = retrieved; S = secondary or marketing source; P = project document; M = measured by me (contrast math, run 30 Oct 2026); R = recommendation.

---

## 1. Limits and starting point

- **I have not seen the current UI.** No screenshots, source or live URL were provided. The only visual facts in the documents are: Tailwind CSS, Lucide icons, a focus ring of `focus-visible:ring-violet-600` (P), a single-page dashboard in `src/app/page.tsx`, a New Event modal, a Change Review modal, and three sample plans (P). That suggests a Tailwind-default violet look, which is a **hypothesis** about visual quality, not an observation.
- **First task for Antigravity:** capture screenshots of the current app at 375, 768 and 1440 px, record the existing tokens, and only then redesign. Preserve component names, props and behavior; restyle through tokens.
- **Evidence for design trends is weak.** Sources are stationery and print-design marketing blogs plus design-trend posts (S). They agree on direction, but they are trend signals, not usability studies. The accessibility and layout rules below rest on WCAG math and established practice, not on those blogs.

## 2. What the research says (signals, not proof)

| Signal | Source | Use |
|---|---|---|
| 2026 wedding and stationery design leans to "quiet luxury": editorial serif or oversized type, restrained palettes, texture, lots of breathing room | [StationeryHQ trends](https://www.stationeryhq.com/pages/trending-design-aesthetics-for-2026-and-how-they-shape-modern-print-stationery) (S), [Photobox, Jul 2026](https://www.photobox.co.uk/blog/special-occasions/2026-wedding-trends-design) (S) | Wedding theme: serif display, warm neutrals, one muted accent |
| "Minimal but with personality": big confident type, serif plus sans pairs, asymmetry | [Catprint](https://www.blog.catprint.com/post/print-design-trends-for-2026) (S) | Large display headings, calm body text |
| Pick one rich accent and use it consistently for buttons and key headlines | [Davey & Krista](https://daveyandkrista.com/2026-design-trends/) (S) | One accent per theme, never several competing |
| Cohesive systems: invites, site, RSVP and signage share type, palette and identity | [StationeryHQ](https://www.stationeryhq.com/pages/the-10-best-wedding-invitation-trends-of-2026) (S) | One token system; theme swaps tokens, not components |
| Playful, retro, bold color is a counter-trend for personality-led events | [Photobox](https://www.photobox.co.uk/blog/special-occasions/2026-wedding-trends-design) (S) | Birthday theme |
| Incumbents are feature-dense dashboards with vendor marketplaces and ads (inferred from app descriptions and complaints) | Research doc, Unstar | Differentiate by calm, uncluttered, no ads or marketplace noise |

## 3. Recommended design direction (R)

**"Calm editorial planner."** A premium, warm, uncluttered product that feels like a well-designed planning notebook, not an AI chat window and not an admin console.

1. **One brand, three event moods.** Layout, components, spacing, status colors, logo and voice stay constant. Per-event **theme tokens** change background tint, accent, soft fill and the display typeface. Switching event type changes the mood without changing where anything lives.
2. **Numbers are the heroes.** Remaining budget, days to go, confidence and slack get large, tabular figures. Decoration stays subordinate.
3. **Trust is visible.** Provenance badges, lock icons and a "Gemini / template" source label are first-class UI, not footnotes.
4. **Show change, not chat.** The primary AI surface is a text box plus chips and a diff, not a chat transcript.
5. **Avoid:** purple-blue gradients, glassmorphism, chatbot bubbles, sparkle icons everywhere, stock photos, heavy animation, and color-only status.

## 4. Color system (HEX, with measured contrast)

All ratios below are **M**: WCAG 2.x relative-luminance contrast, computed 30 Oct 2026. Normal text needs ≥ 4.5:1; large text and UI boundaries ≥ 3:1. Colors marked *decorative* must never carry text or meaning.

### 4.1 Brand core (constant across themes)

| Token | HEX | Use | Contrast |
|---|---|---|---|
| `--ink` | `#1F2430` | Body text | 14.87 on `#FBFAF7` |
| `--ink-muted` | `#5B6070` | Secondary text | 6.00 on `#FBFAF7` |
| `--paper` | `#FBFAF7` | Page background (neutral base) | n/a |
| `--surface` | `#FFFFFF` | Cards | n/a |
| `--line` | `#E4E1DA` | Borders, dividers (decorative) | n/a |
| `--brand` | `#5B3FD1` | Logo, primary focus ring, links | 6.54 on paper; 6.83 white-on-brand |

If the audit shows the current violet-600 `#7C3AED` is already the brand, keep it; it measures 5.70:1 against white and passes. `#5B3FD1` is a deeper option, not a requirement.

### 4.2 Semantic status colors (constant; never themed)

| Meaning | Text | Background | Text-on-background ratio |
|---|---|---|---|
| Over budget / error | `#B42318` | `#FEE4E2` | 5.45 |
| On track / success | `#067647` | `#DCFAE6` | 5.11 |
| Caution / estimate at risk | `#93370D` | `#FEF0C7` | 6.62 |
| Info | `#175CD3` | `#D1E9FF` | 4.79 |

Status always pairs color with an icon **and** a word ("Over by $1,200").

### 4.3 Event themes

| Theme | Background | Accent (text-safe) | Soft fill | Decorative only | Key ratios |
|---|---|---|---|---|---|
| **Wedding, "Ivory and Gold"** | `#FBF7F0` | `#7A5C22` | `#EFE3CC` | blush `#F3DADA` | ink `#2B2420` 14.29; accent on bg 5.82; white on accent 6.21; muted `#6B5E52` 5.87 |
| **Birthday, "Confetti"** | `#FFF8F1` | `#C2255C` | `#FFE3EC` | amber `#F59F00`, violet `#7048E8` | ink `#1E1B2E` 15.94; accent on bg 5.37; white on accent 5.66; muted `#5F5A73` 6.24 |
| **Community, "Neighborhood"** | `#F4FAF6` | `#17694C` | `#D3F0E2` | orange `#E8590C` | ink `#14261E` 14.97; accent on bg 6.28; white on accent 6.64; muted `#4A5F55` 6.49 |

Rejected after measurement: gold `#8A6A2F` is only 4.70 on ivory (too close to the limit), and raspberry `#D6336C` is 4.62 with white text; the deeper values above give margin. **Corporate and festival themes** from the brief are outside Challenge 5's three event types; do not build them now.

### 4.4 Implementation

```css
:root { /* brand + status tokens */ }
[data-theme="wedding"]   { --bg:#FBF7F0; --accent:#7A5C22; --accent-soft:#EFE3CC; --font-display: var(--font-fraunces); }
[data-theme="birthday"]  { --bg:#FFF8F1; --accent:#C2255C; --accent-soft:#FFE3EC; --font-display: var(--font-bricolage); }
[data-theme="community"] { --bg:#F4FAF6; --accent:#17694C; --accent-soft:#D3F0E2; --font-display: var(--font-fraunces); }
```
Map these through the Tailwind config as semantic tokens (`bg-bg`, `text-accent`), set `data-theme` on the app root from the active event type, and keep the setup screen on a neutral theme.

## 5. Typography (R)

| Role | Family (Google Fonts) | Notes |
|---|---|---|
| UI and body | **Inter** (variable) | Tabular figures (`font-variant-numeric: tabular-nums`) for money and counts |
| Display, wedding and community | **Fraunces** (variable serif) | Warm, editorial |
| Display, birthday | **Bricolage Grotesque** (variable) | Playful but legible |

- Load with `next/font/google`: self-hosted at build, no render-blocking third-party request, `display: swap`, Latin subset only. **Verify the families and axes exist at implementation time.**
- Budget: at most three families, and only the weights and axes actually used.
- Scale (rem, 1.125 ratio): 0.8125 / 0.875 / 1 / 1.125 / 1.25 / 1.5 / 2 / 2.75. Body ≥ 16 px. Line height 1.5 body, 1.15 display.
- Money and big metrics use Inter tabular figures even inside themed headings, so columns align.

## 6. Layout, spacing and shape

- **4 px spacing scale** (4, 8, 12, 16, 24, 32, 48, 64). Cards 16 to 24 px padding. Radii 8 (inputs), 12 (cards), 999 (badges).
- **Desktop (≥ 1200):** 12-column grid, max width 1240. Left: plan strip plus workspace tabs. Right (4 columns): the **Pilot panel** containing Tell the Pilot, Scenario Compare and the active change review.
- **Tablet (768 to 1199):** single column; Pilot panel becomes a right-side drawer opened from a persistent "Pilot" button.
- **Mobile (< 768):** bottom tab bar with five items (Budget, Timeline, Vendors, Ideas, Pilot); condensed sticky plan strip showing remaining budget and days to go; tables become stacked cards; review runs as a full-screen sheet. Touch targets ≥ 44 px.
- Shadows: one soft elevation for cards, one for dialogs. No stacked glows.

## 7. Screens

**Landing (R).** One screen of value: headline "Plan changes. Your decisions stay put."; three event cards (Wedding, Birthday, Community) that **preview their theme on hover/focus**; primary "Try a sample plan" (works with no key) and secondary "Start your own". A three-step strip (Set constraints, Change one thing, Review and keep what you chose) and an honesty line: "Estimates are labeled. Nothing changes until you approve." No stock photos: use light inline SVG motifs (botanical line, confetti dots, bunting) marked `aria-hidden`.

**Event creation (R).** Three-step flow, each step one decision: (1) event type as large cards, (2) essentials: date, guests, budget, currency with inline validation and examples, (3) style notes: free-text "traditions, style, must-haves" plus priority chips. "Generate plan" shows determinate progress states ("Building budget", "Scheduling tasks", "Asking Gemini for ideas"). Skip link to the sample plan on every step.

**Workspace (R).**
- **Plan strip:** title, date and countdown, guest count, budget, and a **Confidence ring** (text alternative "62% of spend confirmed").
- **Tabs:** Budget, Timeline, Vendors, Ideas (ARIA tabs pattern, arrow-key navigation).
- **Budget:** category cards with amount, provenance badge, lock toggle; remaining and variance as large numbers; over-budget banner with an icon and text.
- **Timeline:** vertical list grouped by month; dependency shown by an indented "after: Venue booked" chip plus a thin connector, not color alone; conflicts get a warning chip with the reason.
- **Vendors:** pipeline as a labeled stepper (Not contacted, Contacted, Quoted, Booked) with quoted vs confirmed cost fields.
- **Ideas:** cards with rationale, assumption list, estimated cost marked "AI estimate", and "Add to plan".
- **Pilot panel:** text box, understood-as chips, Scenario Compare cards, and the Change Review list with Accept/Reject per row plus "Apply selected".

**Provenance badge spec.** Icon + label + shape: *You entered* (pencil, outline), *AI estimate* (spark in dashed outline), *Confirmed* (check, solid). Tooltips are supplementary only; the label itself is always visible.

## 8. Motion and micro-interaction (R)

- Durations 120 to 220 ms, ease-out; only `transform` and `opacity`.
- Useful motion only: lock toggle snaps, diff rows highlight briefly when added, tab content fades, numbers update without counting animations unless motion is allowed.
- Optional birthday flourish: a tiny confetti-dot burst on "plan generated", **off** under reduced motion and implemented without a library.
- `@media (prefers-reduced-motion: reduce)` removes all non-essential animation and smooth scrolling.

## 9. Accessibility specification

| Requirement | Detail |
|---|---|
| Landmarks and headings | One `h1` per view; `header`, `nav`, `main`, `aside` for Pilot; no skipped levels |
| Keyboard | Everything reachable; tabs use arrow keys; Escape closes dialogs and returns focus to the trigger; focus trapped inside modal dialogs |
| Focus | 2 px outline plus 2 px offset in `--brand`, ≥ 3:1 against every background; never `outline: none` without a replacement |
| Forms | Visible labels, `aria-describedby` for hints and errors, `aria-invalid`, error summary that receives focus on submit |
| Live regions | Polite status for "Plan updated" and for AI results; assertive only for blocking errors |
| Non-color cues | Status, provenance and conflicts always include text and icon |
| Targets | ≥ 44 px on touch layouts (WCAG 2.2 minimum is lower; 44 is the comfortable target) |
| Reflow | No horizontal scroll at 320 px width and 200% zoom |
| Forced colors | Provide a `forced-colors` pass so badges and focus remain visible |
| Motion | Reduced-motion respected as above |
| Screen-reader names | Icon-only buttons have `aria-label`; the Confidence ring has a text equivalent; SVG decoration is `aria-hidden` |

## 10. Acceptance criteria (measurable)

- Automated axe scan on landing, setup, each workspace tab, and both modals at 375 and 1440 px: **0 serious or critical violations**.
- Manual keyboard run of: sample plan → change guests → review → accept one and reject one → reset. Completed with no mouse.
- No horizontal scroll at 320, 375, 768 and 1440 px.
- All text and UI contrast checked against the table in Section 4; any new color gets a measured ratio recorded.
- Fonts: ≤ 3 families, no layout shift when they load.
- Visual QA: screenshots of each theme on desktop and mobile attached to the test report.

## 11. Open questions for the team

1. Is there an existing logo or brand color to preserve?
2. Does the current UI already have any event-type visual differences?
3. Is a dark mode required? Not recommended for this scope; if added, re-measure every ratio.

