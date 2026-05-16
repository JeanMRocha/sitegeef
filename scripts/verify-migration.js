#!/usr/bin/env node

/**
 * Verifies if the auth_profiles migration has been applied
 * Uses Supabase Admin API to check for the profiles table
 */

const https = require('https');
const { createClient } = require('@supabase/supabase-js');
const { getDatabaseUrl, withDatabase } = require('./supabase-db');

// Configuration
const SUPABASE_URL = 'https://nycgpokqlmrfzegjlrwa.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.GEEF_SUPABASE_SERVICE_ROLE_KEY;
const DATABASE_URL = getDatabaseUrl();

if (!SUPABASE_SERVICE_ROLE_KEY && !DATABASE_URL) {
  console.error('❌ Erro: SUPABASE_SERVICE_ROLE_KEY não definido');
  console.log('\nDefina a variável de ambiente:');
  console.log('  export SUPABASE_SERVICE_ROLE_KEY="seu-service-role-key"\n');
  console.log('Ou use GEEF_SUPABASE_SERVICE_ROLE_KEY\n');
  console.log('Ou configure GEEF_SUPABASE_DB_URL / SUPABASE_DB_URL / DATABASE_URL para conexão direta.\n');
  process.exit(1);
}

console.log('🔍 Verificação de Migration - Profiles Table\n');
console.log('==============================================\n');

/**
 * Fazer requisição HTTP
 */
function makeRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : null;
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ status: res.statusCode, data: parsed });
          } else {
            reject(new Error(`Status ${res.statusCode}: ${JSON.stringify(parsed || data)}`));
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ status: res.statusCode, data });
          } else {
            reject(new Error(`Status ${res.statusCode}: ${data}`));
          }
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

/**
 * Check if profiles table exists via SQL query
 */
async function checkProfilesTable() {
  if (DATABASE_URL) {
    const sql = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'profiles'
      ) AS table_exists;
    `;

    const rows = await withDatabase(DATABASE_URL, async (db) => db.unsafe(sql));
    return Boolean(rows?.[0]?.table_exists);
  }

  try {
    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    const { error } = await supabase.from('profiles').select('id').limit(1);

    if (error) {
      if (error.code === 'PGRST205') {
        return false;
      }

      console.error('⚠️  Erro ao verificar via REST API:', error.message);
      return null;
    }

    return true;
  } catch (error) {
    console.error('⚠️  Erro ao verificar via REST API:', error.message);
    return null;
  }
}

/**
 * Main
 */
async function main() {
  console.log('📡 Verificando se a tabela profiles foi criada...\n');

  try {
    const tableExists = await checkProfilesTable();

    if (tableExists === true) {
      console.log('✅ SUCESSO: Tabela profiles já foi criada!');
      console.log('\n🎉 A migration foi aplicada com sucesso.\n');
      console.log('Próximos passos:');
      console.log('1. ✅ Testar fluxo de login: http://localhost:3500/login');
      console.log('2. ✅ Criar um usuário teste');
      console.log('3. ✅ Verificar se perfil foi criado automaticamente');
      console.log('4. ✅ Configurar Google OAuth (se não configurado)');
    } else if (tableExists === false) {
      console.log('❌ A tabela profiles NÃO foi criada ainda.');
      console.log('\n📋 Para aplicar a migration:\n');
      console.log('Opção 1: Via Supabase Dashboard (Recomendado)');
      console.log('────────────────────────────────────────────');
      console.log('1. Abra: https://app.supabase.com/project/nycgpokqlmrfzegjlrwa/sql/editor');
      console.log('2. Cole o conteúdo de: supabase/migrations/20260515_auth_profiles.sql');
      console.log('3. Clique "Run" para executar\n');
      console.log('Opção 2: Usar script (se credenciais disponíveis)');
      console.log('───────────────────────────────────────────────');
      console.log('node scripts/apply-migration-sql.js\n');
    } else {
      console.log('⚠️  Não foi possível verificar o status via API REST.');
      console.log('\n📋 Verifique manualmente:\n');
      console.log('1. Abra: https://app.supabase.com/project/nycgpokqlmrfzegjlrwa');
      console.log('2. Vá para: Table Editor (esquerda)');
      console.log('3. Procure pela tabela "profiles"');
      console.log('   ✅ Se aparecer = Migration foi aplicada');
      console.log('   ❌ Se não aparecer = Você precisa aplicar\n');
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('\n💡 Verifique manualmente no Dashboard:');
    console.log('   https://app.supabase.com/project/nycgpokqlmrfzegjlrwa\n');
  }
}

main().catch(console.error);
