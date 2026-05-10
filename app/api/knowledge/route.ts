import { NextResponse } from "next/server";
import { listKnowledgeSources, searchKnowledge } from "@/lib/agent-knowledge";
import { assertAgentGate, getAgentGateChecklist } from "@/lib/agent-gate";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const gate = assertAgentGate(request);

  if (!gate.ok) {
    return NextResponse.json({ ok: false, error: gate.reason }, { status: gate.status });
  }

  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim() ?? "";
  const limit = clampNumber(url.searchParams.get("limit"), 1, 20, 8);

  if (!query) {
    return NextResponse.json({
      ok: true,
      mode: "index",
      gate: getAgentGateChecklist(),
      total: listKnowledgeSources().length,
      items: listKnowledgeSources(),
    });
  }

  const items = await searchKnowledge(query, limit);

  return NextResponse.json({
    ok: true,
    mode: "search",
    query,
    gate: getAgentGateChecklist(),
    total: items.length,
    items,
  });
}

function clampNumber(value: string | null, min: number, max: number, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
}
