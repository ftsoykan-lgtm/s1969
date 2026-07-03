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
  { label: 'HABERLER', href: '/haberler' },
  { label: 'KULÜP', href: '#', hasMega: true },
  { label: 'KADRO', href: '/kadro' },
  { label: 'MAÇ MERKEZİ', href: '/mac-merkezi' },
  { label: 'TAKVİM', href: '/takvim' },
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

  // Ortalanmış logo düzeni — linkler sol/sağ gruplara ayrılır
  const leftLinks = navLinks.slice(0, 3)   // HABERLER · KULÜP · KADRO
  const rightLinks = navLinks.slice(3)     // MAÇ MERKEZİ · TAKVİM · İLETİŞİM

  // Logo görünüm boyutu — admin ayarından (scroll'da orantılı küçülür)
  const logoBase = club.logoSize || 72
  const emblemPx = Math.round((scrolled ? 0.8 : 1) * logoBase)
  // Ortadaki logo mutlak konumlu; grid'de yatay yer ayıran boşluk (sabit → kayma olmaz)
  const logoSpacerPx = logoBase + 44

  const renderNavItem = (link: (typeof navLinks)[number]) =>
    link.hasMega ? (
      <div key={link.label} className="relative flex items-stretch" onMouseEnter={openMega} onMouseLeave={closeMega}>
        <button className={cn(
          'group relative flex items-center gap-1 h-full px-3 text-[12.5px] font-extrabold tracking-[0.09em] whitespace-nowrap transition-colors',
          megaOpen ? 'text-ugold' : 'text-white/85 hover:text-white',
        )}>
          {link.label}
          <ChevronDown size={12} className={cn('transition-transform duration-200', megaOpen && 'rotate-180')} />
          <span className={cn('absolute left-1/2 -translate-x-1/2 bottom-2.5 h-[2.5px] bg-ugold rounded-full transition-all duration-300', megaOpen ? 'w-6' : 'w-0 group-hover:w-6')} />
        </button>
      </div>
    ) : (
      <Link key={link.href} href={link.href} className={cn(
        'group relative flex items-center h-full px-3 text-[12.5px] font-extrabold tracking-[0.09em] whitespace-nowrap transition-colors',
        isActive(link.href) ? 'text-ugold' : 'text-white/85 hover:text-white',
      )}>
        {link.label}
        <span className={cn('absolute left-1/2 -translate-x-1/2 bottom-2.5 h-[2.5px] bg-ugold rounded-full transition-all duration-300', isActive(link.href) ? 'w-6' : 'w-0 group-hover:w-6')} />
      </Link>
    )

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* En üst sarı-yeşil aksan */}
      <div className="h-1 bg-gradient-to-r from-ugold via-ugreen to-ugold" />

      {/* ── İnce üst kimlik bandı (scroll'da gizlenir) ─────────────────── */}
      <div className={cn('hidden lg:block bg-ugreenm border-b border-white/[0.05] overflow-hidden transition-all duration-300',
        scrolled ? 'max-h-0 opacity-0 pointer-events-none' : 'max-h-10 opacity-100')}>
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
            <Link href="/magaza" className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-white/45 hover:text-ugold transition-colors">Mağaza</Link>
          </div>
        </div>
      </div>

      {/* ── Ana bar (scroll'da camlaşır + güçlü gölge) ─────────────────── */}
      <div className={cn('relative transition-all duration-300',
        scrolled
          ? 'bg-ugreen/85 backdrop-blur-xl shadow-[0_14px_40px_-12px_rgba(0,0,0,0.55)]'
          : 'bg-gradient-to-b from-ugreens to-ugreen shadow-[0_10px_30px_-14px_rgba(0,0,0,0.4)]')}>
        {/* alt altın saç çizgisi */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-ugold/40 to-transparent" />
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
                <div className="h-9 w-9 rounded-full bg-ugold flex items-center justify-center shrink-0">
                  <span className="font-heading font-extrabold text-[10px] text-ugreend">{club.shortCode}</span>
                </div>
              )}
              <span className="flex flex-col leading-none min-w-0">
                <span className="font-heading font-extrabold text-[15px] tracking-tight uppercase text-white truncate">{club.name}</span>
                {club.brandTagline && <span className="text-[8px] font-semibold tracking-[0.16em] uppercase text-ugold/75 truncate">{club.brandTagline}</span>}
              </span>
            </Link>

            <button aria-label="Dil" className="justify-self-end h-10 w-10 flex items-center justify-center text-white/80 hover:text-ugold transition-colors -mr-1">
              <Globe size={22} />
            </button>
          </div>

          {/* ── MASAÜSTÜ BAR — ortalanmış logo + ayrık menü ─────────── */}
          <div className={cn('hidden lg:grid grid-cols-[1fr_auto_1fr] items-center transition-all duration-300', scrolled ? 'h-[64px]' : 'h-[74px]')}>

            {/* SOL menü grubu */}
            <nav className="justify-self-start flex items-stretch h-full">
              {leftLinks.map(renderNavItem)}
            </nav>

            {/* ORTA — yatay yer ayıran boşluk (gerçek logo mutlak konumlu) */}
            <div aria-hidden className="justify-self-center h-full" style={{ width: logoSpacerPx }} />

            {/* SAĞ menü grubu + aksiyonlar */}
            <div className="justify-self-end flex items-stretch h-full">
              <nav className="flex items-stretch h-full">
                {rightLinks.map(renderNavItem)}
              </nav>
              <div className="flex items-center gap-2 pl-3 ml-2 my-3 border-l border-white/15">
                <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Ara"
                  className="h-9 w-9 flex items-center justify-center rounded-full text-white/70 hover:text-ugold hover:bg-white/[0.06] transition-all">
                  <Search size={17} />
                </button>
                <Link href="/bilet"
                  className="group relative inline-flex items-center gap-1.5 text-ugreend font-extrabold text-[11.5px] tracking-wide uppercase whitespace-nowrap pl-3.5 pr-4 py-2.5 rounded-full overflow-hidden
                             bg-gradient-to-b from-ugoldl to-ugold shadow-[0_4px_16px_-2px_rgba(255,209,0,0.45)] transition-all hover:scale-[1.03]">
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-white/30" />
                  <Ticket size={14} className="relative" />
                  <span className="relative">Bilet Al</span>
                </Link>
              </div>
            </div>
          </div>

          {/* ── Ortada mutlak konumlu premium arma (layout'u etkilemez, kayma yok) ── */}
          <Link href="/" aria-label={club.name}
            className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 items-center justify-center group">
            <span aria-hidden className="pointer-events-none absolute -inset-3 rounded-full bg-ugold/0 group-hover:bg-ugold/20 blur-lg transition-all duration-300" />
            <span aria-hidden className="pointer-events-none absolute -inset-1.5 rounded-full border border-dashed border-ugold/0 group-hover:border-ugold/55 group-hover:[animation:spin_7s_linear_infinite] transition-colors duration-300" />
            {hasLogo ? (
              <img src={club.logoUrl} alt={club.name} style={{ height: emblemPx, width: emblemPx }}
                className="logo-emblem relative rounded-full object-contain bg-white ring-2 ring-ugold/50 group-hover:ring-ugold group-hover:scale-105 shadow-[0_10px_30px_-6px_rgba(0,0,0,0.55)] transition-all duration-300" />
            ) : (
              <div style={{ height: emblemPx, width: emblemPx }}
                className="logo-emblem relative rounded-full bg-gradient-to-br from-ugold to-[#e8b800] flex items-center justify-center ring-2 ring-ugold/50 group-hover:scale-105 shadow-[0_10px_30px_-6px_rgba(0,0,0,0.55)] transition-all duration-300">
                <span className="font-heading font-extrabold text-lg text-ugreend">{club.shortCode}</span>
              </div>
            )}
          </Link>
        </div>

        {/* ── Mega Menu ──────────────────────────────────────────────── */}
        <div
          className={cn('hidden lg:block absolute left-0 right-0 top-full transition-all duration-200 z-50',
            megaOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none')}
          onMouseEnter={openMega} onMouseLeave={closeMega}>
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pt-2">
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] bg-ugreenm/97 backdrop-blur-xl ring-1 ring-white/10">
              <div className="h-1 bg-gradient-to-r from-ugreen via-ugold to-ugreen" />
              <div className="p-8 grid grid-cols-[1fr_1fr_1fr_1.1fr] gap-10">
                {kulupMenu.map((col) => (
                  <div key={col.baslik}>
                    <p className="text-ugold text-[10px] font-extrabold tracking-[0.25em] mb-4 pb-3 border-b border-white/10">{col.baslik}</p>
                    <ul className="space-y-0.5">
                      {col.linkler.map((item) => (
                        <li key={item.label}>
                          <Link href={item.href}
                            className="flex items-center gap-2.5 text-sm text-white/55 hover:text-white hover:bg-white/[0.05] rounded-xl px-3 py-2 -mx-3 transition-all group">
                            <span className="w-1.5 h-1.5 rounded-full bg-ugold/30 group-hover:bg-ugold transition-colors shrink-0" />
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-ugreen to-ugreenm ring-1 ring-white/10 p-5 flex flex-col justify-end">
                  <div className="absolute top-3 right-3 font-heading text-[5rem] font-extrabold text-white/[0.04] leading-none">{club.shortCode}</div>
                  <p className="relative text-[10px] font-extrabold tracking-[0.25em] uppercase text-ugold/70 mb-1">{club.nickname}</p>
                  <p className="relative text-white font-extrabold text-lg leading-tight mb-3">Tribünde yerini al</p>
                  <Link href="/bilet" className="relative inline-flex items-center justify-center gap-2 bg-ugold text-ugreenm font-extrabold text-[11px] tracking-wide uppercase px-4 py-2.5 rounded-full hover:bg-ugoldh transition-colors">Bilet Al →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobil menü — TAM EKRAN panel (sağdan kayar) ────────────── */}
        <div className={cn(
          'lg:hidden fixed inset-0 z-[60] bg-ugreenm flex flex-col transition-transform duration-300 ease-out',
          mobileOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        )}>
          {/* Panel başlığı */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-white/10 shrink-0">
            <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
              {hasLogo ? (
                <img src={club.logoUrl} alt="" className="h-9 w-9 rounded-full object-contain bg-white ring-1 ring-white/20" />
              ) : (
                <div className="h-9 w-9 rounded-full bg-ugold flex items-center justify-center"><span className="font-heading font-extrabold text-[10px] text-ugreend">{club.shortCode}</span></div>
              )}
              <span className="font-heading font-extrabold text-base tracking-tight uppercase text-white">{club.name}</span>
            </Link>
            <button onClick={() => setMobileOpen(false)} aria-label="Kapat"
              className="h-10 w-10 flex items-center justify-center rounded-full text-white bg-white/[0.06] hover:bg-white/10 transition-colors">
              <X size={22} />
            </button>
          </div>

          {/* İçerik (kaydırılabilir) */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5">
            {navLinks.map((link) =>
              link.hasMega ? (
                <div key={link.label} className="border-b border-white/[0.06]">
                  <button onClick={() => setMobileSubOpen((v) => !v)}
                    className="w-full flex items-center justify-between py-4 text-lg font-bold text-white">
                    {link.label}
                    <ChevronDown size={18} className={cn('text-white/50 transition-transform', mobileSubOpen && 'rotate-180')} />
                  </button>
                  {mobileSubOpen && (
                    <div className="pb-3 pl-1 space-y-3">
                      {kulupMenu.map((col) => (
                        <div key={col.baslik}>
                          <p className="pt-1 pb-1 text-[10px] font-extrabold tracking-[0.2em] text-ugold/60">{col.baslik}</p>
                          {col.linkler.map((item) => (
                            <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)}
                              className="block py-2 text-[15px] text-white/65 hover:text-white transition-colors">{item.label}</Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={link.href} href={link.href === '#' ? '#' : link.href} onClick={() => setMobileOpen(false)}
                  className={cn('block py-4 text-lg font-bold border-b border-white/[0.06] transition-colors',
                    isActive(link.href) ? 'text-ugold' : 'text-white')}>{link.label}</Link>
              )
            )}

            <Link href="/bilet" onClick={() => setMobileOpen(false)}
              className="block mt-6 py-4 text-center text-sm font-extrabold tracking-widest text-ugreend bg-ugold rounded-xl uppercase shadow-lg shadow-ugold/20">
              Bilet Al
            </Link>

            <div className="flex items-center justify-center gap-3 pt-7">
              {socials.map(({ icon: Icon, href, label, cls }) => (
                <a key={label} href={href} aria-label={label}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm ${cls}`}><Icon /></a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Arama ────────────────────────────────────────────────── */}
        {searchOpen && (
          <div className="absolute left-0 right-0 top-full bg-ugreenm/97 backdrop-blur-xl border-b border-white/10 px-4 py-3 z-40">
            <div className="mx-auto max-w-[1280px]">
              <div className="relative">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input autoFocus type="search" placeholder="Haber, oyuncu, maç ara..."
                  className="w-full bg-white/[0.06] border border-white/10 rounded-full pl-11 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-ugold/40 transition-colors"
                  onBlur={() => setSearchOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
