-- GEEF ERP — Migration Completa
-- Baseada em docs/baseerp.md §32 — Ordem: Instituição → Pessoas → Usuários → Departamentos → Módulos → Docs → Relatórios

-- ============================================================================
-- BLOCO 1 — INSTITUIÇÃO
-- ============================================================================

create table public.instituicao (
  id                    uuid primary key default gen_random_uuid(),
  nome_oficial          text not null,
  nome_curto            text,
  cnpj                  text,
  natureza_juridica     text,
  data_fundacao         date,
  logo_url              text,
  descricao             text,
  historia              text,
  missao                text,
  visao                 text,
  valores               text,
  estatuto_url          text,
  status                text default 'ativa',
  criado_em             timestamptz default now(),
  atualizado_em         timestamptz default now()
);

create table public.instituicao_enderecos (
  id          uuid primary key default gen_random_uuid(),
  cep         text,
  logradouro  text,
  numero      text,
  complemento text,
  bairro      text,
  cidade      text,
  estado      text,
  maps_link   text,
  latitude    numeric,
  longitude   numeric
);

create table public.instituicao_contatos (
  id              uuid primary key default gen_random_uuid(),
  tipo            text,
  telefone        text,
  whatsapp        text,
  email           text,
  instagram       text,
  facebook        text,
  youtube         text,
  site            text,
  responsavel_id  uuid references public.pessoas,
  ativo           boolean default true
);

create table public.contas_bancarias (
  id              uuid primary key default gen_random_uuid(),
  nome            text not null,
  banco           text,
  agencia         text,
  conta           text,
  tipo_conta      text,
  titular         text,
  cpf_cnpj_titular text,
  chave_pix       text,
  tipo_chave_pix  text,
  finalidade      text,
  visibilidade    text default 'privada',
  ativo           boolean default true
);

-- ============================================================================
-- BLOCO 2 — PESSOAS E VÍNCULOS
-- ============================================================================

create type public.tipo_vinculo as enum (
  'frequentador', 'tarefeiro', 'voluntario', 'evangelizador', 'crianca',
  'jovem', 'responsavel_legal', 'leitor', 'comprador', 'doador',
  'assistido', 'palestrante', 'dirigente', 'membro_departamento', 'visitante'
);

create type public.status_pessoa as enum ('ativo', 'inativo', 'falecido', 'afastado');

create table public.pessoas (
  id                    uuid primary key default gen_random_uuid(),
  nome                  text not null,
  nome_social           text,
  data_nascimento       date,
  cpf                   text,
  rg                    text,
  telefone              text,
  whatsapp              text,
  email                 text,
  logradouro            text,
  numero                text,
  bairro                text,
  cidade                text,
  estado                text,
  cep                   text,
  observacoes           text,
  contato_emergencia    text,
  status                public.status_pessoa default 'ativo',
  autoriza_notificacao  boolean default true,
  autoriza_imagem_voz   boolean default false,
  responsavel_id        uuid references public.pessoas,
  criado_em             timestamptz default now(),
  atualizado_em         timestamptz default now()
);

create table public.pessoa_vinculos (
  id        uuid primary key default gen_random_uuid(),
  pessoa_id uuid references public.pessoas on delete cascade,
  vinculo   public.tipo_vinculo not null,
  desde     date,
  unique(pessoa_id, vinculo)
);

-- ============================================================================
-- BLOCO 3 — USUÁRIOS E PERMISSÕES
-- ============================================================================

create type public.perfil_sistema as enum (
  'administrador', 'diretoria', 'secretaria', 'financeiro', 'bibliotecario',
  'livraria', 'evangelizador', 'coord_juventude', 'coord_estudos',
  'coord_atendimento', 'coord_passe', 'coord_apse', 'comunicacao',
  'patrimonio', 'tarefeiro', 'leitor', 'voluntario', 'publico'
);

