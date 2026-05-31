import { createServiceRoleClient } from "@/lib/supabase/service-role";

export type LgpdRegistro = {
  id: string;
  categoria: string;
  acao: string;
  status: string;
  versao: string;
  escopo: Record<string, unknown>;
  severity?: string | null;
  origem: string | null;
  canal: string | null;
  consentido_em: string | null;
  revogado_em: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  pessoa_id: string | null;
};

export type LgpdSolicitacao = {
  id: string;
  request_type: string;
  status: string;
  titular_nome: string | null;
  titular_email: string | null;
  responsavel_id: string | null;
  prazo_resposta: string | null;
  resposta: string | null;
  resolvido_em: string | null;
  created_at: string;
  updated_at: string;
};

export type LgpdNotificacao = {
  id: string;
  tipo: string;
  titulo: string;
  mensagem: string;
  canal: string | null;
  status: string;
  modulo_origem: string | null;
  criado_em: string | null;
  enviado_em: string | null;
};

export type LgpdEvento = {
  id: string;
  source: string;
  level: string;
  message: string;
  payload: Record<string, unknown>;
  happened_at: string | null;
  created_at: string;
};

export type LgpdConsentimento = {
  id: string;
  finalidade: string;
  base_legal: string | null;
  canal_autorizado: string | null;
  data_consentimento: string | null;
  data_revogacao: string | null;
  status: string;
  pessoas: {
    nome: string | null;
    email: string | null;
  } | null;
};

export type LgpdAdminData = {
  registros: LgpdRegistro[];
  solicitacoes: LgpdSolicitacao[];
  notificacoes: LgpdNotificacao[];
  eventos: LgpdEvento[];
  consentimentos: LgpdConsentimento[];
};

export async function loadLgpdAdminData(): Promise<LgpdAdminData> {
  const supabase = createServiceRoleClient();

  const [registrosResult, solicitacoesResult, notificacoesResult, eventosResult, consentimentosResult] = await Promise.all([
    supabase
      .from("lgpd_registros")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(40),
    supabase
      .from("lgpd_solicitacoes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30),
    supabase
      .from("notificacoes")
      .select("id, tipo, titulo, mensagem, canal, status, modulo_origem, criado_em, enviado_em")
      .eq("modulo_origem", "lgpd")
      .order("criado_em", { ascending: false })
      .limit(20),
    supabase
      .from("ops_events")
      .select("id, source, level, message, payload, happened_at, created_at")
      .or("source.ilike.%lgpd%,source.ilike.%documentos%")
      .order("created_at", { ascending: false })
      .limit(30),
    supabase
      .from("consentimentos_lgpd")
      .select("id, finalidade, base_legal, canal_autorizado, data_consentimento, data_revogacao, status, pessoas (nome, email)")
      .order("data_consentimento", { ascending: false })
      .limit(25),
  ]);

  return {
    registros: (registrosResult.data ?? []) as LgpdRegistro[],
    solicitacoes: (solicitacoesResult.data ?? []) as LgpdSolicitacao[],
    notificacoes: (notificacoesResult.data ?? []) as LgpdNotificacao[],
    eventos: (eventosResult.data ?? []) as LgpdEvento[],
    consentimentos: ((consentimentosResult.data ?? []) as Array<{
      id: string;
      finalidade: string;
      base_legal: string | null;
      canal_autorizado: string | null;
      data_consentimento: string | null;
      data_revogacao: string | null;
      status: string;
      pessoas: Array<{ nome: string | null; email: string | null }> | { nome: string | null; email: string | null } | null;
    }>).map((item) => ({
      ...item,
      pessoas: Array.isArray(item.pessoas) ? item.pessoas[0] ?? null : item.pessoas ?? null,
    })) as LgpdConsentimento[],
  };
}
