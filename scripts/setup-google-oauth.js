#!/usr/bin/env node

/**
 * Configura Google OAuth no Supabase via Management API
 *
 * Pré-requisitos:
 * 1. Google Cloud Console credentials (OAuth 2.0 Client ID)
 * 2. Supabase API token com permissão de admin
 */

const https = require('https');

// Configuration
const SUPABASE_PROJECT_REF = 'nycgpokqlmrfzegjlrwa';
const SUPABASE_REGION = 'us-east-1';

// Get environment variables
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

console.log('🔐 Supabase Google OAuth Configuration');
console.log('=====================================\n');

// Check prerequisites
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error('❌ Erro: Credenciais do Google não encontradas!\n');
  console.log('Para configurar Google OAuth, você precisa:\n');
  console.log('1. Criar OAuth 2.0 Client ID no Google Cloud Console');
  console.log('   - Ir para: https://console.cloud.google.com/');
  console.log('   - APIs & Services → Credentials');
  console.log('   - Create OAuth 2.0 Client ID (Web Application)');
  console.log('   - Authorized redirect URIs:');
  console.log('     * https://nycgpokqlmrfzegjlrwa.supabase.co/auth/v1/callback?provider=google');
  console.log('   - Copiar Client ID e Client Secret\n');
  console.log('2. Definir variáveis de ambiente:');
  console.log('   export GOOGLE_CLIENT_ID="seu-client-id"');
  console.log('   export GOOGLE_CLIENT_SECRET="seu-client-secret"\n');
  console.log('3. (Opcional) Obter Supabase Access Token:');
  console.log('   - Ir para: https://app.supabase.com/account/tokens');
  console.log('   - Criar novo token com escopo "admin"');
  console.log('   export SUPABASE_ACCESS_TOKEN="seu-token"\n');
  process.exit(1);
}

if (!SUPABASE_ACCESS_TOKEN) {
  console.warn('⚠️  Aviso: SUPABASE_ACCESS_TOKEN não definido.');
  console.warn('   Você precisará de um token para usar a Management API.\n');
}

console.log('✅ Google Client ID: ' + GOOGLE_CLIENT_ID.substring(0, 20) + '...');
console.log('✅ Google Client Secret: ' + (GOOGLE_CLIENT_SECRET ? '***' : 'Não definido'));
console.log('✅ Supabase Project: ' + SUPABASE_PROJECT_REF);
console.log();

/**
 * Opção 1: Usar Management API (requer SUPABASE_ACCESS_TOKEN)
 */
async function configureViaManagementAPI() {
  if (!SUPABASE_ACCESS_TOKEN) {
    console.log('⚠️  Management API requer SUPABASE_ACCESS_TOKEN.\n');
    showDashboardInstructions();
    return;
  }

  console.log('📡 Configurando via Supabase Management API...\n');

  const payload = {
    provider: 'google',
    enabled: true,
    client_id: GOOGLE_CLIENT_ID,
    secret: GOOGLE_CLIENT_SECRET,
  };

  const options = {
    hostname: 'api.supabase.com',
    port: 443,
    path: `/v1/projects/${SUPABASE_PROJECT_REF}/auth/config`,
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };

  try {
    await makeRequest(options, JSON.stringify(payload));
    console.log('✅ Google OAuth configurado com sucesso via Management API!\n');
  } catch (error) {
    console.error('❌ Erro ao configurar via Management API:', error.message);
    console.log('\n💡 Tente configurar manualmente via Dashboard:\n');
    showDashboardInstructions();
  }
}

/**
 * Fazer requisição HTTP
 */
function makeRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data ? JSON.parse(data) : null);
        } else {
          reject(new Error(`Status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

/**
 * Mostrar instruções para configurar via Dashboard
 */
function showDashboardInstructions() {
  console.log('📋 CONFIGURAR GOOGLE OAUTH VIA DASHBOARD\n');
  console.log('========================================\n');

  console.log('Passo 1: Obter credenciais do Google');
  console.log('─────────────────────────────────────');
  console.log('1. Acesse Google Cloud Console');
  console.log('   https://console.cloud.google.com/\n');
  console.log('2. Crie um novo projeto ou use um existente\n');
  console.log('3. Ative a Google+ API:');
  console.log('   - APIs & Services → Library');
  console.log('   - Procure "Google+ API"');
  console.log('   - Clique "Enable"\n');
  console.log('4. Crie OAuth 2.0 Client ID:');
  console.log('   - APIs & Services → Credentials');
  console.log('   - "Create Credentials" → "OAuth Client ID"');
  console.log('   - Tipo: Web Application\n');
  console.log('5. Configure URIs autorizados:');
  console.log('   - Authorized JavaScript origins:');
  console.log('     * https://nycgpokqlmrfzegjlrwa.supabase.co');
  console.log('     * http://localhost:3500\n');
  console.log('   - Authorized redirect URIs:');
  console.log('     * https://nycgpokqlmrfzegjlrwa.supabase.co/auth/v1/callback?provider=google\n');
  console.log('6. Copie o Client ID e Client Secret\n\n');

  console.log('Passo 2: Configurar no Supabase Dashboard');
  console.log('─────────────────────────────────────────');
  console.log('1. Abra Supabase Dashboard');
  console.log('   https://app.supabase.com/project/nycgpokqlmrfzegjlrwa\n');
  console.log('2. Vá para: Authentication → Providers\n');
  console.log('3. Clique em "Google"\n');
  console.log('4. Cole as credenciais:');
  console.log('   - Client ID: [copie do Google Cloud Console]');
  console.log('   - Client Secret: [copie do Google Cloud Console]\n');
  console.log('5. Clique "Save"\n\n');

  console.log('Passo 3: Testar no site');
  console.log('──────────────────────');
  console.log('1. Acesse: http://localhost:3500/login');
  console.log('2. Clique "Entrar com Google"');
  console.log('3. Autorize o acesso\n\n');

  console.log('📚 Referências:');
  console.log('   - Docs: https://supabase.com/docs/guides/auth/oauth2');
  console.log('   - Google OAuth: https://developers.google.com/identity/protocols/oauth2\n');
}

/**
 * Main
 */
async function main() {
  // Se temos as credenciais, tentar via API
  if (SUPABASE_ACCESS_TOKEN) {
    await configureViaManagementAPI();
  } else {
    // Senão, mostrar instruções do Dashboard
    showDashboardInstructions();
  }
}

main().catch(console.error);