create table public.usuarios_sistema (
  id                  uuid references auth.users on delete cascade primary key,
  pessoa_id           uuid references public.pessoas,
  perfil              public.perfil_sistema not null default 'publico',
  pode_escalas        boolean default false,
  pode_biblioteca     boolean default false,
  pode_livraria       boolean default false,
  pode_financeiro     boolean default false,
  pode_pessoas        boolean default false,
  pode_publicar       boolean default false,
  pode_mediunidade    boolean default false,
  pode_atendimento    boolean default false,
  pode_apse           boolean default false,
  criado_em           timestamptz default now()
);

-- ============================================================================
-- BLOCO 4 — DEPARTAMENTOS
-- ============================================================================

create table public.departamentos (
  id              uuid primary key default gen_random_uuid(),
  nome            text not null unique,
  descricao       text,
  coordenador_id  uuid references public.pessoas,
  vice_id         uuid references public.pessoas,
  ativo           boolean default true
);

create table public.departamento_membros (
  id              uuid primary key default gen_random_uuid(),
  departamento_id uuid references public.departamentos on delete cascade,
  pessoa_id       uuid references public.pessoas,
  cargo           text,
  desde           date,
  unique(departamento_id, pessoa_id)
);

-- ============================================================================
-- BLOCO 5 — ESCALAS
-- ============================================================================

create table public.funcoes (
  id        uuid primary key default gen_random_uuid(),
  nome      text not null unique,
  descricao text,
  ativo     boolean default true
);

create table public.temas_doutrinarios (
  id        uuid primary key default gen_random_uuid(),
  titulo    text not null,
  categoria text not null,
  ativo     boolean default true
);

create table public.escalas_mensais (
  id            uuid primary key default gen_random_uuid(),
  mes           integer not null check (mes between 1 and 12),
  ano           integer not null,
  status        text default 'rascunho',
  criado_por    uuid references auth.users,
  criado_em     timestamptz default now(),
  atualizado_em timestamptz default now(),
  unique(mes, ano)
);

create table public.reunioes (
  id         uuid primary key default gen_random_uuid(),
  escala_id  uuid references public.escalas_mensais on delete cascade,
  data       date not null,
  observacao text,
  unique(escala_id, data)
);

create table public.escala_funcoes (
  id            uuid primary key default gen_random_uuid(),
  reuniao_id    uuid references public.reunioes on delete cascade,
  funcao_id     uuid references public.funcoes,
  pessoa_id     uuid references public.pessoas,
  substituto_id uuid references public.pessoas,
  observacao    text
);

create table public.escala_passe (
  id         uuid primary key default gen_random_uuid(),
  reuniao_id uuid references public.reunioes on delete cascade,
  pessoa_id  uuid references public.pessoas,
  posicao    integer
);

create table public.escala_evangelizacao (
  id         uuid primary key default gen_random_uuid(),
  reuniao_id uuid references public.reunioes on delete cascade,
  pessoa_id  uuid references public.pessoas,
  tema_id    uuid references public.temas_doutrinarios,
  tema_livre text,
  turma      text
);

create table public.escala_palestras (
  id            uuid primary key default gen_random_uuid(),
  reuniao_id    uuid references public.reunioes on delete cascade,
  expositor_id  uuid references public.pessoas,
  tema_id       uuid references public.temas_doutrinarios,
  tema_livre    text,
  cidade_origem text,
  tipo_palestra text
);

-- ============================================================================
-- BLOCO 6 — ATENDIMENTO ESPIRITUAL
-- ============================================================================

create table public.atendimento_recepcao (
  id                  uuid primary key default gen_random_uuid(),
  data                date not null,
  pessoas_atendidas   integer,
  motivo_geral        text,
  encaminhamento      text,
  observacoes         text,
  criado_em           timestamptz default now()
);

create table public.atendimento_fraterno (
  id              uuid primary key default gen_random_uuid(),
  pessoa_id       uuid references public.pessoas,
  atendente_id    uuid references public.pessoas,
  data            date not null,
  tipo            text,
  encaminhamento  text,
  observacoes     text,
  sigilo          boolean default true,
  status          text default 'em_aberto',
  criado_em       timestamptz default now()
);

