import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const defaultBaseUrl = process.env.QA_BASE_URL || "https://cybershield-backend-inx9.onrender.com";
const timeoutMs = Number(process.env.QA_TIMEOUT_MS) || 20000;

const withTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

const runCase = async ({ area, scenario, method = "GET", route, expectedStatuses, body, headers = {} }) => {
  const startedAt = Date.now();
  try {
    const response = await withTimeout(`${defaultBaseUrl}${route}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const durationMs = Date.now() - startedAt;
    const status = response.status;
    const pass = expectedStatuses.includes(status);

    return {
      area,
      scenario,
      method,
      route,
      expected: expectedStatuses.join("/"),
      status,
      pass,
      durationMs,
      note: pass ? "OK" : `Unexpected status ${status}`
    };
  } catch (error) {
    return {
      area,
      scenario,
      method,
      route,
      expected: expectedStatuses.join("/"),
      status: "ERR",
      pass: false,
      durationMs: Date.now() - startedAt,
      note: error?.name === "AbortError" ? "Timeout" : (error?.message || "Request failed")
    };
  }
};

const toMarkdown = (results) => {
  const lines = [
    "# QA Smoke Report",
    "",
    `- Date: ${new Date().toISOString()}`,
    `- Base URL: ${defaultBaseUrl}`,
    `- Timeout per request: ${timeoutMs}ms`,
    "",
    "| Area | Scenario | Method | Route | Expected | Actual | Result | Notes |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |"
  ];

  for (const item of results) {
    lines.push(
      `| ${item.area} | ${item.scenario} | ${item.method} | ${item.route} | ${item.expected} | ${item.status} | ${item.pass ? "PASS" : "FAIL"} | ${item.note} |`
    );
  }

  const passCount = results.filter((r) => r.pass).length;
  const failCount = results.length - passCount;
  lines.push("");
  lines.push(`- Summary: ${passCount} passed, ${failCount} failed, ${results.length} total`);
  lines.push("- Scope: guest/failure API smoke only. Full user/admin UI flow remains manual via docs/qa-checklist.md.");

  return lines.join("\n");
};

const cases = [
  {
    area: "Guest",
    scenario: "System health",
    route: "/api/system/health",
    expectedStatuses: [200]
  },
  {
    area: "Guest",
    scenario: "System version",
    route: "/api/system/version",
    expectedStatuses: [200]
  },
  {
    area: "Guest",
    scenario: "Public reports feed",
    route: "/api/reports?page=1&limit=5",
    expectedStatuses: [200]
  },
  {
    area: "Guest",
    scenario: "Public articles feed",
    route: "/api/articles",
    expectedStatuses: [200]
  },
  {
    area: "Guest",
    scenario: "Public forum feed",
    route: "/api/forum?page=1&limit=5",
    expectedStatuses: [200]
  },
  {
    area: "Guest",
    scenario: "AI prediction",
    method: "POST",
    route: "/api/ai/predict",
    body: {
      text: "You won a prize, click this suspicious link now"
    },
    expectedStatuses: [200]
  },
  {
    area: "Failure",
    scenario: "Invalid token on protected route",
    route: "/api/users/profile",
    headers: {
      Authorization: "Bearer invalid-token"
    },
    expectedStatuses: [401, 403]
  },
  {
    area: "Failure",
    scenario: "Empty login payload",
    method: "POST",
    route: "/api/auth/login",
    body: {},
    expectedStatuses: [400]
  },
  {
    area: "Failure",
    scenario: "Empty AI payload",
    method: "POST",
    route: "/api/ai/predict",
    body: {},
    expectedStatuses: [400]
  }
];

const main = async () => {
  console.log(`[QA] Running smoke suite against ${defaultBaseUrl}`);
  const results = [];

  for (const testCase of cases) {
    const result = await runCase(testCase);
    results.push(result);
    console.log(`[QA] ${result.pass ? "PASS" : "FAIL"} ${result.method} ${result.route} -> ${result.status}`);
  }

  const markdown = toMarkdown(results);
  const outputPath = path.resolve(__dirname, "../../../docs/qa-report.md");
  await fs.writeFile(outputPath, markdown, "utf8");

  const failed = results.filter((r) => !r.pass).length;
  console.log(`[QA] Report written to docs/qa-report.md`);
  console.log(`[QA] Result: ${results.length - failed} passed, ${failed} failed`);

  if (failed > 0) {
    process.exitCode = 1;
  }
};

main().catch((error) => {
  console.error("[QA] Fatal error:", error?.message || error);
  process.exit(1);
});
