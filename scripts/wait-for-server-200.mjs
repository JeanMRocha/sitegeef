#!/usr/bin/env node

const targetUrl = process.env.SERVER_GATE_URL || "http://127.0.0.1:3500/";
const timeoutMs = Number(process.env.SERVER_GATE_TIMEOUT_MS || 90_000);
const intervalMs = Number(process.env.SERVER_GATE_INTERVAL_MS || 1000);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function probe() {
  try {
    const response = await fetch(targetUrl, { cache: "no-store" });
    return {
      ok: response.status === 200,
      status: response.status,
    };
  } catch (error) {
    return {
      ok: false,
      status: null,
      error,
    };
  }
}

async function main() {
  const startedAt = Date.now();
  let lastStatus = null;
  let lastError = null;

  while (Date.now() - startedAt < timeoutMs) {
    const result = await probe();

    if (result.ok) {
      console.log(`[gate] ${targetUrl} respondeu 200`);
      process.exit(0);
    }

    lastStatus = result.status;
    lastError = result.error ?? null;
    await sleep(intervalMs);
  }

  console.error(`[gate] timeout aguardando 200 em ${targetUrl}`);
  if (lastStatus !== null) {
    console.error(`[gate] último status: ${lastStatus}`);
  }
  if (lastError) {
    console.error(`[gate] último erro: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
  }

  process.exit(1);
}

void main();
