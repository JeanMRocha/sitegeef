const baseUrl = process.env.ADMIN_SMOKE_BASE_URL || 'http://localhost:3500';

const routes = [
  '/admin',
  '/admin/pessoas',
  '/admin/usuarios',
  '/admin/governanca',
  '/admin/departamentos',
  '/admin/apse',
  '/admin/atendimento',
  '/admin/biblioteca',
  '/admin/comunicacao',
  '/admin/estudos',
  '/admin/escalas',
  '/admin/mediunidade',
  '/admin/reunioes-virtuais',
  '/admin/instituicao',
  '/admin/documentos',
  '/admin/financeiro',
  '/admin/livraria',
  '/admin/notificacoes',
  '/admin/patrimonio',
  '/admin/planejamento',
  '/admin/juventude',
  '/admin/evangelizacao',
  '/admin/funcoes',
  '/admin/relatorios',
];

const errorPatterns = [
  /Módulo de erros/i,
  /Ocorreu um erro na aplicação/i,
  /Abrir painel de erros/i,
  /Could not find the module .* React Client Manifest/i,
  /Refused to apply style from .* MIME type \('text\/plain'\)/i,
  /Failed to load resource: the server responded with a status of 404/i,
];

async function checkRoute(route) {
  const response = await fetch(`${baseUrl}${route}`);
  const body = await response.text();
  const failures = [];

  if (response.status !== 200) {
    failures.push(`status ${response.status}`);
  }

  for (const pattern of errorPatterns) {
    if (pattern.test(body)) {
      failures.push(`body matched ${pattern}`);
    }
  }

  if (!body.includes('html') || !body.includes('<body')) {
    failures.push('invalid html shell');
  }

  return {
    route,
    ok: failures.length === 0,
    failures,
  };
}

const results = [];
for (const route of routes) {
  results.push(await checkRoute(route));
}

const failed = results.filter((result) => !result.ok);

for (const result of failed) {
  console.error(`FAIL ${result.route}: ${result.failures.join(', ')}`);
}

if (failed.length > 0) {
  process.exitCode = 1;
  console.error(`Admin smoke test failed for ${failed.length}/${results.length} routes.`);
} else {
  console.log(`Admin smoke test passed for ${results.length} routes.`);
}
