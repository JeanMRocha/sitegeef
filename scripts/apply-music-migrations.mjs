#!/usr/bin/env node

import pkg from 'pg';
const { Client } = pkg;

// Read migrations
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const migrations = [
  path.join(__dirname, '../supabase/migrations/20260526_musica_versoes.sql'),
  path.join(__dirname, '../supabase/migrations/20260527_musica_media.sql'),
];

const connectionString = `postgresql://postgres:${process.env.POSTGRES_PASSWORD || 'postgres'}@db.nycgpokqlmrfzegjlrwa.supabase.co:5432/postgres?sslmode=require`;

async function applyMigrations() {
  const client = new Client({ connectionString });

  try {
    console.log('🔗 Connecting to Supabase PostgreSQL...');
    await client.connect();
    console.log('✅ Connected');

    for (const migrationFile of migrations) {
      console.log(`\n📋 Applying ${path.basename(migrationFile)}...`);
      const sql = fs.readFileSync(migrationFile, 'utf8');

      try {
        await client.query(sql);
        console.log(`✅ ${path.basename(migrationFile)} applied successfully`);
      } catch (error) {
        console.error(`❌ Error applying ${path.basename(migrationFile)}:`);
        console.error(error.message);
        throw error;
      }
    }

    console.log('\n✅ All migrations applied successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

applyMigrations();
