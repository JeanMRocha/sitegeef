#!/usr/bin/env node

import { spawn } from "node:child_process";

const port = Number(process.env.PORT || 3500);
const url = `http://127.0.0.1:${port}`;
const restartDelayMs = 2500;
const healthIntervalMs = 5000;
const unhealthyThreshold = 3;

let child = null;
let stopping = false;
let restartTimer = null;
let healthTimer = null;
let unhealthyCount = 0;
let startupDeadline = 0;

startDev();
scheduleHealthCheck(true);

process.on("SIGINT", stop);
process.on("SIGTERM", stop);
process.on("exit", cleanupTimers);

async function startDev() {
  cleanupChild();
  unhealthyCount = 0;
  startupDeadline = Date.now() + 45_000;

  console.log(`[watchdog] starting dev server on ${url}`);
  child = spawn("npm", ["run", "dev"], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  child.on("exit", (code, signal) => {
    child = null;

    if (stopping) {
      return;
    }

    console.warn(
      `[watchdog] dev server exited (${signal || `code ${code ?? "unknown"}`}), restarting in ${restartDelayMs}ms`,
    );
    scheduleRestart();
  });
}

async function probeHealth() {
  if (stopping || !child) {
    return;
  }

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (response.ok) {
      unhealthyCount = 0;
      return;
    }
    throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    if (Date.now() < startupDeadline) {
      return;
    }

    unhealthyCount += 1;
    console.warn(
      `[watchdog] health check failed (${unhealthyCount}/${unhealthyThreshold}): ${error instanceof Error ? error.message : String(error)}`,
    );

    if (unhealthyCount >= unhealthyThreshold) {
      console.warn("[watchdog] restarting dev server after repeated health failures");
      unhealthyCount = 0;
      restartChild();
    }
  }
}

function scheduleHealthCheck(immediate = false) {
  if (healthTimer) {
    clearInterval(healthTimer);
  }

  if (immediate) {
    void probeHealth();
  }

  healthTimer = setInterval(() => {
    void probeHealth();
  }, healthIntervalMs);
}

function scheduleRestart() {
  if (restartTimer) {
    clearTimeout(restartTimer);
  }

  restartTimer = setTimeout(() => {
    restartTimer = null;
    if (!stopping) {
      void startDev();
    }
  }, restartDelayMs);
}

function restartChild() {
  if (!child) {
    void startDev();
    return;
  }

  child.once("exit", () => {
    if (!stopping) {
      scheduleRestart();
    }
  });

  child.kill();
}

function stop() {
  stopping = true;
  cleanupTimers();
  cleanupChild();
  process.exit(0);
}

function cleanupTimers() {
  if (restartTimer) {
    clearTimeout(restartTimer);
    restartTimer = null;
  }

  if (healthTimer) {
    clearInterval(healthTimer);
    healthTimer = null;
  }
}

function cleanupChild() {
  if (child && !child.killed) {
    child.kill();
  }
  child = null;
}
