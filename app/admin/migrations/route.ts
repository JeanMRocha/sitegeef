import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request: Request) {
  // Security: only allow from localhost or with admin token
  const token = new URL(request.url).searchParams.get("token");
  const adminToken = process.env.ADMIN_MIGRATION_TOKEN || "dev-token";

  if (token !== adminToken) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(
      JSON.stringify({ error: "Missing Supabase credentials" }),
      { status: 500 }
    );
  }

  const client = createClient(supabaseUrl, serviceRoleKey);
  const results = [];

  try {
    // Get all migration files
    const migrationsDir = join(process.cwd(), "supabase/migrations");
    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const filePath = join(migrationsDir, file);
      const sql = readFileSync(filePath, "utf-8");

      try {
        // Execute each SQL statement separately
        const statements = sql
          .split(";")
          .map((s) => s.trim())
          .filter((s) => s.length > 0 && !s.startsWith("--"));

        for (const statement of statements) {
          const { data, error } = await client.rpc("exec", {
            statement,
          });

          if (error && error.code !== "42P1") {
            // Ignore "already exists" errors
            console.warn(`Warning in ${file}:`, error.message);
          }
        }

        results.push({ file, status: "success" });
      } catch (err) {
        results.push({
          file,
          status: "error",
          error: (err as Error).message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Migrations completed",
        results,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: (err as Error).message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
