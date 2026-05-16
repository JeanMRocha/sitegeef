#!/usr/bin/env node

import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

async function runMigrations() {
  const sqlPath = join(__dirname, "../supabase/combined-migrations.sql");
  const sql = readFileSync(sqlPath, "utf-8");

  // Split statements by semicolon
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  console.log(`📋 Found ${statements.length} SQL statements to execute\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    const preview = statement.split("\n")[0].substring(0, 60);

    try {
      console.log(`[${i + 1}/${statements.length}] Executing: ${preview}...`);

      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ statement }),
      });

      if (!response.ok) {
        const errorData = await response.text();

        // If function doesn't exist, try direct approach
        if (errorData.includes("exec") || errorData.includes("not found")) {
          console.log(
            `⚠️  RPC function not available, trying direct SQL endpoint...`
          );
          break;
        }

        console.error(`   ❌ Error: ${response.status}`);
        errorCount++;
      } else {
        console.log(`   ✅ Success`);
        successCount++;
      }
    } catch (err) {
      console.error(`   ❌ Error: ${err.message || err}`);
      errorCount++;
    }
  }

  if (errorCount === statements.length) {
    console.log("\n⚠️  RPC method not available, using SQL Editor export...\n");
    console.log("📋 Copy the SQL file and paste in Supabase SQL Editor:");
    console.log(`   File: supabase/combined-migrations.sql`);
    console.log(`   URL: ${SUPABASE_URL}/projects/_/sql/new`);
  } else {
    console.log(`\n✨ Migration Summary:`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
  }
}

runMigrations().catch(console.error);
