#!/usr/bin/env node

import fs from "fs";
import { mkdir, readFile } from "fs/promises";
import path from "path";
import { spawnSync } from "child_process";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import postgres from "postgres";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const ROOT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ADDITIVE_MIGRATION = path.join(
  ROOT_DIR,
  "supabase/migrations/20260523_instituicao_modelagem_total.sql"
);
const CLEANUP_MIGRATION = path.join(
  ROOT_DIR,
  "supabase/migrations/20260524_instituicao_cleanup_legado.sql"
);
const BACKUP_DIR = path.join(ROOT_DIR, "backups");
const DB_URL_KEYS = [
  "GEEF_SUPABASE_DB_URL",
  "SUPABASE_DB_URL",
  "SUPABASE_DIRECT_DB_URL",
  "SUPABASE_DB_SESSION_URL",
  "SUPABASE_DB_TRANSACTION_URL",
  "GEEF_DATABASE_URL",
  "DATABASE_URL",
];

function getDatabaseUrl() {
  for (const key of DB_URL_KEYS) {
    const value = process.env[key];
    if (value) {
      return value;
    }
  }

  return null;
}

function createDbClient(databaseUrl) {
  return postgres(databaseUrl, {
    max: 1,
    ssl: "require",
    prepare: false,
  });
}

function runPgDump(databaseUrl, backupFile) {
  const result = spawnSync(
    "pg_dump",
    [databaseUrl, "--format=custom", "--file", backupFile],
    { stdio: "inherit", shell: false }
  );

  if (result.error) {
    throw new Error(`pg_dump indisponível: ${result.error.message}`);
  }

  if (result.status !== 0) {
    throw new Error(`pg_dump falhou com código ${result.status}`);
  }
}

async function confirm(question) {
  const rl = readline.createInterface({ input, output });
  try {
    const answer = (await rl.question(`${question} [y/N] `)).trim().toLowerCase();
    return answer === "y" || answer === "yes" || answer === "sim";
  } finally {
    rl.close();
  }
}

async function applySqlFile(db, filePath) {
  const sql = await readFile(filePath, "utf8");
  await db.unsafe(sql);
}

async function validateInstitutionState(db) {
  const [
    instituicaoCount,
    enderecosNull,
    contatosNull,
    cnaesNull,
    cnaesPrincipal,
  ] = await Promise.all([
    db`select count(*)::int as count from public.instituicao`,
    db`select count(*)::int as count from public.instituicao_enderecos where instituicao_id is null`,
    db`select count(*)::int as count from public.instituicao_contatos where instituicao_id is null`,
    db`select count(*)::int as count from public.instituicao_cnaes where instituicao_id is null`,
    db`select count(*)::int as count from public.instituicao_cnaes where tipo = 'principal'`,
  ]);

  return {
    instituicaoCount: instituicaoCount[0]?.count ?? 0,
    enderecosNull: enderecosNull[0]?.count ?? 0,
    contatosNull: contatosNull[0]?.count ?? 0,
    cnaesNull: cnaesNull[0]?.count ?? 0,
    cnaesPrincipal: cnaesPrincipal[0]?.count ?? 0,
  };
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    console.error(
      "❌ Defina GEEF_SUPABASE_DB_URL, SUPABASE_DB_URL, SUPABASE_DIRECT_DB_URL ou DATABASE_URL antes de executar."
    );
    process.exit(1);
  }

  if (!fs.existsSync(ADDITIVE_MIGRATION)) {
    console.error(`❌ Migration aditiva não encontrada: ${ADDITIVE_MIGRATION}`);
    process.exit(1);
  }

  if (!fs.existsSync(CLEANUP_MIGRATION)) {
    console.error(`❌ Migration de cleanup não encontrada: ${CLEANUP_MIGRATION}`);
    process.exit(1);
  }

  await mkdir(BACKUP_DIR, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = path.join(BACKUP_DIR, `instituicao_${timestamp}.dump`);

  console.log("== Migration segura da instituicao ==");
  console.log(`DB: ${databaseUrl.replace(/:[^:@/]+@/, ":***@")}`);
  console.log(`Aditiva: ${path.relative(ROOT_DIR, ADDITIVE_MIGRATION)}`);
  console.log(`Cleanup: ${path.relative(ROOT_DIR, CLEANUP_MIGRATION)}`);
  console.log("");

  if (!args.has("--skip-backup")) {
    console.log("1) Criando backup com pg_dump...");
    runPgDump(databaseUrl, backupFile);
    console.log(`   backup salvo em ${path.relative(ROOT_DIR, backupFile)}`);
    console.log("");
  } else {
    console.log("1) Backup ignorado por flag --skip-backup");
    console.log("");
  }

  const db = createDbClient(databaseUrl);

  try {
    console.log("2) Aplicando migration aditiva...");
    await applySqlFile(db, ADDITIVE_MIGRATION);
    console.log("   ok");
    console.log("");

    console.log("3) Validando backfill...");
    const validation = await validateInstitutionState(db);
    console.log(`   instituicao: ${validation.instituicaoCount}`);
    console.log(`   enderecos sem instituicao_id: ${validation.enderecosNull}`);
    console.log(`   contatos sem instituicao_id: ${validation.contatosNull}`);
    console.log(`   cnaes sem instituicao_id: ${validation.cnaesNull}`);
    console.log(`   cnaes principal: ${validation.cnaesPrincipal}`);
    console.log("");

    const validationFailed =
      validation.instituicaoCount !== 1 ||
      validation.enderecosNull > 0 ||
      validation.contatosNull > 0 ||
      validation.cnaesNull > 0 ||
      validation.cnaesPrincipal === 0;

    if (validationFailed) {
      throw new Error("Validação do backfill falhou. Pare antes do cleanup.");
    }

    const shouldCleanup = args.has("--cleanup") || (process.stdin.isTTY && (await confirm("4) Aplicar cleanup destrutivo agora?")));

    if (shouldCleanup) {
      console.log("");
      console.log("4) Aplicando cleanup destrutivo...");
      await applySqlFile(db, CLEANUP_MIGRATION);
      console.log("   ok");
    } else {
      console.log("");
      console.log("4) Cleanup não aplicado. Rode manualmente depois do backup e validação.");
    }

    console.log("");
    console.log("✅ Fluxo concluído.");
  } catch (error) {
    console.error("");
    console.error(`❌ ${error.message}`);
    process.exitCode = 1;
  } finally {
    await db.end({ timeout: 5 });
  }
}

main();
