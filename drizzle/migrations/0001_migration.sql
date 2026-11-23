create table public.visit_sources (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'visit',
  source text not null default 'direct',
  referrer text,
  utm_source text, utm_medium text, utm_campaign text,
  landing_path text,
  device text,
  created_at timestamptz not null default now()
);
grant insert on public.visit_sources to anon, authenticated;
grant select on public.visit_sources to authenticated;
grant all on public.visit_sources to service_role;
alter table public.visit_sources enable row level security;
create policy "visit insert validated" on public.visit_sources for insert to anon, authenticated
with check (kind in ('visit','whatsapp') and length(source) <= 100 and coalesce(length(referrer),0) <= 500
 and coalesce(length(utm_source),0) <= 100 and coalesce(length(utm_medium),0) <= 100 and coalesce(length(utm_campaign),0) <= 100
 and coalesce(length(landing_path),0) <= 300 and coalesce(length(device),0) <= 20);
create policy "visit admin read" on public.visit_sources for select to authenticated using (public.has_role(auth.uid(),'admin'));
create index on public.visit_sources (created_at desc);