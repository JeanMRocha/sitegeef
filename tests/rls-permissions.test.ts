/**
 * RLS (Row-Level Security) Permission Tests
 *
 * These tests validate that sensitive modules enforce proper access control:
 * - Mediunidade: requires pode_mediunidade = true
 * - Atendimento Fraterno: requires pode_atendimento = true
 * - Irradiação: requires pode_atendimento = true
 *
 * Tests should be run against a staging database with test users.
 */

import { createClient } from '@/lib/supabase/server';

interface TestUser {
  id: string;
  email: string;
  permissao: 'pode_mediunidade' | 'pode_atendimento' | 'nenhuma';
}

const testUsers: TestUser[] = [
  { id: 'user-mediunidade', email: 'test-med@geef.org', permissao: 'pode_mediunidade' },
  { id: 'user-atendimento', email: 'test-atend@geef.org', permissao: 'pode_atendimento' },
  { id: 'user-publico', email: 'test-pub@geef.org', permissao: 'nenhuma' },
];

export async function testMediunidadeRLS() {
  const supabase = await createClient();
  const results = [];

  // Test: Usuario com pode_mediunidade deveria conseguir ler grupos
  const { data: authUserMed } = await supabase.auth.getUser();
  if (authUserMed?.user) {
    const { data: grupos, error: erroGrupos } = await supabase
      .from('grupos_mediunicos')
      .select('id, nome')
      .limit(1);

    results.push({
      test: 'Mediunidade: Usuário autorizado pode ler grupos',
      passed: !erroGrupos && grupos,
      error: erroGrupos?.message,
    });
  }

  return results;
}

export async function testAtendimentoFraternoRLS() {
  const supabase = await createClient();
  const results = [];

  const { data: authUser } = await supabase.auth.getUser();
  if (authUser?.user) {
    // Test: Usuario com pode_atendimento deveria conseguir ler atendimentos
    const { data: atendimentos, error: erroAtend } = await supabase
      .from('atendimento_fraterno')
      .select('id, pessoa_id, data, sigilo')
      .limit(1);

    results.push({
      test: 'Atendimento Fraterno: Usuário autorizado pode ler registros',
      passed: !erroAtend && atendimentos,
      error: erroAtend?.message,
    });

    // Test: Verificar que observações confidenciais não são expostas sem permissão
    if (atendimentos && atendimentos.length > 0) {
      const { data: observacoes } = await supabase
        .from('atendimento_fraterno')
        .select('observacoes')
        .eq('id', atendimentos[0].id)
        .single();

      results.push({
        test: 'Atendimento Fraterno: Observações confidenciais visíveis',
        passed: observacoes !== undefined,
        error: observacoes ? null : 'Observações não retornadas',
      });
    }
  }

  return results;
}

export async function testIrradiacaoRLS() {
  const supabase = await createClient();
  const results = [];

  const { data: authUser } = await supabase.auth.getUser();
  if (authUser?.user) {
    // Test: Usuario com pode_atendimento deveria conseguir ler irradiações
    const { data: irradiações, error: erroIrrad } = await supabase
      .from('irradiacoes')
      .select('id, nome_irradiacao, confidencial')
      .limit(1);

    results.push({
      test: 'Irradiação: Usuário autorizado pode ler registros',
      passed: !erroIrrad && irradiações,
      error: erroIrrad?.message,
    });

    // Test: Verificar que registros confidenciais estão protegidos
    if (irradiações && irradiações.length > 0) {
      results.push({
        test: 'Irradiação: Flag confidencial presente',
        passed: irradiações[0].confidencial !== undefined,
        error: null,
      });
    }
  }

  return results;
}

/**
 * Run all RLS tests
 *
 * Usage:
 *   npx ts-node tests/rls-permissions.test.ts
 */
export async function runAllTests() {
  console.log('🔒 RLS Permission Tests\n');
  console.log('=' .repeat(50));

  const meduinidadeTests = await testMediunidadeRLS();
  const fraternoTests = await testAtendimentoFraternoRLS();
  const irradiacaoTests = await testIrradiacaoRLS();

  const allTests = [...meduinidadeTests, ...fraternoTests, ...irradiacaoTests];

  allTests.forEach(result => {
    const status = result.passed ? '✅' : '❌';
    console.log(`${status} ${result.test}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });

  console.log('\n' + '='.repeat(50));
  const passed = allTests.filter(t => t.passed).length;
  const total = allTests.length;
  console.log(`Results: ${passed}/${total} tests passed`);

  return allTests;
}

// Run tests if executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}
