-- Safe fallback migration for institution module
-- Creates the institution tables when a fresh Supabase project is missing them.

create extension if not exists pgcrypto;

create table if not exists public.instituicao (
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

create table if not exists public.instituicao_enderecos (
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

create table if not exists public.instituicao_contatos (
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

create table if not exists public.contas_bancarias (
  id               uuid primary key default gen_random_uuid(),
  nome             text not null,
  banco            text,
  agencia          text,
  conta            text,
  tipo_conta       text,
  titular          text,
  cpf_cnpj_titular text,
  chave_pix        text,
  tipo_chave_pix   text,
  finalidade       text,
  visibilidade     text default 'privada',
  ativo            boolean default true
);

