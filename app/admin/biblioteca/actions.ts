'use server';

import { unstable_cache } from "next/cache";
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { invalidateAdminBibliotecaCache } from "@/lib/admin/cache";
import { invalidateUserAreaCache } from '@/lib/areas/invalidate-user-area';
import { calculateRange, buildSearchFilter } from '@/lib/admin/query-helpers';

async function loadObras(page = 1, search?: string) {
  const supabase = createServiceRoleClient();
  const pageSize = 20;
  const { start, end } = calculateRange(page, pageSize);

  let query = supabase
    .from('obras')
    .select('*', { count: 'exact' })
    .eq('ativo', true);

  if (search) {
    const filter = buildSearchFilter(search, ['titulo', 'autor']);
    if (filter) {
      query = query.or(filter);
    }
  }

  const { data, count, error } = await query
    .order('titulo')
    .range(start, end);

  if (error) {
    return { obras: [], total: 0, page, pageSize };
  }

  return {
    obras: data || [],
    total: count || 0,
    page,
    pageSize,
  };
}

export const getObras = unstable_cache(loadObras, ["admin-biblioteca-obras"], {
  revalidate: 60,
  tags: ["admin-biblioteca"],
});

export async function getObraById(id: string) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('obras')
    .select(
      `
      *,
      exemplares (id, codigo, conservacao, localizacao, origem, situacao)
    `
    )
    .eq('id', id)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function createObra(formData: {
  titulo: string;
  autor?: string;
  editora?: string;
  isbn?: string;
  categoria?: string;
  sinopse?: string;
  capa_url?: string;
  publico?: string;
}) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('obras')
    .insert([
      {
        titulo: formData.titulo,
        autor: formData.autor || null,
        editora: formData.editora || null,
        isbn: formData.isbn || null,
        categoria: formData.categoria || null,
        sinopse: formData.sinopse || null,
        capa_url: formData.capa_url || null,
        publico: formData.publico || 'adulto',
        ativo: true,
      },
    ])
    .select()
    .single();

  if (error) {
    return null;
  }

  invalidateAdminBibliotecaCache();
  invalidateUserAreaCache();
  return data;
}

export async function updateObra(
  id: string,
  formData: {
    titulo?: string;
    autor?: string;
    editora?: string;
    isbn?: string;
    categoria?: string;
    sinopse?: string;
    capa_url?: string;
    publico?: string;
  }
) {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from('obras')
    .update({
      ...formData,
    })
    .eq('id', id);

  if (error) {
    return { success: false };
  }

  invalidateAdminBibliotecaCache();
  invalidateUserAreaCache();
  return { success: true };
}

export async function toggleObraStatus(id: string, ativo: boolean) {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from('obras')
    .update({ ativo })
    .eq('id', id);

  if (error) {
    return { success: false };
  }

  invalidateAdminBibliotecaCache();
  invalidateUserAreaCache();
  return { success: true };
}

export async function getExemplarById(id: string) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('exemplares')
    .select(
      `
      *,
      obra:obras (id, titulo, autor),
      emprestimo_ativo:emprestimos(id, pessoa_id, data_retirada, prazo_devolucao, pessoas(nome))
    `
    )
    .eq('id', id)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function createExemplar(formData: {
  obra_id: string;
  codigo: string;
  conservacao?: string;
  localizacao?: string;
  origem?: string;
}) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from('exemplares')
    .insert([
      {
        obra_id: formData.obra_id,
        codigo: formData.codigo,
        conservacao: formData.conservacao || null,
        localizacao: formData.localizacao || null,
        origem: formData.origem || 'acervo',
        situacao: 'disponivel',
      },
    ])
    .select()
    .single();

  if (error) {
    return null;
  }

  invalidateAdminBibliotecaCache();
  invalidateUserAreaCache();
  return data;
}

export async function updateExemplar(
  id: string,
  formData: {
    conservacao?: string;
    localizacao?: string;
    origem?: string;
    situacao?: string;
  }
) {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from('exemplares')
    .update({
      ...formData,
    })
    .eq('id', id);

  if (error) {
    return { success: false };
  }

  invalidateAdminBibliotecaCache();
  invalidateUserAreaCache();
  return { success: true };
}

export async function deleteExemplar(id: string) {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from('exemplares')
    .delete()
    .eq('id', id);

  if (error) {
    return { success: false };
  }

  invalidateAdminBibliotecaCache();
  invalidateUserAreaCache();
  return { success: true };
}
