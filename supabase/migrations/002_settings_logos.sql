-- Şanlıurfaspor — Site Ayarları + Logolar + Storage (idempotent)
-- Supabase SQL Editor'de çalıştır

-- ─── SİTE AYARLARI (tek satır, JSON) ───────────────────────────────────────
create table if not exists public.site_settings (
  id          smallint primary key default 1,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  constraint single_row check (id = 1)
);
alter table public.site_settings enable row level security;
drop policy if exists "settings_public_read" on public.site_settings;
create policy "settings_public_read" on public.site_settings for select using (true);
drop policy if exists "settings_admin_write" on public.site_settings;
create policy "settings_admin_write" on public.site_settings
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
insert into public.site_settings (id, data) values (1, '{}'::jsonb) on conflict (id) do nothing;

-- ─── TAKIM LOGOLARI ────────────────────────────────────────────────────────
create table if not exists public.team_logos (
  id          bigint primary key generated always as identity,
  team_name   text not null unique,
  logo_url    text,
  updated_at  timestamptz not null default now()
);
alter table public.team_logos enable row level security;
drop policy if exists "logos_public_read" on public.team_logos;
create policy "logos_public_read" on public.team_logos for select using (true);
drop policy if exists "logos_admin_write" on public.team_logos;
create policy "logos_admin_write" on public.team_logos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ─── STORAGE BUCKET (logolar / medya) ──────────────────────────────────────
insert into storage.buckets (id, name, public)
  values ('media', 'media', true)
  on conflict (id) do update set public = true;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media_admin_insert" on storage.objects;
create policy "media_admin_insert" on storage.objects
  for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update" on storage.objects
  for update using (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete" on storage.objects
  for delete using (bucket_id = 'media' and auth.role() = 'authenticated');
