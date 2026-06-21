-- Oyuncu detayları (admin'in elle düzenlediği: foto, numara, mevki, uyruk)
-- TFF isim listesinin üzerine bu bilgiler eklenir
-- Supabase SQL Editor'de çalıştır

create table if not exists public.player_details (
  id           bigint primary key generated always as identity,
  name         text not null unique,        -- TFF kadro ismiyle eşleşir
  tff_id       text,
  photo_url    text,
  number       smallint,
  position     text,                          -- Kaleci / Defans / Orta Saha / Forvet
  nationality  text,
  flag_code    text,                          -- tr, br, sn ...
  birth_date   date,
  active       boolean not null default true,
  sort_order   smallint default 0,
  manual       boolean not null default false, -- TFF'de yok, elle eklenmiş
  updated_at   timestamptz not null default now()
);

alter table public.player_details enable row level security;

drop policy if exists "players_detail_public_read" on public.player_details;
create policy "players_detail_public_read" on public.player_details for select using (true);

drop policy if exists "players_detail_admin_write" on public.player_details;
create policy "players_detail_admin_write" on public.player_details
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
