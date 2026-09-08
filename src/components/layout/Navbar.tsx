'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { X, Search, ChevronDown, Ticket, Phone, Store, MessageSquare, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'
import { clubInfo as defaultClub } from '@/data/club'
import type { ClubInfo } from '@/data/club'
import ClubLogo from '@/components/ui/ClubLogo'

/* ─── Sosyal medya SVG ikonları (Footer ile aynı dil) ────────────────────── */
const SocialIcons = {
  Facebook: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
  ),
  X: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  ),
  YouTube: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/></svg>
  ),
  Instagram: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
  ),
  TikTok: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/></svg>
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

// Mobil tam ekran menünün alt (başparmak) bölgesindeki hızlı erişim
const quickLinks = [
  { label: 'Fikstür', href: '/takvim', Icon: CalendarDays },
  { label: 'Mağaza', href: '/magaza', Icon: Store },
  { label: 'Taraftar', href: '/sayfa/taraftar', Icon: MessageSquare },
]

// Odak halkası — koyu zeminde altın, altın zeminde koyu (kontrast tersine döner)
const focusOnDark = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ugold/85 focus-visible:ring-offset-2 focus-visible:ring-offset-ugreenm'
const focusOnGold = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ugreendd focus-visible:ring-offset-2 focus-visible:ring-offset-ugoldl'
const pressFeedback = 'active:scale-[0.985] active:translate-y-[0.5px]'
// Footer yüzey dili: white/5 dolgu + white/10 kenarlık
const surfacePill = 'bg-white/[0.05] border border-white/10'

