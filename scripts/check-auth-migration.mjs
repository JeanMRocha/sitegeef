#!/usr/bin/env node

/**
 * Check if auth_profiles migration has been applied
 * Uses Supabase client library
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nycgpokqlmrfzegjlrwa.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.GEEF_SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('❌ Erro: SUPABASE_SERVICE_ROLE_KEY não definido\n');
  process.exit(1);
}

console.log('🔍 Verificação de Migration - Profiles Table\n');
console.log('==============================================\n');

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function main() {
  try {
    console.log('📡 Verificando se tabela profiles existe...\n');

    // Try to query the profiles table
    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (error) {
      if (error.code === 'PGRST116' || error.message?.includes('not found')) {
        console.log('❌ Tabela "profiles" não encontrada\n');
        console.log('📋 A migration ainda não foi aplicada.\n');
        console.log('Próximos passos:');
        console.log('─────────────────\n');
        console.log('1️⃣  Abra o Supabase Dashboard:');
        console.log('   https://app.supabase.com/project/nycgpokqlmrfzegjlrwa/sql/editor\n');
        console.log('2️⃣  Cole o conteúdo de:');
        console.log('   supabase/migrations/20260515_auth_profiles.sql\n');
        console.log('3️⃣  Clique "Run" para executar\n');
        console.log('4️⃣  Depois volte aqui e execute novamente para confirmar\n');
        process.exit(0);
      } else {
        throw error;
      }
    }

    console.log('✅ SUCESSO! Tabela "profiles" existe!\n');
    console.log(`📊 Total de perfis: ${count || 0}\n`);
    console.log('🎉 A migration foi aplicada com sucesso!\n');
    console.log('Próximos passos:');
    console.log('────────────────');
    console.log('1. ✅ Testar fluxo de login: http://localhost:3500/login');
    console.log('2. ✅ Criar um usuário teste');
    console.log('3. ✅ Verificar se perfil foi criado automaticamente');
    console.log('4. ✅ Configurar Google OAuth (se necessário)');
    console.log('5. ✅ Testar upload de avatar\n');

  } catch (error) {
    console.error('❌ Erro ao verificar migration:', error.message, '\n');
    console.log('💡 Verifique manualmente no Dashboard:');
    console.log('   https://app.supabase.com/project/nycgpokqlmrfzegjlrwa\n');
    process.exit(1);
  }
}

main();
