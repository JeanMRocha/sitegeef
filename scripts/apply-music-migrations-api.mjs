#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PROJECT_REF = 'nycgpokqlmrfzegjlrwa';
const ACCESS_TOKEN = process.env.GEEF_SUPABASE_Access_Token;

const migrations = [
  {
    name: '20260526_musica_versoes.sql',
    path: path.join(__dirname, '../supabase/migrations/20260526_musica_versoes.sql'),
  },
  {
    name: '20260527_musica_media.sql',
    path: path.join(__dirname, '../supabase/migrations/20260527_musica_media.sql'),
  },
];

async function applyMigration(sql, name) {
  try {
    console.log(`\n📋 Applying ${name}...`);

    const response = await fetch(
      `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: sql,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${response.status}: ${error.message || JSON.stringify(error)}`);
    }

    const result = await response.json();
    console.log(`✅ ${name} applied successfully`);
    return result;
  } catch (error) {
    console.error(`❌ Error applying ${name}:`);
    console.error(error.message);
    throw error;
  }
}

async function main() {
  if (!ACCESS_TOKEN) {
    console.error('❌ GEEF_SUPABASE_Access_Token not found in environment');
    process.exit(1);
  }

  console.log('🚀 Applying music module migrations via Supabase Management API');
  console.log(`📍 Project: ${PROJECT_REF}`);
  console.log(`🔑 Token: ${ACCESS_TOKEN.substring(0, 10)}...`);

  try {
    for (const migration of migrations) {
      const sql = fs.readFileSync(migration.path, 'utf8');
      await applyMigration(sql, migration.name);
    }

    console.log('\n✅ All migrations applied successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Reload the browser (Ctrl+Shift+R)');
    console.log('   2. Try creating a new version in the music editor');
    console.log('   3. It should now work without errors!');
  } catch (error) {
    console.error('\n❌ Migration failed');
    process.exit(1);
  }
}

main();
