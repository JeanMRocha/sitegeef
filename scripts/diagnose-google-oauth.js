#!/usr/bin/env node

/**
 * Diagnostic script for Google OAuth configuration
 */

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '405604315044-mjsecv7dvgbd96ljvkjcteqja4bvab6t.apps.googleusercontent.com';
const SUPABASE_PROJECT = 'nycgpokqlmrfzegjlrwa';

console.log('🔍 Google OAuth Configuration Diagnostic\n');
console.log('='.repeat(50) + '\n');

console.log('📋 Valores Esperados:\n');
console.log('Client ID:');
console.log(`  ${GOOGLE_CLIENT_ID}\n`);

console.log('Redirect URIs que DEVEM estar no Google Cloud Console:');
console.log(`  1. https://${SUPABASE_PROJECT}.supabase.co/auth/v1/callback`);
console.log(`  2. https://www.geef.com.br/auth/callback`);
console.log(`  3. https://geef.com.br/auth/callback\n`);

console.log('❌ Erro que está recebendo:');
console.log('  redirect_uri_mismatch\n');

console.log('✅ O que fazer:\n');
console.log('1. Abra Google Cloud Console:');
console.log('   https://console.cloud.google.com/\n');

console.log('2. Vá para APIs & Services → Credentials\n');

console.log('3. Procure pelo OAuth Client ID com este Client ID:');
console.log(`   ${GOOGLE_CLIENT_ID}\n`);

console.log('4. Clique nele para editar\n');

console.log('5. Verifique se em "Authorized redirect URIs" tem:\n');
const requiredURIs = [
  `https://${SUPABASE_PROJECT}.supabase.co/auth/v1/callback`,
  'https://www.geef.com.br/auth/callback',
  'https://geef.com.br/auth/callback'
];

requiredURIs.forEach((uri, i) => {
  console.log(`   ☐ ${uri}`);
});

console.log('\n6. Se faltarem URIs:\n');
console.log('   a) Clique em "Add URI"');
console.log('   b) Cole a URI completa');
console.log('   c) Clique "Save"\n');

console.log('7. Se alguma URI estiver ERRADA:\n');
console.log('   a) Clique no X para remover');
console.log('   b) Adicione a URI correta\n');

console.log('⚠️  IMPORTANTE:');
console.log('   - NÃO adicione query parameters (?provider=google)');
console.log('   - NÃO adicione barra extra no final (/)');
console.log('   - Copie e cole EXATAMENTE como está acima');
console.log('   - Clique "Save" após fazer as mudanças\n');

console.log('8. Depois de salvar, tente fazer login novamente\n');
console.log('='.repeat(50));
