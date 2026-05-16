#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const modules = [
  "public",
  "auth",
  "dashboard",
  "biblioteca",
  "documentos",
  "pessoas",
  "funcoes",
  "escalas",
  "theme",
  "supabase",
];

const rootDir = resolve(process.cwd());
const agentLint = resolve(rootDir, "scripts/agent-lint.mjs");
const outputFile = resolve(rootDir, "agent-map.json");

const map = {
  generatedAt: new Date().toISOString(),
  source: "scripts/agent-lint.mjs",
  modules: {},
};

for (const moduleName of modules) {
  const raw = execFileSync(process.execPath, [agentLint, "--json", moduleName], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  map.modules[moduleName] = JSON.parse(raw);
}

writeFileSync(outputFile, `${JSON.stringify(map, null, 2)}\n`, "utf8");

console.log(`agent-map written to ${outputFile}`);
