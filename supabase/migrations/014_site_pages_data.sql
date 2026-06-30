-- ════════════════════════════════════════════════════════════════
-- 014 — Sayfalara yapılandırılmış içerik kolonu (özel şablonlar için)
-- Her sayfa tipinin (zaman çizelgesi, üye kartları, renk paleti, sponsor
-- paketleri vb.) verisi `data` (jsonb) içinde tutulur. Boşsa kod-içi
-- varsayılanlar gösterilir; admin panelden düzenlenince buraya yazılır.
-- ════════════════════════════════════════════════════════════════

alter table site_pages add column if not exists data jsonb default '{}'::jsonb;
