'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Menu, X, Search, ChevronDown, Ticket, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { clubInfo as defaultClub } from '@/data/club'
import type { ClubInfo } from '@/data/club'

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
    { label: 'GAP Arena', href: '/sayfa/gap-arena' },
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
  { label: 'HABERLER', href: '/haberler' },
  { label: 'KULÜP', href: '#', hasMega: true },
  { label: 'KADRO', href: '/kadro' },
  { label: 'MAÇ MERKEZİ', href: '/mac-merkezi' },
  { label: 'TARAFTAR', href: '/sayfa/taraftar' },
  { label: 'İLETİŞİM', href: '/iletisim' },
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
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { setMobileOpen(false); setMegaOpen(false); setMobileSubOpen(false) }, [pathname])

  const openMega = () => { if (megaTimer.current) clearTimeout(megaTimer.current); setMegaOpen(true) }
  const closeMega = () => { megaTimer.current = setTimeout(() => setMegaOpen(false), 120) }
  const isActive = (href: string) =>
    pathname === href || (href !== '/' && href !== '#' && pathname.startsWith(href + '/'))

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* En üst sarı-yeşil aksan */}
      <div className="h-1 bg-gradient-to-r from-[#FFD100] via-[#1A6B3C] to-[#FFD100]" />

      {/* ── İnce üst kimlik bandı ──────────────────────────────────────── */}
      <div className="hidden lg:block bg-[#061d10] border-b border-white/[0.05]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 flex items-center justify-end h-10">
          <div className="flex items-center gap-3.5">
            <div className="flex items-center gap-1.5">
              {socials.map(({ icon: Icon, href, label, cls }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                  className={`flex h-6 w-6 items-center justify-center rounded-md text-white shadow-sm hover:scale-110 transition-transform ${cls}`}>
                  <Icon />
                </a>
              ))}
            </div>
            <span className="w-px h-4 bg-white/15" />
            <Link href="/magaza" className="text-[10px] font-black tracking-[0.2em] uppercase text-white/45 hover:text-[#FFD100] transition-colors">Mağaza</Link>
          </div>
        </div>
      </div>

      {/* ── Ana bar ────────────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-b from-[#0f4a28] to-[#0c3f22] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)]">
        {/* alt altın saç çizgisi */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FFD100]/40 to-transparent" />
        <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">

          {/* ── MOBİL BAR (menü · logo · dil) ───────────────────────── */}
          <div className="lg:hidden grid grid-cols-[1fr_auto_1fr] items-center h-16">
            <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menü"
              className="justify-self-start h-10 w-10 flex items-center justify-center text-white -ml-1">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link href="/" className="justify-self-center flex items-center gap-2 min-w-0" aria-label={club.name}>
              {hasLogo ? (
                <img src={club.logoUrl} alt="" className="h-9 w-9 rounded-full object-contain bg-white ring-1 ring-white/20 shrink-0" />
              ) : (
                <div className="h-9 w-9 rounded-full bg-[#FFD100] flex items-center justify-center shrink-0">
                  <span className="font-heading font-black text-[10px] text-[#0f4a28]">{club.shortCode}</span>
                </div>
              )}
              <span className="font-heading font-black text-[15px] tracking-tight uppercase text-white truncate">{club.name}</span>
            </Link>

            <button aria-label="Dil" className="justify-self-end h-10 w-10 flex items-center justify-center text-white/80 hover:text-[#FFD100] transition-colors -mr-1">
              <Globe size={22} />
            </button>
          </div>

          {/* ── MASAÜSTÜ BAR ────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center h-[70px]">

            {/* ── Logo + wordmark (rafine) ────────────────────────────── */}
            <Link href="/" className="relative group flex items-center gap-3.5 h-full shrink-0" aria-label={club.name}>
              <div className="relative shrink-0">
                <div className="absolute -inset-1.5 rounded-full bg-[#FFD100]/0 group-hover:bg-[#FFD100]/25 blur-md transition-all duration-300" />
                {hasLogo ? (
                  <img src={club.logoUrl} alt={club.name}
                    className="relative h-12 w-12 rounded-full object-contain bg-white ring-1 ring-[#FFD100]/40 group-hover:ring-[#FFD100] shadow-md transition-all duration-200" />
                ) : (
                  <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-[#FFD100] to-[#e8b800] flex items-center justify-center shadow-md ring-1 ring-[#FFD100]/40 transition-all duration-200">
                    <span className="font-heading font-black text-sm text-[#0f4a28]">{club.shortCode}</span>
                  </div>
                )}
              </div>
              <div className="leading-none">
                <p className="font-heading font-black text-[18px] tracking-tight uppercase text-white">{club.name}</p>
                <p className="text-[8.5px] font-black tracking-[0.34em] uppercase text-[#FFD100]/70 mt-1">Est. {club.founded}</p>
              </div>
            </Link>

            {/* ── Nav linkleri (ortalı, zarif gösterge) ───────────────── */}
            <nav className="hidden lg:flex items-stretch h-full flex-1 justify-center">
              {navLinks.map((link) =>
                link.hasMega ? (
                  <div key={link.label} className="relative flex items-stretch"
                    onMouseEnter={openMega} onMouseLeave={closeMega}>
                    <button className={cn(
                      'group relative flex items-center gap-1 h-full px-4 text-[12px] font-bold tracking-[0.06em] transition-colors',
                      megaOpen ? 'text-[#FFD100]' : 'text-white/80 hover:text-white'
                    )}>
                      {link.label}
                      <ChevronDown size={11} className={cn('transition-transform duration-200', megaOpen && 'rotate-180')} />
                      <span className={cn('absolute left-1/2 -translate-x-1/2 bottom-[16px] h-[2px] bg-[#FFD100] rounded-full shadow-[0_0_8px_rgba(255,209,0,0.6)] transition-all duration-300', megaOpen ? 'w-5' : 'w-0 group-hover:w-5')} />
                    </button>
                  </div>
                ) : (
                  <Link key={link.href} href={link.href}
                    className={cn(
                      'group relative flex items-center h-full px-4 text-[12px] font-bold tracking-[0.06em] transition-colors',
                      isActive(link.href) ? 'text-[#FFD100]' : 'text-white/80 hover:text-white'
                    )}>
                    {link.label}
                    <span className={cn('absolute left-1/2 -translate-x-1/2 bottom-[16px] h-[2px] bg-[#FFD100] rounded-full shadow-[0_0_8px_rgba(255,209,0,0.6)] transition-all duration-300', isActive(link.href) ? 'w-5' : 'w-0 group-hover:w-5')} />
                  </Link>
                )
              )}
            </nav>

            {/* ── Sağ aksiyonlar ──────────────────────────────────────── */}
            <div className="flex items-center gap-2.5 ml-auto shrink-0">
              <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Ara"
                className="h-10 w-10 flex items-center justify-center rounded-full text-white/70 hover:text-[#FFD100] hover:bg-white/[0.06] transition-all">
                <Search size={18} />
              </button>
              <Link href="/bilet"
                className="group relative inline-flex items-center gap-2 text-[#0f4a28] font-black text-[12px] tracking-wide uppercase pl-4 pr-5 py-2.5 rounded-full overflow-hidden
                           bg-gradient-to-b from-[#FFE04D] to-[#FFD100] shadow-[0_4px_16px_-2px_rgba(255,209,0,0.45)] transition-all hover:scale-[1.03]">
                {/* üst cila */}
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-white/30" />
                <Ticket size={15} className="relative" />
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
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] bg-[#092d18]/97 backdrop-blur-xl ring-1 ring-white/10">
              <div className="h-1 bg-gradient-to-r from-[#1A6B3C] via-[#FFD100] to-[#1A6B3C]" />
              <div className="p-8 grid grid-cols-[1fr_1fr_1fr_1.1fr] gap-10">
                {kulupMenu.map((col) => (
                  <div key={col.baslik}>
                    <p className="text-[#FFD100] text-[10px] font-black tracking-[0.25em] mb-4 pb-3 border-b border-white/10">{col.baslik}</p>
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
                  <Link href="/bilet" className="relative inline-flex items-center justify-center gap-2 bg-[#FFD100] text-[#0a3320] font-black text-[11px] tracking-wide uppercase px-4 py-2.5 rounded-full hover:bg-[#e8c000] transition-colors">Bilet Al →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobil menü (sade + akordeon) ───────────────────────────── */}
        <div className={cn('lg:hidden overflow-hidden transition-all duration-300 bg-[#092d18]',
          mobileOpen ? 'max-h-[80vh] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0')}>
          <div className="px-3 py-3">
            {navLinks.map((link) =>
              link.hasMega ? (
                <div key={link.label}>
                  <button onClick={() => setMobileSubOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-4 py-3.5 text-[15px] font-bold text-white rounded-xl hover:bg-white/[0.05] transition-colors">
                    {link.label}
                    <ChevronDown size={16} className={cn('text-white/50 transition-transform', mobileSubOpen && 'rotate-180')} />
                  </button>
                  {mobileSubOpen && (
                    <div className="mb-1 pl-2 space-y-3 pb-2">
                      {kulupMenu.map((col) => (
                        <div key={col.baslik}>
                          <p className="px-4 pt-1 pb-1 text-[10px] font-black tracking-[0.2em] text-[#FFD100]/60">{col.baslik}</p>
                          {col.linkler.map((item) => (
                            <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)}
                              className="block pl-4 pr-4 py-2 text-sm text-white/60 hover:text-white rounded-lg transition-colors">{item.label}</Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={link.href} href={link.href === '#' ? '#' : link.href} onClick={() => setMobileOpen(false)}
                  className={cn('block px-4 py-3.5 text-[15px] font-bold rounded-xl transition-colors',
                    isActive(link.href) ? 'text-[#FFD100]' : 'text-white hover:bg-white/[0.05]')}>{link.label}</Link>
              )
            )}

            {/* Bilet */}
            <Link href="/bilet" onClick={() => setMobileOpen(false)}
              className="block mt-3 py-3.5 text-center text-sm font-black tracking-widest text-[#0f4a28] bg-[#FFD100] rounded-xl uppercase">
              Bilet Al
            </Link>

            {/* Sosyal */}
            <div className="flex items-center justify-center gap-2.5 pt-5 pb-2">
              {socials.map(({ icon: Icon, href, label, cls }) => (
                <a key={label} href={href} aria-label={label}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-white shadow-sm ${cls}`}><Icon /></a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Arama ────────────────────────────────────────────────── */}
        {searchOpen && (
          <div className="absolute left-0 right-0 top-full bg-[#092d18]/97 backdrop-blur-xl border-b border-white/10 px-4 py-3 z-40">
            <div className="mx-auto max-w-[1280px]">
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
