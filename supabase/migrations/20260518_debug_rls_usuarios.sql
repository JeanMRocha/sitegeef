-- Debug: Remover RLS temporariamente de usuarios_sistema para verificar dados
alter table public.usuarios_sistema disable row level security;

-- Verificar quantos registros existem
-- select count(*) from public.usuarios_sistema;

-- Depois de verificar, re-habilitar com:
-- alter table public.usuarios_sistema enable row level security;
