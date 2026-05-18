-- Criar bucket para ativos da instituição (logo, etc)
-- Este arquivo é idempotent — roda sem erro mesmo se o bucket já existir

-- Nota: Em desenvolvimento, criar bucket via Supabase Dashboard
-- Em produção, usar API ou script de setup

-- Se executar isso manualmente no Supabase CLI:
-- npx supabase storage create instituicao-assets --public

-- Verificar se precisa de RLS policies (Public Read, Service Role Full)
