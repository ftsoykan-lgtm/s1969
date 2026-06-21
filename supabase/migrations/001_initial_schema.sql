-- Şanlıurfaspor FK — Initial Schema (idempotent / tekrar çalıştırılabilir)
-- Supabase SQL Editor'de çalıştır

-- ─── HABERLER ──────────────────────────────────────────────────────────────
create table if not exists public.news (
  id          bigint primary key generated always as identity,
  title       text not null,
  slug        text not null unique,
  excerpt     text,
  content     text,
  image_url   text,
  category    text not null default 'kulup',
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table public.news enable row level security;
drop policy if exists "news_public_read" on public.news;
create policy "news_public_read" on public.news for select using (published = true);
drop policy if exists "news_admin_all" on public.news;
create policy "news_admin_all" on public.news for all using (auth.role() = 'authenticated');

-- ─── OYUNCULAR ─────────────────────────────────────────────────────────────
create table if not exists public.players (
  id           bigint primary key generated always as identity,
  name         text not null,
  slug         text not null unique,
  number       smallint,
  position     text not null,
  nationality  text,
  flag_code    text,
  birth_date   date,
  image_url    text,
  active       boolean not null default true,
  stats_matches  smallint default 0,
  stats_goals    smallint default 0,
  stats_assists  smallint default 0,
  stats_yellow   smallint default 0,
  stats_red      smallint default 0,
  created_at   timestamptz not null default now()
);
alter table public.players enable row level security;
drop policy if exists "players_public_read" on public.players;
create policy "players_public_read" on public.players for select using (active = true);
drop policy if exists "players_admin_all" on public.players;
create policy "players_admin_all" on public.players for all using (auth.role() = 'authenticated');

-- ─── MAÇLAR ────────────────────────────────────────────────────────────────
create table if not exists public.matches (
  id               bigint primary key generated always as identity,
  home_team        text not null,
  away_team        text not null,
  home_team_logo   text,
  away_team_logo   text,
  home_score       smallint,
  away_score       smallint,
  date             date not null,
  time             text,
  venue            text,
  competition      text default 'Süper Lig',
  is_completed     boolean not null default false,
  created_at       timestamptz not null default now()
);
alter table public.matches enable row level security;
drop policy if exists "matches_public_read" on public.matches;
create policy "matches_public_read" on public.matches for select using (true);
drop policy if exists "matches_admin_all" on public.matches;
create policy "matches_admin_all" on public.matches for all using (auth.role() = 'authenticated');

-- ─── PUAN TABLOSU ──────────────────────────────────────────────────────────
create table if not exists public.standings (
  id              bigint primary key generated always as identity,
  rank            smallint not null,
  team            text not null,
  team_logo       text,
  played          smallint default 0,
  won             smallint default 0,
  drawn           smallint default 0,
  lost            smallint default 0,
  goals_for       smallint default 0,
  goals_against   smallint default 0,
  points          smallint default 0,
  is_current_team boolean default false,
  season          text default '2026-27',
  updated_at      timestamptz not null default now()
);
alter table public.standings enable row level security;
drop policy if exists "standings_public_read" on public.standings;
create policy "standings_public_read" on public.standings for select using (true);
drop policy if exists "standings_admin_all" on public.standings;
create policy "standings_admin_all" on public.standings for all using (auth.role() = 'authenticated');

-- ─── SPONSORLAR ────────────────────────────────────────────────────────────
create table if not exists public.sponsors (
  id         bigint primary key generated always as identity,
  name       text not null,
  logo_url   text,
  website    text,
  tier       text not null default 'destekci',
  active     boolean not null default true,
  sort_order smallint default 0
);
alter table public.sponsors enable row level security;
drop policy if exists "sponsors_public_read" on public.sponsors;
create policy "sponsors_public_read" on public.sponsors for select using (active = true);
drop policy if exists "sponsors_admin_all" on public.sponsors;
create policy "sponsors_admin_all" on public.sponsors for all using (auth.role() = 'authenticated');
