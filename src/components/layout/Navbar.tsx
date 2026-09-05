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
  const MOBILE_LOGO = 62          // mobil bar 71px → 12px içerlek, 3px alttan taşar
  const logoBase = Math.max(LOGO_MIN, Math.min(club.logoSize || LOGO_MIN, 150))
  const emblemPx = scrolled ? Math.round(logoBase * 0.62) : logoBase

  // Menü linki — sivasspor ölçüsü: Inter 13.76px / 700 / ls .62px / uppercase,
  // tam bar yüksekliği, yatay padding 13px. Gösterge (.nav-ind) globals.css'te:
  // ortadan açılan altın çizgi + yumuşak hâle.
  const navItemCls = 'nav-item group relative flex h-full items-center gap-1.5 px-[13px] text-[13.8px] font-bold tracking-[0.045em] uppercase whitespace-nowrap transition-colors duration-200'

  const renderNavItem = (link: (typeof navLinks)[number]) =>
    link.hasMega ? (
      <div key={link.label} className="relative flex h-full items-center" onMouseEnter={openMega} onMouseLeave={closeMega}>
        <button className={cn(navItemCls, megaOpen ? 'text-ugold' : 'text-white/85 hover:text-white')}>
          {link.label}
          <ChevronDown size={13} className={cn('text-ugold/80 transition-transform duration-300', megaOpen && 'rotate-180')} />
          <span aria-hidden className="nav-ind" data-on={megaOpen ? 'true' : 'false'} />
        </button>
      </div>
    ) : (
      <Link key={link.href} href={link.href} className={cn(navItemCls,
        isActive(link.href) ? 'text-ugold' : 'text-white/85 hover:text-white')}>
        {link.label}
        <span aria-hidden className="nav-ind" data-on={isActive(link.href) ? 'true' : 'false'} />
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

      {/* ── Ana bar — KATI KOYU YEŞİL + premium derinlik katmanları ── */}
      <div className="relative overflow-visible bg-ugreend transition-all duration-300"
        style={{
          // çok katmanlı gölge + üst iç ışık çizgisi (virgüllü → inline zorunlu)
          boxShadow: scrolled
            ? '0 1px 0 rgba(255,255,255,0.06) inset, 0 18px 44px -18px rgba(0,0,0,0.72), 0 2px 10px rgba(0,0,0,0.28)'
            : '0 1px 0 rgba(255,255,255,0.06) inset, 0 14px 34px -18px rgba(0,0,0,0.50)',
        }}>
        {/* atmosfer: üst sheen + armanın arkasında yumuşak altın hâle */}
        <div aria-hidden className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.045), transparent 38%),' +
              'radial-gradient(46% 150% at 6% 15%, color-mix(in srgb, var(--c-ugold) 13%, transparent), transparent 70%)',
          }} />
        {/* alt altın saç çizgisi */}
        <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-ugold/15 via-ugold/70 to-ugold/15" />
        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">

          {/* ── MOBİL BAR — sivasspor birebir: h71, logo 62px (12px içerlek → 3px taşar),
              solda marka · sağda arama + hamburger (38x38, r11, gap 6) ── */}
          <div className="lg:hidden flex items-center justify-between gap-[9px] h-[71px]">
            {/* SOL — arma + sponsor öneki + kulüp adı */}
            <Link href="/" aria-label={club.name} className="relative flex h-full items-center min-w-0"
              style={{ paddingLeft: MOBILE_LOGO + 7 }}>
              {hasLogo ? (
                <ClubLogo src={club.logoUrl} size={MOBILE_LOGO} optSize={80} priority
                  className="absolute left-0 top-3 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]" />
              ) : (
                <div style={{ height: MOBILE_LOGO, width: MOBILE_LOGO }}
                  className="absolute left-0 top-3 rounded-full bg-ugold flex items-center justify-center">
                  <span className="font-heading font-extrabold text-[11px] text-ugreend">{club.shortCode}</span>
                </div>
              )}
              <span className="flex flex-col leading-none min-w-0">
                {club.brandTagline && (
                  <span className="font-heading text-[9px] font-semibold tracking-[0.16em] uppercase text-white/70 truncate">{club.brandTagline}</span>
                )}
                <span className="mt-[3px] font-heading text-[18px] font-bold leading-none tracking-[0.01em] uppercase text-ugold truncate">{club.name}</span>
              </span>
            </Link>

            {/* SAĞ — arama + hamburger */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Ara"
                className="h-[38px] w-[38px] flex items-center justify-center rounded-[11px] text-white/85 bg-white/[0.055] hover:text-ugold transition-colors">
                <Search size={17} />
              </button>
              <button onClick={() => setMobileOpen(true)} aria-label="Menü" aria-expanded={mobileOpen}
                className="h-[38px] w-[38px] flex items-center justify-center rounded-[11px] text-white bg-white/[0.055] hover:text-ugold transition-colors">
                <span aria-hidden className="grid w-5 gap-[5px]">
                  <span className="h-[2px] w-full rounded-full bg-current" />
                  <span className="h-[2px] w-full rounded-full bg-current" />
                  <span className="h-[2px] w-full rounded-full bg-current" />
                </span>
              </button>
            </div>
          </div>

          {/* ── MASAÜSTÜ BAR — sivasspor `.kap` birebir: h89 (scroll'da 68), gap 22 ── */}
          <div className="hidden lg:flex items-center gap-[22px] transition-all duration-300"
            style={{ height: scrolled ? BAR_H_SCROLLED : BAR_H }}>

            {/* SOL — arma (MUTLAK: bar üstünden 5px, bardan büyük → alttan taşar) + sponsor/isim */}
            {/* ── MARKA KİLİDİ (lockup) — hanedan/madalya dili ──────────
                Altın hâle armayı aydınlatır · ortasında baklava olan heraldik
                ayraç iki parçayı tek amblem yapar · kuruluş yılı altın rozet ·
                kulüp adı KABARTMA (letterpress: altta koyu, üstte ince ışık). */}
            <Link href="/" aria-label={club.name} className="group/brand relative flex h-full shrink-0 items-center gap-[18px]"
              style={{ paddingLeft: emblemPx + 16 }}>
              {/* armayı saran yumuşak altın hâle */}
              <span aria-hidden className="pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full transition-opacity duration-500 opacity-80 group-hover/brand:opacity-100"
                style={{
                  width: emblemPx * 1.3, height: emblemPx * 1.3, left: emblemPx * -0.15,
                  background: 'radial-gradient(circle, color-mix(in srgb, var(--c-ugold) 20%, transparent) 0%, transparent 65%)',
                }} />

              {hasLogo ? (
                <ClubLogo src={club.logoUrl} size={emblemPx} optSize={120} priority
                  className={cn('logo-emblem absolute left-0 object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover/brand:scale-[1.04]',
                    scrolled ? 'top-1' : 'top-[5px]')} />
              ) : (
                <div style={{ height: emblemPx, width: emblemPx }}
                  className={cn('absolute left-0 rounded-full bg-ugold flex items-center justify-center', scrolled ? 'top-1' : 'top-[5px]')}>
                  <span className="font-heading font-extrabold text-sm text-ugreend">{club.shortCode}</span>
                </div>
              )}

              {/* heraldik ayraç — altın kural + merkezinde baklava */}
              <span aria-hidden className="relative hidden h-[58px] w-px shrink-0 xl:block"
                style={{ background: 'linear-gradient(to bottom, transparent, var(--c-ugold) 24%, var(--c-ugold) 76%, transparent)', opacity: 0.5 }}>
                <span className="absolute left-1/2 top-1/2 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-ugold" />
              </span>

              <span className="hidden min-w-0 flex-col xl:flex">
                {/* kuruluş rozeti + sponsor */}
                <span className="flex items-center gap-2.5 whitespace-nowrap">
                  {club.founded && (
                    <span className="rounded-[3px] bg-ugold px-1.5 py-[2px] font-heading text-[9.5px] font-extrabold tracking-[0.1em] text-ugreend">
                      {club.founded}
                    </span>
                  )}
                  {club.brandTagline && (
                    <span className="font-heading text-[11px] font-bold uppercase tracking-[0.26em] text-white/65">{club.brandTagline}</span>
                  )}
                </span>

                {/* kabartmalı kulüp adı */}
                <span className="mt-[7px] whitespace-nowrap font-heading text-[32px] font-bold uppercase leading-none tracking-[0.012em] text-ugold"
                  style={{ textShadow: '0 1px 0 rgba(0,0,0,0.55), 0 -1px 0 rgba(255,255,255,0.10), 0 4px 16px rgba(0,0,0,0.45)' }}>
                  {club.name}
                </span>
              </span>
            </Link>

            {/* ORTA — menü (tam bar yüksekliği, sağa yaslı blok) */}
            <nav className="flex h-full items-center justify-end flex-1 min-w-0">
              {navLinks.map(renderNavItem)}
            </nav>

            {/* SAĞ — arama 44x44 r13 · CTA h42 px18 r6 (gap 10) */}
            <div className="flex items-center gap-[10px] shrink-0">
              <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Ara"
                className="h-11 w-11 flex items-center justify-center rounded-[13px] text-white/80 bg-white/[0.055] ring-1 ring-white/10 hover:text-ugold hover:bg-white/[0.1] hover:ring-ugold/40 transition-all duration-300">
                <Search size={17} />
              </button>
              <Link href="/bilet"
                className="cta-premium group relative inline-flex h-[42px] items-center gap-2 px-[18px] rounded-md overflow-hidden text-ugreend text-[11.8px] font-extrabold tracking-[0.08em] uppercase whitespace-nowrap
                           bg-gradient-to-b from-ugoldl to-ugold transition-all duration-300 hover:-translate-y-0.5"
                style={{ boxShadow: '0 10px 24px -12px rgba(245,196,0,0.9), inset 0 1px 0 rgba(255,255,255,0.55)' }}>
                <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-white/25" />
                <span aria-hidden className="cta-sweep" />
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
                    <p className="mb-4 pb-3 border-b border-white/12 text-[10px] font-extrabold tracking-[0.25em] text-ugold">{col.baslik}</p>
                    <ul className="space-y-0.5">
                      {col.linkler.map((item) => (
                        <li key={item.label}>
                          {/* Hover'da soldan açılan altın ray + metin sağa kayar */}
                          <Link href={item.href}
                            className="group/row relative flex items-center rounded-xl -mx-3 px-3 py-2.5 text-sm font-medium text-white/65 transition-colors duration-300 hover:text-white hover:bg-white/[0.06]">
                            <span aria-hidden
                              className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 origin-center scale-y-0 rounded-full bg-ugold opacity-0 transition-all duration-300 group-hover/row:scale-y-100 group-hover/row:opacity-100" />
                            <span className="transition-transform duration-300 group-hover/row:translate-x-1.5">{item.label}</span>
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

        {/* ── MOBİL ÖRTÜ (perde) — sivasspor `.perde` birebir:
            rgba(9,7,6,.74) + backdrop blur(6px) → ARKA PLAN BULANIKLAŞIR, z190 ── */}
        <div aria-hidden onClick={() => setMobileOpen(false)}
          className={cn('lg:hidden fixed inset-0 z-[190] bg-[rgba(6,16,10,0.74)] transition-opacity duration-300',
            mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none')}
          style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }} />

        {/* ── MOBİL ÇEKMECE — sivasspor `.cekmece` birebir: 345px sağdan, z200,
            padding 16/20/22, kendi içinde kaydırılır ── */}
        {/* NOT: transform/transition INLINE — Tailwind v4 virgüllü arbitrary değeri
            (ease-[cubic-bezier(...)]) kuralı bozup translate'i uygulamıyordu. */}
        <aside
          className="lg:hidden fixed right-0 top-0 bottom-0 z-[200] w-[345px] max-w-[92vw] overflow-y-auto overscroll-contain px-5 pt-4 pb-[22px] border-l border-white/[0.11] bg-[linear-gradient(180deg,var(--c-ugreend)_0%,var(--c-ugreendd)_100%)]"
          style={{
            transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
            // visibility gecikmeli: kapanış animasyonu bitince gizlensin (klavye odağı dışarıda kalsın)
            transition: `transform 300ms cubic-bezier(0.22, 1, 0.36, 1), visibility 0s linear ${mobileOpen ? '0s' : '300ms'}`,
            visibility: mobileOpen ? 'visible' : 'hidden',
          }}
          aria-hidden={!mobileOpen}>

          {/* Tepe — arma 46px + sponsor/isim + kapat 44x44 r13 */}
          <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-white/[0.11]">
            <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 min-w-0">
              {hasLogo ? (
                <ClubLogo src={club.logoUrl} size={46} optSize={80} className="shrink-0 object-contain" />
              ) : (
                <div className="h-[46px] w-[46px] shrink-0 rounded-full bg-ugold flex items-center justify-center">
                  <span className="font-heading font-extrabold text-[11px] text-ugreend">{club.shortCode}</span>
                </div>
              )}
              <span className="flex flex-col leading-none min-w-0">
                {club.brandTagline && (
                  <span className="text-[9px] font-extrabold tracking-[0.16em] uppercase text-white/70 truncate">{club.brandTagline}</span>
                )}
                <span className="mt-1 font-heading text-[20.8px] font-bold leading-none tracking-[0.01em] uppercase text-ugold truncate">{club.name}</span>
              </span>
            </Link>
            <button onClick={() => setMobileOpen(false)} aria-label="Kapat"
              className="h-11 w-11 shrink-0 flex items-center justify-center rounded-[13px] text-white bg-white/[0.055] border border-white/[0.11] hover:bg-white/10 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Menü — satır 56px, Archivo 17.6px uppercase, chevron 12px.
              Premium: açılışta kademeli beliriş + aktif sayfada altın ray. */}
          <ul className="flex flex-col">
            {navLinks.map((link, i) => (
              <li key={link.label}
                className={cn('relative border-b border-white/[0.08]', mobileOpen && 'drawer-item')}
                style={mobileOpen ? { animationDelay: `${60 + i * 45}ms` } : undefined}>
                {/* aktif sayfa göstergesi — sol altın ray */}
                {!link.hasMega && isActive(link.href) && (
                  <span aria-hidden className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-full bg-ugold" />
                )}
                {link.hasMega ? (
                  <>
                    {/* Açık satır altın renge döner, chevron 180° (sivasspor birebir) */}
                    <button onClick={() => setMobileSubOpen((v) => !v)} aria-expanded={mobileSubOpen}
                      className={cn('flex w-full items-center justify-between gap-3 h-14 px-1.5 font-heading text-[17.6px] font-bold tracking-[0.035em] uppercase transition-colors duration-300 active:opacity-70',
                        mobileSubOpen ? 'text-ugold' : 'text-white')}>
                      {link.label}
                      <ChevronDown size={12} className={cn('shrink-0 text-ugold transition-transform duration-300', mobileSubOpen && 'rotate-180')} />
                    </button>
                    {/* Alt menü — sol accent çizgi (2px altın/40), grup başlıkları + linkler */}
                    {mobileSubOpen && (
                      <div className="ml-2 border-l-2 border-ugold/40 pt-0.5 pb-3 pl-3.5">
                        {kulupMenu.map((col) => (
                          <div key={col.baslik}>
                            <div className="mt-3 mb-1 text-[10.5px] font-extrabold uppercase tracking-[0.13em] text-ugold">{col.baslik}</div>
                            {col.linkler.map((item) => (
                              <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)}
                                className="flex h-10 items-center px-1 text-[14.7px] font-semibold text-white/60 hover:text-ugold transition-colors">
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
                    className={cn('flex items-center h-14 px-1.5 font-heading text-[17.6px] font-bold tracking-[0.035em] uppercase transition-colors duration-300 active:opacity-70',
                      isActive(link.href) ? 'text-ugold' : 'text-white hover:text-ugold')}>
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
                className="flex h-12 items-center justify-center gap-2 rounded-lg border border-ugold/35 bg-ugold/[0.06] text-[12px] font-extrabold tracking-[0.06em] uppercase text-ugold">
                <Store size={15} /> Mağaza
              </Link>
              <Link href="/sayfa/taraftar" onClick={() => setMobileOpen(false)}
                className="flex h-12 items-center justify-center gap-2 rounded-lg border border-white/[0.14] bg-white/[0.04] text-[12px] font-extrabold tracking-[0.06em] uppercase text-white/85">
                <MessageSquare size={15} /> Taraftar
              </Link>
            </div>

            <Link href="/bilet" onClick={() => setMobileOpen(false)}
              className="cta-premium relative flex h-[50px] items-center justify-center gap-2 overflow-hidden rounded-[6px] text-[11.8px] font-extrabold tracking-[0.08em] uppercase text-ugreend bg-gradient-to-b from-ugoldl to-ugold"
              style={{ boxShadow: '0 12px 28px -14px rgba(245,196,0,0.95), inset 0 1px 0 rgba(255,255,255,0.55)' }}>
              <span aria-hidden className="cta-sweep" />
              <Ticket size={16} className="relative" /> <span className="relative">Bilet Al</span>
            </Link>

            <div className="flex flex-col gap-2.5 pt-1">
              {club.phone && (
                <a href={`tel:${club.phone.replace(/[^+\d]/g, '')}`}
                  className="flex items-center justify-center gap-2 text-[12.5px] font-bold text-white/80 hover:text-ugold transition-colors">
                  <Phone size={13} className="text-ugold" /> {club.phone}
                </a>
              )}
              <div className="flex items-center justify-center gap-2.5">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                    className="h-[34px] w-[34px] flex items-center justify-center rounded-[10px] text-white/60 hover:text-ugold hover:bg-white/[0.06] transition-colors">
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
