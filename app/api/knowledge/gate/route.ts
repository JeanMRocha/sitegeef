import { NextResponse } from "next/server";
import { assertAgentGate, getAgentGateChecklist } from "@/lib/agent-gate";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const gate = assertAgentGate(request);

  if (!gate.ok) {
    return NextResponse.json({ ok: false, error: gate.reason }, { status: gate.status });
  }

  return NextResponse.json({
    ok: true,
    purpose: "agent_pre_case_gate",
    checklist: getAgentGateChecklist(),
  });
}
