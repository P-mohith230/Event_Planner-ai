# 04 — UI/UX Design Brief
**Product:** EventPilot — The Living Plan

## 1. Experience goal
Create a polished planning workspace that feels calm, trustworthy and useful under pressure. Avoid a generic chat-only interface. The plan itself is the main artifact; AI is a supporting capability.

## 2. Design principles
- Plan-first, not chat-first.
- One clear primary action per state.
- Distinguish confirmed details from estimates.
- Make changes explainable and reversible.
- Show errors with recovery actions.
- Favor clarity over decorative animation.
- Responsive and keyboard accessible by default.

## 3. Information architecture
Header: EventPilot brand, event title, save/reset status.  
Summary strip: event date, guest count, budget and remaining balance.  
Main navigation: Budget, Timeline, Vendor Checklist, Ideas.  
Primary action: “Review plan changes” when a constraint changes.  
Secondary actions: Edit event details, load sample, reset.

## 4. Visual direction
- Clean, modern, editorial planning dashboard.
- Warm neutral background with one restrained accent color.
- Strong typography hierarchy and generous spacing.
- Cards used for meaningful groups, not every single field.
- Simple icons paired with text labels.
- Avoid excessive gradients, glassmorphism, distracting motion or dense charts.
- Use design tokens for color, spacing, typography, radii, borders and focus rings.

## 5. Core components
- EventSetupForm
- EventSummary
- BudgetOverview and BudgetLineItem
- TimelineTaskList
- VendorChecklistItem
- IdeaCard
- ProvenanceBadge
- BudgetOverrunNotice
- ChangeReviewPanel
- Error/Loading/EmptyState
- Toast or inline status message

## 6. Component behavior
### Provenance
Use visible text labels, not color alone:
- User-entered
- AI estimate
- Confirmed by user

### Change review
Use a comparison layout with “Current” and “Proposed”. Explain why a value changes. Do not apply a change before user approval.

### Budget
Show total planned, total budget and remaining/over-budget amount. Use a text status alongside any color.

### Timeline
Show due date, status, priority and dependency/conflict indicators. Provide a list alternative to any visual timeline.

## 7. Accessibility checklist
- Semantic HTML and meaningful landmarks.
- Labels and instructions for all inputs.
- Keyboard-only navigation.
- Visible focus state.
- Sufficient text/background contrast.
- Status messages announced appropriately.
- No color-only meaning.
- Reduced motion support.
- Dialog focus management.
- Zoom/reflow without horizontal page scrolling at common mobile widths.

## 8. Responsive breakpoints
Use framework defaults where possible. Validate at narrow mobile, tablet and desktop widths. Avoid hard-coded pixel layouts that break at intermediate sizes.

## 9. Microcopy
- “AI estimate — confirm before relying on this amount.”
- “This change affects 4 budget items and 3 tasks.”
- “Your locked decisions were preserved.”
- “Suggestions are unavailable right now. Your plan is still editable.”
- “This plan is over budget by … Review the items before making changes.”

## 10. Avoid
- Fake vendor ratings, logos, reviews or prices.
- Claims like “verified” when the user merely entered the data.
- Unlabeled AI content.
- Silent destructive changes.
- Tiny contrast-poor text, hover-only controls, and inaccessible modals.
