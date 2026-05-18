#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env');

const env = {};
fs.readFileSync(envPath, 'utf-8')
  .split('\n')
  .forEach((line) => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      env[key.trim()] = valueParts.join('=').trim();
    }
  });

const supabase = createClient(env.GEEF_SUPABASE_URL, env.GEEF_SUPABASE_SERVICE_ROLE_KEY);

const { data: pessoas } = await supabase.from('pessoas').select('*').limit(10);
console.log('📋 Pessoas criadas:');
console.log(JSON.stringify(pessoas, null, 2));

const { data: usuarios } = await supabase
  .from('usuarios_sistema')
  .select('id, perfil, pessoa_id, pessoas(nome, email)')
  .limit(10);
console.log('\n👥 Usuários do sistema:');
console.log(JSON.stringify(usuarios, null, 2));
