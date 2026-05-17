#!/usr/bin/env node

import { spawn } from "node:child_process";
import { watch } from "node:fs";
import { access, rm } from "node:fs/promises";
import path from "node:path";

const port = Number(process.env.PORT || 3500);
const url = `http://127.0.0.1:${port}`;
const restartDelayMs = 2500;
const healthIntervalMs = 5000;
const unhealthyThreshold = 3;
const startupGraceMs = 45_000;
const watchedRoots = ["app", "components", "lib", "styles", "public", "scripts"];
const watchedExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".css", ".md", ".svg"]);

let child = null;
let stopping = false;
let restartTimer = null;
let healthTimer = null;
let unhealthyCount = 0;
let startupDeadline = 0;
let restartReason = "startup";
let pendingFileRestart = null;
const watchers = [];

void bootstrap();

process.on("SIGINT", stop);
process.on("SIGTERM", stop);
process.on("exit", cleanupTimers);

async function bootstrap() {
  await resetNextArtifacts();
  await startDev("initial start");
  scheduleHealthCheck(true);
  await setupFileWatchers();
}

async function resetNextArtifacts() {
  try {
    await rm(".next", { recursive: true, force: true });
    console.log("[watchdog] cleared stale .next artifacts");
  } catch (error) {
    console.warn(
      `[watchdog] could not clear .next: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

async function startDev(reason) {
  cleanupChild();
  unhealthyCount = 0;
  startupDeadline = Date.now() + startupGraceMs;
  restartReason = reason;

  console.log(`[watchdog] starting dev server on ${url} (${reason})`);
  child = spawn("npm", ["run", "dev"], {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });

  child.on("exit", (code, signal) => {
    child = null;

    if (stopping) {
      return;
    }

    console.warn(
      `[watchdog] dev server exited (${signal || `code ${code ?? "unknown"}`}), restarting in ${restartDelayMs}ms`,
    );
    scheduleRestart("process exit");
  });
}

async function setupFileWatchers() {
  for (const root of watchedRoots) {
    try {
      await access(path.join(process.cwd(), root));
    } catch {
      continue;
    }

    try {
      const watcher = watch(
        root,
        { recursive: true },
        (eventType, filename) => {
          if (stopping) {
            return;
          }

          const normalized = filename ? filename.toString() : "";
          if (!normalized) {
            return;
          }

          const ext = path.extname(normalized).toLowerCase();
          if (!watchedExtensions.has(ext)) {
            return;
          }

          if (normalized.includes(".next") || normalized.includes("node_modules")) {
            return;
          }

          queueRestart(`file change: ${path.join(root, normalized)}`);
        },
      );

      watchers.push(watcher);
      console.log(`[watchdog] watching ${root}/`);
    } catch (error) {
      console.warn(`[watchdog] could not watch ${root}/: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

function queueRestart(reason) {
  restartReason = reason;

  if (pendingFileRestart) {
    clearTimeout(pendingFileRestart);
  }

  pendingFileRestart = setTimeout(() => {
    pendingFileRestart = null;
    if (stopping) {
      return;
    }

    console.warn(`[watchdog] restarting dev server (${restartReason})`);
    restartChild();
  }, 600);
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

function scheduleRestart(reason) {
  if (restartTimer) {
    clearTimeout(restartTimer);
  }

  console.log(`[watchdog] restart scheduled (${reason})`);
  restartTimer = setTimeout(() => {
    restartTimer = null;
    if (!stopping) {
      void startDev(reason);
    }
  }, restartDelayMs);
}

function restartChild() {
  if (!child) {
    void startDev("restart requested");
    return;
  }

  child.once("exit", () => {
    if (!stopping) {
      scheduleRestart("child exit");
    }
  });

  child.kill();
}

function stop() {
  stopping = true;
  cleanupTimers();
  cleanupWatchers();
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

  if (pendingFileRestart) {
    clearTimeout(pendingFileRestart);
    pendingFileRestart = null;
  }
}

function cleanupWatchers() {
  while (watchers.length > 0) {
    const watcher = watchers.pop();
    try {
      watcher?.close();
    } catch {
      // ignore
    }
  }
}

function cleanupChild() {
  if (child && !child.killed) {
    child.kill();
  }
  child = null;
}
