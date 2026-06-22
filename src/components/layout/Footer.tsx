import Link from 'next/link'
import { clubInfo as defaultClub } from '@/data/club'
import type { ClubInfo } from '@/data/club'

/* ── Sosyal ikon SVG'leri ────────────────────────────────────── */
function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}
function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
    </svg>
  )
}
function IconYouTube() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}
function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}
function IconTikTok() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  )
}

const SOCIALS = [
  { key: 'instagram', label: 'Instagram', Icon: IconInstagram, color: '#E1306C', get: (c: ClubInfo) => c.social.instagram },
  { key: 'twitter',   label: 'X / Twitter', Icon: IconX,         color: '#ffffff', get: (c: ClubInfo) => c.social.twitter },
  { key: 'youtube',   label: 'YouTube',    Icon: IconYouTube,    color: '#FF0000', get: (c: ClubInfo) => c.social.youtube },
  { key: 'facebook',  label: 'Facebook',   Icon: IconFacebook,   color: '#1877F2', get: (c: ClubInfo) => c.social.facebook },
  { key: 'tiktok',    label: 'TikTok',     Icon: IconTikTok,     color: '#ffffff', get: (c: ClubInfo) => c.social.tiktok },
]

const LINKS = [
  {
    title: 'Kulüp',
    items: [
      { label: 'Tarihçe',        href: '/kulup/tarihce' },
      { label: 'Yönetim Kurulu', href: '/kulup/yonetim' },
      { label: 'Tesisler',       href: '/kulup/tarihce' },
      { label: 'İletişim',       href: '/iletisim' },
    ],
  },
  {
    title: 'Takım',
    items: [
      { label: 'Kadro',       href: '/kadro' },
      { label: 'Maç Merkezi', href: '/fikstur' },
      { label: 'Haberler',    href: '/haberler' },
      { label: 'Taraftar',    href: '/iletisim' },
    ],
  },
  {
    title: 'Hizmetler',
    items: [
      { label: 'Bilet Al',   href: '/bilet' },
      { label: 'Mağaza',     href: '/magaza' },
      { label: 'Üyelik',     href: '/iletisim' },
      { label: 'Sponsorluk', href: '/iletisim' },
    ],
  },
]

