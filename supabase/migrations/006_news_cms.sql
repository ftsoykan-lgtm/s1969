-- Haber CMS: hero gösterimi + kategoriler
-- Supabase SQL Editor'de çalıştır

-- news tablosuna hero alanı + tarih
alter table public.news add column if not exists featured boolean not null default false;
alter table public.news add column if not exists published_at date default now();

-- Kategoriler (manuel yönetilir)
create table if not exists public.news_categories (
  id          bigint primary key generated always as identity,
  name        text not null,
  slug        text not null unique,
  sort_order  smallint default 0,
  created_at  timestamptz not null default now()
);

alter table public.news_categories enable row level security;

drop policy if exists "news_cat_public_read" on public.news_categories;
create policy "news_cat_public_read" on public.news_categories for select using (true);

drop policy if exists "news_cat_admin_write" on public.news_categories;
create policy "news_cat_admin_write" on public.news_categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Başlangıç kategorileri
insert into public.news_categories (name, slug, sort_order) values
  ('Haberler', 'haber', 1),
  ('Transfer', 'transfer', 2),
  ('Maç Raporu', 'mac-raporu', 3),
  ('Basın Bülteni', 'basin-bildirisi', 4),
  ('Altyapı', 'altyapi', 5),
  ('Kulüpten', 'kulup', 6)
on conflict (slug) do nothing;
