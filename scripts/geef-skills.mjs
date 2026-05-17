#!/usr/bin/env node

/**
 * CLI para gerenciar skills do Autoreflex
 *
 * Uso:
 *   node scripts/geef-skills.mjs search "padrão admin"
 *   node scripts/geef-skills.mjs list
 *   node scripts/geef-skills.mjs index
 */

const AUTOREFLEX_URL = 'http://127.0.0.1:8090';
const SKILLS_DIR = './skills';
const SKILL_PRIORITY = [
  { key: 'admin', skillPath: 'skills/padrao-modulo-admin.md', label: 'Padrão de Módulo Admin GEEF' },
  { key: 'action', skillPath: 'skills/padrao-actions-ts.md', label: 'Padrão de Server Actions GEEF' },
  { key: 'supabase', skillPath: 'skills/supabase-patterns.md', label: 'Padrões Supabase GEEF' },
  { key: 'permission', skillPath: 'skills/auth-permissions.md', label: 'Sistema de Permissões GEEF' },
  { key: 'migration', skillPath: 'skills/migrations-workflow.md', label: 'Workflow de Migrações GEEF' },
  { key: 'notification', skillPath: 'skills/notificacoes-timers-avisos.md', label: 'Notificações, Timers e Avisos (OpnForm)' },
  { key: 'report', skillPath: 'skills/relatorios-geef.md', label: 'Relatórios GEEF' },
  { key: 'reports', skillPath: 'skills/relatorios-geef.md', label: 'Relatórios GEEF' },
  { key: 'dashboard', skillPath: 'skills/relatorios-geef.md', label: 'Relatórios GEEF' },
  { key: 'livraria', skillPath: 'skills/livraria-biblioteca-hibrida.md', label: 'Livraria + Biblioteca Híbrida GEEF' },
  { key: 'biblioteca', skillPath: 'skills/livraria-biblioteca-hibrida.md', label: 'Livraria + Biblioteca Híbrida GEEF' },
  { key: 'livros', skillPath: 'skills/livraria-biblioteca-hibrida.md', label: 'Livraria + Biblioteca Híbrida GEEF' },
  { key: 'orchestration', skillPath: 'skills/roteamento-operacional-autoreflex.md', label: 'Roteamento Operacional de Skills GEEF' },
];

async function api(endpoint, method, body = null) {
  const url = `${AUTOREFLEX_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Erro ao conectar em ${AUTOREFLEX_URL}`);
    console.error(`   Certifique-se de que o Autoreflex está rodando.`);
    console.error(`   Erro: ${error.message}`);
    process.exit(1);
  }
}

async function search(query, limit = 5) {
  console.log(`🔍 Buscando: "${query}"`);
  console.log();

  const { results } = await api('/agent/skills/search', 'POST', {
    query,
    limit,
  });

  if (!results || results.length === 0) {
    console.log('Nenhuma skill encontrada.');
    return;
  }

  console.log(`Encontrados ${results.length} resultados:\n`);

  results.forEach((result, idx) => {
    console.log(`${idx + 1}. ${result.skill_name}`);
    console.log(`   Score: ${(result.score * 100).toFixed(1)}%`);
    console.log(`   Caminho: ${result.skill_path}`);
    console.log(`   Resumo: ${result.summary}`);
    console.log();
  });
}

async function read(skillPath) {
  console.log(`📖 Lendo skill: ${skillPath}\n`);

  const { content } = await api('/agent/skills/get', 'POST', {
    skill_path: skillPath,
  });

  console.log(content);
}

async function index() {
  console.log(`📇 Indexando skills em ${SKILLS_DIR}...`);
  console.log();

  const { indexed_files, indexed_chunks } = await api(
    '/agent/skills/index',
    'POST',
    {} // Indexa tudo
  );

  console.log(`✅ Indexação completa!`);
  console.log(`   Arquivos: ${indexed_files.length}`);
  console.log(`   Chunks: ${indexed_chunks}`);
  console.log();

  if (indexed_files.length > 0) {
    console.log('Arquivos indexados:');
    indexed_files.forEach(f => console.log(`  • ${f}`));
  }
}

async function list() {
  console.log(`📋 Listando skills indexadas...\n`);

  // Buscar com query vazia retorna todas (até o limit)
  const { results } = await api('/agent/skills/search', 'POST', {
    query: '*',
    limit: 100,
  });

  if (!results || results.length === 0) {
    console.log('Nenhuma skill indexada ainda.');
    return;
  }

  console.log(`Total: ${results.length} skills\n`);

  results.forEach((skill, idx) => {
    console.log(`${idx + 1}. ${skill.skill_name}`);
    console.log(`   Caminho: ${skill.skill_path}`);
    console.log();
  });
}

function tokenize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9]+/g)
    .filter(Boolean);
}

async function loadLocalSkills() {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
  const metas = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.meta.json')) {
      continue;
    }

    const metaPath = path.join(SKILLS_DIR, entry.name);
    const raw = await fs.readFile(metaPath, 'utf8');
    metas.push(JSON.parse(raw));
  }

  return metas;
}

