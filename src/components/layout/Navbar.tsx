'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Menu, X, Ticket, Search, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { clubInfo as defaultClub } from '@/data/club'
import type { ClubInfo } from '@/data/club'

/* ─── Sosyal medya SVG ikonları ─────────────────────────────────────────── */
const SocialIcons = {
  Facebook: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  X: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  Instagram: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  ),
  YouTube: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0a3320"/>
    </svg>
  ),
  TikTok: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
    </svg>
  ),
}

/* ─── Nav verisi ─────────────────────────────────────────────────────────── */
const kulupMenu = [
  {
    baslik: 'KULÜP',
    linkler: [
      { label: 'Tarihçe', href: '/kulup/tarihce' },
      { label: 'Yönetim Kurulu', href: '/kulup/yonetim' },
      { label: 'Başkanlarımız', href: '#' },
      { label: 'Kurumsal Kimlik', href: '#' },
      { label: 'Tüzük', href: '#' },
    ],
  },
  {
    baslik: 'TESİSLER',
    linkler: [
      { label: 'GAP Arena', href: '#' },
      { label: 'Antrenman Tesisi', href: '#' },
      { label: 'Altyapı Akademisi', href: '#' },
      { label: 'Müze', href: '#' },
    ],
  },
  {
    baslik: 'KURUMSAL',
    linkler: [
      { label: 'Basın & Medya', href: '#' },
      { label: 'Sponsorluk', href: '#' },
      { label: 'İnsan Kaynakları', href: '#' },
      { label: 'İletişim', href: '/iletisim' },
    ],
  },
]

const navLinks: { label: string; href: string; hasMega?: boolean }[] = [
  { label: 'Haberler', href: '/haberler' },
  { label: 'Kulüp', href: '#', hasMega: true },
  { label: 'Kadro', href: '/kadro' },
  { label: 'Maç Merkezi', href: '/fikstur' },
  { label: 'Taraftar', href: '#' },
  { label: 'İletişim', href: '/iletisim' },
]

