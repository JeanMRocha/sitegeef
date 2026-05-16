/**
 * Routes Coverage Test
 *
 * Valida que todas as rotas esperadas retornam HTTP 200 ou 307 (redirect)
 * e que o servidor está respondendo corretamente.
 *
 * Uso: npx ts-node tests/routes-coverage.ts
 */

const BASE_URL = 'http://localhost:3500';

interface RouteTest {
  path: string;
  expectedStatus: number | number[];
  description: string;
  type: 'public' | 'protected' | 'admin';
}

const routes: RouteTest[] = [
  // Rotas Públicas
  { path: '/', expectedStatus: 200, description: 'Home Page', type: 'public' },
  { path: '/login', expectedStatus: 200, description: 'Login Page', type: 'public' },
  { path: '/escalas', expectedStatus: 200, description: 'Escalas Públicas', type: 'public' },
  { path: '/leitor', expectedStatus: 200, description: 'Área do Leitor', type: 'public' },
  { path: '/institucional', expectedStatus: 200, description: 'Página Institucional', type: 'public' },

  // Rotas Protegidas (redirecionam para login)
  { path: '/admin', expectedStatus: 307, description: 'Admin Dashboard', type: 'protected' },

  // Módulos de Admin (esperados redirecionarem para login)
  { path: '/admin/instituicao', expectedStatus: 307, description: 'Instituição', type: 'admin' },
  { path: '/admin/pessoas', expectedStatus: 307, description: 'Pessoas', type: 'admin' },
  { path: '/admin/usuarios', expectedStatus: 307, description: 'Usuários', type: 'admin' },
  { path: '/admin/departamentos', expectedStatus: 307, description: 'Departamentos', type: 'admin' },
  { path: '/admin/escalas', expectedStatus: 307, description: 'Escalas', type: 'admin' },
  { path: '/admin/funcoes', expectedStatus: 307, description: 'Funções', type: 'admin' },
  { path: '/admin/atendimento', expectedStatus: 307, description: 'Atendimento', type: 'admin' },
  { path: '/admin/evangelizacao', expectedStatus: 307, description: 'Evangelização', type: 'admin' },
  { path: '/admin/juventude', expectedStatus: 307, description: 'Juventude', type: 'admin' },
  { path: '/admin/estudos', expectedStatus: 307, description: 'Estudos', type: 'admin' },
  { path: '/admin/mediunidade', expectedStatus: 307, description: 'Mediunidade (RLS)', type: 'admin' },
  { path: '/admin/biblioteca', expectedStatus: 307, description: 'Biblioteca', type: 'admin' },
  { path: '/admin/livraria', expectedStatus: 307, description: 'Livraria', type: 'admin' },
  { path: '/admin/apse', expectedStatus: 307, description: 'APSE', type: 'admin' },
  { path: '/admin/comunicacao', expectedStatus: 307, description: 'Comunicação', type: 'admin' },
  { path: '/admin/financeiro', expectedStatus: 307, description: 'Financeiro', type: 'admin' },
  { path: '/admin/patrimonio', expectedStatus: 307, description: 'Patrimônio', type: 'admin' },
  { path: '/admin/governanca', expectedStatus: 307, description: 'Governança', type: 'admin' },
  { path: '/admin/planejamento', expectedStatus: 307, description: 'Planejamento', type: 'admin' },
  { path: '/admin/notificacoes', expectedStatus: 307, description: 'Notificações', type: 'admin' },
  { path: '/admin/relatorios', expectedStatus: 307, description: 'Relatórios', type: 'admin' },
  { path: '/admin/reunioes-virtuais', expectedStatus: 307, description: 'Reuniões Virtuais', type: 'admin' },
  { path: '/admin/documentos', expectedStatus: 307, description: 'Documentos/LGPD', type: 'admin' },
  { path: '/admin/erros', expectedStatus: 307, description: 'Debug (Erros)', type: 'admin' },
];

async function testRoute(route: RouteTest): Promise<{ route: RouteTest; status: number; passed: boolean; error?: string }> {
  try {
    const response = await fetch(`${BASE_URL}${route.path}`, {
      method: 'GET',
      redirect: 'manual', // Não seguir redirects automaticamente
    });

    const status = response.status;
    const expectedStatuses = Array.isArray(route.expectedStatus)
      ? route.expectedStatus
      : [route.expectedStatus];

    const passed = expectedStatuses.includes(status);

    return {
      route,
      status,
      passed,
    };
  } catch (error) {
    return {
      route,
      status: 0,
      passed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function runTests() {
  console.log('\n🚀 Routes Coverage Test\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log('='.repeat(80));

  // Testar conexão
  try {
    const response = await fetch(`${BASE_URL}/`);
    console.log(`✓ Servidor respondendo (Status: ${response.status})\n`);
  } catch (error) {
    console.error(`❌ Servidor não está respondendo!`);
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }

  // Separar rotas por tipo
  const publicRoutes = routes.filter(r => r.type === 'public');
  const protectedRoutes = routes.filter(r => r.type === 'protected');
  const adminRoutes = routes.filter(r => r.type === 'admin');

  // Executar testes
  const results = await Promise.all(routes.map(testRoute));

  // Exibir resultados por tipo
  const displayResults = (title: string, testResults: typeof results) => {
    if (testResults.length === 0) return;

    console.log(`\n${title}`);
    console.log('-'.repeat(80));

    testResults.forEach(result => {
      const status = result.passed ? '✅' : '❌';
      const statusCode = result.status || 'ERR';
      const expectedStatus = Array.isArray(result.route.expectedStatus)
        ? result.route.expectedStatus.join('/')
        : result.route.expectedStatus;

      console.log(
        `${status} [${statusCode}] ${result.route.path.padEnd(30)} → ${result.route.description}`
      );

      if (result.error) {
        console.log(`   ⚠️ Error: ${result.error}`);
      }
      if (!result.passed) {
        console.log(`   Expected: ${expectedStatus}, Got: ${result.status}`);
      }
    });
  };

  displayResults('📍 ROTAS PÚBLICAS (HTTP 200)', results.slice(0, publicRoutes.length));
  displayResults('🔐 ROTAS PROTEGIDAS (HTTP 307)', results.slice(publicRoutes.length, publicRoutes.length + protectedRoutes.length));
  displayResults('📊 MÓDULOS DE ADMIN (HTTP 307)', results.slice(publicRoutes.length + protectedRoutes.length));

  // Resumo
  console.log('\n' + '='.repeat(80));
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const percentage = Math.round((passed / total) * 100);

  console.log(`\n📊 RESUMO`);
  console.log(`Total: ${total} rotas`);
  console.log(`✅ Passou: ${passed}`);
  console.log(`❌ Falhou: ${total - passed}`);
  console.log(`Coverage: ${percentage}%`);

  if (passed === total) {
    console.log('\n🎉 TODAS AS ROTAS ESTÃO FUNCIONANDO!\n');
    process.exit(0);
  } else {
    console.log('\n⚠️ Algumas rotas falharam. Verifique acima.\n');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Test error:', error);
  process.exit(1);
});