create table public.evangelhos_no_lar (
  id          uuid primary key default gen_random_uuid(),
  pessoa_id   uuid references public.pessoas,
  endereco    text,
  equipe      text,
  data        date,
  situacao    text,
  observacoes text,
  criado_em   timestamptz default now()
);

create table public.irradiacoes (
  id              uuid primary key default gen_random_uuid(),
  solicitante_id  uuid references public.pessoas,
  nome_irradiacao text not null,
  motivo          text,
  periodo         text,
  status          text default 'ativa',
  confidencial    boolean default true,
  criado_em       timestamptz default now()
);

-- ============================================================================
-- BLOCO 7 — EVANGELIZAÇÃO INFANTIL
-- ============================================================================

create table public.turmas_evangelizacao (
  id              uuid primary key default gen_random_uuid(),
  nome            text not null,
  faixa_etaria    text,
  horario         text,
  sala            text,
  capacidade      integer,
  status          text default 'ativa'
);

create table public.criancas (
  id              uuid primary key default gen_random_uuid(),
  pessoa_id       uuid references public.pessoas,
  responsavel_id  uuid references public.pessoas,
  turma_id        uuid references public.turmas_evangelizacao,
  restricoes      text,
  autorizacoes    text,
  status          text default 'ativa'
);

create table public.turma_evangelizadores (
  id       uuid primary key default gen_random_uuid(),
  turma_id uuid references public.turmas_evangelizacao on delete cascade,
  pessoa_id uuid references public.pessoas,
  unique(turma_id, pessoa_id)
);

create table public.aulas_evangelizacao (
  id          uuid primary key default gen_random_uuid(),
  turma_id    uuid references public.turmas_evangelizacao,
  data        date not null,
  tema        text,
  material    text,
  observacoes text,
  presencas   jsonb,
  criado_em   timestamptz default now()
);

-- ============================================================================
-- BLOCO 8 — ESTUDOS DOUTRINÁRIOS
-- ============================================================================

create table public.cursos_estudo (
  id        uuid primary key default gen_random_uuid(),
  nome      text not null,
  descricao text,
  ativo     boolean default true
);

create table public.turmas_estudo (
  id              uuid primary key default gen_random_uuid(),
  curso_id        uuid references public.cursos_estudo,
  facilitador_id  uuid references public.pessoas,
  horario         text,
  data_inicio     date,
  data_fim        date,
  status          text default 'em_andamento'
);

create table public.modulos_estudo (
  id       uuid primary key default gen_random_uuid(),
  turma_id uuid references public.turmas_estudo on delete cascade,
  nome     text,
  ordem    integer
);

create table public.frequencias_estudo (
  id        uuid primary key default gen_random_uuid(),
  turma_id  uuid references public.turmas_estudo,
  pessoa_id uuid references public.pessoas,
  data      date not null,
  presente  boolean default true
);

-- ============================================================================
-- BLOCO 9 — MEDIUNIDADE (RESTRITO)
-- ============================================================================

create table public.grupos_mediunicos (
  id              uuid primary key default gen_random_uuid(),
  nome            text not null,
  coordenador_id  uuid references public.pessoas,
  status          text default 'ativo'
);

create table public.grupo_mediunico_membros (
  id        uuid primary key default gen_random_uuid(),
  grupo_id  uuid references public.grupos_mediunicos on delete cascade,
  pessoa_id uuid references public.pessoas,
  status    text default 'ativo',
  desde     date,
  unique(grupo_id, pessoa_id)
);

create table public.reunioes_mediunicas (
  id          uuid primary key default gen_random_uuid(),
  grupo_id    uuid references public.grupos_mediunicos,
  data        date not null,
  observacoes text,
  presencas   jsonb
);

-- ============================================================================
-- BLOCO 10 — BIBLIOTECA
-- ============================================================================

