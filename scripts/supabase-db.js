const fs = require('fs');
const path = require('path');
const postgres = require('postgres');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    if (!key || process.env[key] !== undefined) {
      continue;
    }

    let value = line.slice(separatorIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function loadProjectEnv() {
  const root = path.join(__dirname, '..');
  loadEnvFile(path.join(root, '.env'));
  loadEnvFile(path.join(root, '.env.local'));
}

loadProjectEnv();

const DATABASE_URL_KEYS = [
  'GEEF_SUPABASE_DB_URL',
  'SUPABASE_DB_URL',
  'SUPABASE_DIRECT_DB_URL',
  'SUPABASE_DB_SESSION_URL',
  'SUPABASE_DB_TRANSACTION_URL',
  'GEEF_DATABASE_URL',
  'DATABASE_URL',
];

function getDatabaseUrl() {
  for (const key of DATABASE_URL_KEYS) {
    const value = process.env[key];
    if (value) {
      return value;
    }
  }

  return null;
}

function createSqlClient(databaseUrl) {
  if (!databaseUrl) {
    return null;
  }

  return postgres(databaseUrl, {
    max: 1,
    ssl: 'require',
    prepare: false,
  });
}

async function withDatabase(databaseUrl, handler) {
  const sql = createSqlClient(databaseUrl);

  if (!sql) {
    throw new Error('DATABASE_URL not found');
  }

  try {
    return await handler(sql);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

module.exports = {
  createSqlClient,
  getDatabaseUrl,
  withDatabase,
};
