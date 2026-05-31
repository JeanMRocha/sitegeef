begin;

drop policy if exists "public can read musica exibicao publica" on public.musica_sessoes;
create policy "public can read musica exibicao publica"
  on public.musica_sessoes
  for select
  to anon, authenticated
  using (codigo_pareamento = 'EXIBICAO_PUBLICA');

commit;
