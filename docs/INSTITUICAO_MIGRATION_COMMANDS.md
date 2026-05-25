# Checklist Operacional de Migration da Instituição

Este checklist complementa o runbook e traz comandos concretos para executar a migração com segurança.

## Pré-checagem

```powershell
git status --short
npm run db:status
```

Se o projeto estiver em desenvolvimento e você quiser validar o app antes de tocar no banco:

```powershell
npm run build
```

## Modo produção

Use este fluxo quando a base já tem dados e você precisa preservar tudo.

### 1. Backup completo

Defina a URL direta do banco antes de começar:

```powershell
$env:GEEF_SUPABASE_DB_URL = "postgresql://postgres:***@db.nycgpokqlmrfzegjlrwa.supabase.co:5432/postgres"
```

Crie um backup em formato custom:

```powershell
New-Item -ItemType Directory -Force backups | Out-Null
$backupFile = "backups\instituicao_{0}.dump" -f (Get-Date -Format "yyyyMMdd_HHmmss")
pg_dump $env:GEEF_SUPABASE_DB_URL --format=custom --file $backupFile
```

### 2. Aplicar a migration aditiva

```powershell
npm run apply-migration -- supabase/migrations/20260523_instituicao_modelagem_total.sql
```

### 3. Validar o backfill

```powershell
psql $env:GEEF_SUPABASE_DB_URL -v ON_ERROR_STOP=1 -Atc "select count(*) from public.instituicao;"
psql $env:GEEF_SUPABASE_DB_URL -v ON_ERROR_STOP=1 -Atc "select count(*) from public.instituicao_enderecos where instituicao_id is null;"
psql $env:GEEF_SUPABASE_DB_URL -v ON_ERROR_STOP=1 -Atc "select count(*) from public.instituicao_contatos where instituicao_id is null;"
psql $env:GEEF_SUPABASE_DB_URL -v ON_ERROR_STOP=1 -Atc "select count(*) from public.instituicao_cnaes where instituicao_id is null;"
psql $env:GEEF_SUPABASE_DB_URL -v ON_ERROR_STOP=1 -Atc "select count(*) from public.instituicao_cnaes where tipo = 'principal';"
```

Se quiser checar a singleton:

```powershell
psql $env:GEEF_SUPABASE_DB_URL -v ON_ERROR_STOP=1 -Atc "select count(*) from public.instituicao;"
```

### 4. Aplicar a limpeza destrutiva

Somente depois de backup e validação:

```powershell
npm run apply-migration -- supabase/migrations/20260524_instituicao_cleanup_legado.sql
```

### 5. Oficializar o porte do CNPJ

Se a base ainda estiver com rótulos livres em `porte`, aplique a conversão para os códigos oficiais da Receita:

```powershell
npm run apply-migration -- supabase/migrations/20260525_instituicao_porte_cnpj_oficial.sql
```

### Fluxo automatizado

Se você quiser o fluxo completo com backup, aplicação da migration aditiva, validação e confirmação para cleanup:

```powershell
npm run instituicao:migrate-safe
```

Para pular o backup:

```powershell
npm run instituicao:migrate-safe -- --skip-backup
```

Para aplicar o cleanup sem prompt interativo:

```powershell
npm run instituicao:migrate-safe -- --cleanup
```

## Modo homologação

Use este fluxo quando você quer validar a sequência sem expor a produção.

### 1. Conferir migrations

```powershell
npm run db:status
```

### 2. Aplicar migrations disponíveis

Se a conexão direta estiver configurada no ambiente:

```powershell
npm run geef:migrations
```

### 3. Validar o build da aplicação

```powershell
npm run build
```

### 4. Revisar o schema no remoto ligado

```powershell
npm run db:status
```

## Regra de segurança

- Nunca aplique `20260524_instituicao_cleanup_legado.sql` sem backup.
- Nunca rode a limpeza destrutiva antes de validar o backfill.
- Se o banco já tiver dados históricos relevantes, prefira sempre a migration aditiva primeiro.
- Se houver divergência entre schema e dados, pare antes de qualquer `drop column`.
- O `porte` deve ser armazenado como código oficial do CNPJ:
  - `00` - Não informado
  - `01` - Microempresa
  - `03` - Empresa de Pequeno Porte
  - `05` - Demais

## Resultado esperado

Ao final da sequência correta:

- o banco preserva os dados existentes
- a modelagem relacional fica ativa
- o cleanup destrutivo só entra depois do backup
- o repositório continua alinhado com uma única fonte de verdade para instituição