export default function Navbar({ club = defaultClub }: { club?: ClubInfo }) {
  const pathname = usePathname()

  const socials = [
    { icon: SocialIcons.Instagram, href: club.social.instagram, label: 'Instagram' },
    { icon: SocialIcons.X, href: club.social.twitter, label: 'X (Twitter)' },
    { icon: SocialIcons.YouTube, href: club.social.youtube, label: 'YouTube' },
    { icon: SocialIcons.Facebook, href: club.social.facebook, label: 'Facebook' },
    { icon: SocialIcons.TikTok, href: club.social.tiktok, label: 'TikTok' },
  ].filter((s) => s.href && s.href !== '#')

  const hasLogo = club.logoUrl && !club.logoUrl.includes('placehold.co')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSubOpen, setMobileSubOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  // Sahne açılışı — yalnız bir kerelik giriş cilası. Varsayılan false:
  // hiçbir öğe bu class olmadan gizli değildir (SSR/no-JS'te tam görünür).
  const [mounted, setMounted] = useState(false)
  // Mobilde ayrı arama paneli yok: arama tam ekran menünün en üstünde.
  // Arama butonu menüyü açar ve odağı doğrudan arama alanına verir.
  const [focusSearch, setFocusSearch] = useState(false)
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mobileSearchRef = useRef<HTMLInputElement | null>(null)

  // eslint-disable-next-line react-hooks/set-state-in-effect -- route değişiminde açık menüleri kapat (kasıtlı senkronizasyon)
  useEffect(() => { setMobileOpen(false); setMegaOpen(false); setMobileSubOpen(false) }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Tam ekran menü açıkken arka plan kaymasını kilitle (iOS dahil)
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

  // Tam ekran menüde Escape ile kapat (klavye erişilebilirliği)
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  // Menü açılış geçişi bittikten sonra arama alanına odaklan (geçiş sırasında
  // focus() vermek iOS'ta kaydırmayı bozuyor)
  useEffect(() => {
    if (!mobileOpen || !focusSearch) return
    const id = setTimeout(() => { mobileSearchRef.current?.focus(); setFocusSearch(false) }, 340)
    return () => clearTimeout(id)
  }, [mobileOpen, focusSearch])

  const openMobileSearch = () => { setMobileOpen(true); setFocusSearch(true) }
  const openMega = () => { if (megaTimer.current) clearTimeout(megaTimer.current); setMegaOpen(true) }
  const closeMega = () => { megaTimer.current = setTimeout(() => setMegaOpen(false), 120) }
  const isActive = (href: string) =>
    pathname === href || (href !== '/' && href !== '#' && pathname.startsWith(href + '/'))

  // Bar SABİT yükseklikte kalır; arma bardan büyüktür ve alttan taşar.
  const BAR_H = 86
  const BAR_H_SCROLLED = 66
  const LOGO_MIN = 104
  const MOBILE_LOGO = 60
  const logoBase = Math.max(LOGO_MIN, Math.min(club.logoSize || LOGO_MIN, 150))
  const emblemPx = scrolled ? Math.round(logoBase * 0.62) : logoBase

  // Hap menü — footer'ın rounded-full dili. Aktif olan ALTIN dolgulu.
  const pillBase = 'nav-pill group relative flex items-center gap-1.5 rounded-full px-[15px] h-[38px] text-[13.2px] font-bold tracking-[0.05em] uppercase whitespace-nowrap transition-colors duration-300'

  const renderNavItem = (link: (typeof navLinks)[number], i: number) => {
    const active = link.hasMega ? megaOpen : isActive(link.href)
    const cls = cn(pillBase, focusOnDark,
      active ? 'bg-ugold text-ugreenm shadow-[0_6px_18px_-8px_rgba(0,0,0,0.55)]' : 'text-white/80 hover:text-white',
      mounted && 'nav-stagger')
    const style = mounted ? ({ '--i': i } as React.CSSProperties) : undefined

    return link.hasMega ? (
      <div key={link.label} className="relative flex items-center" onMouseEnter={openMega} onMouseLeave={closeMega}>
        <button className={cls} style={style} data-active={active} aria-expanded={megaOpen} aria-haspopup="true">
          <span className="relative">{link.label}</span>
          <ChevronDown size={13} className={cn('relative transition-transform duration-300',
            active ? 'text-ugreenm' : 'text-ugold/80', megaOpen && 'rotate-180')} />
        </button>
      </div>
    ) : (
      <Link key={link.href} href={link.href} className={cls} style={style} data-active={active}
        aria-current={active ? 'page' : undefined}>
        <span className="relative">{link.label}</span>
      </Link>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Footer'ın üst altın hattının aynısı (from-ugreen via-ugold to-ugreen) */}
      <div className={cn('relative z-10 h-1 bg-gradient-to-r from-ugreen via-ugold to-ugreen',
        mounted && 'hairline-draw')} />

      {/* ── PANEL — footer zemini (.nav-surface: ugreenm + iki ışık huzmesi) ── */}
      <div className="nav-surface relative overflow-visible transition-shadow duration-300"
        style={{
          boxShadow: scrolled
            ? '0 1px 0 rgba(255,255,255,0.07) inset, 0 18px 44px -20px rgba(6,20,14,0.55)'
            : '0 1px 0 rgba(255,255,255,0.055) inset, 0 12px 30px -22px rgba(6,20,14,0.40)',
        }}>
        {/* footer'daki dev filigran armanın menüdeki karşılığı */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-1/3 overflow-hidden hidden lg:block">
          <span className="absolute right-6 top-1/2 -translate-y-1/2 font-heading text-[6.5rem] font-extrabold leading-none tracking-tighter text-white/[0.022] select-none">
            {club.shortCode}
          </span>
        </div>
        {/* footer alt bar ayrımı gibi ince beyaz hat */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-white/10" />

        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">

          {/* ── MOBİL BAR ── */}
          <div className="lg:hidden flex items-center justify-between gap-2 h-[68px]">
            <Link href="/" aria-label={club.name} className={cn('relative flex h-full items-center min-w-0 rounded-lg', focusOnDark)}
              style={{ paddingLeft: MOBILE_LOGO + 8 }}>
              {hasLogo ? (
                <ClubLogo src={club.logoUrl} size={MOBILE_LOGO} optSize={80} priority
                  className={cn('absolute left-0 top-2.5 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]', mounted && 'crest-settle')} />
              ) : (
                <div style={{ height: MOBILE_LOGO, width: MOBILE_LOGO }}
                  className="absolute left-0 top-2.5 rounded-full bg-ugold flex items-center justify-center">
                  <span className="font-heading font-extrabold text-[11px] text-ugreenm">{club.shortCode}</span>
                </div>
              )}
              <span className="flex flex-col leading-none min-w-0">
                {club.brandTagline && (
                  <span className="font-heading text-[9px] font-medium tracking-[0.16em] uppercase text-white/80 truncate">{club.brandTagline}</span>
                )}
                {/* 19px: altın metin bu zeminde 4.48:1 veriyor; 18.66px üstü
                    kalın metin WCAG'de "büyük metin" sayılır → eşik 3:1 */}
                <span className="mt-[3px] font-heading text-[19px] font-bold leading-none tracking-[0.01em] uppercase text-ugold truncate">{club.name}</span>
              </span>
            </Link>

            <div className="flex items-center gap-2 shrink-0">
              <button onClick={openMobileSearch} aria-label="Ara" aria-controls="mobil-menu"
                className={cn('h-11 w-11 flex items-center justify-center rounded-full text-white/85 hover:text-ugreenm hover:bg-ugold transition-all duration-300', surfacePill, focusOnDark, pressFeedback)}>
                <Search size={18} />
              </button>
              <button onClick={() => setMobileOpen(true)} aria-label="Menü" aria-expanded={mobileOpen} aria-controls="mobil-menu"
                className={cn('h-11 w-11 flex items-center justify-center rounded-full text-white hover:text-ugreenm hover:bg-ugold transition-all duration-300', surfacePill, focusOnDark, pressFeedback)}>
                <span aria-hidden className="grid w-[18px] gap-[4.5px]">
                  <span className="h-[2px] w-full rounded-full bg-current" />
                  <span className="h-[2px] w-full rounded-full bg-current" />
                  <span className="h-[2px] w-full rounded-full bg-current" />
                </span>
              </button>
            </div>
          </div>

          {/* ── MASAÜSTÜ BAR — 1fr/auto/1fr: menü barın ortasında kalır ── */}
          <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center gap-6 transition-all duration-300"
            style={{ height: scrolled ? BAR_H_SCROLLED : BAR_H }}>

            {/* SOL — arma doğrudan yüzeyde (halka/daire YOK) + marka adı */}
            <Link href="/" aria-label={club.name} className={cn('relative flex h-full items-center justify-self-start rounded-lg', focusOnDark)}
              style={{ paddingLeft: emblemPx + 10 }}>
              {hasLogo ? (
                <ClubLogo src={club.logoUrl} size={emblemPx} optSize={120} priority
                  className={cn('absolute left-0 object-contain drop-shadow-[0_3px_12px_rgba(0,0,0,0.45)] transition-all duration-300',
                    scrolled ? 'top-1' : 'top-[5px]', mounted && 'crest-settle')} />
              ) : (
                <div style={{ height: emblemPx, width: emblemPx }}
                  className={cn('absolute left-0 rounded-full bg-ugold flex items-center justify-center', scrolled ? 'top-1' : 'top-[5px]')}>
                  <span className="font-heading font-extrabold text-sm text-ugreenm">{club.shortCode}</span>
                </div>
              )}
              <span className="hidden xl:flex flex-col leading-none min-w-0">
                {club.brandTagline && (
                  <span className="font-heading text-[12.5px] font-medium tracking-[0.14em] uppercase text-white/80 whitespace-nowrap">{club.brandTagline}</span>
                )}
                <span className="mt-[5px] font-heading text-[29px] font-bold leading-none tracking-[0.012em] uppercase text-ugold whitespace-nowrap">
                  {club.name}
                </span>
              </span>
            </Link>

            {/* ORTA — hap menü */}
            <nav className="flex items-center gap-1">
              {navLinks.map(renderNavItem)}
            </nav>

            {/* SAĞ — arama · Mağaza · Bilet Al.
                Mağaza yüzey dilinde (white/5 hap), Bilet Al tek altın
                birincil aksiyon olarak kalsın diye altın dolgulu değil. */}
            <div className="flex items-center justify-self-end gap-2.5">
              <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Ara"
                className={cn('h-[42px] w-[42px] flex items-center justify-center rounded-full text-white/80 hover:text-ugreenm hover:bg-ugold transition-all duration-300', surfacePill, focusOnDark, pressFeedback)}>
                <Search size={17} />
              </button>
              <Link href="/magaza"
                className={cn('group inline-flex h-[42px] items-center gap-2 px-[17px] rounded-full text-[11.8px] font-extrabold tracking-[0.08em] uppercase whitespace-nowrap text-white/90 hover:text-ugreenm hover:bg-ugold transition-all duration-300',
                  surfacePill, focusOnDark, pressFeedback)}>
                <Store size={14} className="shrink-0 text-ugold transition-colors group-hover:text-ugreenm" />
                Mağaza
              </Link>
              <Link href="/bilet"
                className={cn('cta-premium group relative inline-flex h-[42px] items-center gap-2 px-[20px] rounded-full overflow-hidden text-ugreenm text-[11.8px] font-extrabold tracking-[0.08em] uppercase whitespace-nowrap',
                  'bg-gradient-to-b from-ugoldl to-ugold transition-all duration-300 hover:-translate-y-0.5', focusOnGold, pressFeedback,
                  mounted && 'nav-stagger')}
                style={{ boxShadow: '0 10px 24px -12px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.55)', ...(mounted ? ({ '--i': navLinks.length } as React.CSSProperties) : {}) }}>
                <span aria-hidden className="cta-sweep" />
                <Ticket size={14} className="relative" />
                <span className="relative">Bilet Al</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Mega Menu — footer'ın kolon dili (altın hairline + nokta işaretçi) ── */}
        <div
          className={cn('hidden lg:block absolute left-0 right-0 top-full transition-all duration-300 z-50',
            megaOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none')}
          style={{ transitionTimingFunction: 'var(--ease-premium)' }}
          onMouseEnter={openMega} onMouseLeave={closeMega}>
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pt-2.5">
            <div className="nav-surface relative overflow-hidden rounded-[1.5rem] border border-white/10 shadow-[0_28px_80px_-24px_rgba(0,0,0,0.6)]">
              <div className="relative h-1 bg-gradient-to-r from-ugreen via-ugold to-ugreen" />
              <div className="relative p-8 grid grid-cols-[1fr_1fr_1fr_1.05fr] gap-9">
                {/* Kademeleme SADECE transform — opaklık/blur kullanılmaz.
                    Gecikmeli opacity, geçiş zaman çizelgesi ilerlemeyen
                    ortamlarda kolonları kalıcı görünmez bırakır. Soluma
                    zaten üstteki kapsayıcıda (megaOpen) yapılıyor. */}
                {kulupMenu.map((col, ci) => (
                  <div key={col.baslik} className="transition-transform duration-500"
                    style={{
                      transform: megaOpen ? 'none' : 'translateY(10px)',
                      transitionDelay: megaOpen ? `${ci * 60}ms` : '0ms',
                      transitionTimingFunction: 'var(--ease-premium)',
                    }}>
                    {/* footer kolon başlığı: kısa altın hairline + tracked uppercase */}
                    <div className="flex items-center gap-2 mb-5">
                      <span aria-hidden className="w-4 h-px bg-ugold/60" />
                      <h3 className="text-[10px] font-extrabold tracking-[0.25em] uppercase text-ugold">{col.baslik}</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {col.linkler.map((item) => (
                        <li key={item.label}>
                          <Link href={item.href}
                            className={cn('group/row inline-flex items-center gap-2.5 rounded text-[15px] text-white/80 hover:text-white transition-colors', focusOnDark)}>
                            <span aria-hidden className="dot-marker" />
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {/* Vitrin kartı — footer'ın rounded-2xl white/5 yüzey dili */}
                <div className={cn('relative rounded-2xl overflow-hidden p-6 flex min-h-[210px] flex-col justify-end transition-transform duration-500', surfacePill)}
                  style={{
                    transform: megaOpen ? 'none' : 'translateY(10px)',
                    transitionDelay: megaOpen ? `${kulupMenu.length * 60}ms` : '0ms',
                    transitionTimingFunction: 'var(--ease-premium)',
                  }}>
                  <div aria-hidden className="absolute top-3 right-4 font-heading text-[5rem] font-extrabold text-white/[0.04] leading-none">{club.shortCode}</div>
                  <p className="relative text-[10px] font-extrabold tracking-[0.25em] uppercase text-ugold/70 mb-1.5">{club.nickname}</p>
                  <p className="relative text-white font-extrabold text-lg leading-tight mb-4">Tribünde yerini al</p>
                  <Link href="/bilet"
                    className={cn('relative inline-flex items-center justify-center gap-2 bg-ugold text-ugreenm font-extrabold text-[11px] tracking-wide uppercase px-4 py-2.5 rounded-full hover:bg-ugoldh transition-colors', focusOnGold, pressFeedback)}>
                    Bilet Al →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MOBİL TAM EKRAN MENÜ ──────────────────────────────────────
            Görünürlük React state'ine bağlı (inline opacity/visibility);
            hiçbir animasyon sınıfına bağlı değil. */}
        <div id="mobil-menu" role="dialog" aria-modal="true" aria-label="Menü"
          className="nav-surface lg:hidden fixed inset-0 z-[200] flex flex-col"
          style={{
            opacity: mobileOpen ? 1 : 0,
            transform: mobileOpen ? 'none' : 'scale(1.015)',
            visibility: mobileOpen ? 'visible' : 'hidden',
            pointerEvents: mobileOpen ? 'auto' : 'none',
            transition: `opacity 300ms cubic-bezier(0.16, 1, 0.3, 1), transform 380ms cubic-bezier(0.16, 1, 0.3, 1), visibility 0s linear ${mobileOpen ? '0s' : '380ms'}`,
          }}>

          {/* Tepe — marka + kapat */}
          <div className="flex items-center justify-between gap-3 px-5 h-[68px] shrink-0 border-b border-white/10">
            <Link href="/" onClick={() => setMobileOpen(false)} className={cn('flex items-center gap-2.5 min-w-0 rounded-lg', focusOnDark)}>
              {hasLogo ? (
                <ClubLogo src={club.logoUrl} size={44} optSize={80} className="shrink-0 object-contain" />
              ) : (
                <div className="h-11 w-11 shrink-0 rounded-full bg-ugold flex items-center justify-center">
                  <span className="font-heading font-extrabold text-[11px] text-ugreenm">{club.shortCode}</span>
                </div>
              )}
              <span className="flex flex-col leading-none min-w-0">
                {club.brandTagline && (
                  <span className="text-[9px] font-medium tracking-[0.16em] uppercase text-white/80 truncate">{club.brandTagline}</span>
                )}
                <span className="mt-1 font-heading text-[19px] font-bold leading-none tracking-[0.01em] uppercase text-ugold truncate">{club.name}</span>
              </span>
            </Link>
            <button onClick={() => setMobileOpen(false)} aria-label="Kapat"
              className={cn('h-11 w-11 shrink-0 flex items-center justify-center rounded-full text-white hover:text-ugreenm hover:bg-ugold transition-all duration-300', surfacePill, focusOnDark, pressFeedback)}>
              <X size={20} />
            </button>
          </div>

          {/* Kaydırılabilir orta bölge — arama + menü */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-4 pb-2">
            {/* Arama üstte (kullanışlılık: ilk iş arama) */}
            <div className={cn('relative rounded-full mb-4', mobileOpen && 'drawer-item')}
              style={mobileOpen ? ({ '--i': 0 } as React.CSSProperties) : undefined}>
              <Search size={17} aria-hidden className="absolute left-4 top-1/2 -translate-y-1/2 text-white/45 pointer-events-none" />
              <input ref={mobileSearchRef} type="search" placeholder="Haber, oyuncu, maç ara..." aria-label="Sitede ara"
                className={cn('w-full h-12 rounded-full pl-11 pr-4 text-[15px] text-white placeholder-white/45 transition-colors focus:outline-none focus:border-ugold/55', surfacePill)} />
            </div>

            <ul className="flex flex-col">
              {navLinks.map((link, i) => {
                const active = !link.hasMega && isActive(link.href)
                return (
                  <li key={link.label}
                    className={cn('border-b border-white/[0.08]', mobileOpen && 'drawer-item')}
                    style={mobileOpen ? ({ '--i': i + 1 } as React.CSSProperties) : undefined}>
                    {link.hasMega ? (
                      <>
                        <button onClick={() => setMobileSubOpen((v) => !v)} aria-expanded={mobileSubOpen}
                          className={cn('flex w-full items-center justify-between gap-3 h-16 px-1 font-heading text-[21px] font-bold tracking-[0.03em] uppercase transition-colors duration-300',
                            focusOnDark, pressFeedback, mobileSubOpen ? 'text-ugold' : 'text-white')}>
                          {link.label}
                          <span aria-hidden className={cn('h-8 w-8 flex items-center justify-center rounded-full transition-all duration-300', surfacePill)}>
                            <ChevronDown size={15} className={cn('text-ugold transition-transform duration-300', mobileSubOpen && 'rotate-180')} />
                          </span>
                        </button>
                        {mobileSubOpen && (
                          <div className="pb-4 pl-1">
                            {kulupMenu.map((col) => (
                              <div key={col.baslik} className="mb-1">
                                <div className="flex items-center gap-2 mt-4 mb-2">
                                  <span aria-hidden className="w-4 h-px bg-ugold/60" />
                                  <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-ugold">{col.baslik}</span>
                                </div>
                                {col.linkler.map((item) => (
                                  <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)}
                                    className={cn('group/row flex h-11 items-center gap-2.5 rounded text-[15.5px] text-white/80 hover:text-white transition-colors', focusOnDark)}>
                                    <span aria-hidden className="dot-marker" />
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
                        aria-current={active ? 'page' : undefined}
                        className={cn('flex items-center justify-between h-16 px-1 font-heading text-[21px] font-bold tracking-[0.03em] uppercase transition-colors duration-300',
                          focusOnDark, pressFeedback, active ? 'text-ugold' : 'text-white hover:text-ugold')}>
                        {link.label}
                        {active && <span aria-hidden className="h-2 w-2 rounded-full bg-ugold" />}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>

          {/* ── ALT BAŞPARMAK BÖLGESİ — sabit, kaydırmaz ── */}
          <div className="shrink-0 border-t border-white/10 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Link href="/bilet" onClick={() => setMobileOpen(false)}
              className={cn('cta-premium relative flex h-14 items-center justify-center gap-2.5 overflow-hidden rounded-full text-[13px] font-extrabold tracking-[0.08em] uppercase text-ugreenm bg-gradient-to-b from-ugoldl to-ugold mb-3', focusOnGold, pressFeedback)}
              style={{ boxShadow: '0 12px 28px -14px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.55)' }}>
              <span aria-hidden className="cta-sweep" />
              <Ticket size={17} className="relative" /> <span className="relative">Bilet Al</span>
            </Link>

            <div className="grid grid-cols-3 gap-2.5">
              {quickLinks.map(({ label, href, Icon }) => (
                <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                  className={cn('group flex h-[58px] flex-col items-center justify-center gap-1.5 rounded-2xl text-[11.5px] font-bold tracking-[0.04em] uppercase text-white/85 hover:text-ugreenm hover:bg-ugold transition-all duration-300', surfacePill, focusOnDark, pressFeedback)}>
                  <Icon size={19} className="text-ugold transition-colors group-hover:text-ugreenm" />
                  {label}
                </Link>
              ))}
            </div>

            {/* Telefon + sosyal: 375px'te yan yana sığmıyordu (numara satır kırıp
                taşıyordu) → dikey istif, ikisi de ortalanmış */}
            <div className="flex flex-col items-center gap-3 pt-4">
              {club.phone && (
                <a href={`tel:${club.phone.replace(/[^+\d]/g, '')}`}
                  className={cn('flex items-center gap-2 rounded whitespace-nowrap text-[13px] font-bold text-white/80 hover:text-ugold transition-colors', focusOnDark)}>
                  <Phone size={13} className="shrink-0 text-ugold" /> {club.phone}
                </a>
              )}
              <div className="flex items-center gap-2">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                    className={cn('h-9 w-9 flex items-center justify-center rounded-full text-white/60 hover:text-ugreenm hover:bg-ugold hover:border-ugold transition-all duration-300', surfacePill, focusOnDark)}>
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Masaüstü arama paneli ────────────────────────────────── */}
        {searchOpen && (
          <div className="hidden lg:block absolute left-0 right-0 top-full nav-surface border-b border-white/10 px-4 py-4 z-40 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.6)]">
            <div className="mx-auto max-w-[1280px]">
              <div className="relative">
                <Search size={16} aria-hidden className="absolute left-5 top-1/2 -translate-y-1/2 text-white/45 pointer-events-none" />
                <input autoFocus type="search" placeholder="Haber, oyuncu, maç ara..." aria-label="Sitede ara"
                  className={cn('w-full rounded-full pl-12 pr-5 py-3.5 text-[15px] text-white placeholder-white/45 focus:outline-none focus:border-ugold/55 transition-colors', surfacePill)}
                  onBlur={() => setSearchOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
