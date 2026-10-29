# 03 — Application Flow
**Product:** EventPilot — The Living Plan

## 1. Navigation model
Single-page planning workspace:
- Start / Event Setup
- Plan Workspace
  - Budget
  - Timeline
  - Vendor Checklist
  - Ideas
- Change Review (drawer or dedicated panel)
- Settings / Reset Demo (lightweight)

## 2. Primary flow
```text
START
  |
  v
Choose event type
  |
  v
Enter date, guest count, budget, currency, priorities
  |
  +---- invalid input ----> Inline validation ----> Correct input
  |
  v
Create plan / Load sample plan
  |
  v
PLAN WORKSPACE
  |------ Budget
  |------ Timeline
  |------ Vendor checklist
  |------ Personalized ideas
  |
  v
Change a supported constraint
(guest count / event date / total budget)
  |
  v
Recalculate deterministic values
  |
  v
Create proposed change set
  |
  v
Review before / after / reason / assumptions
  |                         |
  v                         v
Accept selected changes    Reject changes
  |                         |
  v                         v
Commit accepted changes    Keep original values
  \                         /
   \                       /
    v                     v
Updated plan remains editable
```

## 3. Screen states
### Start / setup
- Empty state with clear call to action.
- Event type selector.
- Date, guest count, budget, currency and priorities.
- Inline errors and example values.
- “Try sample plan” path that does not require an API key.

### Plan workspace
- Event title/date/guest count/budget summary.
- Four clearly labeled sections.
- Provenance labels for estimates and confirmed-by-user values.
- Clear over-budget status and task status.
- Loading, empty, error and success states.

### Change review
For each change show:
- Item and field affected.
- Before value and proposed value.
- Reason and assumptions.
- Impact on budget or schedule.
- Accept / Reject controls.
- Locked items indicated and not silently modified.

### AI unavailable
- Keep the current plan usable.
- Show a non-blocking explanation.
- Offer template suggestions / retry action.
- Do not clear or duplicate user data.

## 4. Accessibility requirements
- Logical heading hierarchy and landmarks.
- Keyboard-operable tabs and controls.
- Visible focus indicator.
- Every form control has a label.
- Errors are announced and linked to fields.
- Do not communicate status by color alone.
- Respect reduced-motion preference.
- Dialog/drawer traps and restores focus correctly if used.

## 5. Mobile behavior
- Stack plan sections vertically.
- Keep key budget and date summary visible without horizontal scrolling.
- Change review becomes a full-width panel or dialog.
- Buttons have adequate touch targets.
- Tables convert to stacked rows/cards when needed.

## 6. Error paths
- Invalid form input: inline correction.
- AI timeout/rate limit: preserve plan and offer fallback.
- Invalid AI schema: reject response and use fallback.
- Dependency cycle: show which tasks cause conflict.
- Storage failure: show warning and allow session-only use.
- Reset: confirm destructive reset and then show empty/sample state.

## 7. Demo script (90–120 seconds)
1. Start from sample wedding/birthday plan.
2. Show budget, timeline, vendor checklist and ideas.
3. Change guest count.
4. Show deterministic budget impact and before/after changes.
5. Reject one suggestion and accept another.
6. Demonstrate locked item remains unchanged.
7. Briefly show provenance labels and fallback if AI is unavailable.
