'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Menu, X, Search, ChevronDown, Ticket, Globe, Phone, Store, MessageSquare } from 'lucide-react'
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

// Üst yardımcı çubuk — sol taraf hızlı linkler (sivasspor.org.tr tarzı)
const topLinks = [
  { label: 'Kadro', href: '/kadro' },
  { label: 'Fikstür', href: '/takvim' },
  { label: 'Puan Durumu', href: '/mac-merkezi' },
]

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

  // ═══ sivasspor.org.tr birebir ölçüleri (1600px viewport'ta ölçüldü) ═══
  //  üst şerit 38px · ana bar 89px · container max-w 1400 / padding 0 32px
  //  logo 104px, bar üstünden 5px içerde → bar'ın 20px ALTINA taşar
  const BAR_H = 89
  const BAR_H_SCROLLED = 68
  const LOGO_MIN = 104            // referans boyut — bardan büyük, alttan taşar (üst içerlek: top-[5px])
  const logoBase = Math.max(LOGO_MIN, Math.min(club.logoSize || LOGO_MIN, 150))
  const emblemPx = scrolled ? Math.round(logoBase * 0.62) : logoBase

  // Resmi kulüp menüsü — düz BÜYÜK HARF öğeler, aktif/hover'da ince altın alt-çizgi.
  const goldUnderline = (on: boolean) =>
    cn('pointer-events-none absolute left-3 right-3 bottom-1.5 h-[2px] bg-ugold origin-center transition-transform duration-300 ease-out',
      on ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100')

  // Menü linki — sivasspor ölçüsü: Inter 13.76px / 700 / ls .62px / uppercase,
  // tam bar yüksekliği, yatay padding 13px, ikon boşluğu 6px
  const navItemCls = 'group relative flex h-full items-center gap-1.5 px-[13px] text-[13.8px] font-bold tracking-[0.045em] uppercase whitespace-nowrap transition-colors duration-200'

  const renderNavItem = (link: (typeof navLinks)[number]) =>
    link.hasMega ? (
      <div key={link.label} className="relative flex h-full items-center" onMouseEnter={openMega} onMouseLeave={closeMega}>
        <button className={cn(navItemCls, megaOpen ? 'text-ugold' : 'text-white/85 hover:text-white')}>
          {link.label}
          <ChevronDown size={13} className={cn('text-ugold/80 transition-transform duration-200', megaOpen && 'rotate-180')} />
          <span aria-hidden className={goldUnderline(megaOpen)} />
        </button>
      </div>
    ) : (
      <Link key={link.href} href={link.href} className={cn(navItemCls,
        isActive(link.href) ? 'text-ugold' : 'text-white/85 hover:text-white')}>
        {link.label}
        <span aria-hidden className={goldUnderline(isActive(link.href))} />
      </Link>
    )

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* En üst altın şerit — tam altın, kimlik vurgusu */}
      <div className="h-[3px] bg-[linear-gradient(90deg,var(--c-ugoldd),var(--c-ugold)_25%,var(--c-ugoldl)_50%,var(--c-ugold)_75%,var(--c-ugoldd))]" />

      {/* ── ÜST ŞERİT — sivasspor `.serit` birebir: h38, ana bardan KOYU zemin ── */}
      <div className={cn('hidden lg:block bg-ugreendd overflow-hidden transition-all duration-300',
        scrolled ? 'max-h-0 opacity-0 pointer-events-none' : 'max-h-[38px] opacity-100')}>
        <div className="mx-auto max-w-[1400px] px-8 flex items-center justify-between h-[38px]">
          {/* SOL — hızlı linkler (12.6px/500, gap 22px) + telefon (700) */}
          <div className="flex items-center gap-[22px]">
            {topLinks.map((l) => (
              <Link key={l.href} href={l.href} className="text-[12.6px] font-medium text-white/55 hover:text-white transition-colors">{l.label}</Link>
            ))}
            {club.phone && (
              <a href={`tel:${club.phone.replace(/[^+\d]/g, '')}`} className="flex items-center gap-1.5 text-[12.6px] font-bold text-white/80 hover:text-ugold transition-colors">
                <Phone size={12} className="shrink-0 text-ugold" /> {club.phone}
              </a>
            )}
          </div>
          {/* SAĞ — Mağaza (altın) · Forum · sosyal 30x30 (monokrom) */}
          <div className="flex items-center gap-1.5">
            <Link href="/magaza" className="flex items-center gap-[7px] px-3 py-[5px] rounded text-[11.5px] font-bold tracking-[0.06em] text-ugold hover:brightness-110 transition">
              <Store size={13} className="shrink-0" /> Mağaza
            </Link>
            <Link href="/sayfa/taraftar" className="flex items-center gap-[7px] px-3 py-[5px] rounded text-[11.5px] font-bold tracking-[0.06em] text-white/70 hover:text-white transition-colors">
              <MessageSquare size={13} className="shrink-0" /> Taraftar
            </Link>
            <span className="w-px h-4 bg-white/15 mx-1.5" />
            <div className="flex items-center gap-0.5">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                  className="h-[30px] w-[30px] flex items-center justify-center rounded-[9px] text-white/55 hover:text-ugold hover:bg-white/[0.06] transition-colors">
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Ana bar — KATI KOYU YEŞİL (sivasspor.org.tr tarzı koyu menü alanı) ── */}
      <div className={cn('relative overflow-visible bg-ugreendd transition-all duration-300',
        scrolled
          ? 'shadow-[0_18px_44px_-18px_rgba(0,0,0,0.72)]'
          : 'shadow-[0_14px_34px_-18px_rgba(0,0,0,0.5)]')}>
        {/* çok hafif üst sheen — düz koyu zemine derinlik */}
        <div aria-hidden className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_35%)]" />
        {/* alt altın saç çizgisi */}
        <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-ugold/15 via-ugold/70 to-ugold/15" />
        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">

          {/* ── MOBİL BAR (menü · logo · dil) ───────────────────────── */}
          <div className="lg:hidden grid grid-cols-[1fr_auto_1fr] items-center h-16">
            <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menü"
              className="justify-self-start h-10 w-10 flex items-center justify-center rounded-full text-white bg-white/[0.06] ring-1 ring-white/10 -ml-1">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link href="/" className="justify-self-center flex items-center gap-2 min-w-0" aria-label={club.name}>
              {hasLogo ? (
                <ClubLogo src={club.logoUrl} size={42} priority className="object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] shrink-0" />
              ) : (
                <div className="h-9 w-9 rounded-full bg-ugold flex items-center justify-center shrink-0">
                  <span className="font-heading font-extrabold text-[10px] text-ugreend">{club.shortCode}</span>
                </div>
              )}
              <span className="flex flex-col leading-none min-w-0">
                <span className="font-heading font-extrabold text-[15px] tracking-tight uppercase text-white truncate">{club.name}</span>
                {club.brandTagline && <span className="text-[8px] font-semibold tracking-[0.16em] uppercase text-ugold/75 truncate">{club.brandTagline}</span>}
              </span>
            </Link>

            <button aria-label="Dil" className="justify-self-end h-10 w-10 flex items-center justify-center rounded-full text-white/80 bg-white/[0.04] ring-1 ring-white/10 hover:text-ugold hover:bg-white/[0.08] transition-colors -mr-1">
              <Globe size={22} />
            </button>
          </div>

          {/* ── MASAÜSTÜ BAR — sivasspor `.kap` birebir: h89 (scroll'da 68), gap 22 ── */}
          <div className="hidden lg:flex items-center gap-[22px] transition-all duration-300"
            style={{ height: scrolled ? BAR_H_SCROLLED : BAR_H }}>

            {/* SOL — arma (MUTLAK: bar üstünden 5px, bardan büyük → alttan taşar) + sponsor/isim */}
            <Link href="/" aria-label={club.name} className="relative flex h-full items-center shrink-0"
              style={{ paddingLeft: emblemPx + 7 }}>
              {hasLogo ? (
                <ClubLogo src={club.logoUrl} size={emblemPx} optSize={120} priority
                  className={cn('logo-emblem absolute left-0 object-contain drop-shadow-[0_3px_12px_rgba(0,0,0,0.55)] transition-all duration-300',
                    scrolled ? 'top-1' : 'top-[5px]')} />
              ) : (
                <div style={{ height: emblemPx, width: emblemPx }}
                  className={cn('absolute left-0 rounded-full bg-ugold flex items-center justify-center', scrolled ? 'top-1' : 'top-[5px]')}>
                  <span className="font-heading font-extrabold text-sm text-ugreend">{club.shortCode}</span>
                </div>
              )}
              {/* Sponsor öneki (14.5px/600/ls1.6) ÜSTTE · kulüp adı (31px/700) ALTTA */}
              <span className="hidden xl:flex flex-col leading-none min-w-0">
                {club.brandTagline && (
                  <span className="font-heading text-[14.5px] font-semibold tracking-[0.11em] uppercase text-white/90 whitespace-nowrap">{club.brandTagline}</span>
                )}
                <span className="mt-[3px] font-heading text-[31px] font-bold leading-none tracking-[0.015em] uppercase text-white whitespace-nowrap">{club.name}</span>
              </span>
            </Link>

            {/* ORTA — menü (tam bar yüksekliği, sağa yaslı blok) */}
            <nav className="flex h-full items-center justify-end flex-1 min-w-0">
              {navLinks.map(renderNavItem)}
            </nav>

            {/* SAĞ — arama 44x44 r13 · CTA h42 px18 r6 (gap 10) */}
            <div className="flex items-center gap-[10px] shrink-0">
              <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Ara"
                className="h-11 w-11 flex items-center justify-center rounded-[13px] text-white/80 bg-white/[0.055] hover:text-ugold hover:bg-white/[0.1] transition-all">
                <Search size={17} />
              </button>
              <Link href="/bilet"
                className="group relative inline-flex h-[42px] items-center gap-2 px-[18px] rounded-md overflow-hidden text-ugreend text-[11.8px] font-extrabold tracking-[0.08em] uppercase whitespace-nowrap
                           bg-gradient-to-b from-ugoldl to-ugold shadow-[0_10px_24px_-12px_rgba(245,196,0,0.9),inset_0_1px_0_rgba(255,255,255,0.5)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-14px_rgba(245,196,0,1),inset_0_1px_0_rgba(255,255,255,0.6)]">
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-white/25" />
                <Ticket size={14} className="relative" />
                <span className="relative">Bilet Al</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Mega Menu ──────────────────────────────────────────────── */}
        <div
          className={cn('hidden lg:block absolute left-0 right-0 top-full transition-all duration-200 z-50',
            megaOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none')}
          onMouseEnter={openMega} onMouseLeave={closeMega}>
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pt-2">
            <div className="relative overflow-hidden rounded-[1.35rem] bg-[linear-gradient(135deg,var(--c-ugreendd),var(--c-ugreenm)_58%,var(--c-ugreen))] shadow-[0_28px_80px_-22px_rgba(0,0,0,0.78)] ring-1 ring-white/12">
              <div aria-hidden className="absolute inset-0 bg-[radial-gradient(55%_85%_at_90%_0%,rgba(245,196,0,0.18),transparent_62%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_38%)]" />
              <div className="relative h-1 bg-gradient-to-r from-transparent via-ugold to-transparent" />
              <div className="relative p-8 grid grid-cols-[1fr_1fr_1fr_1.1fr] gap-10">
                {kulupMenu.map((col) => (
                  <div key={col.baslik}>
                    <p className="text-ugold text-[10px] font-extrabold tracking-[0.25em] mb-4 pb-3 border-b border-white/12">{col.baslik}</p>
                    <ul className="space-y-0.5">
                      {col.linkler.map((item) => (
                        <li key={item.label}>
                          <Link href={item.href}
                            className="flex items-center gap-2.5 text-sm font-medium text-white/66 hover:text-white hover:bg-white/[0.07] rounded-xl px-3 py-2 -mx-3 transition-all group">
                            <span className="w-1.5 h-1.5 rounded-full bg-ugold/30 group-hover:bg-ugold transition-colors shrink-0" />
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="relative rounded-2xl overflow-hidden bg-white/[0.07] ring-1 ring-white/12 p-5 flex min-h-[210px] flex-col justify-end shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ugold/70 to-transparent" />
                  <div className="absolute top-3 right-3 font-heading text-[5rem] font-extrabold text-white/[0.045] leading-none">{club.shortCode}</div>
                  <p className="relative text-[10px] font-extrabold tracking-[0.25em] uppercase text-ugold/70 mb-1">{club.nickname}</p>
                  <p className="relative text-white font-extrabold text-lg leading-tight mb-3">Tribünde yerini al</p>
                  <Link href="/bilet" className="relative inline-flex items-center justify-center gap-2 bg-ugold text-ugreenm font-extrabold text-[11px] tracking-wide uppercase px-4 py-2.5 rounded-full shadow-[0_10px_24px_-14px_rgba(245,196,0,0.9)] hover:bg-ugoldh transition-colors">Bilet Al →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MOBİL MENÜ — TAM EKRAN + BÜYÜK TİPOGRAFİ ──────────────────── */}
        <div className={cn(
          'lg:hidden fixed inset-0 z-[60] flex flex-col transition-transform duration-300 ease-out bg-[linear-gradient(180deg,var(--c-ugreendd)_0%,var(--c-ugreens)_52%,var(--c-ugreenb)_100%)]',
          mobileOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        )}>
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(85%_55%_at_80%_0%,rgba(245,196,0,0.18),transparent_62%),linear-gradient(90deg,rgba(255,255,255,0.06),transparent_26%)]" />
          {/* dev arma filigranı */}
          <div aria-hidden className="pointer-events-none absolute -right-16 -bottom-10 font-heading text-[16rem] font-extrabold text-white/[0.03] leading-none select-none">{club.shortCode}</div>

          {/* Panel başlığı */}
          <div className="relative flex items-center justify-between h-16 px-4 border-b border-white/12 shrink-0">
            <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
              {hasLogo ? (
                <ClubLogo src={club.logoUrl} size={44} className="object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-ugold flex items-center justify-center"><span className="font-heading font-extrabold text-[11px] text-ugreend">{club.shortCode}</span></div>
              )}
              <span className="font-heading font-extrabold text-base tracking-tight uppercase text-white">{club.name}</span>
            </Link>
            <button onClick={() => setMobileOpen(false)} aria-label="Kapat"
              className="h-11 w-11 flex items-center justify-center rounded-full text-white bg-white/[0.08] hover:bg-white/15 transition-colors">
              <X size={22} />
            </button>
          </div>

          {/* İçerik (kaydırılabilir) — açılışta kademeli beliren büyük öğeler */}
          <div className="relative flex-1 overflow-y-auto overscroll-contain px-5 py-6">
            {mobileOpen && (
              <>
                <nav className="flex flex-col">
                  {navLinks.map((link, i) =>
                    link.hasMega ? (
                      <div key={link.label} className="nav-mitem border-b border-white/[0.09]" style={{ animationDelay: `${i * 55}ms` }}>
                        <button onClick={() => setMobileSubOpen((v) => !v)}
                          className="w-full flex items-center justify-between gap-3 py-4">
                          <span className="flex items-baseline gap-3">
                            <span className="font-heading text-[9px] font-extrabold tracking-[0.25em] text-ugold/50 tabular-nums">0{i + 1}</span>
                            <span className="font-heading text-[26px] font-extrabold tracking-tight uppercase text-white leading-none">{link.label}</span>
                          </span>
                          <ChevronDown size={22} className={cn('text-ugold/70 transition-transform duration-200', mobileSubOpen && 'rotate-180')} />
                        </button>
                        {mobileSubOpen && (
                          <div className="pb-4 pl-7 grid grid-cols-2 gap-x-4 gap-y-1">
                            {kulupMenu.flatMap((col) => col.linkler).map((item) => (
                              <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)}
                                className="block rounded-lg px-2 py-1.5 text-[14px] text-white/68 hover:bg-white/[0.06] hover:text-ugold transition-colors">{item.label}</Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link key={link.href} href={link.href === '#' ? '#' : link.href} onClick={() => setMobileOpen(false)}
                        style={{ animationDelay: `${i * 55}ms` }}
                        className={cn('nav-mitem group flex items-baseline gap-3 py-4 border-b border-white/[0.09]',
                          isActive(link.href) ? 'text-ugold' : 'text-white')}>
                        <span className={cn('font-heading text-[9px] font-extrabold tracking-[0.25em] tabular-nums', isActive(link.href) ? 'text-ugold/70' : 'text-ugold/50')}>0{i + 1}</span>
                        <span className="font-heading text-[26px] font-extrabold tracking-tight uppercase leading-none">{link.label}</span>
                      </Link>
                    )
                  )}
                </nav>

                <Link href="/bilet" onClick={() => setMobileOpen(false)}
                  style={{ animationDelay: `${navLinks.length * 55}ms` }}
                  className="nav-mitem flex items-center justify-center gap-2 mt-7 py-4 text-sm font-extrabold tracking-widest text-ugreend bg-gradient-to-b from-ugoldl to-ugold rounded-2xl uppercase shadow-[0_16px_34px_-16px_rgba(245,196,0,1),inset_0_1px_0_rgba(255,255,255,0.55)]">
                  <Ticket size={16} /> Bilet Al
                </Link>

                <div className="nav-mitem flex items-center justify-between gap-3 mt-6" style={{ animationDelay: `${(navLinks.length + 1) * 55}ms` }}>
                  <Link href="/magaza" onClick={() => setMobileOpen(false)}
                    className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-white/55 hover:text-ugold transition-colors">Mağaza</Link>
                  <div className="flex items-center gap-2.5">
                    {socials.map(({ icon: Icon, href, label, cls }) => (
                      <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                        className={`flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm ${cls}`}><Icon /></a>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Arama ────────────────────────────────────────────────── */}
        {searchOpen && (
          <div className="absolute left-0 right-0 top-full bg-ugreendd/96 backdrop-blur-xl border-b border-white/10 px-4 py-3 z-40 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.75)]">
            <div className="mx-auto max-w-[1280px]">
              <div className="relative">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input autoFocus type="search" placeholder="Haber, oyuncu, maç ara..."
                  className="w-full bg-white/[0.075] border border-white/12 rounded-full pl-11 pr-4 py-3 text-sm text-white placeholder-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] focus:outline-none focus:border-ugold/55 transition-colors"
                  onBlur={() => setSearchOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
