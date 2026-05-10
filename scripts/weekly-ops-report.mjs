#!/usr/bin/env node

import { execFileSync } from "node:child_process";

const ingestUrl = process.env.GEEF_LOG_INGEST_URL;
const ingestToken = process.env.GEEF_LOG_INGEST_TOKEN;
const source = process.env.GEEF_LOG_SOURCE || "vpsgeef";

if (!ingestUrl) {
  fail("Missing GEEF_LOG_INGEST_URL.");
}

if (!ingestToken) {
  fail("Missing GEEF_LOG_INGEST_TOKEN.");
}

const windowEnd = new Date();
const windowStart = new Date(windowEnd.getTime() - 7 * 24 * 60 * 60 * 1000);

const siteStatus = run("systemctl", ["is-active", "sitegeef"]);
const tunnelStatus = run("systemctl", ["is-active", "sitegeef-tunnel"]);
const siteStatusLine = run("systemctl", ["--no-pager", "--full", "status", "sitegeef", "--lines=5"]);
const tunnelStatusLine = run("systemctl", ["--no-pager", "--full", "status", "sitegeef-tunnel", "--lines=5"]);
const siteJournal = run("journalctl", ["-u", "sitegeef", "--since", "7 days ago", "--no-pager"]);
const tunnelJournal = run("journalctl", ["-u", "sitegeef-tunnel", "--since", "7 days ago", "--no-pager"]);

const siteErrors = countMatches(siteJournal, /error|failed|exception/i);
const tunnelErrors = countMatches(tunnelJournal, /error|failed|exception/i);

const report = {
  source,
  event_type: "weekly_report",
  level: siteErrors > 0 || tunnelErrors > 0 ? "warn" : "info",
  message: "Weekly VPS report",
  happened_at: windowEnd.toISOString(),
  payload: {
    window_start: windowStart.toISOString(),
    window_end: windowEnd.toISOString(),
    statuses: {
      sitegeef: siteStatus || "unknown",
      sitegeef_tunnel: tunnelStatus || "unknown",
    },
    error_counts: {
      sitegeef: siteErrors,
      sitegeef_tunnel: tunnelErrors,
    },
    excerpts: {
      sitegeef: tail(siteStatusLine, 20),
      sitegeef_tunnel: tail(tunnelStatusLine, 20),
    },
  },
};

const response = await fetch(ingestUrl, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    authorization: `Bearer ${ingestToken}`,
  },
  body: JSON.stringify(report),
});

if (!response.ok) {
  const text = await response.text();
  fail(`Ingest failed: ${response.status} ${response.statusText}\n${text}`);
}

const output = await response.json();
console.log(JSON.stringify({ ok: true, response: output }, null, 2));

function run(command, args) {
  try {
    return execFileSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch {
    return "";
  }
}

function countMatches(input, pattern) {
  if (!input) {
    return 0;
  }

  return input.split("\n").filter((line) => pattern.test(line)).length;
}

function tail(input, maxLines) {
  if (!input) {
    return [];
  }

  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(-maxLines);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
