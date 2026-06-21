-- TFF canlı verisi (puan durumu + fikstür) — tek satır JSON
-- GitHub Actions scraper'ı service_role ile buraya yazar; site buradan okur
-- Supabase SQL Editor'de çalıştır

create table if not exists public.tff_data (
  id          smallint primary key default 1,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  constraint tff_single_row check (id = 1)
);

alter table public.tff_data enable row level security;

-- Herkes okuyabilir (site public okuyor)
drop policy if exists "tff_public_read" on public.tff_data;
create policy "tff_public_read" on public.tff_data for select using (true);

-- Yazma yalnızca giriş yapmış / service_role (scraper service_role kullanır, RLS'i bypass eder)
drop policy if exists "tff_admin_write" on public.tff_data;
create policy "tff_admin_write" on public.tff_data
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into public.tff_data (id, data) values (1, '{}'::jsonb) on conflict (id) do nothing;
