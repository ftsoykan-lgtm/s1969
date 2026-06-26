import Link from 'next/link'
import { clubInfo as defaultClub, defaultFooter } from '@/data/club'
import type { ClubInfo } from '@/data/club'

/* ─── Sosyal medya SVG ikonları (Navbar ile aynı dil) ────────────────────── */
const SocialIcons = {
  Facebook: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  Instagram: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  ),
  YouTube: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#16532f"/>
    </svg>
  ),
  TikTok: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
    </svg>
  ),
}

const SOCIALS = [
  { label: 'Instagram', Icon: SocialIcons.Instagram, get: (c: ClubInfo) => c.social.instagram },
  { label: 'X',         Icon: SocialIcons.X,         get: (c: ClubInfo) => c.social.twitter },
  { label: 'YouTube',   Icon: SocialIcons.YouTube,   get: (c: ClubInfo) => c.social.youtube },
  { label: 'Facebook',  Icon: SocialIcons.Facebook,  get: (c: ClubInfo) => c.social.facebook },
  { label: 'TikTok',    Icon: SocialIcons.TikTok,    get: (c: ClubInfo) => c.social.tiktok },
]

export default function Footer({ club = defaultClub }: { club?: ClubInfo }) {
  const socials = SOCIALS.map((s) => ({ ...s, href: s.get(club) })).filter((s) => s.href && s.href !== '#')
  const hasLogo = club.logoUrl && !club.logoUrl.includes('placehold.co')
  const f = club.footer ?? defaultFooter
  const copyright = (f.copyright || '© {year} {name}. Tüm hakları saklıdır.')
    .replace('{year}', String(new Date().getFullYear()))
    .replace('{name}', club.name)

  return (
    <footer className="relative bg-[#16532f] text-white overflow-hidden">
      {/* Arka plan parıltıları + watermark */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full bg-[#1A6B3C]/30 blur-[130px]" />
        <div className="absolute -bottom-32 right-0 w-[480px] h-[480px] rounded-full bg-[#FFD100]/[0.05] blur-[120px]" />
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center select-none">
          <span className="font-heading text-[26vw] font-black leading-none text-white/[0.015] tracking-tighter">{club.shortCode}</span>
        </div>
      </div>

      {/* Üst altın hat (navbar ile aynı) */}
      <div className="h-1 bg-gradient-to-r from-[#1A6B3C] via-[#FFD100] to-[#1A6B3C]" />

      {/* ── Bülten / CTA premium şeridi ────────────────────────────── */}
      <div className="relative border-b border-white/[0.07]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#FFD100]/60 mb-1.5">{f.newsletterKicker}</p>
            <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-white tracking-tight">{f.newsletterTitle}</h3>
          </div>
          <form className="flex w-full md:w-auto items-center gap-2 rounded-full bg-white/[0.05] border border-white/10 p-1.5 backdrop-blur-sm">
            <input type="email" placeholder={f.newsletterPlaceholder} aria-label="E-posta"
              className="flex-1 md:w-64 bg-transparent px-4 py-2 text-sm text-white placeholder-white/35 focus:outline-none" />
            <button type="submit"
              className="shrink-0 inline-flex items-center gap-1.5 text-[#16532f] font-black text-[11px] tracking-wide uppercase px-5 py-2.5 rounded-full bg-gradient-to-b from-[#FFE04D] to-[#FFD100] shadow-[0_4px_14px_rgba(255,209,0,0.3)] hover:scale-[1.03] transition-transform">
              {f.newsletterButton}
            </button>
          </form>
        </div>
      </div>

      {/* ── Orta: marka + linkler ─────────────────────────────────── */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10">

        {/* Marka bloğu */}
        <div className="col-span-2 lg:col-span-1">
          <Link href="/" className="inline-flex items-center gap-3.5 group mb-5">
            {hasLogo ? (
              <img src={club.logoUrl} alt={club.name}
                className="h-14 w-14 rounded-2xl object-contain bg-white/5 ring-1 ring-white/15 shrink-0" />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD100] to-[#d4ad00] text-[#16532f] font-black text-base shadow-lg">
                {club.shortCode}
              </div>
            )}
            <div className="leading-tight">
              <p className="font-heading text-white font-extrabold text-lg tracking-wide uppercase">{club.name}</p>
            </div>
          </Link>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6">
            {club.footerText || "Güneydoğu Anadolu'nun köklü ve tutkulu kulübü. Sahada ve tribünde daima bir."}
          </p>
          {/* Sosyal — navbar pill diliyle */}
          <div className="flex flex-wrap gap-2.5">
            {socials.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="h-11 w-11 flex items-center justify-center rounded-full bg-white/[0.05] border border-white/10 text-white/60 hover:text-[#16532f] hover:bg-[#FFD100] hover:border-[#FFD100] hover:scale-110 transition-all duration-300">
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Link kolonları */}
        {f.columns.map((col) => (
          <div key={col.title}>
            <div className="flex items-center gap-2 mb-5">
              <span className="w-4 h-px bg-[#FFD100]/60" />
              <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-[#FFD100]">{col.title}</h3>
            </div>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="group inline-flex items-center gap-2 text-[15px] text-white/45 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/15 group-hover:bg-[#FFD100] group-hover:scale-125 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* İletişim mini blok */}
        <div className="col-span-2 lg:col-span-4 pt-8 mt-2 border-t border-white/[0.07] grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm">
          {club.address && (
            <div className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#FFD100]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>
              </span>
              <span className="text-white/45 leading-relaxed">{club.address}</span>
            </div>
          )}
          {club.phone && (
            <a href={`tel:${club.phone}`} className="flex items-center gap-3 group">
              <span className="shrink-0 w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#FFD100]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 010 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
              </span>
              <span className="text-white/45 group-hover:text-white transition-colors">{club.phone}</span>
            </a>
          )}
          {club.email && (
            <a href={`mailto:${club.email}`} className="flex items-center gap-3 group">
              <span className="shrink-0 w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#FFD100]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>
              </span>
              <span className="text-white/45 group-hover:text-white transition-colors">{club.email}</span>
            </a>
          )}
        </div>
      </div>

      {/* ── Alt bar ──────────────────────────────────────────────── */}
      <div className="relative border-t border-white/10 bg-[#15532f]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/25 order-2 sm:order-1">{copyright}</p>
          <div className="flex items-center gap-5 text-xs text-white/25 order-1 sm:order-2">
            {f.legalLinks.map((l, i) => (
              <span key={l.label} className="flex items-center gap-5">
                {i > 0 && <span className="w-px h-3 bg-white/10" />}
                <Link href={l.href} className="hover:text-white/55 transition-colors">{l.label}</Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
