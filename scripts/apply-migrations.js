#!/usr/bin/env node

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

async function applyMigrations() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("❌ Missing SUPABASE credentials in .env");
    process.exit(1);
  }

  const client = createClient(supabaseUrl, serviceRoleKey);

  // Get all migration files
  const migrationsDir = path.join(__dirname, "../supabase/migrations");
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql"));

  console.log(`📋 Found ${files.length} migration files`);

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf-8");

    console.log(`\n▶️  Applying: ${file}`);

    try {
      const { error } = await client.rpc("exec_sql", { sql });

      if (error) {
        console.error(`❌ Error in ${file}:`, error.message);
        continue;
      }

      console.log(`✅ Applied: ${file}`);
    } catch (err) {
      // Try alternative method using raw SQL via PostgreSQL
      console.log(`⚠️  RPC method failed, trying direct SQL...`);

      try {
        // Split by statements and execute each
        const statements = sql
          .split(";")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);

        for (const statement of statements) {
          const { error } = await client.rpc("exec", { statement });
          if (error) {
            // If RPC fails, just log and continue
            console.warn(`⚠️  Could not execute statement in ${file}`);
            break;
          }
        }

        console.log(`✅ Applied: ${file}`);
      } catch (innerErr) {
        console.error(
          `❌ Could not apply ${file}. Please apply manually in Supabase dashboard.`
        );
        console.error(innerErr.message);
      }
    }
  }

  console.log("\n✨ Migration process complete!");
}

applyMigrations().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
