begin;

update public.instituicao
set porte = case
  when porte is null then null
  when trim(porte) = '' then null
  when upper(trim(porte)) in ('00', '01', '03', '05') then upper(trim(porte))
  when upper(trim(porte)) like '%MEI%' then '00'
  when upper(trim(porte)) like '%MICRO%' or upper(trim(porte)) = 'ME' then '01'
  when upper(trim(porte)) like '%PEQUEN%' or upper(trim(porte)) = 'EPP' then '03'
  when upper(trim(porte)) like '%DEMAIS%' or upper(trim(porte)) like '%MÉDIA%' or upper(trim(porte)) like '%MEDIA%' or upper(trim(porte)) like '%GRANDE%' then '05'
  else null
end;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'instituicao_porte_cnpj_oficial_chk'
  ) then
    alter table public.instituicao
      add constraint instituicao_porte_cnpj_oficial_chk
      check (porte is null or porte in ('00', '01', '03', '05'));
  end if;
end $$;

comment on column public.instituicao.porte is
  'Porte oficial do CNPJ: 00-Não informado, 01-Microempresa, 03-EPP, 05-Demais';

commit;
