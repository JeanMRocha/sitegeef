import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";

const url = "https://nycgpokqlmrfzegjlrwa.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55Y2dwb2txbG1yZnplZ2pscndhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODM3Mzc4MSwiZXhwIjoyMDkzOTQ5NzgxfQ.BnoQWqFmV0YyfKAfCSJMiMJYUuTWwwmT3ORBKMHElJM";

const supabase = createClient(url, key);

const sql = fs.readFileSync("supabase/migrations/20260527_musica_media.sql", "utf-8");

async function applyMigration() {
  try {
    const { data, error } = await supabase.rpc("exec_sql", { sql });
    if (error) {
      console.error("Migration failed:", error);
      process.exit(1);
    }
    console.log("Migration applied successfully");
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

applyMigration();