export default function Footer({ club = defaultClub }: { club?: ClubInfo }) {
  const socials = SOCIALS.map((s) => ({ ...s, href: s.get(club) })).filter((s) => s.href && s.href !== '#')
  const hasLogo = club.logoUrl && !club.logoUrl.includes('placehold.co')

  return (
    <footer className="relative bg-[#04110a] text-white overflow-hidden">

      {/* ── Arka plan ışık efektleri ──────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Sol yeşil parıltı */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[#1A6B3C]/12 blur-[120px]" />
        {/* Sağ sarı parıltı */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#FFD100]/6 blur-[100px]" />
        {/* Alt merkez */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-[#0f4a28]/20 blur-[80px]" />
        {/* Büyük watermark */}
        <div className="absolute -bottom-10 right-4 text-[22vw] font-black leading-none select-none tracking-tighter text-white/[0.018]">
          {club.shortCode}
        </div>
        {/* Gürültü doku (SVG noise) */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise-footer">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/>
            <feColorMatrix type="saturate" values="0"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noise-footer)"/>
        </svg>
      </div>

      {/* ── Üst altın çizgi ──────────────────────────────────── */}
      <div className="relative h-px bg-gradient-to-r from-transparent via-[#FFD100]/50 to-transparent" />

      {/* ── HERO şeridi ──────────────────────────────────────── */}
      <div className="relative border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">

          {/* Marka bloğu */}
          <div className="flex items-center gap-6">
            {hasLogo ? (
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-[#FFD100]/20 blur-xl scale-110" />
                <img src={club.logoUrl} alt={club.name}
                  className="relative h-24 w-24 rounded-2xl object-contain bg-white/5 ring-1 ring-white/10 shadow-2xl" />
              </div>
            ) : (
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-[#FFD100]/30 blur-xl scale-110" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD100] to-[#e8b800] text-[#0f4a28] font-black text-2xl shadow-2xl">
                  {club.shortCode}
                </div>
              </div>
            )}
            <div>
              <p className="text-[10px] font-black tracking-[0.35em] uppercase text-[#FFD100]/50 mb-1">
                Est. {club.founded} · TFF 2. Lig
              </p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase leading-tight">
                {club.name}
              </h2>
              <p className="text-white/35 text-sm mt-1.5 max-w-xs leading-relaxed">
                Güneydoğu Anadolu&apos;nun tutkulu kulübü. Sahada ve tribünde bir.
              </p>
            </div>
          </div>

          {/* Sosyal medya ikon grubu */}
          <div className="flex flex-wrap gap-3">
            {socials.map(({ href, label, Icon, color }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05] border border-white/[0.08] text-white/50 hover:text-white transition-all duration-300 hover:scale-110 hover:border-white/20 hover:bg-white/[0.09] overflow-hidden"
              >
                {/* hover'da arka plan rengi */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl"
                  style={{ background: color }} />
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Orta: bağlantı kolonları + iletişim ─────────────── */}
      <div className="relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-12">

          {/* İletişim kolonu */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FFD100]/10 border border-[#FFD100]/20 px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD100] animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#FFD100]">İletişim</span>
            </div>
            <div className="space-y-4">
              {club.address && (
                <div className="flex items-start gap-3 group">
                  <div className="mt-0.5 shrink-0 w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#FFD100] group-hover:bg-[#FFD100]/10 transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  </div>
                  <p className="text-sm text-white/45 leading-relaxed pt-1">{club.address}</p>
                </div>
              )}
              {club.phone && (
                <a href={`tel:${club.phone}`} className="flex items-center gap-3 group">
                  <div className="shrink-0 w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#FFD100] group-hover:bg-[#FFD100]/10 transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.02 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
                  </div>
                  <span className="text-sm text-white/45 group-hover:text-white/70 transition-colors">{club.phone}</span>
                </a>
              )}
              {club.email && (
                <a href={`mailto:${club.email}`} className="flex items-center gap-3 group">
                  <div className="shrink-0 w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#FFD100] group-hover:bg-[#FFD100]/10 transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <span className="text-sm text-white/45 group-hover:text-white/70 transition-colors">{club.email}</span>
                </a>
              )}
            </div>
          </div>

          {/* Bağlantı kolonları */}
          {LINKS.map((col) => (
            <div key={col.title}>
              <div className="flex items-center gap-2 mb-7">
                <span className="w-0.5 h-5 rounded-full bg-gradient-to-b from-[#FFD100] to-[#FFD100]/20" />
                <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-white/60">{col.title}</h3>
              </div>
              <ul className="space-y-3">
                {col.items.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}
                      className="group flex items-center gap-2.5 text-[15px] text-white/40 hover:text-white transition-colors duration-200">
                      <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-[#FFD100] group-hover:scale-125 transition-all duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Newsletter / hashtag şeridi ──────────────────────── */}
      {club.hashtag && (
        <div className="relative border-t border-white/[0.05]">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8 flex items-center justify-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
            <p className="text-2xl font-black text-white/[0.07] tracking-widest uppercase select-none">
              {club.hashtag}
            </p>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
          </div>
        </div>
      )}

      {/* ── Alt bar ──────────────────────────────────────────── */}
      <div className="relative border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/20 order-2 sm:order-1">
            © {new Date().getFullYear()} {club.fullName}. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-5 text-xs text-white/20 order-1 sm:order-2">
            <Link href="/gizlilik" className="hover:text-white/50 transition-colors">Gizlilik</Link>
            <span className="w-px h-3 bg-white/10" />
            <Link href="/kullanim" className="hover:text-white/50 transition-colors">Kullanım Koşulları</Link>
            <span className="w-px h-3 bg-white/10" />
            <Link href="/cerez" className="hover:text-white/50 transition-colors">Çerezler</Link>
          </div>
        </div>
      </div>

      {/* ── Alt üçlü renk şeridi ─────────────────────────────── */}
      <div className="flex h-1">
        <div className="flex-1 bg-gradient-to-r from-[#1A6B3C] to-[#14532d]" />
        <div className="flex-1 bg-gradient-to-r from-[#FFD100] to-[#f0c000]" />
        <div className="flex-1 bg-gradient-to-r from-white/60 to-white/40" />
      </div>
    </footer>
  )
}
