# VERCEL DEPLOYMENT CONFIGURATION & GUIDE
**Project:** EventPilot — The Living Plan  
**Repository:** https://github.com/P-mohith230/Event_Planner-ai  

---

## 1. Quick Deploy to Vercel

1. Log into your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** $\rightarrow$ **Project**.
3. Import the repository: `P-mohith230/Event_Planner-ai`.
4. In the Project Configuration:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `./`
   - **Build Command:** `pnpm run build` (or leave default `next build`)
   - **Output Directory:** `.next`
   - **Install Command:** `pnpm install`

---

## 2. Environment Variables Configuration

Under **Settings** $\rightarrow$ **Environment Variables**, add the following keys for **Production**, **Preview**, and **Development**:

| Variable Name | Required? | Example Value | Purpose |
| :--- | :---: | :--- | :--- |
| `GEMINI_API_KEY` | **Required** | `AQ.Ab8RN6...` | Google Gemini API Key used by server routes |
| `GEMINI_MODEL` | Optional | `gemini-3.5-flash-lite` | Model identifier (defaults to `gemini-3.5-flash-lite`) |

> **Security Note:** `GEMINI_API_KEY` is strictly accessed server-side via Node runtime. It is never exposed in the client-side JavaScript bundle or browser network requests.

---

## 3. Deployment Artifacts Included

- `vercel.json`: Specifies framework, install, and build settings.
- `next.config.mjs`: Configured with production security headers:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- Guaranteed deterministic fallback: Even if the API key is not configured in preview builds, the application seamlessly runs using its zero-dependency offline calculation and template engine without throwing errors.

