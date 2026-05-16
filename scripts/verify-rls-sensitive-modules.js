#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nycgpokqlmrfzegjlrwa.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.GEEF_SUPABASE_SERVICE_ROLE_KEY;
const migrationPath = path.join(__dirname, '../supabase/migrations/20260515_rls_sensitive_modules.sql');

const TARGET_TABLES = [
  'grupos_mediunicos',
  'grupo_mediunico_membros',
  'reunioes_mediunicas',
  'atendimento_fraterno',
  'irradiacoes',
];

if (!SERVICE_ROLE_KEY) {
  console.error('❌ Erro: SUPABASE_SERVICE_ROLE_KEY não definido');
  console.error('Defina SUPABASE_SERVICE_ROLE_KEY ou GEEF_SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

if (!fs.existsSync(migrationPath)) {
  console.error(`❌ Migration não encontrada: ${migrationPath}`);
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

  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${typeof data === 'string' ? data : JSON.stringify(data)}`);
  }

  return data;
}

function normalizeRows(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && Array.isArray(data.rows)) {
    return data.rows;
  }

  return [];
}

async function main() {
  console.log('🔎 Verificação de RLS - Módulos Sensíveis do GEEF');
  console.log('=================================================');
  console.log(`📄 Migration: ${path.relative(path.join(__dirname, '..'), migrationPath)}`);
  console.log('');

  const sql = fs.readFileSync(migrationPath, 'utf-8');
  const foundTables = TARGET_TABLES.filter((table) => sql.includes(`public.${table}`));

  if (foundTables.length !== TARGET_TABLES.length) {
    console.log('⚠️  A migration local não menciona todas as tabelas esperadas.');
    console.log(`   Encontradas: ${foundTables.join(', ') || 'nenhuma'}`);
    console.log(`   Esperadas: ${TARGET_TABLES.join(', ')}`);
    console.log('');
  } else {
    console.log('✅ Migration local contém todas as tabelas alvo.');
    console.log('');
  }

  const policySql = `
    select
      c.relname as table_name,
      c.relrowsecurity as rls_enabled,
      coalesce(count(p.policyname), 0) as policy_count
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    left join pg_policies p
      on p.schemaname = n.nspname
     and p.tablename = c.relname
    where n.nspname = 'public'
      and c.relname = any (array['${TARGET_TABLES.join("','")}'])
    group by c.relname, c.relrowsecurity
    order by c.relname;
  `;

  const policiesSql = `
    select tablename, policyname, cmd
    from pg_policies
    where schemaname = 'public'
      and tablename = any (array['${TARGET_TABLES.join("','")}'])
    order by tablename, policyname;
  `;

  try {
    const tableStatus = normalizeRows(await executeSQL(policySql));
    const policyRows = normalizeRows(await executeSQL(policiesSql));

    console.log('📊 Status das tabelas:');
    tableStatus.forEach((row) => {
      console.log(`- ${row.table_name}: rls=${row.rls_enabled ? 'on' : 'off'}, policies=${row.policy_count}`);
    });

    console.log('');
    console.log('📑 Políticas encontradas:');
    policyRows.forEach((row) => {
      console.log(`- ${row.tablename}: ${row.policyname} (${row.cmd})`);
    });

    const missing = TARGET_TABLES.filter((table) => !tableStatus.some((row) => row.table_name === table));

    if (missing.length > 0) {
      console.log('');
      console.log(`❌ Tabelas sem resposta na verificação: ${missing.join(', ')}`);
      process.exit(1);
    }

    const disabled = tableStatus.filter((row) => !row.rls_enabled).map((row) => row.table_name);
    if (disabled.length > 0) {
      console.log('');
      console.log(`❌ RLS desativado em: ${disabled.join(', ')}`);
      process.exit(1);
    }

    if (policyRows.length === 0) {
      console.log('');
      console.log('❌ Nenhuma política encontrada para os módulos sensíveis.');
      process.exit(1);
    }

    console.log('');
    console.log('✅ RLS sensível validado com sucesso.');
  } catch (error) {
    console.error('');
    console.error(`❌ Falha na verificação: ${error.message}`);
    console.error('Se a RPC execute_sql não existir no projeto, aplique a migration manualmente no SQL Editor.');
    process.exit(1);
  }
}

main();
