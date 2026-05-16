#!/usr/bin/env node

import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import * as dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

const PROJECT_ID = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(
  /https:\/\/(\w+)\.supabase/
)?.[1];

if (!PROJECT_ID) {
  console.error("❌ Missing PROJECT_ID");
  process.exit(1);
}

const sqlPath = join(__dirname, "../supabase/combined-migrations.sql");
const sql = readFileSync(sqlPath, "utf-8");

console.log("📋 GEEF Migrations - One-Click Setup\n");
console.log("🔄 Copying SQL to clipboard...");

// Copy to clipboard using PowerShell
const psCommand = `$('${sql.replace(/'/g, "''")}')|Set-Clipboard`;

exec(
  `powershell -Command "${psCommand}"`,
  { maxBuffer: 10 * 1024 * 1024 },
  (err) => {
    if (err) {
      console.error("❌ Could not copy to clipboard:", err.message);
      console.log("\n📝 SQL content (copy manually):");
      console.log(sql);
      process.exit(1);
    }

    console.log("✅ SQL copied to clipboard!\n");

    const sqlEditorUrl = `https://supabase.com/dashboard/project/${PROJECT_ID}/sql/new`;

    console.log("🌐 Opening Supabase SQL Editor...");
    console.log(`   ${sqlEditorUrl}\n`);

    const openCommand =
      process.platform === "win32"
        ? `start ${sqlEditorUrl}`
        : process.platform === "darwin"
          ? `open "${sqlEditorUrl}"`
          : `xdg-open "${sqlEditorUrl}"`;

    exec(openCommand, (err) => {
      if (err) {
        console.log("📋 Paste this URL in your browser:");
        console.log(`   ${sqlEditorUrl}`);
      }
    });

    console.log("📝 NEXT STEPS:\n");
    console.log("1. ✅ SQL is already in your clipboard");
    console.log("2. Click in the SQL Editor text area");
    console.log("3. Paste: Ctrl+V");
    console.log("4. Click 'Run' button");
    console.log("5. Done! ✨\n");
  }
);
