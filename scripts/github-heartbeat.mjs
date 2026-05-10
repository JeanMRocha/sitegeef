#!/usr/bin/env node

const supabaseUrl = process.env.GEEF_SUPABASE_URL?.trim();
const serviceRoleKey = process.env.GEEF_SUPABASE_SERVICE_ROLE_KEY?.trim();
const source = process.env.GEEF_GITHUB_HEARTBEAT_SOURCE || "github-actions";
const eventType = "heartbeat";
const level = process.env.GEEF_GITHUB_HEARTBEAT_LEVEL || "info";
const message = process.env.GEEF_GITHUB_HEARTBEAT_MESSAGE || "GitHub Actions heartbeat";

if (!supabaseUrl) fail("Missing GEEF_SUPABASE_URL.");
if (!serviceRoleKey) fail("Missing GEEF_SUPABASE_SERVICE_ROLE_KEY.");

const payload = {
  source,
  event_type: eventType,
  level,
  message,
  happened_at: new Date().toISOString(),
  payload: {
    repository: process.env.GITHUB_REPOSITORY || null,
    branch: process.env.GITHUB_REF_NAME || null,
    sha: process.env.GITHUB_SHA || null,
    run_id: process.env.GITHUB_RUN_ID || null,
    run_number: process.env.GITHUB_RUN_NUMBER || null,
    workflow: process.env.GITHUB_WORKFLOW || null,
    actor: process.env.GITHUB_ACTOR || null,
  },
};

const baseUrl = normalizeBaseUrl(supabaseUrl);

const response = await fetch(`${baseUrl}/rest/v1/ops_events`, {
  method: "POST",
  headers: {
    apikey: serviceRoleKey,
    authorization: `Bearer ${serviceRoleKey}`,
    "content-type": "application/json",
    prefer: "return=representation",
  },
  body: JSON.stringify(payload),
});

if (!response.ok) {
  const text = await response.text();
  fail(`Heartbeat ingest failed: ${response.status} ${response.statusText}\n${text}`);
}

const data = await response.json();
console.log(JSON.stringify({ ok: true, inserted: Array.isArray(data) ? data.length : 0 }, null, 2));

function fail(message) {
  console.error(message);
  process.exit(1);
}

function normalizeBaseUrl(value) {
  if (!value) {
    fail("Missing GEEF_SUPABASE_URL.");
  }

  let parsed;

  try {
    parsed = new URL(value);
  } catch {
    fail(`Invalid GEEF_SUPABASE_URL: ${value}`);
  }

  if (parsed.protocol !== "https:") {
    fail("GEEF_SUPABASE_URL must use https.");
  }

  return `${parsed.protocol}//${parsed.host}${parsed.pathname}`.replace(/\/+$/, "");
}
