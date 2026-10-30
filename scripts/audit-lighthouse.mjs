import { spawn, execSync } from "child_process";
import fs from "fs";
import path from "path";

const PORT = 3011;
const URL = `http://localhost:${PORT}`;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runLighthouseAudit() {
  console.log("Starting Next.js production server for Lighthouse audit on port " + PORT);
  const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    shell: true,
    stdio: "pipe",
  });

  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(URL);
      if (res.ok) {
        console.log("Server is responsive at " + URL);
        break;
      }
    } catch {
      await sleep(1000);
    }
  }

  console.log("Running Lighthouse CLI audit...");
  const cmd = `npx lighthouse ${URL} --chrome-flags="--headless" --output=json --output-path=docs/audit/lighthouse-baseline.json --only-categories=performance,accessibility,best-practices,seo`;
  try {
    execSync(cmd, { stdio: "inherit" });
    console.log("Lighthouse audit completed!");
  } catch (err) {
    console.error("Lighthouse execution error:", err.message);
  } finally {
    server.kill();
  }

  if (fs.existsSync("docs/audit/lighthouse-baseline.json")) {
    const raw = JSON.parse(fs.readFileSync("docs/audit/lighthouse-baseline.json", "utf-8"));
    const scores = {
      performance: Math.round((raw.categories.performance?.score || 0) * 100),
      accessibility: Math.round((raw.categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((raw.categories["best-practices"]?.score || 0) * 100),
      seo: Math.round((raw.categories.seo?.score || 0) * 100),
    };
    console.log("=== LIGHTHOUSE SCORES ===", JSON.stringify(scores, null, 2));
    fs.writeFileSync("docs/audit/lighthouse-summary.json", JSON.stringify(scores, null, 2));
  }
}

runLighthouseAudit().catch((e) => {
  console.error("Lighthouse script error:", e);
  process.exit(1);
});
