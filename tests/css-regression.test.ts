/**
 * CSS Regression Gate Test
 *
 * Valida que os estilos CSS estão sendo importados corretamente
 * e que as classes principais estão presentes no HTML renderizado.
 *
 * Uso: npx ts-node tests/css-regression.test.ts
 */

const BASE_URL = 'http://localhost:3500';

interface CSSTest {
  page: string;
  url: string;
  requiredClasses: string[];
  requiredCSSVariables?: string[];
}

const cssTests: CSSTest[] = [
  {
    page: 'Home Page',
    url: '/',
    requiredClasses: [
      '.hero',
      '.feature-grid',
      '.schedule-grid',
      '.contact-grid',
      '.site-header',
      '.site-footer',
      '.button',
      '.button-primary',
    ],
    requiredCSSVariables: ['--uva', '--bg', '--text', '--font-heading'],
  },
  {
    page: 'Login Page',
    url: '/login',
    requiredClasses: [
      '.login-container',
      '.login-form',
      '.form-group',
      '.site-header',
      '.site-footer',
    ],
    requiredCSSVariables: ['--uva', '--text', '--bg'],
  },
  {
    page: 'Escalas Públicas',
    url: '/escalas',
    requiredClasses: ['.site-header', '.site-footer', '.section'],
    requiredCSSVariables: ['--uva', '--text'],
  },
];

async function testCSSOnPage(test: CSSTest): Promise<{
  page: string;
  url: string;
  passed: boolean;
  missingClasses: string[];
  missingVariables: string[];
  error?: string;
}> {
  try {
    const response = await fetch(`${BASE_URL}${test.url}`, { method: 'GET' });
    if (!response.ok) {
      return {
        page: test.page,
        url: test.url,
        passed: false,
        missingClasses: [],
        missingVariables: [],
        error: `HTTP ${response.status}`,
      };
    }

    const html = await response.text();

    // Verificar se CSS foi importado (arquivo externo Next.js)
    const cssFileMatch = html.match(/href="(\/_next\/static\/css\/app\/layout\.css[^"]*?)"/);
    if (!cssFileMatch) {
      return {
        page: test.page,
        url: test.url,
        passed: false,
        missingClasses: [],
        missingVariables: [],
        error: 'CSS file not found in HTML',
      };
    }

    // Fetch do arquivo CSS compilado
    const cssFileUrl = cssFileMatch[1];
    const cssResponse = await fetch(`${BASE_URL}${cssFileUrl}`);
    if (!cssResponse.ok) {
      return {
        page: test.page,
        url: test.url,
        passed: false,
        missingClasses: [],
        missingVariables: [],
        error: `CSS file HTTP ${cssResponse.status}`,
      };
    }

    const cssContent = await cssResponse.text();

    // Verificar classes CSS no arquivo CSS compilado
    const missingClasses = test.requiredClasses.filter(
      (cssClass) => !cssContent.includes(cssClass)
    );

    // Verificar variáveis CSS no arquivo CSS compilado
    const missingVariables = test.requiredCSSVariables
      ? test.requiredCSSVariables.filter((varName) => !cssContent.includes(varName))
      : [];

    const passed = missingClasses.length === 0 && missingVariables.length === 0;

    return {
      page: test.page,
      url: test.url,
      passed,
      missingClasses,
      missingVariables,
    };
  } catch (error) {
    return {
      page: test.page,
      url: test.url,
      passed: false,
      missingClasses: [],
      missingVariables: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function runTests() {
  console.log('\n🎨 CSS Regression Gate Test\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log('='.repeat(80));

  // Verificar conexão
  try {
    const response = await fetch(`${BASE_URL}/`);
    console.log(`✓ Servidor respondendo (Status: ${response.status})\n`);
  } catch (error) {
    console.error(`❌ Servidor não está respondendo!`);
    console.error(
      `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    process.exit(1);
  }

  // Executar testes
  const results = await Promise.all(cssTests.map(testCSSOnPage));

  // Exibir resultados
  results.forEach((result) => {
    const status = result.passed ? '✅' : '❌';
    console.log(`${status} ${result.page} (${result.url})`);

    if (!result.passed) {
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      if (result.missingClasses.length > 0) {
        console.log(`   Missing classes: ${result.missingClasses.join(', ')}`);
      }
      if (result.missingVariables.length > 0) {
        console.log(
          `   Missing CSS variables: ${result.missingVariables.join(', ')}`
        );
      }
    }
  });

  // Resumo
  console.log('\n' + '='.repeat(80));
  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  const percentage = Math.round((passed / total) * 100);

  console.log(`\n📊 RESUMO`);
  console.log(`Total: ${total} páginas`);
  console.log(`✅ Passou: ${passed}`);
  console.log(`❌ Falhou: ${total - passed}`);
  console.log(`Coverage: ${percentage}%`);

  if (passed === total) {
    console.log('\n✅ NENHUMA REGRESSÃO DE CSS DETECTADA!\n');
    process.exit(0);
  } else {
    console.log('\n⚠️ REGRESSÃO CSS DETECTADA! Verifique as falhas acima.\n');
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  console.error('Test error:', error);
  process.exit(1);
});
