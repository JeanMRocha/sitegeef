-- Combined migrations for GEEF Supabase setup
-- Copy and paste this entire file into Supabase SQL Editor
-- Go to: https://app.supabase.com/project/_/sql/new

-- =====================================================
-- Migration: 20260515_auth_profiles.sql
-- =====================================================

-- Create profiles table for user profile data
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  nome_completo text,
  avatar_url text,
  email text,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Drop existing policies if they exist (to avoid conflicts)
drop policy if exists "Usuário pode ver seu perfil" on public.profiles;
drop policy if exists "Usuário pode atualizar seu perfil" on public.profiles;
drop policy if exists "Usuário pode criar seu perfil" on public.profiles;

-- Create policies
create policy "Usuário pode ver seu perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuário pode atualizar seu perfil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Usuário pode criar seu perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Function to create profile on user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, nome_completo, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    nome_completo = coalesce(excluded.nome_completo, public.profiles.nome_completo),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url);
  return new;
end;
$$;

-- Drop existing trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Trigger to call function on new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================
-- Storage Setup
-- =====================================================

-- Ensure storage bucket exists
insert into storage.buckets (id, name, public)
values ('avatares', 'avatares', true)
on conflict (id) do nothing;

-- Drop existing storage policies if they exist
drop policy if exists "Usuários autenticados podem fazer upload de avatar" on storage.objects;
drop policy if exists "Avatares são públicos" on storage.objects;
drop policy if exists "Usuários podem atualizar seu avatar" on storage.objects;
drop policy if exists "Usuários podem deletar seu avatar" on storage.objects;

-- Storage policies
create policy "Usuários autenticados podem fazer upload de avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatares' and
    auth.role() = 'authenticated' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Avatares são públicos"
  on storage.objects for select
  using (bucket_id = 'avatares');

create policy "Usuários podem atualizar seu avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatares' and
    auth.role() = 'authenticated' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Usuários podem deletar seu avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatares' and
    auth.role() = 'authenticated' and
    (storage.foldername(name))[1] = auth.uid()::text
  );
