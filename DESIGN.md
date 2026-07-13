# Design

Şanlıurfaspor resmî sitesinin görsel sistemi. Kaynak: `src/app/globals.css` (token'lar admin panelden tema değişimi için CSS değişkenlerine bağlıdır). Renk kimliği **yeşil + altın + beyaz**; kişilik premium/kurumsal/güçlü.

## Theme

Açık tema birincildir (beyaz/yeşil-tonlu nötr zemin, koyu yeşil metin). Fiziksel sahne: taraftar çoğunlukla mobilde, gündüz/dış ışıkta hızlı bilgi arar — açık zemin okunabilirliği ve "resmî kaynak" güvenini destekler. İki marka teması CSS `data-theme` ile değişir:

- **Zümrüt (varsayılan)**: rafine, koyu zümrüt yeşili + sıcak altın.
- **Klasik**: daha canlı yeşil + neon sarı (önceki kimlik, `[data-theme="classic"]`).

Ayrıca bir shadcn tabanlı `.dark` token seti admin/ui bileşenleri için tanımlıdır (halka açık site açık temada kalır).

## Color

OKLCH nötrler + hex marka renkleri. Marka renkleri `--c-u*` değişkenlerinden gelir ve `bg-ugreen`, `text-ugold`, `bg-ugreen/30` gibi Tailwind utility'lerine bağlanır.

### Marka — Yeşil (Zümrüt teması)
- `ugreen` **#1b5e44** — ana marka yeşili (primary, ring)
- `ugreens` #1a5740 — hero/panel üst gradient
- `ugreenm` #154836 — orta ton
- `ugreend` #103f2e — navbar/footer
- `ugreenb` #0e3a2a — koyu blok
- `ugreendd` #0c2e22 — en koyu / ana metin rengi
- `utxt2` #356152 — ikincil metin

### Marka — Altın
- `ugold` **#f5c400** — aksan (accent), seçim, altın hairline
- `ugoldl` #f7d24a — açık altın (gradient üst)
- `ugoldh` #d9b400 — hover
- `ugoldd` #c9a200 — koyu altın (gradient alt)

### Nötr & Yüzey
- `--c-surface` #f5f9f6 — sayfa arka planı (yeşil tonlu beyaz)
- `--c-card` #ffffff — kart zemini
- `--c-border` #ddeae2 — ince kenarlık
- Metin: birincil `#0c2e22`, ikincil `#356152`, üçüncil/placeholder `#7aab8e`
- `destructive` oklch(0.577 0.245 27.325)

Kontrast: gövde metni koyu yeşil (`ugreendd`) beyaz/surface üzerinde ≥4.5:1. Yeşil zemin üzerinde metin beyaz veya altın; soluk gri metin kullanılmaz.

## Typography

Tek aile, çok ağırlık stratejisi — kurumsal grotesk.

- **Aile**: `Archivo` (next/font, kurumsal + sportif grotesk), fallback self-host `Mesopotamia Sans` (General Sans tarzı geometrik), sonra `system-ui`.
- `--font-sans` ve `--font-display` aynı Archivo ailesine dayanır; hiyerarşi ağırlık ve ölçek kontrastıyla kurulur (font eşleştirme değil).
- **Başlıklar** (h1–h4): display ailesi, `letter-spacing: -0.02em`, sıkı ve otoriter.
- Gövde: antialiased, `font-feature-settings: "kern" "liga" "calt"`, `optimizeLegibility`.
- Ağırlıklar: 400 / 500 / 600 / 700 (self-host woff2).

## Layout & Shape

- **Radius**: taban `--radius: 0.625rem`; ölçek `sm`→`4xl` (`radius * 0.6` … `* 2.6`). Kartlar 16px.
- **Boşluk**: ritim için değişken; üniform padding'den kaçınılır.
- Mobil öncelik: `html, body { overflow-x: hidden }`, `%100` genişlik sınırı; çapa kaydırma `scroll-margin-top: 90px`.
- `:target` ve smooth scroll etkin (reduced-motion'da `auto`).

## Components

- **`.card-premium`**: beyaz kart, 1px `--c-border`, 16px radius, yumuşak katmanlı gölge; hover'da `translateY(-3px)` + zümrüt kenar + derin gölge (`cubic-bezier(.16,1,.3,1)`).
- **`.panel-premium`**: büyük paneller (puan tablosu vb.); kalkış yok, yalnız yumuşak gölge.
- **`.page-hero`**: iç sayfa hero bandı — radial altın atmosfer + zümrüt lineer gradient + alt kenarda altın hairline (`::after`).
- **`.media-zoom`** / `.group:hover`: görsel kartlarda ince zoom (`scale(1.05)`, .7s).
- **Butonlar**: tutarlı geçiş + `:active` mikro-basış (`translateY(0.5px) scale(0.985)`).
- Odak: `:focus-visible` 2px yeşil halka, 2px offset.
- Kaydırma çubuğu: ince, marka tonlu.

## Motion

Etki statik güç + ölçülü hareketten gelir. Anahtar kareler globals.css'te (Turbopack `<style jsx>` keyframe enjekte etmediği için — component'te değil global CSS'te tanımlı):

- Hero: `hProg`/`hloader` (JS-driven ilerleme çubuğu tercih edilir, reduced-motion'a bağışık), `hKenBurns`, kademeli `hAnim1–4`.
- Maç ikonları: `macBob`, `macSpin`, `macPop`; CTA gol efektleri `netShake`/`goalFlash`/`golPop`.
- Navbar amblemi: sürekli altın hâle (`logoGlow`), reduced-motion'da kapanır.
- `.reveal`: scroll fade-up; **içerik görünürlüğü sınıfa bağlanmaz** — `.js-ready` yoksa görünür kalır, headless/gizli sekmede boş kalmaz.
- **Reduced motion**: global olarak animasyon/geçiş 0.01ms'ye indirilir; her özel animasyonun `@media (prefers-reduced-motion: reduce)` alternatifi vardır.

## Notes

Token'lar admin panelden tema değişimine izin verecek şekilde `--c-u*` katmanına soyutlanmıştır; yeni renk sabiti eklerken hardcode hex yerine bu değişkenlere bağlanın. Kod değiştikçe bu belgeyi `/impeccable document` ile yeniden üretebilirsiniz.
