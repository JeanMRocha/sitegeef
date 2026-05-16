'use server';

import { createClient } from '@/lib/supabase/server';

export async function getProdutos(page = 1, search?: string) {
  const supabase = await createClient();
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from('produtos_livraria')
    .select('*', { count: 'exact' })
    .eq('ativo', true);

  if (search) {
    query = query.or(`titulo.ilike.%${search}%,autor.ilike.%${search}%`);
  }

  const { data, count, error } = await query
    .order('titulo')
    .range(offset, offset + pageSize - 1);

  if (error) throw error;

  return {
    produtos: data || [],
    total: count || 0,
    page,
    pageSize,
  };
}

export async function getProdutoById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('produtos_livraria')
    .select(
      `
      *,
      movimentos:movimentos_livraria (id, tipo, quantidade, valor_unit, forma_pagamento, data_criacao:criado_em, pessoas (nome))
    `
    )
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
}

export async function createProduto(formData: {
  titulo: string;
  autor?: string;
  categoria?: string;
  capa_url?: string;
  qtd_estoque?: number;
  estoque_minimo?: number;
  valor_custo?: number;
  valor_venda?: number;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('produtos_livraria')
    .insert([
      {
        titulo: formData.titulo,
        autor: formData.autor || null,
        categoria: formData.categoria || null,
        capa_url: formData.capa_url || null,
        qtd_estoque: formData.qtd_estoque || 0,
        estoque_minimo: formData.estoque_minimo || 2,
        valor_custo: formData.valor_custo || null,
        valor_venda: formData.valor_venda || null,
        status: 'disponivel',
        ativo: true,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateProduto(
  id: string,
  formData: {
    titulo?: string;
    autor?: string;
    categoria?: string;
    capa_url?: string;
    qtd_estoque?: number;
    estoque_minimo?: number;
    valor_custo?: number;
    valor_venda?: number;
    status?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('produtos_livraria')
    .update({
      ...formData,
    })
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

export async function toggleProdutoStatus(id: string, ativo: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('produtos_livraria')
    .update({ ativo })
    .eq('id', id);

  if (error) throw error;

  return { success: true };
}

export async function registrarMovimento(formData: {
  produto_id: string;
  pessoa_id?: string;
  tipo: string;
  quantidade: number;
  valor_unit?: number;
  valor_total?: number;
  forma_pagamento?: string;
  status_pagamento?: string;
  observacao?: string;
}) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  // Create movimento
  const { data: movimento, error: movimentoError } = await supabase
    .from('movimentos_livraria')
    .insert([
      {
        produto_id: formData.produto_id,
        pessoa_id: formData.pessoa_id || null,
        tipo: formData.tipo,
        quantidade: formData.quantidade,
        valor_unit: formData.valor_unit || null,
        valor_total: formData.valor_total || null,
        forma_pagamento: formData.forma_pagamento || null,
        status_pagamento: formData.status_pagamento || null,
        observacao: formData.observacao || null,
      },
    ])
    .select()
    .single();

  if (movimentoError) throw movimentoError;

  // Update produto estoque
  const { data: produto } = await supabase
    .from('produtos_livraria')
    .select('qtd_estoque')
    .eq('id', formData.produto_id)
    .single();

  let novoEstoque = produto.qtd_estoque;

  if (formData.tipo === 'venda' || formData.tipo === 'doacao_realizada' || formData.tipo === 'transferencia_biblioteca') {
    novoEstoque -= formData.quantidade;
  } else if (formData.tipo === 'doacao_recebida' || formData.tipo === 'entrada') {
    novoEstoque += formData.quantidade;
  }

  const { error: updateError } = await supabase
    .from('produtos_livraria')
    .update({ qtd_estoque: novoEstoque })
    .eq('id', formData.produto_id);

  if (updateError) throw updateError;

  return movimento;
}

export async function getPessoasDisponiveis() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pessoas')
    .select('id, nome, email')
    .eq('status', 'ativo')
    .order('nome');

  if (error) throw error;

  return data || [];
}

export async function getRelatorioVendas(mes: number, ano: number) {
  const supabase = await createClient();

  const dataInicio = `${ano}-${String(mes).padStart(2, '0')}-01`;
  const dataFim = new Date(ano, mes, 0).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('movimentos_livraria')
    .select(
      `
      *,
      produtos_livraria (titulo, valor_venda)
    `
    )
    .eq('tipo', 'venda')
    .gte('criado_em', `${dataInicio}T00:00:00`)
    .lte('criado_em', `${dataFim}T23:59:59`)
    .order('criado_em', { ascending: false });

  if (error) throw error;

  return data || [];
}
