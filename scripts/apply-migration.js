const fs = require('fs');
const path = require('path');

// Read migration file
const migrationFile = path.join(__dirname, '../supabase/migrations/20260515_auth_profiles.sql');
const sql = fs.readFileSync(migrationFile, 'utf-8');

// Split SQL into individual statements
const statements = sql
  .split(';')
  .map(stmt => stmt.trim())
  .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

console.log(`Migration file: ${migrationFile}`);
console.log(`Total statements: ${statements.length}`);
console.log('\nStatements to execute:');

statements.forEach((stmt, index) => {
  const preview = stmt.substring(0, 60).replace(/\n/g, ' ');
  console.log(`  ${index + 1}. ${preview}${stmt.length > 60 ? '...' : ''}`);
});

console.log('\n📋 Instructions:');
console.log('1. Open Supabase Dashboard: https://app.supabase.com/project/nycgpokqlmrfzegjlrwa/sql/editor');
console.log('2. Copy the entire SQL from supabase/migrations/20260515_auth_profiles.sql');
console.log('3. Paste it into the SQL editor');
console.log('4. Click "Run" to execute all statements');
console.log('\n✅ Migration is ready to apply!');
