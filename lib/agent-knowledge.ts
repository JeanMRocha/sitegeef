import { readdirSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

export type KnowledgeSource = {
  path: string;
  title: string;
  summary: string;
  category: string;
};

export type KnowledgeHit = KnowledgeSource & {
  score: number;
  snippets: string[];
};

const KNOWLEDGE_SOURCES: KnowledgeSource[] = [
  {
    path: "docs/Agent.md",
    title: "Agent.md",
    summary: "Regras operacionais para agentes humanos e IA.",
    category: "operacao",
  },
  {
    path: "docs/AUTOREFLEX_ADAPTADO.md",
    title: "AutoReflex adaptado",
    summary: "Base de conhecimento local inspirada no Autoreflex.",
    category: "operacao",
  },
  {
    path: "docs/HANDOFF.md",
    title: "Handoff",
    summary: "Estado atual e continuidade do projeto sem contexto oral.",
    category: "operacao",
  },
  {
    path: "docs/INCIDENTE_CLOUDFLARE_VPS.md",
    title: "Incidente Cloudflare/VPS",
    summary: "Checklist de triagem para borda, tunnel e origem.",
    category: "operacao",
  },
  {
    path: "docs/CLOUDFLARE.md",
    title: "Cloudflare",
    summary: "Configuracao da conexao Cloudflare do projeto GEEF.",
    category: "infra",
  },
  {
    path: "docs/OPS_LOGS.md",
    title: "Logs e heartbeat via Supabase",
    summary: "Fluxo de observabilidade leve do projeto.",
    category: "infra",
  },
  {
    path: "docs/CONNECTIONS.md",
    title: "Conexoes e MCPs",
    summary: "Checklist de acesso a GitHub, Supabase, Cloudflare e VPS.",
    category: "infra",
  },
  {
    path: "docs/ARCHITECTURE.md",
    title: "Arquitetura Tecnica",
    summary: "Stack, limites modulares e deploy alvo.",
    category: "arquitetura",
  },
  {
    path: "docs/SECURITY.md",
    title: "Seguranca",
    summary: "Segredos, LGPD, SSH, VPS e Cloudflare.",
    category: "seguranca",
  },
  {
    path: "docs/SUPABASE.md",
    title: "Supabase",
    summary: "Configuracao do MCP e do backend em Supabase.",
    category: "infra",
  },
  {
    path: "docs/ROADMAP.md",
    title: "Roadmap",
    summary: "Sequencia das fases de execucao do projeto.",
    category: "produto",
  },
  {
    path: "docs/PRODUCT_VISION.md",
    title: "Visao de produto",
    summary: "Principios, publico e escopo de negocio.",
    category: "produto",
  },
  {
    path: "docs/INDEX.md",
    title: "Indice do projeto",
    summary: "Mapa de leitura da documentacao.",
    category: "indice",
  },
  {
    path: "README.md",
    title: "README",
    summary: "Resumo de execucao, deploy e variaveis esperadas.",
    category: "raiz",
  },
] as const;

const fileCache = new Map<string, { content: string; mtimeMs: number }>();
const CASES_DIR = "docs/cases";

export function listKnowledgeSources() {
  return [...KNOWLEDGE_SOURCES, ...listCaseSources()].map((source) => ({ ...source }));
}

export async function searchKnowledge(query: string, limit = 8): Promise<KnowledgeHit[]> {
  const terms = tokenize(query);

  if (terms.length === 0) {
    return [];
  }

  const results: KnowledgeHit[] = [];

  for (const source of KNOWLEDGE_SOURCES) {
    const file = await loadSourceFile(source.path);
    if (!file) {
      continue;
    }

    const matches = scoreDocument(file.content, terms);
    if (matches.score <= 0) {
      continue;
    }

    results.push({
      ...source,
      score: matches.score,
      snippets: matches.snippets,
    });
  }

  return results
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
}

async function loadSourceFile(relativePath: string) {
  const absolutePath = path.join(process.cwd(), relativePath);

  try {
    const fileStat = await stat(absolutePath);
    const cached = fileCache.get(absolutePath);
    if (cached && cached.mtimeMs === fileStat.mtimeMs) {
      return cached;
    }

    const content = await readFile(absolutePath, "utf8");
    const fresh = { content, mtimeMs: fileStat.mtimeMs };
    fileCache.set(absolutePath, fresh);
    return fresh;
  } catch {
    return null;
  }
}

function listCaseSources(): KnowledgeSource[] {
  const items: KnowledgeSource[] = [];
  const basePath = path.join(process.cwd(), CASES_DIR);

  try {
    const entries = readdirSync(basePath, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".md")) {
        continue;
      }

      items.push({
        path: `${CASES_DIR}/${entry.name}`,
        title: entry.name.replace(/\.md$/i, "").replace(/-/g, " "),
        summary: "Caso operacional documentado pelo agente.",
        category: "casos",
      });
    }
  } catch {
    // O diretorio de casos e opcional.
  }

  return items;
}

function scoreDocument(content: string, terms: string[]) {
  const lines = content.split(/\r?\n/);
  const scoredLines: Array<{ index: number; score: number }> = [];
  let totalScore = 0;

  lines.forEach((line, index) => {
    const normalized = normalizeForSearch(line);
    if (!normalized) {
      return;
    }

    let score = 0;
    for (const term of terms) {
      const count = countMatches(normalized, term);
      if (count > 0) {
        score += count * (term.length >= 6 ? 2 : 1);
      }
    }

    if (score > 0) {
      if (line.startsWith("# ")) {
        score += 4;
      } else if (line.startsWith("## ")) {
        score += 3;
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        score += 1;
      }

      scoredLines.push({ index, score });
      totalScore += score;
    }
  });

  const snippets = buildSnippets(lines, scoredLines);

  return { score: totalScore, snippets };
}

function buildSnippets(
  lines: string[],
  scoredLines: Array<{ index: number; score: number }>,
) {
  return scoredLines
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 3)
    .map(({ index }) => {
      const start = Math.max(0, index - 1);
      const end = Math.min(lines.length, index + 2);
      return lines
        .slice(start, end)
        .map((line) => line.trim())
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
    })
    .filter(Boolean);
}

function tokenize(value: string) {
  return normalizeForSearch(value)
    .split(/\s+/)
    .map((term) => term.trim())
    .filter((term) => term.length > 2);
}

function normalizeForSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function countMatches(text: string, term: string) {
  if (!term) {
    return 0;
  }

  let count = 0;
  let index = text.indexOf(term);

  while (index !== -1) {
    count += 1;
    index = text.indexOf(term, index + term.length);
  }

  return count;
}
