import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export type AgentGateChecklist = {
  before_case: string[];
  after_case: string[];
  storage_dir: string;
  auth_header: string;
};

export type AgentCaseDraft = {
  title?: string;
  summary?: string;
  symptom?: string;
  diagnosis?: string;
  resolution?: string;
  impact?: string;
  tags?: string[];
  source?: string;
  decided_at?: string;
  references?: string[];
};

const AGENT_KEY_HEADER = "x-geef-agent-key";
const CASES_DIR = path.join(process.cwd(), "docs", "cases");

export function getAgentGateChecklist(): AgentGateChecklist {
  return {
    before_case: [
      "Consultar /api/knowledge antes de tentar resolver o caso.",
      "Localizar docs/HANDOFF.md, docs/INCIDENTE_CLOUDFLARE_VPS.md, docs/CLOUDFLARE.md e docs/OPS_LOGS.md se o caso for de infra.",
      "Confirmar o sintoma, o horario e o ultimo estado conhecido.",
      "Nao alterar nada sem registrar o que foi encontrado primeiro.",
    ],
    after_case: [
      "Registrar o caso novo em docs/cases como nota operacional.",
      "Incluir sintoma, diagnostico, resolucao e impacto.",
      "Adicionar referencias relevantes para futura busca.",
      "Indexar o novo caso na base de conhecimento.",
    ],
    storage_dir: "docs/cases",
    auth_header: AGENT_KEY_HEADER,
  };
}

export function assertAgentGate(request: Request) {
  const expected = process.env.GEEF_AGENT_KNOWLEDGE_KEY?.trim();

  if (!expected) {
    return { ok: false, status: 500, reason: "missing_agent_gate_key" as const };
  }

  const authorization = request.headers.get("authorization");
  const tokenFromAuth = authorization?.toLowerCase().startsWith("bearer ")
    ? authorization.slice(7).trim()
    : null;
  const tokenFromHeader = request.headers.get(AGENT_KEY_HEADER)?.trim();
  const provided = tokenFromAuth || tokenFromHeader;

  if (!provided || provided !== expected) {
    return { ok: false, status: 401, reason: "unauthorized" as const };
  }

  return { ok: true as const };
}

export async function writeCaseNote(draft: AgentCaseDraft) {
  const title = normalizeText(draft.title, "caso-operacional");
  const safeSlug = slugify(title);
  const date = new Date(draft.decided_at || new Date().toISOString()).toISOString().slice(0, 10);
  const filename = `${date}-${safeSlug}.md`;
  const filePath = path.join(CASES_DIR, filename);

  await mkdir(CASES_DIR, { recursive: true });
  await writeFile(filePath, buildCaseMarkdown(draft, date), "utf8");

  return {
    path: `docs/cases/${filename}`,
    title,
  };
}

function buildCaseMarkdown(draft: AgentCaseDraft, date: string) {
  const title = normalizeText(draft.title, "Caso operacional");
  const summary = normalizeText(draft.summary, "Caso registrado pelo agente.");
  const symptom = normalizeText(draft.symptom, "Nao informado.");
  const diagnosis = normalizeText(draft.diagnosis, "Nao informado.");
  const resolution = normalizeText(draft.resolution, "Nao informada.");
  const impact = normalizeText(draft.impact, "Nao informado.");
  const source = normalizeText(draft.source, "agente");
  const tags = Array.isArray(draft.tags)
    ? draft.tags.map((tag) => normalizeText(tag)).filter((tag) => tag.length > 0)
    : [];
  const references = Array.isArray(draft.references)
    ? draft.references.map((reference) => normalizeText(reference)).filter((reference) => reference.length > 0)
    : [];

  return [
    `# ${title}`,
    "",
    `Data: ${date}`,
    `Fonte: ${source}`,
    `Resumo: ${summary}`,
    "",
    "## Sintoma",
    symptom,
    "",
    "## Diagnostico",
    diagnosis,
    "",
    "## Resolucao",
    resolution,
    "",
    "## Impacto",
    impact,
    "",
    "## Tags",
    tags.length ? tags.map((tag) => `- ${tag}`).join("\n") : "- sem-tags",
    "",
    "## Referencias",
    references.length ? references.map((ref) => `- ${ref}`).join("\n") : "- sem-referencias",
    "",
  ].join("\n");
}

function slugify(value: string) {
  return normalizeText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "caso-operacional";
}

function normalizeText(value: unknown, fallback = "") {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}
