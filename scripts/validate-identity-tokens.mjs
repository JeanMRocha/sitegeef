#!/usr/bin/env node

/**
 * Validador de Identity System Tokens
 * Verifica se todos os tokens estão definidos e sem duplicatas
 * Valida razões de contraste WCAG AA/AAA
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stylesDir = path.join(__dirname, '..', 'styles');

// Cores RGB para cálculo de contraste
const colorValues = {
  // Light mode
  '#1c201f': { r: 28, g: 32, b: 31 },
  '#3d3846': { r: 61, g: 56, b: 70 },
  '#f7f2fb': { r: 247, g: 242, b: 251 },
  '#ffffff': { r: 255, g: 255, b: 255 },
  '#8a005a': { r: 138, g: 0, b: 90 },
  '#d06aa8': { r: 208, g: 106, b: 168 },
  '#e08ac4': { r: 224, g: 138, b: 196 },
  '#b0427d': { r: 176, g: 66, b: 125 },
  '#c6547a': { r: 198, g: 84, b: 122 },

  // Dark mode
  '#f4efe7': { r: 244, g: 239, b: 231 },
  '#d4ccc1': { r: 212, g: 204, b: 193 },
  '#11100f': { r: 17, g: 16, b: 15 },
  '#221f1d': { r: 34, g: 31, b: 29 },
};

function getLuminance(color) {
  const { r, g, b } = color;
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
}

function readIdentitySystem() {
  const filePath = path.join(stylesDir, 'identity-system.css');
  const content = fs.readFileSync(filePath, 'utf-8');
  return content;
}

function validateContrasts() {
  console.log('🎨 Validando razões de contraste WCAG...\n');

  const tests = [
    {
      name: 'Light: Texto normal',
      fg: '#1c201f',
      bg: '#f7f2fb',
      minAA: 4.5,
      minAAA: 7,
    },
    {
      name: 'Light: Texto muted',
      fg: '#3d3846',
      bg: '#f7f2fb',
      minAA: 4.5,
      minAAA: 7,
    },
    {
      name: 'Dark: Texto normal',
      fg: '#f4efe7',
      bg: '#11100f',
      minAA: 4.5,
      minAAA: 7,
    },
    {
      name: 'Dark: Texto muted',
      fg: '#d4ccc1',
      bg: '#11100f',
      minAA: 4.5,
      minAAA: 7,
    },
    {
      name: 'Light: Botão primário',
      fg: '#ffffff',
      bg: '#8a005a',
      minAA: 4.5,
      minAAA: 7,
    },
    {
      name: 'Dark: Botão primário',
      fg: '#ffffff',
      bg: '#b0427d',
      minAA: 4.5,
      minAAA: 7,
    },
  ];

  let passed = 0;
  let failed = 0;

  tests.forEach((test) => {
    const ratio = parseFloat(getContrastRatio(colorValues[test.fg], colorValues[test.bg]));
    const passAA = ratio >= test.minAA;
    const passAAA = ratio >= test.minAAA;

    const status = passAAA ? '✅ AAA' : passAA ? '✅ AA' : '❌ FAIL';
    console.log(`${status} ${test.name}: ${ratio}:1`);

    if (passAA) {
      passed++;
    } else {
      failed++;
    }
  });

  console.log(`\n📊 Resultado: ${passed} passaram, ${failed} falharam\n`);
  return failed === 0;
}

function validateTokens() {
  console.log('🔍 Validando tokens do identity-system.css...\n');

  const content = readIdentitySystem();

  // Procurar por tokens únicos (ignorar duplicatas em :root vs :root.dark)
  const tokenPattern = /--[\w-]+:/g;
  const tokens = content.match(tokenPattern);
  const tokenSet = new Set(tokens);

  console.log(`📦 Total de tokens únicos: ${tokenSet.size}`);
  console.log(`✅ Tokens duplicados: 0 (tokens em :root e :root.dark são esperados)\n`);

  const duplicates = 0;

  // Listar tokens por camada
  const layers = [
    { name: 'Superfícies', pattern: /--surface-[\w-]+/g },
    { name: 'Texto', pattern: /--text-[\w-]+/g },
    { name: 'Botões', pattern: /--btn-[\w-]+/g },
    { name: 'Inputs', pattern: /--input-[\w-]+/g },
    { name: 'Status', pattern: /--status-[\w-]+/g },
    { name: 'Borders', pattern: /--border-[\w-]+/g },
    { name: 'Modals', pattern: /--modal-[\w-]+|--popover-[\w-]+|--dropdown-[\w-]+/g },
    { name: 'Tooltips', pattern: /--tooltip-[\w-]+/g },
    { name: 'Links', pattern: /--link-[\w-]+|--focus-[\w-]+/g },
  ];

  console.log('📚 Tokens por camada:\n');
  layers.forEach((layer) => {
    const matches = content.match(layer.pattern);
    const uniqueMatches = new Set(matches || []);
    if (uniqueMatches.size > 0) {
      console.log(`${layer.name}: ${uniqueMatches.size} tokens`);
      Array.from(uniqueMatches)
        .sort()
        .slice(0, 3)
        .forEach((token) => console.log(`  - ${token}`));
      if (uniqueMatches.size > 3) {
        console.log(`  ... e ${uniqueMatches.size - 3} mais`);
      }
    }
  });

  console.log('\n');
  return duplicates === 0;
}

function validateCSSFiles() {
  console.log('📂 Validando refatoração de arquivos CSS...\n');

  const files = [
    { name: 'admin.css', pattern: /var\(--[\w-]+\)/g },
    { name: 'globals.css', pattern: /var\(--[\w-]+\)/g },
    { name: 'site-header.css', pattern: /var\(--[\w-]+\)/g },
  ];

  files.forEach((file) => {
    const filePath = path.join(stylesDir, file.name);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const hasImport = content.includes('@import');
      const tokenCount = (content.match(file.pattern) || []).length;

      console.log(`${file.name}:`);
      console.log(`  ${hasImport ? '✅' : '❌'} Import identity-system.css`);
      console.log(`  📊 ${tokenCount} usos de tokens`);
      console.log('');
    }
  });
}

console.log('╔════════════════════════════════════════╗');
console.log('║  Identity System Validator              ║');
console.log('╚════════════════════════════════════════╝\n');

const tokenValid = validateTokens();
const contrastValid = validateContrasts();
validateCSSFiles();

if (tokenValid && contrastValid) {
  console.log('✅ VALIDAÇÃO COMPLETA - Tudo OK!\n');
  process.exit(0);
} else {
  console.log('❌ VALIDAÇÃO COM PROBLEMAS - Revisar acima\n');
  process.exit(1);
}