create table public.obras (
  id        uuid primary key default gen_random_uuid(),
  titulo    text not null,
  autor     text,
  editora   text,
  isbn      text unique,
  categoria text,
  sinopse   text,
  capa_url  text,
  publico   text,
  ativo     boolean default true,
  criado_em timestamptz default now()
);

create table public.exemplares (
  id          uuid primary key default gen_random_uuid(),
  obra_id     uuid references public.obras on delete cascade,
  codigo      text not null unique,
  conservacao text,
  localizacao text,
  origem      text,
  situacao    text default 'disponivel',
  criado_em   timestamptz default now()
);

create table public.emprestimos (
  id              uuid primary key default gen_random_uuid(),
  exemplar_id     uuid references public.exemplares,
  pessoa_id       uuid references public.pessoas,
  data_retirada   date not null default current_date,
  prazo_devolucao date not null,
  data_devolucao  date,
  status          text default 'em_aberto',
  observacao      text,
  criado_em       timestamptz default now()
);

create table public.reservas (
  id           uuid primary key default gen_random_uuid(),
  pessoa_id    uuid references public.pessoas,
  obra_id      uuid references public.obras,
  posicao_fila integer,
  status       text default 'aguardando',
  criado_em    timestamptz default now()
);

-- ============================================================================
-- BLOCO 11 — LIVRARIA
-- ============================================================================

create table public.produtos_livraria (
  id              uuid primary key default gen_random_uuid(),
  titulo          text not null,
  autor           text,
  categoria       text,
  capa_url        text,
  qtd_estoque     integer default 0,
  estoque_minimo  integer default 2,
  valor_custo     numeric(10,2),
  valor_venda     numeric(10,2),
  status          text default 'disponivel',
  ativo           boolean default true,
  criado_em       timestamptz default now()
);

create table public.movimentos_livraria (
  id              uuid primary key default gen_random_uuid(),
  produto_id      uuid references public.produtos_livraria,
  pessoa_id       uuid references public.pessoas,
  tipo            text not null,
  quantidade      integer not null,
  valor_unit      numeric(10,2),
  valor_total     numeric(10,2),
  forma_pagamento text,
  status_pagamento text,
  observacao      text,
  criado_em       timestamptz default now()
);

-- ============================================================================
-- BLOCO 12 — APSE
-- ============================================================================

create table public.familias_assistidas (
  id              uuid primary key default gen_random_uuid(),
  responsavel_id  uuid references public.pessoas,
  endereco        text,
  membros         integer,
  situacao        text,
  status          text default 'ativa',
  criado_em       timestamptz default now()
);

create table public.atendimentos_apse (
  id              uuid primary key default gen_random_uuid(),
  familia_id      uuid references public.familias_assistidas,
  pessoa_id       uuid references public.pessoas,
  data            date not null,
  tipo            text,
  descricao       text,
  responsavel_id  uuid references public.pessoas,
  criado_em       timestamptz default now()
);

create table public.campanhas_apse (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  descricao   text,
  data_inicio date,
  data_fim    date,
  meta        text,
  status      text default 'planejada'
);

-- ============================================================================
-- BLOCO 13 — FINANCEIRO
-- ============================================================================

create table public.plano_contas (
  id     uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  nome   text not null,
  tipo   text not null,
  status text default 'ativo'
);

create table public.centros_custo (
  id    uuid primary key default gen_random_uuid(),
  nome  text not null unique,
  ativo boolean default true
);

create table public.movimentos_financeiros (
  id              uuid primary key default gen_random_uuid(),
  tipo            text not null,
  conta_id        uuid references public.plano_contas,
  categoria       text not null,
  descricao       text not null,
  valor           numeric(10,2) not null,
  data            date not null default current_date,
  centro_custo_id uuid references public.centros_custo,
  pessoa_id       uuid references public.pessoas,
  comprovante_url text,
  lancado_por     uuid references auth.users,
  criado_em       timestamptz default now()
);

-- ============================================================================
-- BLOCO 14 — GOVERNANÇA
-- ============================================================================

