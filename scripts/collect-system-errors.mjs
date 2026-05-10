#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname } from "node:path";

const ingestUrl = process.env.GEEF_LOG_INGEST_URL;
const ingestToken = process.env.GEEF_LOG_INGEST_TOKEN;
const source = process.env.GEEF_LOG_SOURCE || "vpsgeef";
const stateFile = process.env.GEEF_LOG_STATE_FILE || "/var/lib/sitegeef/system-error-collector.state.json";
const lookbackMinutes = Number(process.env.GEEF_LOG_LOOKBACK_MINUTES || "15");
const maxEntries = Number(process.env.GEEF_LOG_MAX_ENTRIES || "100");

if (!ingestUrl) fail("Missing GEEF_LOG_INGEST_URL.");
if (!ingestToken) fail("Missing GEEF_LOG_INGEST_TOKEN.");

const state = readState(stateFile);
const since = state.lastRealtimeIso || new Date(Date.now() - lookbackMinutes * 60 * 1000).toISOString();

const output = run("journalctl", [
  "--utc",
  "--no-pager",
  "--output",
  "json",
  "-p",
  "err..alert",
  "--since",
  since,
]);

const entries = parseJournalEntries(output).slice(0, maxEntries);
let lastRealtimeIso = state.lastRealtimeIso || since;
let sent = 0;

for (const entry of entries) {
  const payload = buildPayload(entry);
  if (!payload.message) continue;

  const response = await fetch(ingestUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ingestToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    fail(`Ingest failed: ${response.status} ${response.statusText}\n${text}`);
  }

  sent += 1;
  if (payload.happened_at > lastRealtimeIso) {
    lastRealtimeIso = payload.happened_at;
  }
}

writeState(stateFile, {
  lastRealtimeIso,
  updatedAt: new Date().toISOString(),
  lastSentCount: sent,
});

console.log(JSON.stringify({ ok: true, sent, lastRealtimeIso }, null, 2));

function run(command, args) {
  try {
    return execFileSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch (error) {
    const stderr = error?.stderr?.toString?.().trim() || "";
    if (stderr) {
      fail(stderr);
    }
    fail(error?.message || `Failed running ${command}`);
  }
}

function parseJournalEntries(input) {
  if (!input) return [];

  return input
    .split("\n")
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .filter((entry) => entry.MESSAGE);
}

function buildPayload(entry) {
  const happenedAt = toIso(entry.__REALTIME_TIMESTAMP);
  const priority = String(entry.PRIORITY ?? "");
  const level = priorityToLevel(priority);
  const unit = entry._SYSTEMD_UNIT || entry.SYSLOG_IDENTIFIER || entry._COMM || "system";
  const message = String(entry.MESSAGE || "").trim();

  return {
    source,
    event_type: "log",
    level,
    message,
    happened_at: happenedAt,
    payload: {
      unit,
      priority,
      identifier: entry.SYSLOG_IDENTIFIER || null,
      comm: entry._COMM || null,
      pid: entry._PID ? Number(entry._PID) : null,
      executable: entry._EXE || null,
      boot_id: entry._BOOT_ID || null,
      transport: entry._TRANSPORT || null,
      hostname: entry._HOSTNAME || null,
      journal_cursor: entry.__CURSOR || null,
      raw: {
        message,
        unit,
      },
    },
  };
}

function priorityToLevel(priority) {
  switch (priority) {
    case "0":
    case "1":
      return "error";
    case "2":
      return "warn";
    case "3":
    case "4":
      return "info";
    default:
      return "error";
  }
}

function toIso(value) {
  if (!value) return new Date().toISOString();

  const raw = String(value);
  if (/^\d+$/.test(raw)) {
    const millis = Number(raw.length > 13 ? Number(raw) / 1000 : Number(raw));
    return new Date(millis).toISOString();
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

function readState(file) {
  try {
    if (!existsSync(file)) return {};
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return {};
  }
}

function writeState(file, state) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
