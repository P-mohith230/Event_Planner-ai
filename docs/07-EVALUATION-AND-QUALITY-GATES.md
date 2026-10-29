# 07 — Evaluation and Quality Gates
**Purpose:** Turn the six supplied evaluation dimensions into observable engineering checks. These are internal targets, not official scoring weights.

## 1. Code Quality
**Target:** maintainable, predictable and type-safe code.
- Run the repository's formatter/linter and type checker if configured.
- Remove avoidable warnings and dead code.
- Keep budget/scheduling logic in pure functions.
- Avoid giant components and duplicate state.
- Use consistent error handling.
**Evidence:** command output, tests, clean production build.

## 2. Security
**Target:** no known critical issue.
- API keys server-side only.
- No secrets committed or embedded in client assets.
- Validate inputs and AI outputs.
- Safe rendering of generated text.
- No unnecessary personal data collection.
- Review dependencies and deployment configuration.
**Evidence:** secret scan or manual review, dependency audit, API boundary tests.

## 3. Efficiency
**Target:** responsive core workflows and bounded provider use.
- Avoid duplicate requests and unlimited retries.
- Keep deterministic calculations local.
- Use small prompts and only required context.
- Handle loading/timeout/rate limit states.
**Evidence:** request count inspection, interaction smoke test, bounded timeout/retry configuration.

## 4. Testing
**Target:** all critical deterministic behavior covered.
- Budget totals and over-budget cases.
- Invalid inputs and currency formatting.
- Date boundaries and dependency cycles.
- Change diff, accept/reject and locked-item preservation.
- AI invalid response, timeout and provider failure.
- Core end-to-end flow.
**Evidence:** test report and documented coverage gaps.

## 5. Accessibility
**Target:** core journey usable with keyboard and assistive technology.
- Semantic landmarks/headings.
- Labels and inline error associations.
- Visible focus and logical focus order.
- Contrast and non-color status indicators.
- Responsive reflow and reduced motion.
**Evidence:** automated scan plus manual keyboard test.

## 6. Problem Statement Alignment
**Target:** all four required areas clearly demonstrated:
- Budget
- Timeline
- Vendor checklist
- Personalized ideas
**Evidence:** a short demo script and working UI, not just claims in README.

## Release gate
Do not claim “zero errors” based only on code inspection. Record:
- Commands executed and exit codes.
- Build/test/lint output.
- Console findings during defined user journeys.
- Essential network request failures.
- Security findings and resolution status.
- Known limitations and external provider failures.

## Official score uncertainty
The Challenge 3 screenshot is an example, not proof of Challenge 5's scoring weights. Do not reverse-engineer official weights from one example score. A top-10 position cannot be guaranteed.
