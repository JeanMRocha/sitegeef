#!/usr/bin/env node

/**
 * Script para setup de storage buckets no Supabase
 * Cria buckets necessários e configura políticas de acesso
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
  console.error('   Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão em .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const BUCKETS = [
  {
    name: 'instituicao-assets',
    public: true,
    description: 'Logo e assets da instituição',
  },
];

async function setupBuckets() {
  console.log('🔧 Configurando buckets de storage...\n');

  for (const bucketConfig of BUCKETS) {
    try {
      // Verifica se bucket existe
      const { data: existing } = await supabase.storage.listBuckets();
      const bucketExists = existing?.some((b) => b.name === bucketConfig.name);

      if (bucketExists) {
        console.log(`✅ Bucket '${bucketConfig.name}' já existe`);
        continue;
      }

      // Cria bucket
      const { data, error } = await supabase.storage.createBucket(bucketConfig.name, {
        public: bucketConfig.public,
      });

      if (error) {
        console.error(`❌ Erro ao criar bucket '${bucketConfig.name}': ${error.message}`);
        continue;
      }

      console.log(`✅ Bucket '${bucketConfig.name}' criado com sucesso`);
      console.log(`   ${bucketConfig.description}`);
      console.log(`   Acesso: ${bucketConfig.public ? 'Público' : 'Privado'}\n`);
    } catch (err) {
      console.error(`❌ Erro inesperado com bucket '${bucketConfig.name}':`, err.message);
    }
  }

  console.log('✅ Setup de buckets concluído!');
  console.log('   Os buckets estão prontos para uso.\n');
}

setupBuckets().catch((err) => {
  console.error('❌ Erro fatal:', err.message);
  process.exit(1);
});
