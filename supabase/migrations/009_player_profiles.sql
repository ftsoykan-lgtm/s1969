-- ════════════════════════════════════════════════════════════════
-- 009 — Sezon bazlı oyuncu profilleri
-- Her oyuncu her sezonda ayrı satırda tutulur. TFF'den gelen alanlar
-- senkronizasyonda güncellenir; admin'in girdiği alanlar KORUNUR.
-- ════════════════════════════════════════════════════════════════

create table if not exists player_profiles (
  id          bigserial primary key,
  season      text not null,
  tff_id      text,
  slug        text not null,
  -- TFF kaynaklı (senkronizasyonda güncellenir)
  name        text not null,
  position    text,
  number      int,
  birth_date  text,
  nationality text,
  flag_code   text,
  license_no  text,
  club        text,            -- TFF lisansındaki kulüp
  photo_tff   text,            -- TFF foto (varsa)
  -- Admin kaynaklı (senkronizasyon SİLMEZ)
  photo       text,            -- admin yüklediği profil fotoğrafı
  bio         text,
  height      text,
  weight      text,
  prev_team   text,            -- geldiği takım
  description text,
  instagram   text,
  twitter     text,
  -- Durum
  active      boolean default true,
  sort_order  int default 0,
  manual      boolean default false,
  updated_at  timestamptz default now(),
  unique (season, slug),
  unique (season, tff_id)
);

create index if not exists player_profiles_slug_idx on player_profiles (slug);
create index if not exists player_profiles_season_idx on player_profiles (season);

alter table player_profiles enable row level security;

drop policy if exists "player_profiles_read" on player_profiles;
create policy "player_profiles_read" on player_profiles for select using (true);

drop policy if exists "player_profiles_write" on player_profiles;
create policy "player_profiles_write" on player_profiles for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
