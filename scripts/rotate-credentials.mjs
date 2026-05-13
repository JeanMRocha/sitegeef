#!/usr/bin/env node

/**
 * Credential Rotation Helper
 *
 * Este script ajuda a rotacionar credenciais sensíveis de forma segura.
 *
 * Uso:
 *   node scripts/rotate-credentials.mjs --help
 *   node scripts/rotate-credentials.mjs --validate
 *   node scripts/rotate-credentials.mjs --backup
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import readline from "node:readline";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const envPath = path.join(projectRoot, ".env");
const envBackupPath = path.join(projectRoot, ".env.backup");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function validateEnv() {
  console.log("\n🔍 Validando credenciais...\n");

  if (!fs.existsSync(envPath)) {
    console.error("❌ .env não encontrado em:", envPath);
    process.exit(1);
  }

  const content = fs.readFileSync(envPath, "utf-8");
  const lines = content.split("\n");

  const credentials = [
    {
      name: "GEEF_SUPABASE_SERVICE_ROLE_KEY",
      pattern: /^GEEF_SUPABASE_SERVICE_ROLE_KEY=(.+)$/,
      required: true,
      critical: true,
    },
    {
      name: "SUPABASE_SERVICE_ROLE_KEY",
      pattern: /^SUPABASE_SERVICE_ROLE_KEY=(.+)$/,
      required: true,
      critical: true,
    },
    {
      name: "GEEF_LOG_INGEST_TOKEN",
      pattern: /^GEEF_LOG_INGEST_TOKEN=(.+)$/,
      required: true,
      critical: true,
    },
    {
      name: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      pattern: /^NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=(.+)$/,
      required: true,
      critical: false,
    },
  ];

  let allValid = true;

  for (const cred of credentials) {
    const line = lines.find((l) => cred.pattern.test(l));

    if (!line) {
      if (cred.required) {
        console.error(`❌ ${cred.name}: FALTANDO`);
        allValid = false;
      } else {
        console.log(`⚠️  ${cred.name}: OPCIONAL (não encontrado)`);
      }
      continue;
    }

    const match = line.match(cred.pattern);
    const value = match?.[1];

    if (!value || value.length === 0) {
      console.error(`❌ ${cred.name}: VAZIO`);
      allValid = false;
      continue;
    }

    if (value.includes("[") || value.includes("AQUI")) {
      console.error(`⚠️  ${cred.name}: PLACEHOLDER (não substituído)`);
      allValid = false;
      continue;
    }

    const isJWT = value.includes("eyJ");
    const isToken = value.length > 32;

    if (cred.critical && isJWT) {
      console.log(`✅ ${cred.name}: JWT válido (${value.substring(0, 30)}...)`);
    } else if (cred.critical && isToken) {
      console.log(`✅ ${cred.name}: Token válido (${value.substring(0, 30)}...)`);
    } else if (!cred.critical) {
      console.log(`ℹ️  ${cred.name}: Presente (${value.substring(0, 30)}...)`);
    } else {
      console.log(`⚠️  ${cred.name}: Formato desconhecido`);
    }
  }

  console.log("");
  if (allValid) {
    console.log("✅ Todas as credenciais críticas estão presentes!\n");
  } else {
    console.error("❌ Existem credenciais ausentes ou inválidas.\n");
    process.exit(1);
  }
}

async function backupEnv() {
  console.log("\n💾 Fazendo backup de .env...\n");

  if (!fs.existsSync(envPath)) {
    console.error("❌ .env não encontrado");
    process.exit(1);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFilename = `.env.backup.${timestamp}`;
  const backupFullPath = path.join(projectRoot, backupFilename);

  fs.copyFileSync(envPath, backupFullPath);
  console.log(`✅ Backup criado: ${backupFilename}\n`);
}

async function rotateCredential() {
  console.log("\n🔄 Assistente de Rotação de Credenciais\n");

  const options = [
    "1) GEEF_SUPABASE_SERVICE_ROLE_KEY (JWT Supabase)",
    "2) GEEF_LOG_INGEST_TOKEN (Token de Ingestão)",
    "3) NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "0) Cancelar",
  ];

  console.log("Qual credencial deseja rotacionar?\n");
  options.forEach((opt) => console.log(opt));
  console.log("");

  const choice = await question("Escolha uma opção (0-3): ");

  const credentials = {
    "1": {
      varName: "GEEF_SUPABASE_SERVICE_ROLE_KEY",
      alsoUpdate: "SUPABASE_SERVICE_ROLE_KEY",
      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      instructions: `
1. Acesse https://app.supabase.com
2. Selecione o projeto: nycgpokqlmrfzegjlrwa
3. Vá para Settings → API
4. Clique em "Regenerate" no Service Role Key
5. Copie a nova chave
6. Cole aqui

`,
    },
    "2": {
      varName: "GEEF_LOG_INGEST_TOKEN",
      example: "0a99e3c2b76ba381102a595676f5fe1f22d6083a907a2e651b4ad7bf638782e...",
      instructions: `
1. Gere um novo token com: openssl rand -hex 64
2. Ou regenere no seu painel de logs
3. Cole aqui

`,
    },
    "3": {
      varName: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      example: "sb_publishable_...",
      instructions: `
1. Acesse https://app.supabase.com
2. Vá para Settings → API
3. Copie a Publishable Key
4. Cole aqui

`,
    },
  };

  if (choice === "0") {
    console.log("\n✅ Operação cancelada.\n");
    process.exit(0);
  }

  if (!credentials[choice]) {
    console.error("\n❌ Opção inválida\n");
    process.exit(1);
  }

  const cred = credentials[choice];
  console.log(cred.instructions);

  const newValue = await question(`Digite o novo valor para ${cred.varName}: `);

  if (!newValue || newValue.length === 0) {
    console.error("\n❌ Valor não pode estar vazio\n");
    process.exit(1);
  }

  // Backup
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(projectRoot, `.env.backup.${timestamp}`);
  fs.copyFileSync(envPath, backupPath);
  console.log(`\n💾 Backup criado: .env.backup.${timestamp}`);

  // Atualizar
  let content = fs.readFileSync(envPath, "utf-8");

  // Substitui a credencial principal
  content = content.replace(
    new RegExp(`^${cred.varName}=.+$`, "m"),
    `${cred.varName}=${newValue}`,
  );

  // Se houver também uma versão alternativa (tipo SUPABASE_SERVICE_ROLE_KEY)
  if (cred.alsoUpdate) {
    content = content.replace(
      new RegExp(`^${cred.alsoUpdate}=.+$`, "m"),
      `${cred.alsoUpdate}=${newValue}`,
    );
  }

  fs.writeFileSync(envPath, content);
  console.log(`✅ ${cred.varName} atualizado em .env\n`);

  console.log("📋 Próximos passos:\n");
  console.log("1. ✅ Você atualizou .env localmente");
  console.log("2. ⏳ Atualize os GitHub Secrets:");
  console.log(`   - https://github.com/Geef-EliasFrancis/sitegeef/settings/secrets/actions`);
  console.log(`   - Secret name: ${cred.varName}`);
  console.log(`   - Novo valor: ${newValue.substring(0, 20)}...`);
  console.log("");
  console.log("3. ⏳ Atualize a VPS:");
  console.log(`   - ssh ubuntu@204.216.166.12`);
  console.log(`   - nano /home/ubuntu/sitegeef/.env`);
  console.log(`   - Substitua ${cred.varName}`);
  console.log(`   - systemctl restart sitegeef`);
  console.log("");
  console.log("4. ✅ Teste a conexão:");
  console.log(`   - npm run collect:system-errors`);
  console.log("\n");
}

async function showHelp() {
  console.log(`
🔐 Credential Rotation Helper

Uso:
  node scripts/rotate-credentials.mjs [opção]

Opções:
  --validate   Valida todas as credenciais do .env
  --backup     Faz backup do .env com timestamp
  --rotate     Inicia assistente interativo de rotação
  --help       Mostra esta mensagem

Exemplos:
  node scripts/rotate-credentials.mjs --validate
  node scripts/rotate-credentials.mjs --backup
  node scripts/rotate-credentials.mjs --rotate

Credenciais críticas a rotacionar:
  - GEEF_SUPABASE_SERVICE_ROLE_KEY (JWT)
  - GEEF_LOG_INGEST_TOKEN (Token)

Documentação:
  Veja docs/SECURITY_ROTATION.md para mais detalhes.
`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case "--validate":
        await validateEnv();
        rl.close();
        break;

      case "--backup":
        await backupEnv();
        rl.close();
        break;

      case "--rotate":
        await rotateCredential();
        rl.close();
        break;

      case "--help":
      case "-h":
        await showHelp();
        rl.close();
        break;

      default:
        await showHelp();
        rl.close();
        process.exit(1);
    }
  } catch (error) {
    console.error("❌ Erro:", error.message);
    rl.close();
    process.exit(1);
  }
}

main();
