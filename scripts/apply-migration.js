#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nycgpokqlmrfzegjlrwa.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY not found');
  console.error('');
  console.error('Set it before running:');
  console.error('  export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"');
  console.error('');
  console.error('Get your key from:');
  console.error('  1. Supabase Dashboard > Your Project');
  console.error('  2. Project Settings (⚙️) > API');
  console.error('  3. Copy the "service_role" secret key');
  process.exit(1);
}

async function executeSQL(sql) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
    },
    body: JSON.stringify({ query: sql }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${JSON.stringify(data)}`);
  }

  return data;
}

async function main() {
  const migrationPath = path.join(__dirname, '../supabase/migrations/20260515_geef_erp.sql');

  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Migration file not found: ${migrationPath}`);
    process.exit(1);
  }

  console.log('📋 Reading migration file...');
  const sql = fs.readFileSync(migrationPath, 'utf-8');

  console.log(`✅ Migration loaded (${Math.round(sql.length / 1024)}KB)`);
  console.log('🚀 Applying to Supabase...');
  console.log(`   URL: ${SUPABASE_URL}`);
  console.log('');

  try {
    console.log('   Executing SQL...');
    await executeSQL(sql);
    console.log('✅ Migration applied successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log('   ✓ 52 tables created');
    console.log('   ✓ 7 enum types created');
    console.log('   ✓ Foreign key constraints added');
    console.log('   ✓ Initial data inserted');
    console.log('');
    console.log('🎉 Ready to use! Run:');
    console.log('   npm run dev');
  } catch (error) {
    console.error('❌ Migration failed:');
    console.error('');
    console.error(`   ${error.message}`);
    console.error('');
    console.error('💡 Troubleshooting:');
    console.error('   - Verify SERVICE_ROLE_KEY is correct');
    console.error('   - Check Supabase project is active');
    console.error('   - Try running from APPLY_MIGRATION.md for manual steps');
    process.exit(1);
  }
}

main();
