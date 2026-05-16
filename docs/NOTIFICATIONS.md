# Notificações — Sistema de Alertas e Comunicações

## Visão Geral

O sistema de notificações do GEEF suporta três canais de entrega:

1. **Interno** — Painel de notificações no admin
2. **Email** — Entrega via Resend (transactional email)
3. **WhatsApp** — Integração futura com Twilio

Todas as notificações são armazenadas na tabela `notificacoes` com status tracking.

## Status de Notificação

- `pendente` — Criada, aguardando processamento
- `enviado` — Entregue com sucesso
- `falhou` — Falha na entrega
- `lida` — Lida pelo usuário (interno)

## Tipos de Notificação

- `sistema` — 🔧 Atualizações do sistema
- `alerta` — ⚠️ Avisos importantes
- `sucesso` — ✅ Operações concluídas
- `info` — ℹ️ Informações gerais

---

## Implementação

### 1. Criar Notificação (Server Action)

```typescript
import { criarNotificacao } from '@/lib/notificacoes/create-notification';

// Uma notificação
await criarNotificacao({
  pessoa_id: 'uuid-da-pessoa',
  titulo: 'Nova Escala Publicada',
  mensagem: 'A escala de maio foi publicada e está disponível',
  tipo: 'sucesso',
  canal: 'interno', // interno | email | whatsapp
  modulo_origem: 'escalas',
});

// Múltiplas notificações
import { criarNotificacoesBatch } from '@/lib/notificacoes/create-notification';

await criarNotificacoesBatch(
  ['pessoa-1', 'pessoa-2', 'pessoa-3'],
  'Convite para Assembleia',
  'Você está convidado para a AGO de junho',
  'info',
  'email',
  'governanca'
);

// Notificação de erro
import { criarNotificacaoErro } from '@/lib/notificacoes/create-notification';

await criarNotificacaoErro(
  pessoa_id,
  'Erro ao salvar dados',
  'Ocorreu um erro ao atualizar seu perfil. Tente novamente.',
  'pessoas'
);
```

### 2. Edge Function — Envio de Emails

**Arquivo:** `supabase/functions/send-pending-notifications/index.ts`

A Edge Function processa notificações pendentes com canal `email` e as envia via Resend.

#### Configuração

**Environment Variables (Supabase Dashboard):**

```
RESEND_API_KEY=re_xxxxxxxxxxxx
NOTIFICATION_FUNCTION_SECRET=seu-token-secreto
```

#### Deploy

```bash
# Deploy a Edge Function
npx supabase functions deploy send-pending-notifications

# Testar localmente
supabase functions serve
```

#### Invocar a Function

```bash
# Via cURL
curl -X POST "http://localhost:54321/functions/v1/send-pending-notifications" \
  -H "Authorization: Bearer seu-token-secreto" \
  -H "Content-Type: application/json"

# Via Node.js
const response = await fetch('/api/notificacoes/enviar', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer seu-token-secreto' },
});
```

### 3. Schedular Processamento Automático

**Via Supabase Cron:**

```bash
# No painel Supabase → Edge Functions → Cron
# Executar a cada 5 minutos:
*/5 * * * *

# Executar a cada hora:
0 * * * *

# Executar a cada 6 horas:
0 */6 * * *
```

**Via Vercel Cron (`.vercel.json`):**

```json
{
  "crons": [
    {
      "path": "/api/notificacoes/enviar",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

---

## API Endpoints

### GET /admin/notificacoes

Lista todas as notificações do usuário autenticado.

**Resposta:**
```json
[
  {
    "id": "uuid",
    "pessoa_id": "uuid",
    "titulo": "Nova Escala",
    "mensagem": "A escala foi publicada",
    "tipo": "sucesso",
    "canal": "interno",
    "status": "lida",
    "modulo_origem": "escalas",
    "criado_em": "2026-05-16T10:30:00Z",
    "enviado_em": "2026-05-16T10:31:00Z"
  }
]
```

### POST /admin/notificacoes/[id]/marcar-lida

Marca uma notificação como lida.

### DELETE /admin/notificacoes/[id]

Deleta uma notificação.

---

## Padrões de Uso

### 1. Notificação ao Publicar Escala

```typescript
// Em app/admin/escalas/[id]/actions.ts
export async function publicarEscala(id: string) {
  // ... publicar lógica ...

  // Notificar todos os evangelizadores
  const { data: evangelizadores } = await supabase
    .from('pessoa_vinculos')
    .select('pessoa_id')
    .eq('vinculo', 'evangelizador');

  await criarNotificacoesBatch(
    evangelizadores.map(e => e.pessoa_id),
    'Escala Publicada',
    'Uma nova escala foi publicada. Consulte no sistema.',
    'sucesso',
    'email',
    'escalas'
  );
}
```

### 2. Notificação ao Criar Relatório

```typescript
// Em app/admin/relatorios/actions.ts
export async function gerar RelatorioDRE(mes: number, ano: number) {
  // ... gerar lógica ...

  // Notificar coordenador financeiro
  await criarNotificacao({
    pessoa_id: coordenador_id,
    titulo: 'DRE Disponível',
    mensagem: `DRE de ${mes}/${ano} foi gerado`,
    tipo: 'sucesso',
    modulo_origem: 'financeiro',
  });
}
```

### 3. Notificação de Erro em Operação

```typescript
try {
  await salvarDados();
} catch (error) {
  await criarNotificacaoErro(
    usuario_id,
    'Erro ao salvar',
    error.message,
    'escalas'
  );
}
```

---

## Resend Configuration

### Criar Conta e API Key

1. Ir para [resend.com](https://resend.com)
2. Sign up com email da organização
3. Criar API key em **Dashboard → API Keys**
4. Copiar a chave (formato: `re_xxxxxxxxxxxx`)

### Validar Domínio

1. Ir para **Domains** no painel Resend
2. Adicionar domínio `geef.org`
3. Seguir instruções de DNS (SPF, DKIM, DMARC)

### Remetente de Email

- Padrão: `notificacoes@geef.org`
- Suporta multiplos remetentes via configuração

---

## Troubleshooting

### Edge Function não inicia

```bash
# Verificar logs
supabase functions serve --debug

# Checar sintaxe TypeScript
deno check supabase/functions/send-pending-notifications/index.ts
```

### Emails não são enviados

1. Verificar `RESEND_API_KEY` no Supabase
2. Verificar status da notificação em `notificacoes` table
3. Chamar Edge Function manualmente:
   ```bash
   curl -X POST "https://seu-projeto.supabase.co/functions/v1/send-pending-notifications" \
     -H "Authorization: Bearer seu-token"
   ```

### Pessoas não recebem emails

1. Verificar que `pessoas.email` está preenchido
2. Verificar que `pessoas.autoriza_notificacao = true`
3. Verificar que `usuarios_sistema` existe para o usuário

---

## Segurança

- **RLS Policies:** Usuários só veem suas próprias notificações
- **API Keys:** Armazenar em `.env.local` (nunca commitar)
- **Edge Function Token:** Usar `NOTIFICATION_FUNCTION_SECRET` para autorizar chamadas
- **Email Validation:** Resend valida automaticamente domínios

---

## Roadmap

- [ ] Integração WhatsApp (Twilio)
- [ ] Dashboard de estatísticas de entrega
- [ ] Templates customizáveis por módulo
- [ ] Preferências de notificação por usuário
- [ ] Retry automático com backoff exponencial
- [ ] Webhooks para eventos de bounces/complaints
