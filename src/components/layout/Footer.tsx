import Link from 'next/link'
import { clubInfo as defaultClub } from '@/data/club'
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
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#072414"/>
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

const LINKS = [
  { title: 'Kulüp',     items: [{ label: 'Tarihçe', href: '/kulup/tarihce' }, { label: 'Yönetim Kurulu', href: '/kulup/yonetim' }, { label: 'Tesisler', href: '/kulup/tarihce' }, { label: 'İletişim', href: '/iletisim' }] },
  { title: 'Takım',     items: [{ label: 'Kadro', href: '/kadro' }, { label: 'Maç Merkezi', href: '/fikstur' }, { label: 'Haberler', href: '/haberler' }, { label: 'Taraftar', href: '/iletisim' }] },
  { title: 'Hizmetler', items: [{ label: 'Bilet Al', href: '/bilet' }, { label: 'Mağaza', href: '/magaza' }, { label: 'Üyelik', href: '/iletisim' }, { label: 'Sponsorluk', href: '/iletisim' }] },
]

export default function Footer({ club = defaultClub }: { club?: ClubInfo }) {
  const socials = SOCIALS.map((s) => ({ ...s, href: s.get(club) })).filter((s) => s.href && s.href !== '#')
  const hasLogo = club.logoUrl && !club.logoUrl.includes('placehold.co')

  return (
    <footer className="relative bg-[#0a3320] text-white overflow-hidden">
      {/* Arka plan parıltıları */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-[#1A6B3C]/25 blur-[120px]" />
        <div className="absolute -bottom-24 right-0 w-[420px] h-[420px] rounded-full bg-[#FFD100]/[0.04] blur-[110px]" />
      </div>

      {/* Üst altın çizgi (navbar mega menü ile aynı) */}
      <div className="h-1 bg-gradient-to-r from-[#1A6B3C] via-[#FFD100] to-[#1A6B3C]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">

        {/* ── Üst: marka kartı + CTA ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5 mb-12">

          {/* Marka cam kartı */}
          <div className="rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-sm p-7 flex items-center gap-5">
            {hasLogo ? (
              <img src={club.logoUrl} alt={club.name}
                className="h-20 w-20 rounded-2xl object-contain bg-white/5 ring-1 ring-white/10 shrink-0" />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD100] to-[#e8b800] text-[#0a3320] font-black text-xl shadow-lg">
                {club.shortCode}
              </div>
            )}
            <div>
              <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#FFD100]/60 mb-1">
                Est. {club.founded} · {club.nickname}
              </p>
              <h2 className="text-2xl font-black tracking-tight text-white uppercase leading-tight">{club.name}</h2>
              <p className="text-white/40 text-sm mt-2 leading-relaxed max-w-md">
                Güneydoğu Anadolu&apos;nun köklü ve tutkulu kulübü. Sahada ve tribünde daima bir.
              </p>
            </div>
          </div>

          {/* CTA cam kartı */}
          <div className="rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-sm p-7 flex flex-col justify-center">
            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#FFD100]/60 mb-3">Bizi Takip Edin</p>
            <div className="flex flex-wrap gap-2.5 mb-5">
              {socials.map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="h-11 w-11 flex items-center justify-center rounded-full bg-white/[0.05] border border-white/10 text-white/60 hover:text-[#0a3320] hover:bg-[#FFD100] hover:border-[#FFD100] hover:scale-110 transition-all duration-300">
                  <Icon />
                </a>
              ))}
            </div>
            <Link href="/bilet"
              className="inline-flex items-center justify-center gap-2 bg-[#FFD100] hover:bg-[#e8c000] text-[#0a3320] font-black text-[12px] tracking-wide uppercase px-5 py-3 rounded-full transition-all hover:scale-[1.02] shadow-md shadow-[#FFD100]/25">
              Maça Bilet Al →
            </Link>
          </div>
        </div>

        {/* ── Orta: link kolonları + iletişim ──────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8 lg:gap-10 pt-10 border-t border-white/10">

          {/* İletişim */}
          <div className="col-span-2 lg:col-span-1 space-y-3">
            <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-[#FFD100] mb-5">İletişim</h3>
            {club.address && <p className="text-sm text-white/45 leading-relaxed max-w-xs">{club.address}</p>}
            {club.phone && <a href={`tel:${club.phone}`} className="block text-sm text-white/45 hover:text-white transition-colors">{club.phone}</a>}
            {club.email && <a href={`mailto:${club.email}`} className="block text-sm text-white/45 hover:text-white transition-colors">{club.email}</a>}
          </div>

          {/* Link kolonları */}
          {LINKS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-[#FFD100] mb-5">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.items.map((link) => (
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
        </div>
      </div>

      {/* ── Alt bar ──────────────────────────────────────────────── */}
      <div className="relative border-t border-white/10 bg-[#072414]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/25 order-2 sm:order-1">
            © {new Date().getFullYear()} {club.fullName}. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-5 text-xs text-white/25 order-1 sm:order-2">
            <Link href="/gizlilik" className="hover:text-white/55 transition-colors">Gizlilik</Link>
            <span className="w-px h-3 bg-white/10" />
            <Link href="/kullanim" className="hover:text-white/55 transition-colors">Kullanım Koşulları</Link>
            <span className="w-px h-3 bg-white/10" />
            <Link href="/cerez" className="hover:text-white/55 transition-colors">Çerezler</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
