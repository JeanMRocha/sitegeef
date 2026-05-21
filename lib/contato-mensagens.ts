import { createServiceRoleClient } from "@/lib/supabase/service-role";

export type ContatoMensagem = {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  assunto: string | null;
  mensagem: string;
  pagina_origem: string | null;
  canal: string;
  status: string;
  criado_em: string;
  atualizado_em: string;
  respondido_em: string | null;
  referer: string | null;
};

export async function loadContatoMensagensAdmin() {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("contato_mensagens")
      .select("*")
      .order("criado_em", { ascending: false })
      .limit(60);

    if (error) {
      return [];
    }

    return (data ?? []) as ContatoMensagem[];
  } catch {
    return [];
  }
}
