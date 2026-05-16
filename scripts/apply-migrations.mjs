#!/usr/bin/env node

import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

async function applyMigrations() {
  const dbHost = process.env.host || "db.nycgpokqlmrfzegjlrwa.supabase.co";
  const dbPort = parseInt(process.env.port || "5432");
  const dbName = process.env.database || "postgres";
  const dbUser = process.env.user || "postgres";
  const dbPassword = process.env.GEEF_SUPABASE_SECRET_KEY;

  if (!dbPassword) {
    console.error("❌ Missing database password (GEEF_SUPABASE_SECRET_KEY) in .env");
    process.exit(1);
  }

  const pool = new pg.Pool({
    host: dbHost,
    port: dbPort,
    database: dbName,
    user: dbUser,
    password: dbPassword,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log(`🔗 Connecting to PostgreSQL at ${dbHost}:${dbPort}...`);
    const client = await pool.connect();
    console.log("✅ Connected!");

    // Get all migration files
    const migrationsDir = join(__dirname, "../supabase/migrations");
    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    console.log(`\n📋 Found ${files.length} migration files\n`);

    for (const file of files) {
      const filePath = join(migrationsDir, file);
      const sql = readFileSync(filePath, "utf-8");

      console.log(`▶️  Applying: ${file}`);

      try {
        await client.query(sql);
        console.log(`✅ Applied: ${file}\n`);
      } catch (err) {
        console.error(`❌ Error in ${file}:`, err.message);
        console.error(`   Full error:`, err);
        console.log();
      }
    }

    client.release();
    console.log("✨ Migration process complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

applyMigrations();
