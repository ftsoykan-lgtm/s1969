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
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
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

const navLinks: {
  label: string
  href: string
  hasMega?: boolean
  submenu?: { label: string; href: string }[]
}[] = [
  { label: 'HABERLER', href: '/haberler' },
  { label: 'KULÜP', href: '#', hasMega: true },
  { label: 'KADRO', href: '/kadro' },
  { label: 'MAÇ MERKEZİ', href: '/fikstur' },
  { label: 'TARAFTAR', href: '#' },
  { label: 'İLETİŞİM', href: '/iletisim' },
]

export default function Navbar({ club = defaultClub }: { club?: ClubInfo }) {
  const pathname = usePathname()

  const socials = [
    { icon: SocialIcons.Facebook, href: club.social.facebook, label: 'Facebook' },
    { icon: SocialIcons.X, href: club.social.twitter, label: 'X (Twitter)' },
    { icon: SocialIcons.YouTube, href: club.social.youtube, label: 'YouTube' },
    { icon: SocialIcons.Instagram, href: club.social.instagram, label: 'Instagram' },
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

  return (
    <header className="sticky top-0 z-50 w-full">

      {/* ── Üst bant ─────────────────────────────────────────────────────── */}
      <div className="hidden lg:block bg-[#092d18] border-b border-white/8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
          <p className="text-[10px] text-white/30 font-medium tracking-wide">
            Şanlıurfaspor FK — Resmi Web Sitesi
          </p>
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                className="text-white/35 hover:text-white transition-colors duration-150">
                <Icon />
              </a>
            ))}
            <div className="w-px h-4 bg-white/10 mx-1" />
            <Link href="/bilet"
              className="text-[10px] font-black tracking-widest uppercase text-[#FFD100]/70 hover:text-[#FFD100] transition-colors">
              BİLET AL
            </Link>
          </div>
        </div>
      </div>

      {/* ── Ana navbar ────────────────────────────────────────────────────── */}
      <div className={cn(
        'transition-all duration-300',
        scrolled
          ? 'bg-[#0f4a28]/96 backdrop-blur-sm shadow-xl shadow-black/30'
          : 'bg-[#0f4a28]'
      )}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[66px] items-center gap-8">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              {hasLogo ? (
                <img src={club.logoUrl} alt={club.name}
                  className="h-12 w-12 rounded-full object-contain bg-white/5 ring-2 ring-[#FFD100]/20 group-hover:ring-[#FFD100]/50 transition-all duration-200" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD100] text-[#0f4a28] font-black text-sm shadow-lg ring-2 ring-[#FFD100]/20 group-hover:ring-[#FFD100]/50 transition-all duration-200">
                  {club.shortCode}
                </div>
              )}
              <div className="hidden sm:block">
                <p className="text-white font-black text-base tracking-wide leading-tight uppercase">{club.name}</p>
                <p className="text-[#FFD100]/50 text-[9px] font-bold tracking-[0.25em] uppercase">Futbol Kulübü</p>
              </div>
            </Link>

            {/* Desktop linkler */}
            <nav className="hidden lg:flex items-stretch h-full flex-1">
              {navLinks.map((link) =>
                link.hasMega ? (
                  <div key={link.label} className="relative flex items-center"
                    onMouseEnter={openMega} onMouseLeave={closeMega}>
                    <button className={cn(
                      'flex items-center gap-1 h-full px-4 text-[12px] font-black tracking-widest transition-colors border-b-2',
                      megaOpen
                        ? 'text-[#FFD100] border-[#FFD100]'
                        : 'text-white/75 hover:text-white border-transparent hover:border-white/20'
                    )}>
                      {link.label}
                      <ChevronDown size={10} className={cn('transition-transform duration-200', megaOpen && 'rotate-180')} />
                    </button>
                  </div>
                ) : link.submenu ? (
                  <div key={link.label} className="relative flex items-center group">
                    <Link href={link.href}
                      className={cn(
                        'flex items-center gap-1 h-full px-4 text-[12px] font-black tracking-widest transition-colors border-b-2',
                        pathname === link.href
                          ? 'text-[#FFD100] border-[#FFD100]'
                          : 'text-white/75 hover:text-white border-transparent group-hover:border-white/20'
                      )}>
                      {link.label}
                      <ChevronDown size={10} className="transition-transform duration-200 group-hover:rotate-180" />
                    </Link>
                    {/* Küçük dropdown */}
                    <div className="absolute top-full left-0 w-48 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                      <div className="bg-[#092d18] border border-white/10 rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
                        <div className="h-0.5 bg-gradient-to-r from-[#1A6B3C] via-[#FFD100] to-[#1A6B3C]" />
                        {link.submenu.map((item) => (
                          <Link key={item.href} href={item.href}
                            className="flex items-center gap-2 px-4 py-3 text-sm text-white/65 hover:text-white hover:bg-white/8 transition-colors border-b border-white/5 last:border-0">
                            <span className="w-1 h-1 rounded-full bg-[#FFD100]/40" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link key={link.href} href={link.href}
                    className={cn(
                      'flex items-center h-full px-4 text-[12px] font-black tracking-widest transition-colors border-b-2',
                      pathname === link.href
                        ? 'text-[#FFD100] border-[#FFD100]'
                        : 'text-white/75 hover:text-white border-transparent hover:border-white/20'
                    )}>
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Sağ */}
            <div className="flex items-center gap-2 ml-auto lg:ml-0 shrink-0">
              <button onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all hidden lg:flex">
                <Search size={17} />
              </button>
              <Link href="/magaza"
                className="hidden lg:inline-flex items-center px-4 py-2 text-[11px] font-black tracking-widest text-white/60 hover:text-white border border-white/15 hover:border-white/30 rounded-xl transition-all uppercase">
                Mağaza
              </Link>
              <Link href="/bilet"
                className="inline-flex items-center gap-2 bg-[#FFD100] hover:bg-[#e8c000] text-[#0f4a28] font-black text-[12px] tracking-widest uppercase px-5 py-2.5 rounded-xl transition-all hover:scale-105 shadow-md shadow-[#FFD100]/20">
                <Ticket size={14} />
                <span className="hidden sm:inline">Bilet Al</span>
                <span className="sm:hidden">Bilet</span>
              </Link>
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </div>
        </div>

        {/* ── Mega Menu ──────────────────────────────────────────────────── */}
        <div
          className={cn(
            'hidden lg:block absolute left-0 right-0 transition-all duration-200 overflow-hidden',
            megaOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          )}
          onMouseEnter={openMega}
          onMouseLeave={closeMega}
        >
          <div className="bg-[#092d18] border-t border-white/8 shadow-2xl shadow-black/50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-3 gap-12">
                {kulupMenu.map((col) => (
                  <div key={col.baslik}>
                    <p className="text-[#FFD100] text-[10px] font-black tracking-[0.25em] mb-4 pb-3 border-b border-white/10">
                      {col.baslik}
                    </p>
                    <ul className="space-y-2">
                      {col.linkler.map((item) => (
                        <li key={item.label}>
                          <Link href={item.href}
                            className="flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors group py-0.5">
                            <span className="w-1 h-1 rounded-full bg-[#FFD100]/30 group-hover:bg-[#FFD100] transition-colors shrink-0" />
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobil menü ─────────────────────────────────────────────────── */}
        <div className={cn(
          'lg:hidden overflow-hidden transition-all duration-300 border-t border-white/8',
          mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        )}>
          <div className="bg-[#092d18] px-4 py-4 space-y-0.5">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link href={link.href === '#' ? '#' : link.href}
                  className={cn(
                    'block px-4 py-3 text-sm font-black tracking-widest rounded-xl transition-all',
                    pathname === link.href
                      ? 'text-[#FFD100] bg-white/8'
                      : 'text-white/70 hover:text-white hover:bg-white/6'
                  )}
                  onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
                {link.hasMega && (
                  <div className="ml-4 mt-1 mb-2 space-y-0.5">
                    {kulupMenu.flatMap((col) => col.linkler).map((item) => (
                      <Link key={item.label} href={item.href}
                        className="block pl-4 py-2 text-xs text-white/40 hover:text-white/80 rounded-lg transition-colors"
                        onClick={() => setMobileOpen(false)}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
                {link.submenu && (
                  <div className="ml-4 mt-1 mb-2 space-y-0.5">
                    {link.submenu.map((item) => (
                      <Link key={item.href} href={item.href}
                        className="block pl-4 py-2 text-xs text-white/40 hover:text-white/80 rounded-lg transition-colors"
                        onClick={() => setMobileOpen(false)}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {/* Mobilde sosyal ikonlar */}
            <div className="flex items-center gap-4 px-4 pt-4 pb-1 border-t border-white/10 mt-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="text-white/35 hover:text-white transition-colors">
                  <Icon />
                </a>
              ))}
            </div>
            <div className="pt-2 flex gap-2 border-t border-white/10">
              <Link href="/magaza"
                className="flex-1 py-3 text-center text-xs font-black tracking-widest text-white/60 border border-white/15 rounded-xl uppercase"
                onClick={() => setMobileOpen(false)}>
                Mağaza
              </Link>
              <Link href="/bilet"
                className="flex-1 py-3 text-center text-xs font-black tracking-widest bg-[#FFD100] text-[#0f4a28] rounded-xl uppercase"
                onClick={() => setMobileOpen(false)}>
                Bilet Al
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Arama */}
      {searchOpen && (
        <div className="hidden lg:block bg-[#092d18] border-t border-white/8 px-4 py-3">
          <div className="mx-auto max-w-7xl">
            <div className="relative">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input autoFocus type="search" placeholder="Ara..."
                className="w-full bg-white/8 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FFD100]/40 transition-colors"
                onBlur={() => setSearchOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
