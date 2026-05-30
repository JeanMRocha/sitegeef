#!/usr/bin/env node

import { spawn } from "node:child_process";

const OLLAMA_URL = process.env.AUTOREFLEX_OLLAMA_URL || "http://127.0.0.1:11434";

main().catch((error) => {
  console.error("[autoreflex:up] fatal:", error instanceof Error ? error.stack || error.message : String(error));
  process.exit(1);
});

async function main() {
  const ollamaReady = await probeHttp(`${OLLAMA_URL}/api/tags`, 2000);
  if (!ollamaReady) {
    console.error(`[autoreflex:up] Ollama nao esta respondendo em ${OLLAMA_URL}. Abra o Ollama primeiro e rode novamente.`);
    process.exit(1);
  }

  console.log(`[autoreflex:up] Ollama ok em ${OLLAMA_URL}`);

  await new Promise((resolve, reject) => {
    const child = spawn(getNpmCommand(), ["run", "autoreflex:serve"], {
      stdio: "inherit",
      windowsHide: true,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve(undefined);
        return;
      }
      reject(new Error(`autoreflex:serve saiu com code ${code}`));
    });
  });
}

async function probeHttp(url, timeoutMs = 2000) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch(url, { cache: "no-store", signal: controller.signal });
    clearTimeout(timer);
    return response.ok;
  } catch {
    return false;
  }
}

function getNpmCommand() {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}
