#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = {};
fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf-8')
  .split('\n')
  .forEach((line) => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      env[key.trim()] = valueParts.join('=').trim();
    }
  });

const supabase = createClient(env.GEEF_SUPABASE_URL, env.GEEF_SUPABASE_SERVICE_ROLE_KEY);

console.log('🔐 Testando is_admin_user() para cada user...\n');

// Buscar auth users
const allAuthUsers = [];
let page = 1;
while (true) {
  const { data, error } = await supabase.auth.admin.listUsers({
    page,
    perPage: 100,
  });

  if (error) break;
  allAuthUsers.push(...(data?.users || []));
  if (!data?.nextPage) break;
  page = data.nextPage;
}

const realUsers = allAuthUsers.filter((u) => !u.email?.toLowerCase().match(/^codex-(profile|test)-/i));

for (const authUser of realUsers) {
  // Testar se a função is_admin_user retorna true para este user
  try {
    const { data: result, error } = await supabase
      .rpc('is_admin_user')
      .eq('user_id', authUser.id)
      .catch(async () => {
        // Tentar alternativa: fazer select como se fosse o user
        return {
          data: null,
          error: 'rpc_not_available',
        };
      });

    console.log(`${authUser.email}:`);
    console.log(`  - Existe em usuarios_sistema: ${result ? 'sim' : '?'}`);
    console.log(`  - ID do auth.user: ${authUser.id}`);
  } catch (e) {
    console.log(`${authUser.email}: erro ao testar`);
  }
}

// Verificar direto se usuarios_sistema tem os users
console.log('\n📋 Verificando usuarios_sistema...\n');

const { data: usuarios } = await supabase
  .from('usuarios_sistema')
  .select('id, perfil, pessoa_id')
  .limit(10);

console.log(`Registros em usuarios_sistema: ${usuarios?.length || 0}`);
if (usuarios) {
  usuarios.forEach((u) => {
    console.log(`  - ${u.id.slice(0, 8)}... (perfil: ${u.perfil})`);
  });
}
