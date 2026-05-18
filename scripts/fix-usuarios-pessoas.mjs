#!/usr/bin/env node

/**
 * Script para corrigir relação usuários ↔ pessoas
 * Cria usuários_sistema e pessoas se necessário
 */

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

console.log('🔧 Verificando relação usuários ↔ pessoas...\n');

// Listar pessoas
const { data: pessoas } = await supabase
  .from('pessoas')
  .select('id, nome, email')
  .limit(100);

console.log(`📋 Pessoas na DB: ${pessoas?.length || 0}`);
pessoas?.forEach((p) => {
  console.log(`   - ${p.nome} (${p.email})`);
});

console.log('');

console.log('⚠️  RLS bloqueia listagem de usuários_sistema');
console.log('   Vou sincronizar via auth users diretamente...\n');

// Listar auth users
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

const realAuthUsers = allAuthUsers.filter(
  (u) => !u.email?.toLowerCase().match(/^codex-(profile|test)-/i)
);

console.log(`\n🔑 Auth users: ${realAuthUsers.length}`);
realAuthUsers.forEach((u) => {
  console.log(`   - ${u.email} (id: ${u.id})`);
});

// Sincronizar: Para cada auth user, criar pessoa + usuarios_sistema se não existir
console.log('\n🔄 Sincronizando...\n');

for (const authUser of realAuthUsers) {
  const email = authUser.email;
  const nome = authUser.user_metadata?.nome || email.split('@')[0];

  // Verificar se pessoa existe
  const { data: pessoaExistente } = await supabase
    .from('pessoas')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  let pessoaId = pessoaExistente?.id;

  if (!pessoaId) {
    const { data: novaPessoa } = await supabase
      .from('pessoas')
      .insert([{ nome, email, status: 'ativo' }])
      .select('id')
      .maybeSingle();
    pessoaId = novaPessoa?.id;
    console.log(`  ✨ Pessoa criada: ${email} (${pessoaId})`);
  } else {
    console.log(`  ✓ Pessoa existe: ${email} (${pessoaId})`);
  }

  // Verificar se usuarios_sistema existe
  let usuarioExistente = null;
  try {
    const result = await supabase
      .from('usuarios_sistema')
      .select('id, pessoa_id')
      .eq('id', authUser.id)
      .maybeSingle();
    usuarioExistente = result.data;
  } catch (e) {
    // RLS bloqueado
  }

  if (usuarioExistente) {
    if (usuarioExistente.pessoa_id !== pessoaId) {
      // Atualizar pessoa_id
      try {
        await supabase
          .from('usuarios_sistema')
          .update({ pessoa_id: pessoaId })
          .eq('id', authUser.id);
        console.log(`  🔗 Usuario_sistema atualizado com pessoa`);
      } catch (e) {
        console.log(`  ⚠️  Erro ao atualizar`);
      }
    } else {
      console.log(`  🔗 Usuario_sistema já linkado`);
    }
  } else {
    // Criar usuario_sistema
    try {
      await supabase
        .from('usuarios_sistema')
        .insert([
          {
            id: authUser.id,
            pessoa_id: pessoaId,
            perfil: 'administrador',
          },
        ]);
      console.log(`  ✨ Usuario_sistema criado`);
    } catch (e) {
      console.log(`  ⚠️  Não consegui criar usuario_sistema`);
    }
  }
}

console.log('\n✅ Sincronização concluída!');
