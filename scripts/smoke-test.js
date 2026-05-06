#!/usr/bin/env node

/**
 * Smoke test script for ScamRadar production deployment
 * Run after deployment: node scripts/smoke-test.js
 */

const API_URL = process.env.API_URL || "http://localhost:3000";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

async function testEndpoint(name, url, method = "GET") {
  try {
    const res = await fetch(url, { method });
    if (res.ok) {
      console.log(`✓ ${name}: ${res.status}`);
      return true;
    } else {
      console.log(`✗ ${name}: ${res.status}`);
      return false;
    }
  } catch (err) {
    console.log(`✗ ${name}: ${err.message}`);
    return false;
  }
}

async function runSmokeTests() {
  console.log(`\n🏭 Running smoke tests against ${API_URL}\n`);

  const tests = [
    ["Health check", `${API_URL}/health`],
    ["API health", `${API_URL}/api/health`],
    ["Scams list", `${API_URL}/api/scams`],
    ["Categories", `${API_URL}/api/categories`],
    ["Scam detail", `${API_URL}/api/scams/phishing-email-scam`],
    ["Search scams", `${API_URL}/api/scams/search?q=email`],
    ["Submit report", `${API_URL}/api/reports`, "POST"],
  ];

  let passed = 0;
  let failed = 0;

  for (const [name, url, method] of tests) {
    const result = await testEndpoint(name, url, method || "GET");
    if (result) passed++;
    else failed++;
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runSmokeTests().catch(console.error);
