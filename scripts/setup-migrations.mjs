#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";
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

// Save to temp file for clipboard
const tempPath = join(__dirname, "../.sql-temp.txt");
writeFileSync(tempPath, sql);

console.log("📋 GEEF Migrations Setup\n");
console.log("✅ SQL file created: .sql-temp.txt\n");

const sqlEditorUrl = `https://supabase.com/dashboard/project/${PROJECT_ID}/sql/new`;

console.log("🌐 Opening Supabase SQL Editor...\n");

const openCommand =
  process.platform === "win32"
    ? `start ${sqlEditorUrl}`
    : process.platform === "darwin"
      ? `open "${sqlEditorUrl}"`
      : `xdg-open "${sqlEditorUrl}"`;

exec(openCommand, (err) => {
  if (err) {
    console.log("📋 Open this URL in your browser:");
    console.log(`   ${sqlEditorUrl}`);
  }
});

console.log("📝 MANUAL SETUP STEPS:\n");
console.log("1. Arquivo com SQL está em: supabase/combined-migrations.sql");
console.log("2. Abra o link acima (Supabase SQL Editor)");
console.log("3. Cole todo o conteúdo do arquivo na editor");
console.log("4. Clique no botão 'Run'");
console.log("5. Pronto! ✨\n");

// Also show the SQL content for reference
console.log("─".repeat(70));
console.log("📄 SQL Content Preview (primeiras 20 linhas):\n");
const lines = sql.split("\n").slice(0, 20);
lines.forEach((line) => console.log(line));
console.log("...\n");
console.log("─".repeat(70));
console.log(
  "\n💡 Dica: Se você tiver psql instalado, pode rodar:"
);
console.log("   psql postgresql://postgres:<SERVICE_KEY>@db.nycgpokqlmrfzegjlrwa.supabase.co:5432/postgres -f supabase/combined-migrations.sql\n");
