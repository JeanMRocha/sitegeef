# Seguranca

## Situacao atual

Foram adicionadas pastas locais de segredos SSH em `.secrets/`. Elas sao aceitaveis para uso local, mas nunca devem ser versionadas.

O arquivo `baseinicial.md` continha credenciais Supabase. Essas credenciais devem ser consideradas expostas e precisam ser rotacionadas antes de producao ou push publico.

## Regras de segredos

- `.secrets/` nao entra no Git.
- `.env` e `.env.*` nao entram no Git.
- `.env.example` pode entrar no Git com nomes de variaveis sem valores reais.
- Service role key nunca deve ir para frontend.
- Chave SSH privada nunca deve ser copiada para documentacao.
- Senhas de banco nunca devem ser registradas em markdown.

## Supabase

Regras iniciais:

- Usar publishable key no cliente quando necessario.
- Nunca expor `service_role`.
- Habilitar RLS em tabelas expostas.
- Criar policies por caso de uso, nao policies genericas permissivas.
- Evitar autorizacao baseada em `user_metadata`.
- Guardar autorizacao em estrutura controlada pelo servidor ou `app_metadata`.
- Separar schemas publicos e privados quando houver dado sensivel.

## SSH e VPS

Antes de qualquer deploy:

- Validar acesso SSH.
- Registrar fingerprint em `known_hosts`.
- Confirmar usuario, porta e permissao de chave.
- Desabilitar login por senha quando seguro.
- Aplicar firewall basico.
- Atualizar pacotes.
- Configurar usuario de deploy com menor privilegio.
- Definir estrategia de rollback.

## Cloudflare

Antes de apontar producao:

- Confirmar posse do dominio.
- Configurar DNS.
- Ativar proxy quando adequado.
- Validar SSL.
- Criar regras basicas de WAF.
- Configurar redirecionamento HTTP para HTTPS.
- Definir politica para `/admin`, APIs e rotas sensiveis.

## LGPD

Todo modulo que lide com pessoa fisica deve documentar:

- quais dados coleta;
- por que coleta;
- quem pode acessar;
- quanto tempo retem;
- como corrigir, exportar, anonimizar ou excluir;
- qual base legal ou consentimento se aplica.

## Checklist antes do primeiro commit publico

- `.secrets/` ignorado.
- `.env` ignorado.
- Credenciais removidas de markdown.
- Historico Git sem segredos.
- Chaves expostas rotacionadas.
- `.env.example` criado sem valores reais.
- `docs/SECURITY.md` revisado.
