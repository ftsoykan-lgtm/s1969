-- ════════════════════════════════════════════════════════════════
-- 008 — Sezon arşivi
-- tff_data (id=1) her zaman GÜNCEL sezonu tutar (site bunu okur).
-- tff_seasons her sezonun anlık görüntüsünü ayrı satırda saklar —
-- yeni sezona geçilince eski sezon (ör. 2025-2026) kaybolmaz.
-- ════════════════════════════════════════════════════════════════

create table if not exists tff_seasons (
  season      text primary key,        -- "2025-2026"
  data        jsonb not null,          -- o sezonun puan durumu + fikstür + kadro
  updated_at  timestamptz default now()
);

alter table tff_seasons enable row level security;

-- Herkes okuyabilir (geçmiş sezon görüntüleme)
drop policy if exists "tff_seasons_read" on tff_seasons;
create policy "tff_seasons_read" on tff_seasons for select using (true);

-- Yazma yalnız service_role (scraper) — RLS service key ile bypass edilir.
-- Authenticated admin de yazabilsin (manuel düzeltme gerekirse):
drop policy if exists "tff_seasons_write" on tff_seasons;
create policy "tff_seasons_write" on tff_seasons for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