create table public.diretorias (
  id              uuid primary key default gen_random_uuid(),
  nome            text not null,
  data_inicio     date,
  data_fim        date,
  status          text default 'ativa',
  ata_eleicao_url text,
  ata_posse_url   text,
  observacoes     text
);

create table public.cargos (
  id        uuid primary key default gen_random_uuid(),
  nome      text not null,
  descricao text,
  nivel     text
);

create table public.cargo_ocupacoes (
  id            uuid primary key default gen_random_uuid(),
  pessoa_id     uuid references public.pessoas,
  cargo_id      uuid references public.cargos,
  diretoria_id  uuid references public.diretorias,
  data_inicio   date,
  data_fim      date,
  motivo_saida  text,
  status        text default 'ativo'
);

create table public.assembleias (
  id           uuid primary key default gen_random_uuid(),
  tipo         text not null,
  data         date not null,
  pauta        text,
  participantes jsonb,
  decisoes     text,
  ata_url      text,
  status       text default 'rascunho'
);

-- ============================================================================
-- BLOCO 15 — DOCUMENTOS E LGPD
-- ============================================================================

create table public.documentos_modelo (
  id        uuid primary key default gen_random_uuid(),
  tipo      text not null,
  titulo    text not null,
  versao    text,
  conteudo  text,
  ativo     boolean default true,
  criado_em timestamptz default now()
);

create table public.termos_assinados (
  id              uuid primary key default gen_random_uuid(),
  pessoa_id       uuid references public.pessoas,
  responsavel_id  uuid references public.pessoas,
  modelo_id       uuid references public.documentos_modelo,
  data_assinatura date,
  validade        date,
  arquivo_url     text,
  status          text default 'ativo',
  criado_em       timestamptz default now()
);

create table public.consentimentos_lgpd (
  id                 uuid primary key default gen_random_uuid(),
  pessoa_id          uuid references public.pessoas,
  finalidade         text not null,
  base_legal         text,
  canal_autorizado   text,
  data_consentimento timestamptz default now(),
  data_revogacao     timestamptz,
  status             text default 'ativo'
);

create table public.servicos_voluntarios (
  id              uuid primary key default gen_random_uuid(),
  pessoa_id       uuid references public.pessoas,
  departamento_id uuid references public.departamentos,
  servico         text,
  horarios        text,
  termo_url       text,
  data_inicio     date,
  data_fim        date,
  status          text default 'ativo'
);

-- ============================================================================
-- BLOCO 16 — COMUNICAÇÃO, PATRIMÔNIO, REUNIÕES VIRTUAIS, PLANEJAMENTO
-- ============================================================================

create table public.publicacoes (
  id           uuid primary key default gen_random_uuid(),
  titulo       text not null,
  tipo         text,
  conteudo     text,
  autor_id     uuid references public.pessoas,
  status       text default 'rascunho',
  publicado_em timestamptz,
  criado_em    timestamptz default now()
);

create table public.bens_patrimoniais (
  id              uuid primary key default gen_random_uuid(),
  nome            text not null,
  categoria       text,
  localizacao     text,
  conservacao     text,
  responsavel_id  uuid references public.pessoas,
  data_aquisicao  date,
  valor           numeric(10,2),
  termo_doacao_url text,
  status          text default 'ativo'
);

create table public.reunioes_virtuais (
  id           uuid primary key default gen_random_uuid(),
  titulo       text not null,
  plataforma   text,
  link         text,
  senha        text,
  anfitriao_id uuid references public.pessoas,
  data_hora    timestamptz,
  checklist    jsonb,
  status       text default 'planejada'
);

create table public.metas_planejamento (
  id              uuid primary key default gen_random_uuid(),
  diretriz        text,
  objetivo        text not null,
  meta            text,
  acao            text,
  responsavel_id  uuid references public.pessoas,
  prazo           date,
  indicador       text,
  andamento       integer default 0,
  status          text default 'planejada'
);

-- ============================================================================
-- BLOCO 17 — NOTIFICAÇÕES E LOGS
-- ============================================================================

