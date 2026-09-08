'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { X, Search, ChevronDown, Ticket, Phone, Store, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { clubInfo as defaultClub } from '@/data/club'
import type { ClubInfo } from '@/data/club'
import ClubLogo from '@/components/ui/ClubLogo'

/* ─── Sosyal medya SVG ikonları ─────────────────────────────────────────── */
const SocialIcons = {
  Facebook: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
  ),
  X: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  ),
  YouTube: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#FF0000"/></svg>
  ),
  Instagram: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
  ),
  TikTok: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/></svg>
  ),
}

/* ─── Nav verisi ─────────────────────────────────────────────────────────── */
const kulupMenu = [
  { baslik: 'KULÜP', linkler: [
    { label: 'Tarihçe', href: '/kulup/tarihce' },
    { label: 'Yönetim Kurulu', href: '/kulup/yonetim' },
    { label: 'Başkanlarımız', href: '/sayfa/baskanlarimiz' },
    { label: 'Kurumsal Kimlik', href: '/sayfa/kurumsal-kimlik' },
    { label: 'Tüzük', href: '/sayfa/tuzuk' },
  ]},
  { baslik: 'TESİSLER', linkler: [
    { label: '11 Nisan Stadyumu', href: '/sayfa/gap-arena' },
    { label: 'Antrenman Tesisi', href: '/sayfa/antrenman-tesisi' },
    { label: 'Altyapı Akademisi', href: '/sayfa/altyapi-akademisi' },
    { label: 'Müze', href: '/sayfa/muze' },
  ]},
  { baslik: 'KURUMSAL', linkler: [
    { label: 'Basın & Medya', href: '/sayfa/basin-medya' },
    { label: 'Sponsorluk', href: '/sayfa/sponsorluk' },
    { label: 'İnsan Kaynakları', href: '/sayfa/insan-kaynaklari' },
    { label: 'İletişim', href: '/iletisim' },
  ]},
]

const navLinks: { label: string; href: string; hasMega?: boolean }[] = [
  { label: 'KULÜP', href: '#', hasMega: true },
  { label: 'KADRO', href: '/kadro' },
  { label: 'HABERLER', href: '/haberler' },
  { label: 'MAÇ MERKEZİ', href: '/mac-merkezi' },
  { label: 'TAKVİM', href: '/takvim' },
  { label: 'İLETİŞİM', href: '/iletisim' },
]

// Üst yardımcı çubuk — sol taraf hızlı linkler
const topLinks = [
  { label: 'Kadro', href: '/kadro' },
  { label: 'Fikstür', href: '/takvim' },
  { label: 'Puan Durumu', href: '/mac-merkezi' },
]

// Odak halkası — gold zeminde koyu, koyu zeminde altın (kontrast tersine döner)
const focusOnDark = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ugold/85 focus-visible:ring-offset-2 focus-visible:ring-offset-ugreend'
const focusOnGold = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ugreendd focus-visible:ring-offset-2 focus-visible:ring-offset-ugoldl'
const pressFeedback = 'active:scale-[0.985] active:translate-y-[0.5px]'

