#!/usr/bin/env node

/**
 * Verifica se a migration de profiles foi aplicada
 * Você pode executar este script para confirmar o status
 */

console.log('🔍 Verificação de Migration - Profiles Table\n');
console.log('==============================================\n');

console.log('Para verificar se a migration foi aplicada:\n');

console.log('Opção 1: Via Supabase Dashboard (Recomendado)');
console.log('───────────────────────────────────────────');
console.log('1. Abra: https://app.supabase.com/project/nycgpokqlmrfzegjlrwa');
console.log('2. Vá para: Table Editor (esquerda)');
console.log('3. Procure pela tabela "profiles"');
console.log('   ✅ Se aparecer = Migration foi aplicada');
console.log('   ❌ Se não aparecer = Migration ainda não foi aplicada\n');

console.log('Opção 2: Via SQL Query');
console.log('─────────────────────');
console.log('1. Abra: https://app.supabase.com/project/nycgpokqlmrfzegjlrwa/sql/editor');
console.log('2. Execute este SQL:');
console.log('```sql');
console.log('SELECT EXISTS (');
console.log('  SELECT FROM information_schema.tables');
console.log('  WHERE table_schema = \'public\'');
console.log('  AND table_name = \'profiles\'');
console.log(') AS table_exists;');
console.log('```');
console.log('3. Resultado:');
console.log('   ✅ true = Tabela existe (migration aplicada)');
console.log('   ❌ false = Tabela não existe (migration não aplicada)\n');

console.log('Opção 3: Verificar todas as tabelas');
console.log('───────────────────────────────────');
console.log('1. SQL Editor: \\dt');
console.log('2. Ou vá para Table Editor e procure por "profiles"\n');

console.log('Se a migration NÃO foi aplicada:');
console.log('───────────────────────────────');
console.log('1. Abra: https://app.supabase.com/project/nycgpokqlmrfzegjlrwa/sql/editor');
console.log('2. Consulte docs/SUPABASE_MIGRATION_MAP.md e copie o SQL de: supabase/migrations/20260515_auth_profiles.sql');
console.log('3. Cole no SQL Editor');
console.log('4. Clique "Run" ou pressione Ctrl+Enter\n');

console.log('Verificar estrutura da tabela (se existir):');
console.log('──────────────────────────────────────────');
console.log('```sql');
console.log('SELECT column_name, data_type, is_nullable');
console.log('FROM information_schema.columns');
console.log('WHERE table_name = \'profiles\';');
console.log('```\n');

console.log('Resultado esperado:');
console.log('```');
console.log('column_name    | data_type | is_nullable');
console.log('───────────────┼───────────┼────────────');
console.log('id             | uuid      | NO');
console.log('nome_completo  | text      | YES');
console.log('avatar_url     | text      | YES');
console.log('email          | text      | YES');
console.log('updated_at     | timestamp | YES');
console.log('```\n');

console.log('Link úteis:');
console.log('──────────');
console.log('📚 Guia de migration: MIGRATION_GUIDE.md');
console.log('🔗 Dashboard: https://app.supabase.com/project/nycgpokqlmrfzegjlrwa\n');
