-- ════════════════════════════════════════════════════════════════
-- 007 — Sayfalar CMS (statik/bilgi sayfaları admin'den yönetilir)
-- Tarihçe, Tesisler, Tüzük, Başkanlarımız, Taraftar, Yasal vb.
-- ════════════════════════════════════════════════════════════════

create table if not exists site_pages (
  slug        text primary key,
  title       text not null,
  subtitle    text,
  hero_image  text,
  body        text,                 -- düz metin (paragraflar boş satırla ayrılır)
  nav_group   text default 'kulup', -- kulup | tesisler | kurumsal | taraftar | yasal
  sort        int  default 0,
  published   boolean default true,
  updated_at  timestamptz default now()
);

alter table site_pages enable row level security;

-- Herkes yayınlanmış sayfaları okuyabilir
drop policy if exists "site_pages_read" on site_pages;
create policy "site_pages_read" on site_pages for select using (true);

-- Giriş yapmış admin yazabilir
drop policy if exists "site_pages_write" on site_pages;
create policy "site_pages_write" on site_pages for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Varsayılan sayfalar (içerikler admin'den doldurulacak)
insert into site_pages (slug, title, subtitle, nav_group, sort, body) values
  ('baskanlarimiz',    'Başkanlarımız',     'Kulübümüze hizmet eden başkanlar',          'kulup',     1, 'İçerik yakında eklenecek.'),
  ('kurumsal-kimlik',  'Kurumsal Kimlik',   'Logo, renkler ve marka kullanımı',          'kulup',     2, 'İçerik yakında eklenecek.'),
  ('tuzuk',            'Tüzük',             'Kulüp tüzüğü',                              'kulup',     3, 'İçerik yakında eklenecek.'),
  ('gap-arena',        'GAP Arena',         'Stadyumumuz',                              'tesisler',  1, 'İçerik yakında eklenecek.'),
  ('antrenman-tesisi', 'Antrenman Tesisi',  'Takımımızın hazırlandığı tesis',           'tesisler',  2, 'İçerik yakında eklenecek.'),
  ('altyapi-akademisi','Altyapı Akademisi', 'Geleceğin yıldızları',                     'tesisler',  3, 'İçerik yakında eklenecek.'),
  ('muze',             'Müze',              'Kulüp tarihimiz',                          'tesisler',  4, 'İçerik yakında eklenecek.'),
  ('basin-medya',      'Basın & Medya',     'Basın bültenleri ve akreditasyon',         'kurumsal',  1, 'İçerik yakında eklenecek.'),
  ('sponsorluk',       'Sponsorluk',        'Sponsorluk fırsatları',                    'kurumsal',  2, 'İçerik yakında eklenecek.'),
  ('insan-kaynaklari', 'İnsan Kaynakları',  'Kariyer ve iş ilanları',                   'kurumsal',  3, 'İçerik yakında eklenecek.'),
  ('taraftar',         'Taraftar',          'Taraftarlarımız için',                     'taraftar',  1, 'İçerik yakında eklenecek.'),
  ('uyelik',           'Üyelik',            'Kulüp üyeliği',                            'taraftar',  2, 'İçerik yakında eklenecek.'),
  ('gizlilik',         'Gizlilik Politikası','Kişisel verilerin korunması',             'yasal',     1, 'İçerik yakında eklenecek.'),
  ('kullanim',         'Kullanım Koşulları','Site kullanım şartları',                   'yasal',     2, 'İçerik yakında eklenecek.'),
  ('cerez',            'Çerez Politikası',  'Çerez kullanımı',                          'yasal',     3, 'İçerik yakında eklenecek.')
on conflict (slug) do nothing;
