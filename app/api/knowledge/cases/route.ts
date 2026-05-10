import { NextResponse } from "next/server";
import { assertAgentGate, getAgentGateChecklist, writeCaseNote } from "@/lib/agent-gate";
import { searchKnowledge } from "@/lib/agent-knowledge";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const gate = assertAgentGate(request);

  if (!gate.ok) {
    return NextResponse.json({ ok: false, error: gate.reason }, { status: gate.status });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const draft = body as Record<string, unknown>;
  const saved = await writeCaseNote({
    title: draft.title as string | undefined,
    summary: draft.summary as string | undefined,
    symptom: draft.symptom as string | undefined,
    diagnosis: draft.diagnosis as string | undefined,
    resolution: draft.resolution as string | undefined,
    impact: draft.impact as string | undefined,
    tags: Array.isArray(draft.tags) ? (draft.tags as string[]) : undefined,
    source: draft.source as string | undefined,
    decided_at: draft.decided_at as string | undefined,
    references: Array.isArray(draft.references) ? (draft.references as string[]) : undefined,
  });

  const indexed = await searchKnowledge(saved.title, 5);

  return NextResponse.json({
    ok: true,
    saved,
    next_step: getAgentGateChecklist().before_case,
    indexed,
  });
}