create table public.notificacoes (
  id            uuid primary key default gen_random_uuid(),
  pessoa_id     uuid references public.pessoas,
  tipo          text not null,
  titulo        text not null,
  mensagem      text not null,
  canal         text default 'interno',
  status        text default 'pendente',
  modulo_origem text,
  criado_em     timestamptz default now(),
  enviado_em    timestamptz
);

create table public.logs_alteracoes (
  id               uuid primary key default gen_random_uuid(),
  tabela           text not null,
  registro_id      uuid,
  acao             text,
  dados_anteriores jsonb,
  dados_novos      jsonb,
  usuario_id       uuid references auth.users,
  criado_em        timestamptz default now()
);

-- ============================================================================
-- INSERTS INICIAIS
-- ============================================================================

insert into public.funcoes (nome, descricao) values
  ('Dirigente', 'Responsável pela condução da reunião'),
  ('Recepção', 'Acolhimento na chegada'),
  ('Prece Inicial', 'Prece de abertura'),
  ('Prece Final', 'Prece de encerramento'),
  ('Aplicador de Passe', 'Aplicação de passes energéticos'),
  ('Evangelizador', 'Educação doutrinária'),
  ('Expositor', 'Palestra ou exposição'),
  ('Paginista', 'Controle de leitura e passagens'),
  ('Apoio', 'Suporte geral nas atividades');

insert into public.centros_custo (nome) values
  ('Biblioteca'),
  ('Livraria'),
  ('Evangelização'),
  ('APSE'),
  ('Manutenção'),
  ('Comunicação'),
  ('Patrimônio'),
  ('Estudos'),
  ('Eventos'),
  ('Administração');

insert into public.departamentos (nome, descricao) values
  ('Gestão / Diretoria', 'Governança e estratégia'),
  ('Secretaria', 'Documentação e comunicação administrativa'),
  ('Financeiro', 'Contas e livro caixa'),
  ('Doutrinário', 'Formação doutrinária'),
  ('Atendimento Espiritual', 'Recepção e atendimento'),
  ('Passe', 'Aplicação de passes'),
  ('Atendimento Fraterno', 'Acolhimento e orientação'),
  ('Evangelização Infantil', 'Educação de crianças'),
  ('Juventude / Mocidade', 'Trabalho com jovens'),
  ('Estudos Doutrinários', 'IEE, ESDE, EOB, EADE'),
  ('Mediunidade', 'Práticas mediúnicas'),
  ('Biblioteca', 'Acervo e empréstimos'),
  ('Livraria', 'Venda de livros'),
  ('Comunicação Social Espírita', 'Divulgação e mídia'),
  ('APSE', 'Assistência e promoção social'),
  ('Patrimônio', 'Bens e equipamentos'),
  ('Eventos', 'Reuniões especiais'),
  ('Tecnologia / Site', 'Infraestrutura e TI'),
  ('Reuniões Virtuais', 'Reuniões online');

insert into public.cursos_estudo (nome, descricao) values
  ('IEE', 'Introdução ao Estudo do Espiritismo'),
  ('ESDE', 'Estudo Sistematizado da Doutrina Espírita'),
  ('EOB', 'Estudo da Obra Básica'),
  ('EADE', 'Estudo Aprofundado da Doutrina Espírita');

insert into public.plano_contas (codigo, nome, tipo) values
  ('1.1.1', 'Doações', 'receita'),
  ('1.1.2', 'Venda de Livros', 'receita'),
  ('1.1.3', 'Contribuições', 'receita'),
  ('1.1.4', 'Eventos', 'receita'),
  ('2.1.1', 'Compra de Livros', 'despesa'),
  ('2.1.2', 'Materiais de Evangelização', 'despesa'),
  ('2.1.3', 'Água e Luz', 'despesa'),
  ('2.1.4', 'Internet', 'despesa'),
  ('2.1.5', 'Manutenção', 'despesa'),
  ('2.1.6', 'Assistência Social', 'despesa'),
  ('2.1.7', 'Impressão', 'despesa');
