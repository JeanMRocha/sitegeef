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

console.log('🧪 Testando getPessoas com service role...\n');

// Simular a query que getPessoas faz
const { data, count, error } = await supabase
  .from('pessoas')
  .select('id,nome,email,telefone,status,criado_em', { count: 'exact' })
  .range(0, 19);

console.log('Query result:');
console.log(`  Data: ${data?.length || 0} registros`);
console.log(`  Count: ${count}`);
console.log(`  Error: ${error ? JSON.stringify(error) : 'none'}`);

if (data && data.length > 0) {
  console.log('\n📋 Pessoas:');
  data.forEach((p) => {
    console.log(`  - ${p.nome} (${p.email}) - Status: ${p.status}`);
  });
} else {
  console.log('\n❌ Nenhuma pessoa encontrada!');
}
