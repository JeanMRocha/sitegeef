#!/bin/bash

# Load environment
set -a
source .env
set +a

# Use curl to insert usuarios_sistema for all users without one
curl -X POST https://nycgpokqlmrfzegjlrwa.supabase.co/rest/v1/usuarios_sistema \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "INSERT INTO public.usuarios_sistema (id, perfil, pode_escalas, pode_biblioteca, pode_livraria, pode_financeiro, pode_pessoas, pode_publicar, pode_mediunidade, pode_atendimento, pode_apse) SELECT id, '"'"'publico'"'"', false, false, false, false, false, false, false, false, false FROM auth.users WHERE id NOT IN (SELECT id FROM public.usuarios_sistema) ON CONFLICT (id) DO NOTHING"
  }'