export default function Navbar({ club = defaultClub }: { club?: ClubInfo }) {
  const pathname = usePathname()

  const socials = [
    { icon: SocialIcons.Instagram, href: club.social.instagram, label: 'Instagram' },
    { icon: SocialIcons.X, href: club.social.twitter, label: 'X (Twitter)' },
    { icon: SocialIcons.YouTube, href: club.social.youtube, label: 'YouTube' },
    { icon: SocialIcons.Facebook, href: club.social.facebook, label: 'Facebook' },
    { icon: SocialIcons.TikTok, href: club.social.tiktok, label: 'TikTok' },
  ]
  const hasLogo = club.logoUrl && !club.logoUrl.includes('placehold.co')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setMegaOpen(false)
  }, [pathname])

  const openMega = () => {
    if (megaTimer.current) clearTimeout(megaTimer.current)
    setMegaOpen(true)
  }
  const closeMega = () => {
    megaTimer.current = setTimeout(() => setMegaOpen(false), 120)
  }

  const isActive = (href: string) => pathname === href

  return (
    <header className="sticky top-0 z-50 w-full">

      {/* ── İnce premium üst bant ─────────────────────────────────────── */}
      <div className="hidden lg:block bg-[#061d10]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-8">
          <p className="text-[10px] text-white/35 font-medium tracking-[0.15em] uppercase">
            {club.fullName} <span className="text-[#FFD100]/40">— Resmi Web Sitesi</span>
          </p>
          <div className="flex items-center gap-4">
            <Link href="/bilet" className="text-[10px] font-black tracking-[0.2em] uppercase text-[#FFD100]/70 hover:text-[#FFD100] transition-colors">
              Bilet
            </Link>
            <span className="w-px h-3.5 bg-white/15" />
            <div className="flex items-center gap-3.5">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                  className="text-white/30 hover:text-[#FFD100] transition-colors duration-150">
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Ana navbar — premium cam yüzey ─────────────────────────────── */}
      <div className={cn(
        'relative transition-all duration-300',
        scrolled
          ? 'bg-[#0a3320]/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)]'
          : 'bg-gradient-to-b from-[#0c3a25] to-[#0a3320]'
      )}>
        {/* Alt altın hat */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FFD100]/30 to-transparent" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[74px] items-center gap-6">

            {/* Logo + wordmark */}
            <Link href="/" className="flex items-center gap-3.5 shrink-0 group">
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-[#FFD100]/0 group-hover:bg-[#FFD100]/20 blur-md transition-all duration-300" />
                {hasLogo ? (
                  <img src={club.logoUrl} alt={club.name}
                    className="relative h-12 w-12 rounded-2xl object-contain bg-white/5 ring-1 ring-white/15 group-hover:ring-[#FFD100]/60 transition-all duration-200" />
                ) : (
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD100] to-[#d4ad00] text-[#0a3320] font-black text-sm shadow-lg ring-1 ring-white/15 group-hover:ring-[#FFD100]/60 transition-all duration-200">
                    {club.shortCode}
                  </div>
                )}
              </div>
              <div className="hidden sm:block leading-tight">
                <p className="font-heading text-white font-extrabold text-[16px] tracking-wide uppercase">{club.name}</p>
                <p className="text-[#FFD100]/55 text-[9px] font-bold tracking-[0.3em] uppercase mt-0.5">Futbol Kulübü · {club.founded}</p>
              </div>
            </Link>

            {/* Desktop linkler — pill grup */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
              {navLinks.map((link) =>
                link.hasMega ? (
                  <div key={link.label} className="relative"
                    onMouseEnter={openMega} onMouseLeave={closeMega}>
                    <button className={cn(
                      'flex items-center gap-1 px-4 py-2 rounded-full text-[12.5px] font-bold tracking-wide transition-all duration-200',
                      megaOpen
                        ? 'text-[#FFD100] bg-white/[0.08]'
                        : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                    )}>
                      {link.label}
                      <ChevronDown size={12} className={cn('transition-transform duration-200', megaOpen && 'rotate-180')} />
                    </button>
                  </div>
                ) : (
                  <Link key={link.href} href={link.href}
                    className={cn(
                      'relative px-4 py-2 rounded-full text-[12.5px] font-bold tracking-wide transition-all duration-200 group',
                      isActive(link.href)
                        ? 'text-[#FFD100]'
                        : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                    )}>
                    {link.label}
                    {/* aktif alt gösterge */}
                    <span className={cn(
                      'absolute left-1/2 -translate-x-1/2 -bottom-[19px] h-[2px] rounded-full bg-[#FFD100] shadow-[0_0_8px_rgba(255,209,0,0.6)] transition-all duration-300',
                      isActive(link.href) ? 'w-6 opacity-100' : 'w-0 opacity-0'
                    )} />
                  </Link>
                )
              )}
            </nav>

            {/* Sağ aksiyonlar */}
            <div className="flex items-center gap-2 ml-auto lg:ml-0 shrink-0">
              <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Ara"
                className="hidden lg:flex h-10 w-10 items-center justify-center text-white/55 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-full transition-all">
                <Search size={16} />
              </button>
              {/* Premium bilet butonu */}
              <Link href="/bilet"
                className="group relative inline-flex items-center gap-2 text-[#0a3320] font-black text-[12px] tracking-wide uppercase pl-4 pr-5 py-2.5 rounded-full transition-all hover:scale-[1.03] overflow-hidden
                           bg-gradient-to-b from-[#FFE04D] to-[#FFD100] shadow-[0_4px_14px_rgba(255,209,0,0.35)]">
                <span className="absolute inset-x-0 top-0 h-1/2 bg-white/25" />
                <Ticket size={15} className="relative" />
                <span className="relative hidden sm:inline">Bilet Al</span>
                <span className="relative sm:hidden">Bilet</span>
              </Link>
              <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menü"
                className="lg:hidden h-10 w-10 flex items-center justify-center text-white/70 hover:text-white bg-white/[0.05] border border-white/10 rounded-full transition-all">
                {mobileOpen ? <X size={19} /> : <Menu size={19} />}
              </button>
            </div>

          </div>
        </div>

        {/* ── Mega Menu — premium cam panel ──────────────────────────── */}
        <div
          className={cn(
            'hidden lg:block absolute left-0 right-0 transition-all duration-200',
            megaOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
          )}
          onMouseEnter={openMega}
          onMouseLeave={closeMega}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-3">
            <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] bg-[#061d10]/95 backdrop-blur-xl ring-1 ring-white/10">
              <div className="h-1 bg-gradient-to-r from-[#1A6B3C] via-[#FFD100] to-[#1A6B3C]" />
              <div className="p-8 grid grid-cols-[1fr_1fr_1fr_1.1fr] gap-10">
                {kulupMenu.map((col) => (
                  <div key={col.baslik}>
                    <p className="text-[#FFD100] text-[10px] font-black tracking-[0.25em] mb-4 pb-3 border-b border-white/10">
                      {col.baslik}
                    </p>
                    <ul className="space-y-0.5">
                      {col.linkler.map((item) => (
                        <li key={item.label}>
                          <Link href={item.href}
                            className="flex items-center gap-2.5 text-sm text-white/55 hover:text-white hover:bg-white/[0.05] rounded-xl px-3 py-2 -mx-3 transition-all group">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD100]/30 group-hover:bg-[#FFD100] transition-colors shrink-0" />
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {/* Vitrin kartı */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1A6B3C] to-[#0a3320] ring-1 ring-white/10 p-5 flex flex-col justify-end">
                  <div className="absolute top-3 right-3 text-[5rem] font-black text-white/[0.04] leading-none">{club.shortCode}</div>
                  <p className="relative text-[10px] font-black tracking-[0.25em] uppercase text-[#FFD100]/70 mb-1">{club.nickname}</p>
                  <p className="relative text-white font-black text-lg leading-tight mb-3">Tribünde yerini al</p>
                  <Link href="/bilet" className="relative inline-flex items-center justify-center gap-2 bg-[#FFD100] text-[#0a3320] font-black text-[11px] tracking-wide uppercase px-4 py-2.5 rounded-full hover:bg-[#e8c000] transition-colors">
                    Bilet Al →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobil menü ─────────────────────────────────────────────── */}
        <div className={cn(
          'lg:hidden overflow-hidden transition-all duration-300',
          mobileOpen ? 'max-h-[680px] opacity-100' : 'max-h-0 opacity-0'
        )}>
          <div className="bg-[#061d10] px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link href={link.href === '#' ? '#' : link.href}
                  className={cn(
                    'block px-4 py-3 text-sm font-bold tracking-wide rounded-2xl transition-all',
                    isActive(link.href)
                      ? 'text-[#0a3320] bg-gradient-to-b from-[#FFE04D] to-[#FFD100]'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                  )}
                  onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
                {link.hasMega && (
                  <div className="ml-3 mt-1 mb-2 space-y-0.5">
                    {kulupMenu.flatMap((col) => col.linkler).map((item) => (
                      <Link key={item.label} href={item.href}
                        className="block pl-5 py-2 text-xs text-white/40 hover:text-white/80 rounded-xl transition-colors"
                        onClick={() => setMobileOpen(false)}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex items-center justify-center gap-5 px-4 pt-4 pb-1 border-t border-white/10 mt-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="text-white/35 hover:text-[#FFD100] transition-colors">
                  <Icon />
                </a>
              ))}
            </div>
            <Link href="/magaza"
              className="block py-3 text-center text-xs font-black tracking-widest text-white/60 border border-white/15 rounded-2xl uppercase mt-2"
              onClick={() => setMobileOpen(false)}>
              Mağaza
            </Link>
          </div>
        </div>
      </div>

      {/* ── Arama ────────────────────────────────────────────────────── */}
      {searchOpen && (
        <div className="hidden lg:block bg-[#061d10]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3">
          <div className="mx-auto max-w-7xl">
            <div className="relative">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input autoFocus type="search" placeholder="Haber, oyuncu, maç ara..."
                className="w-full bg-white/[0.06] border border-white/10 rounded-full pl-11 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FFD100]/40 transition-colors"
                onBlur={() => setSearchOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