export default function Navbar({ club = defaultClub }: { club?: ClubInfo }) {
  const pathname = usePathname()

  const socials = [
    { icon: SocialIcons.Instagram, href: club.social.instagram, label: 'Instagram', cls: 'bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888]' },
    { icon: SocialIcons.X, href: club.social.twitter, label: 'X (Twitter)', cls: 'bg-[#0a0a0a] ring-1 ring-white/15' },
    { icon: SocialIcons.YouTube, href: club.social.youtube, label: 'YouTube', cls: 'bg-[#FF0000]' },
    { icon: SocialIcons.Facebook, href: club.social.facebook, label: 'Facebook', cls: 'bg-[#1877F2]' },
    { icon: SocialIcons.TikTok, href: club.social.tiktok, label: 'TikTok', cls: 'bg-[#010101] ring-1 ring-white/15' },
  ]
  const hasLogo = club.logoUrl && !club.logoUrl.includes('placehold.co')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSubOpen, setMobileSubOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  // Sahne açılışı — yalnız bir kerelik giriş cilası (bkz. globals.css NAVBAR
  // PREMIUM CİLA notu). Varsayılan false: hiçbir öğe bu class olmadan gizli
  // değildir, JS kapalıyken/ilk boyada header zaten tam görünür render olur.
  const [mounted, setMounted] = useState(false)
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // eslint-disable-next-line react-hooks/set-state-in-effect -- route değişiminde açık menüleri kapat (kasıtlı senkronizasyon)
  useEffect(() => { setMobileOpen(false); setMegaOpen(false); setMobileSubOpen(false) }, [pathname])

  // Scroll'da navbar'ı daralt + camlaştır
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Sahne açılışını bir çerçeve geciktir: ilk boyanın "tam görünür" hâli
  // ekrana gerçekten committed olsun, sonra giriş class'ı eklensin — aksi
  // halde React aynı tick'te class'ı eklerse tarayıcı animasyonun "from"
  // durumuna anlık sıçrayıp geri dönebilir (flaş riski).
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Mobil menü açıkken arka plan kaymasını tamamen kilitle (iOS dahil)
  useEffect(() => {
    const body = document.body
    if (mobileOpen) {
      const scrollY = window.scrollY
      body.dataset.scrollY = String(scrollY)
      body.style.position = 'fixed'
      body.style.top = `-${scrollY}px`
      body.style.left = '0'
      body.style.right = '0'
      body.style.width = '100%'
    } else {
      const scrollY = body.dataset.scrollY
      body.style.position = ''
      body.style.top = ''
      body.style.left = ''
      body.style.right = ''
      body.style.width = ''
      if (scrollY) { window.scrollTo(0, parseInt(scrollY, 10)); delete body.dataset.scrollY }
    }
  }, [mobileOpen])

  const openMega = () => { if (megaTimer.current) clearTimeout(megaTimer.current); setMegaOpen(true) }
  const closeMega = () => { megaTimer.current = setTimeout(() => setMegaOpen(false), 120) }
  const isActive = (href: string) =>
    pathname === href || (href !== '/' && href !== '#' && pathname.startsWith(href + '/'))

  // ═══ Ölçüler (sivasspor.org.tr'de 1600px viewport'ta ölçülüp doğrulandı,
  // bu turda korunuyor) ═══  üst şerit 38px · ana bar 89px (scroll'da 68) ·
  // container max-w 1400 / padding 0 32px · logo 104px, bar üstünden 5px
  // içerde → bar'ın 20px ALTINA taşar.
  const BAR_H = 89
  const BAR_H_SCROLLED = 68
  const LOGO_MIN = 104
  const MOBILE_LOGO = 62
  const RING_GAP = 14        // masaüstü arma bezeli — crest'ten ne kadar taşar
  const MOBILE_RING_GAP = 10
  const logoBase = Math.max(LOGO_MIN, Math.min(club.logoSize || LOGO_MIN, 150))
  const emblemPx = scrolled ? Math.round(logoBase * 0.62) : logoBase
  const crestTopPx = scrolled ? 4 : 5   // top-1 = 4px, top-[5px] = 5px

  // Menü linki — Inter 13.8px / 700 / ls .045em / uppercase, tam bar
  // yüksekliği. Gösterge (.nav-ind) globals.css'te: iki katmanlı altın
  // çizgi (keskin hat + yumuşak hâle) — kütle değil ışık.
  const navItemCls = 'nav-item group relative flex h-full items-center gap-1.5 px-[13px] text-[13.8px] font-bold tracking-[0.045em] uppercase whitespace-nowrap transition-colors duration-200'

  const renderNavItem = (link: (typeof navLinks)[number], i: number) =>
    link.hasMega ? (
      <div key={link.label} className="relative flex h-full items-center" onMouseEnter={openMega} onMouseLeave={closeMega}>
        <button
          className={cn(navItemCls, focusOnDark, megaOpen ? 'text-ugold' : 'text-white/85 hover:text-white',
            mounted && 'nav-stagger')}
          style={mounted ? ({ '--i': i } as React.CSSProperties) : undefined}
          aria-expanded={megaOpen} aria-haspopup="true">
          {link.label}
          <ChevronDown size={13} className={cn('text-ugold/80 transition-transform duration-300', megaOpen && 'rotate-180')} />
          <span aria-hidden className="nav-ind" data-on={megaOpen ? 'true' : 'false'} />
        </button>
      </div>
    ) : (
      <Link key={link.href} href={link.href}
        className={cn(navItemCls, focusOnDark, isActive(link.href) ? 'text-ugold' : 'text-white/85 hover:text-white',
          mounted && 'nav-stagger')}
        style={mounted ? ({ '--i': i } as React.CSSProperties) : undefined}>
        {link.label}
        <span aria-hidden className="nav-ind" data-on={isActive(link.href) ? 'true' : 'false'} />
      </Link>
    )

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* En üst altın hairline — sahne açılışında soldan sağa çizilir;
          JS/motion yoksa zaten tam genişlikte, normal görünür halinde. */}
      <div className={cn('relative z-10 h-[2px] bg-[linear-gradient(90deg,var(--c-ugoldd),var(--c-ugold)_25%,var(--c-ugoldl)_50%,var(--c-ugold)_75%,var(--c-ugoldd))]',
        mounted && 'hairline-draw')} />

      {/* ── TEK PANEL — üst yardımcı satır + ana bar aynı gradient yüzeyde,
          sert renk dikişi yok. Yükselti mevcut token rampasından (ugreendd→
          ugreen), yeni hex icat edilmedi. ── */}
      <div className="nav-surface relative overflow-visible transition-shadow duration-300"
        style={{
          boxShadow: scrolled
            ? '0 1px 0 rgba(255,255,255,0.07) inset, 0 20px 46px -18px rgba(6,20,14,0.65), 0 2px 10px rgba(6,20,14,0.30)'
            : '0 1px 0 rgba(255,255,255,0.055) inset, 0 14px 34px -20px rgba(6,20,14,0.45)',
        }}>
        {/* çok ince üst sheen — metal kenar hissi (geniş bulanık hâle yok,
            ışık kaynağı armaya ayrılmış durumda) */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/[0.07]" />
        {/* alt altın saç çizgisi */}
        <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-ugold/15 via-ugold/70 to-ugold/15" />

        {/* ── ÜST YARDIMCI SATIR (masaüstü) — scroll'da grid-track daralması
            ile katlanır (height animasyonu değil). ── */}
        <div className="hidden lg:grid util-row" data-collapsed={scrolled ? 'true' : 'false'}>
          <div>
            <div className="mx-auto max-w-[1400px] px-8 flex items-center justify-between h-[38px] border-b border-white/[0.07]">
              {/* SOL — hızlı linkler + telefon */}
              <div className="flex items-center gap-[22px]">
                {topLinks.map((l) => (
                  <Link key={l.href} href={l.href} className={cn('rounded text-[12.6px] font-medium text-white/55 hover:text-white transition-colors', focusOnDark)}>{l.label}</Link>
                ))}
                {club.phone && (
                  <a href={`tel:${club.phone.replace(/[^+\d]/g, '')}`} className={cn('flex items-center gap-1.5 rounded text-[12.6px] font-bold text-white/80 hover:text-ugold transition-colors', focusOnDark)}>
                    <Phone size={12} className="shrink-0 text-ugold" /> {club.phone}
                  </a>
                )}
              </div>
              {/* SAĞ — Mağaza (altın) · Taraftar · sosyal 30x30 (monokrom) */}
              <div className="flex items-center gap-1.5">
                <Link href="/magaza" className={cn('flex items-center gap-[7px] px-3 py-[5px] rounded text-[11.5px] font-bold tracking-[0.06em] text-ugold hover:brightness-110 transition', focusOnDark)}>
                  <Store size={13} className="shrink-0" /> Mağaza
                </Link>
                <Link href="/sayfa/taraftar" className={cn('flex items-center gap-[7px] px-3 py-[5px] rounded text-[11.5px] font-bold tracking-[0.06em] text-white/70 hover:text-white transition-colors', focusOnDark)}>
                  <MessageSquare size={13} className="shrink-0" /> Taraftar
                </Link>
                <span className="w-px h-4 bg-white/15 mx-1.5" />
                <div className="flex items-center gap-0.5">
                  {socials.map(({ icon: Icon, href, label }) => (
                    <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                      className={cn('h-[30px] w-[30px] flex items-center justify-center rounded-[9px] text-white/55 hover:text-ugold hover:bg-white/[0.06] transition-colors', focusOnDark)}>
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">

          {/* ── MOBİL BAR — h71, logo 62px (12px içerlek → 3px alttan taşar),
              solda marka+bezel · sağda arama + hamburger ── */}
          <div className="lg:hidden flex items-center justify-between gap-[9px] h-[71px]">
            <Link href="/" aria-label={club.name} className={cn('group/brand relative flex h-full items-center min-w-0 rounded-lg', focusOnDark)}
              style={{ paddingLeft: MOBILE_LOGO + 7 }}>
              <span aria-hidden className="crest-ring absolute"
                style={{ left: -(MOBILE_RING_GAP / 2), top: 12 - MOBILE_RING_GAP / 2, width: MOBILE_LOGO + MOBILE_RING_GAP, height: MOBILE_LOGO + MOBILE_RING_GAP }} />
              {hasLogo ? (
                <ClubLogo src={club.logoUrl} size={MOBILE_LOGO} optSize={80} priority
                  className={cn('absolute left-0 top-3 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]', mounted && 'crest-settle')} />
              ) : (
                <div style={{ height: MOBILE_LOGO, width: MOBILE_LOGO }}
                  className="absolute left-0 top-3 rounded-full bg-ugold flex items-center justify-center">
                  <span className="font-heading font-extrabold text-[11px] text-ugreend">{club.shortCode}</span>
                </div>
              )}
              <span className="flex flex-col leading-none min-w-0">
                {club.brandTagline && (
                  <span className="font-heading text-[9px] font-medium tracking-[0.16em] uppercase text-white/60 truncate">{club.brandTagline}</span>
                )}
                <span className="mt-[3px] font-heading text-[18px] font-bold leading-none tracking-[0.01em] uppercase text-ugold truncate">{club.name}</span>
              </span>
            </Link>

            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Ara"
                className={cn('h-[38px] w-[38px] flex items-center justify-center rounded-[11px] text-white/85 bg-white/[0.055] hover:text-ugold transition-colors', focusOnDark, pressFeedback)}>
                <Search size={17} />
              </button>
              <button onClick={() => setMobileOpen(true)} aria-label="Menü" aria-expanded={mobileOpen}
                className={cn('h-[38px] w-[38px] flex items-center justify-center rounded-[11px] text-white bg-white/[0.055] hover:text-ugold transition-colors', focusOnDark, pressFeedback)}>
                <span aria-hidden className="grid w-5 gap-[5px]">
                  <span className="h-[2px] w-full rounded-full bg-current" />
                  <span className="h-[2px] w-full rounded-full bg-current" />
                  <span className="h-[2px] w-full rounded-full bg-current" />
                </span>
              </button>
            </div>
          </div>

          {/* ── MASAÜSTÜ BAR — h89 (scroll'da 68). 1fr/auto/1fr grid: marka ve
              aksiyon blokları farklı genişlikte olsa da menü bar'ın GERÇEK
              matematiksel ortasında kalır (flex-1+justify-center bunu garanti
              etmiyordu — geniş marka bloğu merkezi sağa kaydırıyordu). ── */}
          <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center gap-[22px] transition-all duration-300"
            style={{ height: scrolled ? BAR_H_SCROLLED : BAR_H }}>

            {/* SOL — arma (bezel halkalı, MUTLAK: bardan büyük → alttan taşar) + sponsor/isim */}
            <Link href="/" aria-label={club.name} className={cn('group/brand relative flex h-full items-center justify-self-start rounded-lg', focusOnDark)}
              style={{ paddingLeft: emblemPx + 7 }}>
              <span aria-hidden className="crest-ring absolute"
                style={{ left: -(RING_GAP / 2), top: crestTopPx - RING_GAP / 2, width: emblemPx + RING_GAP, height: emblemPx + RING_GAP, transition: 'width 300ms var(--ease-snap), height 300ms var(--ease-snap), top 300ms var(--ease-snap)' }} />
              {hasLogo ? (
                <ClubLogo src={club.logoUrl} size={emblemPx} optSize={120} priority
                  className={cn('absolute left-0 object-contain drop-shadow-[0_3px_12px_rgba(0,0,0,0.55)] transition-all duration-300',
                    scrolled ? 'top-1' : 'top-[5px]', mounted && 'crest-settle')} />
              ) : (
                <div style={{ height: emblemPx, width: emblemPx }}
                  className={cn('absolute left-0 rounded-full bg-ugold flex items-center justify-center', scrolled ? 'top-1' : 'top-[5px]')}>
                  <span className="font-heading font-extrabold text-sm text-ugreend">{club.shortCode}</span>
                </div>
              )}
              {/* Sponsor öneki (ince ağırlık, ölçülü) ÜSTTE · kulüp adı ALTTA */}
              <span className="hidden xl:flex flex-col leading-none min-w-0">
                {club.brandTagline && (
                  <span className="font-heading text-[13px] font-medium tracking-[0.13em] uppercase text-white/60 whitespace-nowrap">{club.brandTagline}</span>
                )}
                <span className="mt-[4px] font-heading text-[31px] font-bold leading-none tracking-[0.012em] uppercase text-ugold whitespace-nowrap"
                  style={{ textShadow: '0 2px 14px rgba(6,20,14,0.5)' }}>
                  {club.name}
                </span>
              </span>
            </Link>

            {/* ORTA — menü; grid'in auto-sütunu olduğu için ekstra genişlik
                yok, dolayısıyla otomatik olarak bar'ın matematiksel ortasında. */}
            <nav className="flex h-full items-center">
              {navLinks.map(renderNavItem)}
            </nav>

            {/* SAĞ — arama 44x44 r13 · CTA h42 px18 r6 (gap 10) */}
            <div className="flex items-center justify-self-end gap-[10px]">
              <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Ara"
                className={cn('h-11 w-11 flex items-center justify-center rounded-[13px] text-white/80 bg-white/[0.055] ring-1 ring-white/10 hover:text-ugold hover:bg-white/[0.1] hover:ring-ugold/40 transition-all duration-300',
                  focusOnDark, pressFeedback)}>
                <Search size={17} />
              </button>
              <Link href="/bilet"
                className={cn('cta-premium group relative inline-flex h-[42px] items-center gap-2 px-[18px] rounded-md overflow-hidden text-ugreend text-[11.8px] font-extrabold tracking-[0.08em] uppercase whitespace-nowrap',
                  'bg-gradient-to-b from-ugoldl to-ugold transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.015]', focusOnGold, pressFeedback,
                  mounted && 'nav-stagger')}
                style={{ boxShadow: '0 10px 24px -12px rgba(245,196,0,0.9), inset 0 1px 0 rgba(255,255,255,0.55)', ...(mounted ? ({ '--i': navLinks.length } as React.CSSProperties) : {}) }}>
                <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-white/25" />
                <span aria-hidden className="cta-sweep" />
                <Ticket size={14} className="relative" />
                <span className="relative">Bilet Al</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Mega Menu — kademeli + blur-to-clear reveal (her açılışta çalışır;
            React className megaOpen'a bağlı olduğu için mount-tracking gerekmez) ── */}
        <div
          className={cn('hidden lg:block absolute left-0 right-0 top-full transition-all duration-300 z-50',
            megaOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none')}
          style={{ transitionTimingFunction: 'var(--ease-premium)' }}
          onMouseEnter={openMega} onMouseLeave={closeMega}>
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pt-2">
            <div className="relative overflow-hidden rounded-[1.35rem] bg-[linear-gradient(135deg,var(--c-ugreendd),var(--c-ugreenm)_58%,var(--c-ugreen))] shadow-[0_28px_80px_-22px_rgba(0,0,0,0.78)] ring-1 ring-white/12">
              <div aria-hidden className="absolute inset-0 bg-[radial-gradient(55%_85%_at_90%_0%,rgba(245,196,0,0.18),transparent_62%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_38%)]" />
              <div className="relative h-1 bg-gradient-to-r from-transparent via-ugold to-transparent" />
              <div className="relative p-8 grid grid-cols-[1fr_1fr_1fr_1.1fr] gap-10">
                {kulupMenu.map((col, ci) => (
                  <div key={col.baslik}
                    className="transition-all duration-500"
                    style={{
                      opacity: megaOpen ? 1 : 0,
                      transform: megaOpen ? 'none' : 'translateY(10px)',
                      filter: megaOpen ? 'blur(0px)' : 'blur(6px)',
                      transitionDelay: megaOpen ? `${ci * 60}ms` : '0ms',
                      transitionTimingFunction: 'var(--ease-premium)',
                    }}>
                    <p className="mb-4 pb-3 border-b border-white/12 text-[10px] font-extrabold tracking-[0.25em] text-ugold">{col.baslik}</p>
                    <ul className="space-y-0.5">
                      {col.linkler.map((item) => (
                        <li key={item.label}>
                          {/* Hover'da soldan açılan altın ray + metin sağa kayar */}
                          <Link href={item.href}
                            className={cn('group/row relative flex items-center rounded-xl -mx-3 px-3 py-2.5 text-sm font-medium text-white/65 transition-colors duration-300 hover:text-white hover:bg-white/[0.06]', focusOnDark)}>
                            <span aria-hidden
                              className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 origin-center scale-y-0 rounded-full bg-ugold opacity-0 transition-all duration-300 group-hover/row:scale-y-100 group-hover/row:opacity-100" />
                            <span className="transition-transform duration-300 group-hover/row:translate-x-1.5">{item.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="relative rounded-2xl overflow-hidden bg-white/[0.07] ring-1 ring-white/12 p-5 flex min-h-[210px] flex-col justify-end shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-500"
                  style={{
                    opacity: megaOpen ? 1 : 0,
                    transform: megaOpen ? 'none' : 'translateY(10px)',
                    filter: megaOpen ? 'blur(0px)' : 'blur(6px)',
                    transitionDelay: megaOpen ? `${kulupMenu.length * 60}ms` : '0ms',
                    transitionTimingFunction: 'var(--ease-premium)',
                  }}>
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ugold/70 to-transparent" />
                  <div className="absolute top-3 right-3 font-heading text-[5rem] font-extrabold text-white/[0.045] leading-none">{club.shortCode}</div>
                  <p className="relative text-[10px] font-extrabold tracking-[0.25em] uppercase text-ugold/70 mb-1">{club.nickname}</p>
                  <p className="relative text-white font-extrabold text-lg leading-tight mb-3">Tribünde yerini al</p>
                  <Link href="/bilet" className={cn('relative inline-flex items-center justify-center gap-2 bg-ugold text-ugreenm font-extrabold text-[11px] tracking-wide uppercase px-4 py-2.5 rounded-full shadow-[0_10px_24px_-14px_rgba(245,196,0,0.9)] hover:bg-ugoldh transition-colors', focusOnGold, pressFeedback)}>Bilet Al →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MOBİL ÖRTÜ (perde) — koyu + blur, hafif vinyet ile ekstra derinlik ── */}
        <div aria-hidden onClick={() => setMobileOpen(false)}
          className={cn('lg:hidden fixed inset-0 z-[190] transition-opacity duration-300',
            mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none')}
          style={{
            background: 'radial-gradient(120% 100% at 85% 0%, rgba(6,16,10,0.55), rgba(6,16,10,0.82) 60%)',
            backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
          }} />

        {/* ── MOBİL ÇEKMECE — 345px sağdan, tek panel gradienti ── */}
        {/* NOT: transform/transition INLINE — Tailwind v4 virgüllü arbitrary değeri
            (ease-[cubic-bezier(...)]) kuralı bozup translate'i uygulamıyordu. */}
        <aside
          className="lg:hidden fixed right-0 top-0 bottom-0 z-[200] w-[345px] max-w-[92vw] overflow-y-auto overscroll-contain px-5 pt-4 pb-[22px] border-l border-white/[0.11] bg-[linear-gradient(165deg,var(--c-ugreend)_0%,var(--c-ugreenb)_45%,var(--c-ugreendd)_100%)]"
          style={{
            transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
            // visibility gecikmeli: kapanış animasyonu bitince gizlensin (klavye odağı dışarıda kalsın)
            transition: `transform 300ms cubic-bezier(0.22, 1, 0.36, 1), visibility 0s linear ${mobileOpen ? '0s' : '300ms'}`,
            visibility: mobileOpen ? 'visible' : 'hidden',
          }}
          aria-hidden={!mobileOpen}>

          {/* Tepe — arma (bezel halkalı) + sponsor/isim + kapat */}
          <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-white/[0.11]">
            <Link href="/" onClick={() => setMobileOpen(false)} className={cn('flex items-center gap-2.5 min-w-0 rounded-lg', focusOnDark)}>
              <span className="relative shrink-0" style={{ width: 46, height: 46 }}>
                <span aria-hidden className="crest-ring absolute -inset-[5px]" />
                {hasLogo ? (
                  <ClubLogo src={club.logoUrl} size={46} optSize={80} className="object-contain" />
                ) : (
                  <div className="h-[46px] w-[46px] rounded-full bg-ugold flex items-center justify-center">
                    <span className="font-heading font-extrabold text-[11px] text-ugreend">{club.shortCode}</span>
                  </div>
                )}
              </span>
              <span className="flex flex-col leading-none min-w-0">
                {club.brandTagline && (
                  <span className="text-[9px] font-medium tracking-[0.16em] uppercase text-white/60 truncate">{club.brandTagline}</span>
                )}
                <span className="mt-1 font-heading text-[20.8px] font-bold leading-none tracking-[0.01em] uppercase text-ugold truncate">{club.name}</span>
              </span>
            </Link>
            <button onClick={() => setMobileOpen(false)} aria-label="Kapat"
              className={cn('h-11 w-11 shrink-0 flex items-center justify-center rounded-[13px] text-white bg-white/[0.055] border border-white/[0.11] hover:bg-white/10 transition-colors', focusOnDark, pressFeedback)}>
              <X size={20} />
            </button>
          </div>

          {/* Menü — satır 56px, Archivo 17.6px uppercase, chevron 12px.
              Kademeli beliriş + aktif sayfada altın ray. */}
          <ul className="flex flex-col">
            {navLinks.map((link, i) => (
              <li key={link.label}
                className={cn('relative border-b border-white/[0.08]', mobileOpen && 'drawer-item')}
                style={mobileOpen ? { animationDelay: `${60 + i * 45}ms` } : undefined}>
                {!link.hasMega && isActive(link.href) && (
                  <span aria-hidden className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-full bg-ugold" />
                )}
                {link.hasMega ? (
                  <>
                    <button onClick={() => setMobileSubOpen((v) => !v)} aria-expanded={mobileSubOpen}
                      className={cn('flex w-full items-center justify-between gap-3 h-14 px-1.5 font-heading text-[17.6px] font-bold tracking-[0.035em] uppercase transition-colors duration-300',
                        focusOnDark, pressFeedback, mobileSubOpen ? 'text-ugold' : 'text-white')}>
                      {link.label}
                      <ChevronDown size={12} className={cn('shrink-0 text-ugold transition-transform duration-300', mobileSubOpen && 'rotate-180')} />
                    </button>
                    {mobileSubOpen && (
                      <div className="ml-2 border-l-2 border-ugold/40 pt-0.5 pb-3 pl-3.5">
                        {kulupMenu.map((col) => (
                          <div key={col.baslik}>
                            <div className="mt-3 mb-1 text-[10.5px] font-extrabold uppercase tracking-[0.13em] text-ugold">{col.baslik}</div>
                            {col.linkler.map((item) => (
                              <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)}
                                className={cn('flex h-10 items-center px-1 text-[14.7px] font-semibold text-white/60 hover:text-ugold transition-colors rounded', focusOnDark)}>
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={link.href} onClick={() => setMobileOpen(false)}
                    className={cn('flex items-center h-14 px-1.5 font-heading text-[17.6px] font-bold tracking-[0.035em] uppercase transition-colors duration-300',
                      focusOnDark, pressFeedback, isActive(link.href) ? 'text-ugold' : 'text-white hover:text-ugold')}>
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Alt — Mağaza/Taraftar (48px) · Bilet Al (50px r6) · telefon + sosyal */}
          <div className={cn('flex flex-col gap-3 pt-5', mobileOpen && 'drawer-item')}
            style={mobileOpen ? { animationDelay: `${60 + navLinks.length * 45}ms` } : undefined}>
            <div className="grid grid-cols-2 gap-2.5">
              <Link href="/magaza" onClick={() => setMobileOpen(false)}
                className={cn('flex h-12 items-center justify-center gap-2 rounded-lg border border-ugold/35 bg-ugold/[0.06] text-[12px] font-extrabold tracking-[0.06em] uppercase text-ugold', focusOnDark, pressFeedback)}>
                <Store size={15} /> Mağaza
              </Link>
              <Link href="/sayfa/taraftar" onClick={() => setMobileOpen(false)}
                className={cn('flex h-12 items-center justify-center gap-2 rounded-lg border border-white/[0.14] bg-white/[0.04] text-[12px] font-extrabold tracking-[0.06em] uppercase text-white/85', focusOnDark, pressFeedback)}>
                <MessageSquare size={15} /> Taraftar
              </Link>
            </div>

            <Link href="/bilet" onClick={() => setMobileOpen(false)}
              className={cn('cta-premium relative flex h-[50px] items-center justify-center gap-2 overflow-hidden rounded-[6px] text-[11.8px] font-extrabold tracking-[0.08em] uppercase text-ugreend bg-gradient-to-b from-ugoldl to-ugold', focusOnGold, pressFeedback)}
              style={{ boxShadow: '0 12px 28px -14px rgba(245,196,0,0.95), inset 0 1px 0 rgba(255,255,255,0.55)' }}>
              <span aria-hidden className="cta-sweep" />
              <Ticket size={16} className="relative" /> <span className="relative">Bilet Al</span>
            </Link>

            <div className="flex flex-col gap-2.5 pt-1">
              {club.phone && (
                <a href={`tel:${club.phone.replace(/[^+\d]/g, '')}`}
                  className={cn('flex items-center justify-center gap-2 rounded text-[12.5px] font-bold text-white/80 hover:text-ugold transition-colors', focusOnDark)}>
                  <Phone size={13} className="text-ugold" /> {club.phone}
                </a>
              )}
              <div className="flex items-center justify-center gap-2.5">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                    className={cn('h-[34px] w-[34px] flex items-center justify-center rounded-[10px] text-white/60 hover:text-ugold hover:bg-white/[0.06] transition-colors', focusOnDark)}>
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Arama ────────────────────────────────────────────────── */}
        {searchOpen && (
          <div className="absolute left-0 right-0 top-full bg-ugreendd/96 backdrop-blur-xl border-b border-white/10 px-4 py-3 z-40 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.75)]">
            <div className="mx-auto max-w-[1280px]">
              <div className="relative">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input autoFocus type="search" placeholder="Haber, oyuncu, maç ara..."
                  className={cn('w-full bg-white/[0.075] border border-white/12 rounded-full pl-11 pr-4 py-3 text-sm text-white placeholder-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] focus:outline-none focus:border-ugold/55 transition-colors')}
                  onBlur={() => setSearchOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
