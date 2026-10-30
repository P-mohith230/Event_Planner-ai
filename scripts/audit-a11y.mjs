import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const PORT = 3010;
const BASE_URL = `http://localhost:${PORT}`;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runA11yAudit() {
  console.log("Starting Next.js production server for a11y audit...");
  const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    shell: true,
    stdio: "pipe",
  });

  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(BASE_URL);
      if (res.ok) break;
    } catch {
      await sleep(1000);
    }
  }

  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });

  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await sleep(1000);

  const results = {};

  // 1. Scan Main Landing View
  console.log("Scanning Main View...");
  const mainScan = await new AxeBuilder({ page }).analyze();
  results.mainView = {
    violationsCount: mainScan.violations.length,
    violations: mainScan.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.length,
      helpUrl: v.helpUrl,
    })),
  };

  // 2. Open Change Simulator and Change Review Modal
  console.log("Scanning Change Review Modal...");
  await page.click('button:has-text("Simulate Constraint Change")');
  await sleep(400);
  await page.click('button:has-text("+25")');
  await sleep(200);
  await page.click('button:has-text("Simulate Impact & Review Diffs")');
  await sleep(600);

  const modalScan = await new AxeBuilder({ page }).analyze();
  results.changeReviewModal = {
    violationsCount: modalScan.violations.length,
    violations: modalScan.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.length,
    })),
  };

  // Close modal
  await page.keyboard.press("Escape");
  await sleep(400);

  // 3. Open New Event Modal
  console.log("Scanning New Event Modal...");
  await page.click('button:has-text("New Event")');
  await sleep(400);

  const newEventScan = await new AxeBuilder({ page }).analyze();
  results.newEventModal = {
    violationsCount: newEventScan.violations.length,
    violations: newEventScan.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.length,
    })),
  };

  await browser.close();
  server.kill();

  fs.writeFileSync(
    path.resolve("docs/audit/axe-scan-results.json"),
    JSON.stringify(results, null, 2)
  );
  console.log("Saved a11y audit to docs/audit/axe-scan-results.json");
  console.log("Summary:", JSON.stringify({
    mainViewViolations: results.mainView.violationsCount,
    modalViolations: results.changeReviewModal.violationsCount,
    newEventModalViolations: results.newEventModal.violationsCount,
  }));
}

runA11yAudit().catch((e) => {
  console.error("A11y audit failed:", e);
  process.exit(1);
});
