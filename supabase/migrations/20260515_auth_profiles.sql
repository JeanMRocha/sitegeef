-- Create profiles table for user profile data
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  nome_completo text,
  avatar_url text,
  email text,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Policy: Users can view their own profile
create policy "Usuário pode ver seu perfil"
  on public.profiles for select
  using (auth.uid() = id);

-- Policy: Users can update their own profile
create policy "Usuário pode atualizar seu perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- Policy: Users can insert their own profile (for trigger)
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
  );
  return new;
end;
$$;

-- Trigger to call function on new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Create storage bucket for avatars
insert into storage.buckets (id, name, public)
values ('avatares', 'avatares', true)
on conflict do nothing;

-- Storage policy: authenticated users can upload to their own folder
create policy "Usuários autenticados podem fazer upload de avatar"
  on storage.objects for insert
  with check (
    auth.role() = 'authenticated' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage policy: everyone can view avatars
create policy "Avatares são públicos"
  on storage.objects for select
  using (bucket_id = 'avatares');

-- Storage policy: users can update/delete their own avatar
create policy "Usuários podem atualizar seu avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatares' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Usuários podem deletar seu avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatares' and
    (storage.foldername(name))[1] = auth.uid()::text
  );
