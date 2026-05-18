#!/usr/bin/env node

/**
 * Script para sincronizar usuários com pessoas
 * Cria registro de pessoa para cada usuário do sistema
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env');

if (!fs.existsSync(envPath)) {
  console.error('❌ Arquivo .env não encontrado');
  process.exit(1);
}

const env = {};
fs.readFileSync(envPath, 'utf-8')
  .split('\n')
  .forEach((line) => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      env[key.trim()] = valueParts.join('=').trim();
    }
  });

const supabaseUrl = env.GEEF_SUPABASE_URL;
const serviceRoleKey = env.GEEF_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function syncUsuariosPessoas() {
  console.log('🔄 Sincronizando usuários com pessoas...\n');

  try {
    // Buscar todos os usuários de autenticação
    const allAuthUsers = [];
    let page = 1;

    while (true) {
      const { data, error } = await supabase.auth.admin.listUsers({
        page,
        perPage: 100,
      });

      if (error) {
        console.error('❌ Erro ao listar usuários:', error);
        return;
      }

      allAuthUsers.push(...(data?.users || []));
      if (!data?.nextPage) break;
      page = data.nextPage;
    }

    console.log(`✅ Encontrados ${allAuthUsers.length} usuários de autenticação\n`);

    // Filtrar usuários reais (não-teste)
    const realUsers = allAuthUsers.filter(
      (u) => !u.email?.toLowerCase().match(/^codex-(profile|test)-/i)
    );

    console.log(`📋 Processando ${realUsers.length} usuários reais:\n`);

    for (const authUser of realUsers) {
      const email = authUser.email || '';
      const nome = authUser.user_metadata?.nome || email.split('@')[0] || 'Sem nome';

      // Verificar se já tem pessoa_id
      const { data: usuarioData } = await supabase
        .from('usuarios_sistema')
        .select('pessoa_id')
        .eq('id', authUser.id)
        .maybeSingle();

      if (usuarioData?.pessoa_id) {
        console.log(`  ✅ ${email} → já tem pessoa (${usuarioData.pessoa_id})`);
        continue;
      }

      // Verificar se já existe pessoa com este email
      const { data: pessoaExistente } = await supabase
        .from('pessoas')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      let pessoaId;

      if (pessoaExistente) {
        pessoaId = pessoaExistente.id;
        console.log(`  ✓ ${email} → pessoa existente (${pessoaId})`);
      } else {
        // Criar pessoa
        const { data: novaPessoa, error: createError } = await supabase
          .from('pessoas')
          .insert([
            {
              nome,
              email,
              status: 'ativo',
            },
          ])
          .select('id')
          .maybeSingle();

        if (createError) {
          console.error(`  ❌ ${email} → erro ao criar pessoa:`, createError.message);
          continue;
        }

        pessoaId = novaPessoa?.id;
        console.log(`  ✨ ${email} → pessoa criada (${pessoaId})`);
      }

      // Atualizar usuario_sistema com pessoa_id
      if (pessoaId) {
        const { error: updateError } = await supabase
          .from('usuarios_sistema')
          .update({ pessoa_id: pessoaId })
          .eq('id', authUser.id);

        if (updateError) {
          console.error(`     ⚠️  erro ao linkar pessoa:`, updateError.message);
        } else {
          console.log(`     🔗 linkado a usuário_sistema`);
        }
      }
    }

    console.log('\n✅ Sincronização concluída!');
  } catch (error) {
    console.error('❌ Erro fatal:', error.message);
    process.exit(1);
  }
}

syncUsuariosPessoas();
