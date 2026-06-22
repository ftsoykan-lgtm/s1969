'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Menu, X, Search, ChevronDown, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { clubInfo as defaultClub } from '@/data/club'
import type { ClubInfo } from '@/data/club'

/* ─── Sosyal medya SVG ikonları ─────────────────────────────────────────── */
const SocialIcons = {
  Facebook: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  X: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  YouTube: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0f4a28"/>
    </svg>
  ),
  Instagram: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  ),
  TikTok: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
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
  { label: 'HABERLER', href: '/haberler' },
  { label: 'KULÜP', href: '#', hasMega: true },
  { label: 'KADRO', href: '/kadro' },
  { label: 'FİKSTÜR', href: '/fikstur' },
  { label: 'TARAFTAR', href: '#' },
  { label: 'MAĞAZA', href: '/magaza' },
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
  const [searchOpen, setSearchOpen] = useState(false)
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

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
      <div className="relative bg-[#0f4a28]">
        {/* Alt ince altın hat */}
        <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#1A6B3C] via-[#FFD100] to-[#1A6B3C]" />

        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-stretch gap-5">

            {/* ── Büyük yuvarlak logo (aşağı taşar) ──────────────────── */}
            <Link href="/" className="relative shrink-0 flex items-center group" aria-label={club.name}>
              {hasLogo ? (
                <img src={club.logoUrl} alt={club.name}
                  className="h-[88px] w-[88px] lg:h-[108px] lg:w-[108px] rounded-full object-contain bg-white p-1 ring-4 ring-white shadow-2xl lg:-mb-6 transition-transform duration-200 group-hover:scale-[1.03]" />
              ) : (
                <div className="h-[88px] w-[88px] lg:h-[108px] lg:w-[108px] rounded-full bg-white ring-4 ring-white shadow-2xl lg:-mb-6 flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.03]">
                  <span className="font-heading font-black text-2xl lg:text-3xl text-[#0f4a28]">{club.shortCode}</span>
                </div>
              )}
            </Link>

            {/* ── Sağ taraf: iki satır ───────────────────────────────── */}
            <div className="flex-1 min-w-0 flex flex-col">

              {/* Üst satır — sosyal + CTA + dil */}
              <div className="hidden lg:flex items-center justify-end gap-4 h-[52px]">
                <div className="flex items-center gap-3">
                  {socials.map(({ icon: Icon, href, label }) => (
                    <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                      className="text-white/60 hover:text-[#FFD100] transition-colors duration-150">
                      <Icon />
                    </a>
                  ))}
                </div>
                <span className="w-px h-5 bg-white/15" />
                <Link href="/bilet"
                  className="inline-flex items-center text-[#0f4a28] font-black text-[13px] tracking-wide uppercase px-6 py-2.5 rounded-md bg-gradient-to-b from-[#FFE04D] to-[#FFD100] shadow-[0_3px_12px_rgba(255,209,0,0.3)] hover:brightness-105 transition-all">
                  Bilet Al
                </Link>
                <button className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-[13px] font-bold uppercase tracking-wide">
                  <Globe size={16} />
                  TR
                </button>
              </div>

              {/* Alt satır — nav linkleri + arama */}
              <div className="flex items-center justify-between h-[58px] lg:h-[64px]">
                {/* Desktop nav */}
                <nav className="hidden lg:flex items-stretch h-full">
                  {navLinks.map((link) =>
                    link.hasMega ? (
                      <div key={link.label} className="relative flex items-stretch"
                        onMouseEnter={openMega} onMouseLeave={closeMega}>
                        <button className={cn(
                          'flex items-center gap-1 h-full px-4 text-[13px] font-extrabold tracking-wide transition-colors relative',
                          megaOpen ? 'text-[#FFD100]' : 'text-white hover:text-[#FFD100]'
                        )}>
                          {link.label}
                          <ChevronDown size={11} className={cn('transition-transform duration-200', megaOpen && 'rotate-180')} />
                          {megaOpen && <span className="absolute bottom-0 inset-x-3 h-[3px] bg-[#FFD100] rounded-t" />}
                        </button>
                      </div>
                    ) : (
                      <Link key={link.href} href={link.href}
                        className={cn(
                          'flex items-center h-full px-4 text-[13px] font-extrabold tracking-wide transition-colors relative',
                          isActive(link.href) ? 'text-[#FFD100]' : 'text-white hover:text-[#FFD100]'
                        )}>
                        {link.label}
                        {isActive(link.href) && <span className="absolute bottom-0 inset-x-3 h-[3px] bg-[#FFD100] rounded-t" />}
                      </Link>
                    )
                  )}
                </nav>

                {/* Mobil: kulüp adı */}
                <Link href="/" className="lg:hidden font-heading text-white font-extrabold text-lg tracking-wide uppercase">
                  {club.name}
                </Link>

                {/* Sağ: arama + mobil menü */}
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Ara"
                    className="h-10 w-10 flex items-center justify-center text-white hover:text-[#FFD100] transition-colors">
                    <Search size={19} />
                  </button>
                  <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menü"
                    className="lg:hidden h-10 w-10 flex items-center justify-center text-white">
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Mega Menu ──────────────────────────────────────────────── */}
        <div
          className={cn(
            'hidden lg:block absolute left-0 right-0 top-full transition-all duration-200 z-50',
            megaOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
          )}
          onMouseEnter={openMega}
          onMouseLeave={closeMega}
        >
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 pt-2">
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] bg-[#092d18]/97 backdrop-blur-xl ring-1 ring-white/10">
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
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1A6B3C] to-[#0a3320] ring-1 ring-white/10 p-5 flex flex-col justify-end">
                  <div className="absolute top-3 right-3 font-heading text-[5rem] font-black text-white/[0.04] leading-none">{club.shortCode}</div>
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
          'lg:hidden overflow-hidden transition-all duration-300 bg-[#092d18]',
          mobileOpen ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0'
        )}>
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link href={link.href === '#' ? '#' : link.href}
                  className={cn(
                    'block px-4 py-3 text-sm font-extrabold tracking-wide rounded-xl transition-all',
                    isActive(link.href) ? 'text-[#0f4a28] bg-[#FFD100]' : 'text-white hover:bg-white/[0.06]'
                  )}
                  onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
                {link.hasMega && (
                  <div className="ml-3 mt-1 mb-2 space-y-0.5">
                    {kulupMenu.flatMap((col) => col.linkler).map((item) => (
                      <Link key={item.label} href={item.href}
                        className="block pl-5 py-2 text-xs text-white/40 hover:text-white/80 rounded-lg transition-colors"
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
                  className="text-white/40 hover:text-[#FFD100] transition-colors">
                  <Icon />
                </a>
              ))}
            </div>
            <Link href="/bilet"
              className="block py-3 text-center text-sm font-black tracking-widest text-[#0f4a28] bg-[#FFD100] rounded-xl uppercase mt-2"
              onClick={() => setMobileOpen(false)}>
              Bilet Al
            </Link>
          </div>
        </div>

        {/* ── Arama ────────────────────────────────────────────────── */}
        {searchOpen && (
          <div className="absolute left-0 right-0 top-full bg-[#092d18]/97 backdrop-blur-xl border-b border-white/10 px-4 py-3 z-40">
            <div className="mx-auto max-w-[1320px]">
              <div className="relative">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input autoFocus type="search" placeholder="Haber, oyuncu, maç ara..."
                  className="w-full bg-white/[0.06] border border-white/10 rounded-full pl-11 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FFD100]/40 transition-colors"
                  onBlur={() => setSearchOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
