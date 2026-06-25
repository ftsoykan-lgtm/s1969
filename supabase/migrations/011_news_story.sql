-- ════════════════════════════════════════════════════════════════
-- 011 — Haberlerde "Story" desteği (mobil story alanı)
-- ════════════════════════════════════════════════════════════════
alter table news add column if not exists story boolean default false;
create index if not exists news_story_idx on news (story) where story = true;
