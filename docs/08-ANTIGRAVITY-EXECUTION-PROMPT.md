# 08 — Antigravity IDE Execution Prompt
Paste this prompt into Antigravity IDE after placing this package in the project repository.

---

You are the implementation engineer for **EventPilot — The Living Plan**, built for Google Prompt Wars Virtual Challenge 5: Celebration & Event Planner.

## First: inspect, do not overwrite
1. Inspect the entire existing repository, package manager, scripts, framework, routes, components, environment files, tests and current git diff.
2. Read `docs/00-RESEARCH-AND-INNOVATION.md` through `docs/07-EVALUATION-AND-QUALITY-GATES.md`.
3. Read the supplied challenge screenshots if they are available in the workspace.
4. Verify the official challenge rules, deadline, submission method, allowed stack and deployment constraints. If web access is unavailable, list the verification as blocked rather than inventing an answer.
5. Report the current baseline: build, lint, typecheck, tests, known console errors, network failures and warnings.
6. Create a concise implementation plan and identify files to change. Preserve existing working code.

## Product requirements
Implement a complete, polished, responsive event-planning workspace for weddings, birthdays and community events. It must cover:
- Budget with deterministic arithmetic
- Timeline and task dependencies appropriate to MVP
- Vendor checklist
- Personalized ideas
- Changes to guest count, event date and total budget
- Before/after change review with accept/reject
- Preservation of user-locked decisions
- Provenance labels distinguishing user-entered, AI estimate and confirmed-by-user
- Sample plan that works without an AI key

## Engineering constraints
- Use deterministic code for money math and date logic; never rely on an LLM for authoritative calculations.
- Use the existing repository's coherent stack unless a verified requirement requires change.
- If Gemini is used, call it from a server-side endpoint, validate its output, bound retries/timeouts and keep a deterministic fallback.
- Never expose API keys in frontend code, source control, logs or README.
- Do not fabricate vendors, quotes, prices, reviews, availability or external verification.
- Do not add authentication, database, marketplace or integrations unless the challenge requires them.
- Build incrementally. After each meaningful phase, run relevant tests and fix regressions before continuing.
- Use accessible semantic controls, visible focus, labeled fields and responsive layouts.

## Required workflow
A. Repository audit and baseline report.  
B. Data model and deterministic budget core.  
C. Event setup and sample plan with all four planning areas.  
D. Schedule/task logic and validation.  
E. Constraint change engine and review UI.  
F. Optional AI suggestions and failure handling.  
G. Accessibility and responsive polish.  
H. Full quality gate and deployment verification.

## Mandatory release checks
Run the actual commands found in the repository; do not assume script names. Verify formatter/linter, typecheck, tests and production build. Test the main flow in the browser. Inspect console and network activity. Fix all reproducible application errors and avoidable warnings. Test AI failure and missing-key behavior. Review secrets and dependency risks.

Target zero known blocking build errors, zero known application-console errors in tested core workflows, zero known failed essential requests in the test environment, zero avoidable warnings, and no unresolved critical security findings. Do not claim these targets are met unless the checks were actually run. Document external failures separately.

## Required reporting
At completion, provide:
1. Files changed and why.
2. Implemented features and deferred features.
3. Commands run and pass/fail outcomes.
4. Test coverage and untested areas.
5. Console/network findings.
6. Security and accessibility findings.
7. Deployment status and URL if actually deployed.
8. Remaining blockers and exact next actions.

Do not stop after creating a visually attractive mockup. The core workflow must function end to end. Do not promise or claim a Top 10 result.
