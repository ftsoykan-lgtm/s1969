import Link from 'next/link'
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react'
import { clubInfo as defaultClub } from '@/data/club'
import type { ClubInfo } from '@/data/club'

const footerLinks = {
  'Kulüp': [
    { label: 'Tarihçe', href: '/kulup/tarihce' },
    { label: 'Yönetim Kurulu', href: '/kulup/yonetim' },
    { label: 'Tesisler', href: '/kulup/tarihce' },
    { label: 'İletişim', href: '/iletisim' },
  ],
  'Takım': [
    { label: 'Kadro', href: '/kadro' },
    { label: 'Maç Merkezi', href: '/fikstur' },
    { label: 'Haberler', href: '/haberler' },
    { label: 'Taraftar', href: '/iletisim' },
  ],
  'Hizmetler': [
    { label: 'Bilet Al', href: '/bilet' },
    { label: 'Mağaza', href: '/magaza' },
    { label: 'Üyelik', href: '/iletisim' },
    { label: 'Sponsorluk', href: '/iletisim' },
  ],
}

export default function Footer({ club = defaultClub }: { club?: ClubInfo }) {
  const socials = [
    { label: 'Facebook', href: club.social.facebook, abbr: 'f' },
    { label: 'X', href: club.social.twitter, abbr: 'X' },
    { label: 'Instagram', href: club.social.instagram, abbr: 'ig' },
    { label: 'YouTube', href: club.social.youtube, abbr: '▶' },
    { label: 'TikTok', href: club.social.tiktok, abbr: '♪' },
  ].filter((s) => s.href && s.href !== '#')
  const hasLogo = club.logoUrl && !club.logoUrl.includes('placehold.co')

  return (
    <footer className="relative bg-[#061a0f] text-white overflow-hidden">
      {/* Atmosfer */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-20%,#0f4a28_0%,transparent_60%)]" />
      <div className="absolute -bottom-24 right-0 text-[18rem] font-black text-white/[0.025] leading-none select-none pointer-events-none tracking-tighter">
        {club.shortCode}
      </div>

      <div className="relative">
        <div className="h-px bg-gradient-to-r from-transparent via-[#FFD100]/60 to-transparent" />

        {/* Üst — marka şeridi */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8 border-b border-white/8">
          <div className="flex items-center gap-4">
            {hasLogo ? (
              <img src={club.logoUrl} alt={club.name} className="h-20 w-20 rounded-2xl object-contain bg-white/5 ring-1 ring-white/10 shadow-xl" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#FFD100] text-[#0f4a28] font-black text-2xl shadow-xl">{club.shortCode}</div>
            )}
            <div>
              <p className="text-white font-black text-2xl md:text-3xl tracking-tight uppercase">{club.name}</p>
              <p className="text-[#FFD100]/60 text-xs font-bold tracking-[0.25em] uppercase mt-1">Futbol Kulübü · Est. {club.founded}</p>
            </div>
          </div>

          {/* Sosyal */}
          <div className="flex gap-2.5">
            {socials.map(({ href, label, abbr }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-[#0f4a28] hover:bg-[#FFD100] hover:border-[#FFD100] transition-all text-sm font-black">
                {abbr}
              </a>
            ))}
          </div>
        </div>

        {/* Orta — kolonlar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12">
          <div className="space-y-5">
            <p className="text-white/45 text-sm leading-relaxed max-w-sm">
              {club.founded} yılında kurulan {club.fullName}, Güneydoğu Anadolu'nun köklü ve tutkulu futbol kulübüdür. Sahada ve tribünde bir.
            </p>
            <div className="space-y-3 text-sm text-white/55">
              <div className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-[#FFD100]" /><span>{club.address}</span></div>
              <div className="flex items-center gap-3"><Phone size={16} className="shrink-0 text-[#FFD100]" /><span>{club.phone}</span></div>
              <div className="flex items-center gap-3"><Mail size={16} className="shrink-0 text-[#FFD100]" /><span>{club.email}</span></div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-black tracking-[0.2em] uppercase text-[#FFD100] mb-6">{title}</h3>
              <ul className="space-y-3.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="group inline-flex items-center gap-1.5 text-[15px] text-white/55 hover:text-white transition-colors">
                      {link.label}
                      <ArrowUpRight size={13} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-[#FFD100] transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Alt bar */}
        <div className="border-t border-white/8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30">© {new Date().getFullYear()} {club.fullName}. Tüm hakları saklıdır.</p>
            <div className="flex gap-6 text-xs text-white/30">
              <Link href="/gizlilik" className="hover:text-white/70 transition-colors">Gizlilik</Link>
              <Link href="/kullanim" className="hover:text-white/70 transition-colors">Kullanım Koşulları</Link>
              <Link href="/cerez" className="hover:text-white/70 transition-colors">Çerezler</Link>
            </div>
          </div>
        </div>

        <div className="flex h-1.5">
          <div className="flex-1 bg-[#1A6B3C]" />
          <div className="flex-1 bg-[#FFD100]" />
          <div className="flex-1 bg-white/80" />
        </div>
      </div>
    </footer>
  )
}
