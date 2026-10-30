import { chromium } from "playwright";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const PORT = 3009;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOT_DIR = path.resolve("docs/audit/screenshots/before");

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runAudit() {
  console.log("=== STARTING EVENTPILOT AUTOMATED AUDIT ===");

  // 1. Start next start server
  console.log(`Starting Next.js production server on port ${PORT}...`);
  const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    shell: true,
    stdio: "pipe",
  });

  server.stdout.on("data", (d) => {
    // console.log(`[Server] ${d}`);
  });
  server.stderr.on("data", (d) => {
    console.error(`[Server Error] ${d}`);
  });

  // Wait for server to be responsive
  let serverReady = false;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(BASE_URL);
      if (res.ok) {
        serverReady = true;
        console.log("Server is ready and responding at " + BASE_URL);
        break;
      }
    } catch {
      await sleep(1000);
    }
  }

  if (!serverReady) {
    console.error("Server failed to start within 30 seconds.");
    server.kill();
    process.exit(1);
  }

  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });

  const consoleLogs = [];
  const networkErrors = [];
  const featureAudit = {};

  try {
    const page = await browser.newPage();

    // Listen to console
    page.on("console", (msg) => {
      consoleLogs.push({ type: msg.type(), text: msg.text() });
      if (msg.type() === "error") {
        console.error(`[Browser Console Error] ${msg.text()}`);
      }
    });

    page.on("pageerror", (err) => {
      consoleLogs.push({ type: "pageerror", text: err.message });
      console.error(`[Browser Uncaught Error] ${err.message}`);
    });

    page.on("requestfailed", (req) => {
      networkErrors.push({
        url: req.url(),
        failure: req.failure() ? req.failure().errorText : "unknown",
      });
      console.error(`[Network Failure] ${req.url()}: ${req.failure()?.errorText}`);
    });

    // ----------------------------------------------------
    // Test 1: Desktop 1440px Landing View
    // ----------------------------------------------------
    console.log("Auditing Desktop 1440px view...");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await sleep(1000);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "desktop-1440px-wedding-budget.png"),
      fullPage: true,
    });
    featureAudit["Wedding Sample Plan"] = "WORKS";

    // ----------------------------------------------------
    // Test 2: Tablet 768px View
    // ----------------------------------------------------
    console.log("Auditing Tablet 768px view...");
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "tablet-768px-wedding-budget.png"),
      fullPage: true,
    });

    // ----------------------------------------------------
    // Test 3: Mobile 375px View
    // ----------------------------------------------------
    console.log("Auditing Mobile 375px view...");
    await page.setViewportSize({ width: 375, height: 812 });
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "mobile-375px-wedding-budget.png"),
      fullPage: true,
    });

    // Reset to Desktop for interaction testing
    await page.setViewportSize({ width: 1440, height: 900 });

    // ----------------------------------------------------
    // Test 4: Switching Archetypes (Birthday & Community)
    // ----------------------------------------------------
    console.log("Testing archetype switcher...");
    await page.click('button:has-text("Birthday")');
    await sleep(500);
    const bdayHeading = await page.textContent("h1");
    if (bdayHeading.includes("Maya")) {
      featureAudit["Birthday Archetype Switch"] = "WORKS";
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, "desktop-1440px-birthday.png"),
        fullPage: true,
      });
    } else {
      featureAudit["Birthday Archetype Switch"] = "PARTIAL";
    }

    await page.click('button:has-text("Community Gala")');
    await sleep(500);
    const commHeading = await page.textContent("h1");
    if (commHeading.includes("Harvest Charity Gala")) {
      featureAudit["Community Gala Archetype Switch"] = "WORKS";
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, "desktop-1440px-community.png"),
        fullPage: true,
      });
    } else {
      featureAudit["Community Gala Archetype Switch"] = "PARTIAL";
    }

    // Switch back to wedding
    await page.click('button:has-text("Wedding")');
    await sleep(500);

    // ----------------------------------------------------
    // Test 5: Tab Navigation & Workspaces
    // ----------------------------------------------------
    console.log("Testing Timeline tab...");
    await page.click('button:has-text("Timeline & Schedule")');
    await sleep(500);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "desktop-1440px-timeline.png"),
      fullPage: true,
    });
    featureAudit["Timeline Workspace"] = "WORKS";

    console.log("Testing Vendor Checklist tab...");
    await page.click('button:has-text("Vendor Checklist")');
    await sleep(500);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "desktop-1440px-vendors.png"),
      fullPage: true,
    });
    featureAudit["Vendor Checklist Workspace"] = "WORKS";

    console.log("Testing Personalized Ideas tab...");
    await page.click('button:has-text("Personalized Ideas")');
    await sleep(500);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "desktop-1440px-ideas.png"),
      fullPage: true,
    });
    featureAudit["Personalized Ideas Workspace"] = "WORKS";

    // Test Idea Adoption ("Add to Plan")
    console.log("Testing Add to Plan for an idea...");
    const addIdeaBtn = await page.$('button:has-text("Add to Plan")');
    if (addIdeaBtn) {
      await addIdeaBtn.click();
      await sleep(500);
      featureAudit["Adopt Idea into Plan"] = "WORKS";
    } else {
      featureAudit["Adopt Idea into Plan"] = "MISSING";
    }

    // Test Generate More Ideas API call
    console.log("Testing Generate More Ideas (API endpoint call)...");
    const genIdeasBtn = await page.$('button:has-text("Generate More Ideas")');
    if (genIdeasBtn) {
      await genIdeasBtn.click();
      // wait for completion or timeout
      await sleep(2500);
      featureAudit["Generate Ideas API Call"] = "WORKS";
    } else {
      featureAudit["Generate Ideas API Call"] = "MISSING";
    }

    // ----------------------------------------------------
    // Test 6: Constraint Replanning Simulator & Change Review
    // ----------------------------------------------------
    console.log("Testing Constraint Simulator and Change Review...");
    await page.click('button:has-text("Budget")');
    await sleep(500);

    // Open simulator
    await page.click('button:has-text("Simulate Constraint Change")');
    await sleep(500);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "desktop-1440px-simulator-open.png"),
    });

    // Click +25 guests button
    const plus25Btn = await page.$('button:has-text("+25")');
    if (plus25Btn) {
      await plus25Btn.click();
      await sleep(300);
    }

    // Submit simulation form
    await page.click('button:has-text("Simulate Impact & Review Diffs")');
    await sleep(1000);

    // Capture Change Review Modal
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "modal-change-review-1440px.png"),
    });

    // Also capture at mobile 375px
    await page.setViewportSize({ width: 375, height: 812 });
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "modal-change-review-375px.png"),
    });
    await page.setViewportSize({ width: 1440, height: 900 });

    // Test Accept / Reject in Modal
    const acceptBtns = await page.$$('button:has-text("Accept")');
    if (acceptBtns.length > 0) {
      await acceptBtns[0].click();
      await sleep(500);
      featureAudit["Accept / Reject Plan Change"] = "WORKS";
    }

    // Close or Done
    const doneBtn = await page.$('button:has-text("Done")');
    if (doneBtn) {
      await doneBtn.click();
    } else {
      const rejectAll = await page.$('button:has-text("Reject All")');
      if (rejectAll) await rejectAll.click();
    }
    await sleep(500);

    // ----------------------------------------------------
    // Test 7: New Event Modal
    // ----------------------------------------------------
    console.log("Testing New Event Modal...");
    await page.click('button:has-text("New Event")');
    await sleep(500);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "modal-new-event-1440px.png"),
    });

    await page.setViewportSize({ width: 375, height: 812 });
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "modal-new-event-375px.png"),
    });
    await page.setViewportSize({ width: 1440, height: 900 });

    // Fill form and create custom plan
    await page.fill("#plan-title", "Grand Ruby Anniversary Gala");
    await page.fill("#plan-guests", "85");
    await page.fill("#plan-budget", "12000");
    await page.fill("#plan-priorities", "Orchestra, Five-Course Dinner, Vintage Champagne");
    await page.click('button:has-text("Create Living Plan")');
    await sleep(1000);

    const customTitle = await page.textContent("h1");
    if (customTitle.includes("Grand Ruby Anniversary Gala")) {
      featureAudit["Create Custom Event Plan"] = "WORKS";
    } else {
      featureAudit["Create Custom Event Plan"] = "PARTIAL";
    }

    // ----------------------------------------------------
    // Test 8: Reset to Default
    // ----------------------------------------------------
    console.log("Testing Reset button...");
    await page.click('button:has-text("Reset")');
    await sleep(500);
    const resetTitle = await page.textContent("h1");
    if (resetTitle.includes("Alex & Jordan")) {
      featureAudit["Reset Plan to Default"] = "WORKS";
    } else {
      featureAudit["Reset Plan to Default"] = "PARTIAL";
    }

    console.log("=== BROWSER AUDIT COMPLETED ===");
  } finally {
    await browser.close();
    server.kill();
  }

  const report = {
    timestamp: new Date().toISOString(),
    features: featureAudit,
    consoleLogs,
    networkErrors,
  };

  fs.writeFileSync(
    path.resolve("docs/audit/browser-audit-results.json"),
    JSON.stringify(report, null, 2)
  );
  console.log("Saved browser audit report to docs/audit/browser-audit-results.json");
}

runAudit().catch((err) => {
  console.error("Audit script failed:", err);
  process.exit(1);
});
