#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Validating design system compliance...\n');

const violations = {
  hardcodedColors: [],
  inlineStyles: [],
  missingVars: []
};

// Check TypeScript/TSX files for inline styles
const tsxFiles = execSync('find . -type f -name "*.tsx" -not -path "./node_modules/*" -not -path "./.next/*"', { encoding: 'utf8' }).split('\n').filter(Boolean);

console.log(`📄 Checking ${tsxFiles.length} TypeScript/React files...\n`);

tsxFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line, idx) => {
    // Check for inline styles
    if (/style=\{\{/.test(line) && !/style=\{\{.*var\(/.test(line)) {
      // Allow some exceptions
      if (!line.includes('display: flex') || line.includes('outline: none')) {
        violations.inlineStyles.push({
          file,
          line: idx + 1,
          preview: line.trim().substring(0, 80)
        });
      }
    }
    
    // Check for hardcoded colors
    if (/#[0-9a-fA-F]{3,6}/.test(line) && !line.includes('var(--')) {
      violations.hardcodedColors.push({
        file,
        line: idx + 1,
        preview: line.trim().substring(0, 80)
      });
    }
  });
});

// Print results
let hasIssues = false;

if (violations.hardcodedColors.length > 0) {
  hasIssues = true;
  console.log('⚠️  Hardcoded Colors Detected:\n');
  violations.hardcodedColors.slice(0, 10).forEach(v => {
    console.log(`  ${path.relative('.', v.file)}:${v.line}`);
    console.log(`    ${v.preview}...\n`);
  });
  if (violations.hardcodedColors.length > 10) {
    console.log(`  ... and ${violations.hardcodedColors.length - 10} more\n`);
  }
}

if (violations.inlineStyles.length > 0) {
  hasIssues = true;
  console.log('⚠️  Inline Styles Detected:\n');
  violations.inlineStyles.slice(0, 10).forEach(v => {
    console.log(`  ${path.relative('.', v.file)}:${v.line}`);
    console.log(`    ${v.preview}...\n`);
  });
  if (violations.inlineStyles.length > 10) {
    console.log(`  ... and ${violations.inlineStyles.length - 10} more\n`);
  }
}

if (!hasIssues) {
  console.log('✅ Design system compliance check passed!\n');
  process.exit(0);
} else {
  console.log('\n💡 Fix: Use CSS variables from styles/identity-system.css or classes from styles/utilities.css\n');
  process.exit(1);
}
