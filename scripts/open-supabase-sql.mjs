#!/usr/bin/env node

import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import * as dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!SUPABASE_URL) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL");
  process.exit(1);
}

// Extract project ID from URL
const projectId = SUPABASE_URL.match(/https:\/\/(\w+)\.supabase\.co/)?.[1];

if (!projectId) {
  console.error("❌ Could not extract project ID from Supabase URL");
  process.exit(1);
}

const sqlPath = join(__dirname, "../supabase/combined-migrations.sql");
const sql = readFileSync(sqlPath, "utf-8");

// Open file in VS Code
console.log("📂 Opening migrations file in VS Code...");
exec(`code "${sqlPath}"`, (err) => {
  if (err) {
    console.warn("⚠️  Could not open VS Code, showing file path instead:");
    console.log(`   ${sqlPath}`);
  }
});

// Open Supabase SQL Editor
const sqlEditorUrl = `https://supabase.com/dashboard/project/${projectId}/sql/new`;

console.log("\n🌐 Opening Supabase SQL Editor...");
console.log(`   ${sqlEditorUrl}`);

const openCommand =
  process.platform === "win32"
    ? `start ${sqlEditorUrl}`
    : process.platform === "darwin"
      ? `open "${sqlEditorUrl}"`
      : `xdg-open "${sqlEditorUrl}"`;

exec(openCommand, (err) => {
  if (err) {
    console.log("\n📋 Copy and paste this URL in your browser:");
    console.log(`   ${sqlEditorUrl}`);
  }
});

console.log("\n📝 INSTRUCTIONS:\n");
console.log("1. Copy the entire content of the file shown in VS Code");
console.log("2. Paste it in the Supabase SQL Editor that opens");
console.log("3. Click 'Run' button");
console.log("4. Done! ✅\n");
