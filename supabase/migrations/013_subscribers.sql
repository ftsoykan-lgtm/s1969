-- Bülten aboneleri (footer "Abone Ol")
-- Supabase SQL Editor'de çalıştır

create table if not exists public.subscribers (
  id          bigint primary key generated always as identity,
  email       text not null unique,
  created_at  timestamptz not null default now()
);

-- Basit e-posta format kontrolü
alter table public.subscribers
  drop constraint if exists subscribers_email_format;
alter table public.subscribers
  add constraint subscribers_email_format
  check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');

alter table public.subscribers enable row level security;

-- Herkes abone OLABİLİR (yalnızca insert) — e-postalar gizli kalır (public select YOK)
drop policy if exists "subscribers_public_insert" on public.subscribers;
create policy "subscribers_public_insert" on public.subscribers
  for insert with check (true);

-- Sadece admin (authenticated) listeyi görür / siler
drop policy if exists "subscribers_admin_read" on public.subscribers;
create policy "subscribers_admin_read" on public.subscribers
  for select using (auth.role() = 'authenticated');

drop policy if exists "subscribers_admin_delete" on public.subscribers;
create policy "subscribers_admin_delete" on public.subscribers
  for delete using (auth.role() = 'authenticated');
