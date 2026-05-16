#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configurados');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function populateUsuariosSistema() {
  try {
    console.log('🔄 Populando usuarios_sistema para usuários existentes...\n');

    const { data: users, error: usersError } = await supabase
      .from('auth.users')
      .select('id', { count: 'exact' });

    if (usersError) {
      console.error('❌ Erro ao buscar usuários:', usersError);
      process.exit(1);
    }

    console.log(`Total de usuários em auth.users: ${users?.length || 0}`);

    const { data: existing, error: existingError } = await supabase
      .from('usuarios_sistema')
      .select('id', { count: 'exact' });

    if (existingError) {
      console.error('❌ Erro ao buscar usuarios_sistema:', existingError);
      process.exit(1);
    }

    console.log(`Total em usuarios_sistema: ${existing?.length || 0}\n`);

    // Executar via RPC ou INSERT direto
    const { error: insertError } = await supabase.rpc('exec', {
      sql: `
        INSERT INTO public.usuarios_sistema (id, perfil, pode_escalas, pode_biblioteca, pode_livraria, pode_financeiro, pode_pessoas, pode_publicar, pode_mediunidade, pode_atendimento, pode_apse)
        SELECT
          id,
          'publico',
          false, false, false, false, false, false, false, false, false
        FROM auth.users
        WHERE id NOT IN (SELECT id FROM public.usuarios_sistema)
        ON CONFLICT (id) DO NOTHING
      `
    });

    if (insertError) {
      // Tentar com INSERT direto
      console.log('⚠️  RPC exec não disponível, tentando approach alternativo...\n');

      // Buscar usuários sem usuarios_sistema
      const { data: authUsers } = await supabase.auth.admin.listUsers();

      if (authUsers?.users) {
        const { data: existing } = await supabase
          .from('usuarios_sistema')
          .select('id');

        const existingIds = new Set(existing?.map(u => u.id) || []);
        const usersToCreate = authUsers.users.filter(u => !existingIds.has(u.id));

        if (usersToCreate.length === 0) {
          console.log('✅ Todos os usuários já têm registro em usuarios_sistema\n');
          process.exit(0);
        }

        console.log(`Criando ${usersToCreate.length} registros em usuarios_sistema...\n`);

        for (const user of usersToCreate) {
          const { error } = await supabase
            .from('usuarios_sistema')
            .insert({
              id: user.id,
              perfil: 'publico',
              pode_escalas: false,
              pode_biblioteca: false,
              pode_livraria: false,
              pode_financeiro: false,
              pode_pessoas: false,
              pode_publicar: false,
              pode_mediunidade: false,
              pode_atendimento: false,
              pode_apse: false,
            });

          if (error) {
            console.log(`⚠️  Erro ao criar para ${user.email}:`, error.message);
          } else {
            console.log(`✅ ${user.email}`);
          }
        }
      }
    } else {
      console.log('✅ usuarios_sistema populado com sucesso');
    }

    console.log('\n✅ Processo concluído!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
    process.exit(1);
  }
}

populateUsuariosSistema();
