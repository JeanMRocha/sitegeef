#!/usr/bin/env node

/**
 * GEEF Custom Migrations Runner
 * Applies all migrations from supabase/migrations directory
 * Using PostgreSQL connection via pg library
 */

import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

const PROJECT_ID = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(
  /https:\/\/(\w+)\.supabase/
)?.[1];
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!PROJECT_ID || !SERVICE_ROLE_KEY || !SUPABASE_URL) {
  console.error(
    "❌ Missing Supabase credentials in .env"
  );
  process.exit(1);
}

async function applyMigrations() {
  console.log("🚀 GEEF Migrations Runner\n");
  console.log(`📍 Project: ${PROJECT_ID}`);
  console.log(`🔗 URL: ${SUPABASE_URL}\n`);

  const migrationsDir = join(__dirname, "../supabase/migrations");
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  console.log(`📋 Found ${files.length} migration files:\n`);
  files.forEach((f, i) => console.log(`   ${i + 1}. ${f}`));
  console.log();

  const pool = new pg.Pool({
    host: `db.${PROJECT_ID}.supabase.co`,
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: SERVICE_ROLE_KEY,
    ssl: { rejectUnauthorized: false },
  });

  let client;
  try {
    console.log("🔗 Connecting to database...");
    client = await pool.connect();
    console.log("✅ Connected!\n");

    // Read combined migrations file
    const combinedPath = join(__dirname, "../supabase/combined-migrations.sql");
    const combinedSQL = readFileSync(combinedPath, "utf-8");

    // Split into statements and execute
    const statements = combinedSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    console.log(`▶️  Executing ${statements.length} SQL statements...\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      const preview = stmt.split("\n")[0].substring(0, 60);

      try {
        await client.query(stmt);
        console.log(`[${i + 1}/${statements.length}] ✅ ${preview}...`);
        successCount++;
      } catch (err) {
        // Ignore "already exists" errors
        if (err.code === "42P7" || err.code === "42710") {
          console.log(
            `[${i + 1}/${statements.length}] ℹ️  ${preview}... (already exists)`
          );
          successCount++;
        } else {
          console.error(`[${i + 1}/${statements.length}] ❌ Error: ${err.message}`);
          errorCount++;
        }
      }
    }

    console.log(
      `\n✨ Migration Summary:\n   ✅ Success: ${successCount}\n   ❌ Errors: ${errorCount}\n`
    );

    if (errorCount === 0) {
      console.log("🎉 All migrations applied successfully!");
    }
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
    console.error(
      "\n📋 To apply migrations manually:\n"
    );
    console.log("1. Visit: https://app.supabase.com/project/" + PROJECT_ID + "/sql/new");
    console.log("2. Open file: supabase/combined-migrations.sql");
    console.log("3. Copy all content and paste in SQL Editor");
    console.log("4. Click 'Run'\n");
    process.exit(1);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

applyMigrations().catch(console.error);
