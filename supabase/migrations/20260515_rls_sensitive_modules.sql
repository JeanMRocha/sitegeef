-- Enable RLS on sensitive tables
-- These tables contain restricted information requiring permission validation

-- ============================================================================
-- MEDIUNIDADE — Ultra-restricted access (pode_mediunidade = true required)
-- ============================================================================

-- Enable RLS
alter table public.grupos_mediunicos enable row level security;
alter table public.grupo_mediunico_membros enable row level security;
alter table public.reunioes_mediunicas enable row level security;

-- Policy: Only users with pode_mediunidade = true can access groups
create policy "mediunidade_grupos_access"
  on public.grupos_mediunicos
  for all
  using (
    exists (
      select 1 from public.usuarios_sistema
      where id = auth.uid()
      and pode_mediunidade = true
    )
  );

create policy "mediunidade_grupos_insert"
  on public.grupos_mediunicos
  for insert
  with check (
    exists (
      select 1 from public.usuarios_sistema
      where id = auth.uid()
      and pode_mediunidade = true
    )
  );

-- Policy: Group members accessible only to authorized users
create policy "mediunidade_membros_access"
  on public.grupo_mediunico_membros
  for all
  using (
    exists (
      select 1 from public.usuarios_sistema
      where id = auth.uid()
      and pode_mediunidade = true
    )
  );

create policy "mediunidade_membros_insert"
  on public.grupo_mediunico_membros
  for insert
  with check (
    exists (
      select 1 from public.usuarios_sistema
      where id = auth.uid()
      and pode_mediunidade = true
    )
  );

-- Policy: Group meetings accessible only to authorized users
create policy "mediunidade_reunioes_access"
  on public.reunioes_mediunicas
  for all
  using (
    exists (
      select 1 from public.usuarios_sistema
      where id = auth.uid()
      and pode_mediunidade = true
    )
  );

create policy "mediunidade_reunioes_insert"
  on public.reunioes_mediunicas
  for insert
  with check (
    exists (
      select 1 from public.usuarios_sistema
      where id = auth.uid()
      and pode_mediunidade = true
    )
  );

-- ============================================================================
-- ATENDIMENTO FRATERNO — Confidential records (pode_atendimento = true + sigilo)
-- ============================================================================

alter table public.atendimento_fraterno enable row level security;

-- Policy: Observations visible only to pode_atendimento users
create policy "atendimento_fraterno_access"
  on public.atendimento_fraterno
  for select
  using (
    exists (
      select 1 from public.usuarios_sistema
      where id = auth.uid()
      and pode_atendimento = true
    )
  );

-- Policy: Can insert/update only if pode_atendimento
create policy "atendimento_fraterno_modify"
  on public.atendimento_fraterno
  for insert
  with check (
    exists (
      select 1 from public.usuarios_sistema
      where id = auth.uid()
      and pode_atendimento = true
    )
  );

create policy "atendimento_fraterno_update"
  on public.atendimento_fraterno
  for update
  using (
    exists (
      select 1 from public.usuarios_sistema
      where id = auth.uid()
      and pode_atendimento = true
    )
  );

-- ============================================================================
-- IRRADIAÇÃO — Confidential spiritual request records
-- ============================================================================

alter table public.irradiacoes enable row level security;

-- Policy: Confidential irradiations visible only to pode_atendimento users
create policy "irradiacao_access"
  on public.irradiacoes
  for select
  using (
    exists (
      select 1 from public.usuarios_sistema
      where id = auth.uid()
      and pode_atendimento = true
    )
  );

create policy "irradiacao_modify"
  on public.irradiacoes
  for insert
  with check (
    exists (
      select 1 from public.usuarios_sistema
      where id = auth.uid()
      and pode_atendimento = true
    )
  );

create policy "irradiacao_update"
  on public.irradiacoes
  for update
  using (
    exists (
      select 1 from public.usuarios_sistema
      where id = auth.uid()
      and pode_atendimento = true
    )
  );

-- ============================================================================
-- NOTE: These policies enforce database-level security. Application must also
-- validate permissions at the page/route level (see app/admin/layout checks).
-- ============================================================================