async function recommend(query) {
  const tokens = tokenize(query);
  if (tokens.length === 0) {
    console.error('❌ Forneça uma frase para recomendação.');
    process.exit(1);
  }

  const metas = await loadLocalSkills();
  const scored = metas.map((meta) => {
    const haystack = tokenize(
      [
        meta.name,
        meta.title,
        meta.summary,
        ...(meta.tags || []),
      ].join(' ')
    );

    let score = 0;
    for (const token of tokens) {
      if (haystack.includes(token)) {
        score += 2;
      }
      for (const part of SKILL_PRIORITY) {
        if (meta.source_skill_path === part.skillPath && query.toLowerCase().includes(part.key)) {
          score += 3;
        }
      }
    }

    return { meta, score };
  }).sort((a, b) => b.score - a.score);

  const ranked = scored.filter((item) => item.score > 0);
  const best = ranked[0] || scored[0];

  if (!best) {
    console.log('Nenhuma skill local disponível para recomendação.');
    return;
  }

  console.log(`🧭 Recomendação para: "${query}"`);
  console.log();
  console.log(`1. ${best.meta.title}`);
  console.log(`   Caminho: ${best.meta.source_skill_path}`);
  console.log(`   Motivo: melhor correspondência local entre título, resumo e tags.`);
  console.log();

  if (ranked.length > 1) {
    console.log('Alternativas próximas:');
    ranked.slice(1, 4).forEach((item, idx) => {
      console.log(`  ${idx + 2}. ${item.meta.title} (${item.meta.source_skill_path})`);
    });
  }
}

async function health() {
  try {
    const res = await fetch(`${AUTOREFLEX_URL}/health`);
    if (res.ok) {
      console.log('✅ Autoreflex está rodando em', AUTOREFLEX_URL);
      return true;
    }
  } catch (err) {
    // Continuar com erro
  }
  return false;
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.log(`
🎓 Autoreflex Skills Manager — GEEF ERP

Uso:
  node scripts/geef-skills.mjs search "<query>"    Buscar skills
  node scripts/geef-skills.mjs recommend "<frase>"  Sugerir a melhor skill local
  node scripts/geef-skills.mjs read "<skill-path>" Ler skill completa
  node scripts/geef-skills.mjs list                Listar todas as skills
  node scripts/geef-skills.mjs index               Reindexar todas as skills
  node scripts/geef-skills.mjs health              Verificar status

Exemplos:
  node scripts/geef-skills.mjs search "padrão admin"
  node scripts/geef-skills.mjs read "skills/padrao-modulo-admin.md"
  node scripts/geef-skills.mjs index
    `);
    return;
  }

  // Verificar se Autoreflex está rodando (exceto para help)
  if (command !== 'help' && command !== 'health' && command !== 'recommend') {
    const running = await health();
    if (!running) {
      console.error('\n❌ Autoreflex não está respondendo.');
      console.error('   Certifique-se de que está instalado e rodando:');
      console.error('   $ cd Autoreflex');
      console.error('   $ python install/install.py');
      process.exit(1);
    }
    console.log();
  }

  switch (command) {
    case 'search': {
      const query = args.slice(1).join(' ') || '';
      if (!query) {
        console.error('❌ Forneça uma query: node scripts/geef-skills.mjs search "termo"');
        process.exit(1);
      }
      await search(query);
      break;
    }

    case 'recommend': {
      const query = args.slice(1).join(' ') || '';
      await recommend(query);
      break;
    }

    case 'read': {
      const skillPath = args[1];
      if (!skillPath) {
        console.error('❌ Forneça o caminho: node scripts/geef-skills.mjs read "skills/nome.md"');
        process.exit(1);
      }
      await read(skillPath);
      break;
    }

    case 'list': {
      await list();
      break;
    }

    case 'index': {
      await index();
      break;
    }

    case 'health': {
      const running = await health();
      if (running) {
        console.log('Status: OK');
      } else {
        console.log('❌ Autoreflex não está respondendo');
        process.exit(1);
      }
      break;
    }

    case 'help': {
  console.log(`
🎓 Autoreflex Skills Manager — GEEF ERP

Uso:
  node scripts/geef-skills.mjs search "<query>"    Buscar skills
  node scripts/geef-skills.mjs recommend "<frase>"  Sugerir a melhor skill local
  node scripts/geef-skills.mjs read "<skill-path>" Ler skill completa
  node scripts/geef-skills.mjs list                Listar todas as skills
  node scripts/geef-skills.mjs index               Reindexar todas as skills
  node scripts/geef-skills.mjs health              Verificar status

Exemplos:
  node scripts/geef-skills.mjs search "padrão admin"
  node scripts/geef-skills.mjs read "skills/padrao-modulo-admin.md"
  node scripts/geef-skills.mjs index
      `);
      break;
    }

    default: {
      console.error(`❌ Comando desconhecido: ${command}`);
    console.error('   Use: help, search, recommend, read, list, index, health');
      process.exit(1);
    }
  }
}

main().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
