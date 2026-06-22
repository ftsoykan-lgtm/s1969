import Link from 'next/link'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import { clubInfo as defaultClub } from '@/data/club'
import type { ClubInfo } from '@/data/club'

const footerLinks = {
  'Kulüp': [
    { label: 'Tarihçe', href: '/kulup/tarihce' },
    { label: 'Yönetim', href: '/kulup/yonetim' },
    { label: 'Tesisler', href: '/kulup/tesisler' },
    { label: 'Altyapı', href: '/kulup/altyapi' },
  ],
  'Takım': [
    { label: 'Kadro', href: '/kadro' },
    { label: 'Maç Merkezi', href: '/fikstur' },
    { label: 'Mağaza', href: '/magaza' },
    { label: 'Bilet Al', href: '/bilet' },
  ],
  'Haberler': [
    { label: 'Tüm Haberler', href: '/haberler' },
    { label: 'Transferler', href: '/haberler' },
    { label: 'Maç Raporları', href: '/haberler' },
    { label: 'Taraftar', href: '/iletisim' },
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
    <footer className="relative bg-[#0b3a20] overflow-hidden">
      {/* Üst gradient + radyal ışık */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f4a28] to-[#071f10]" />
      <div className="absolute -top-32 -right-20 w-[520px] h-[520px] rounded-full bg-[#1A6B3C]/30 blur-3xl" />
      {/* Dev filigran */}
      <div className="absolute -bottom-16 -left-6 text-[14rem] font-black text-white/[0.03] leading-none select-none pointer-events-none tracking-tighter">
        {club.shortCode}
      </div>

      <div className="relative">
        {/* Üst şerit */}
        <div className="h-1 bg-gradient-to-r from-[#1A6B3C] via-[#FFD100] to-[#1A6B3C]" />

        {/* E-bülten bandı */}
        <div className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-5">
            <div>
              <h3 className="text-white font-black text-xl tracking-tight">Gelişmelerden ilk sen haberdar ol</h3>
              <p className="text-white/45 text-sm mt-1">Kulüp haberleri ve duyurular için e-bültene kayıt ol.</p>
            </div>
            <form className="flex items-center gap-2 w-full md:w-auto">
              <input type="email" placeholder="E-posta adresin"
                className="flex-1 md:w-72 bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/35 focus:outline-none focus:border-[#FFD100]/50 transition-colors" />
              <button type="submit"
                className="inline-flex items-center gap-2 bg-[#FFD100] hover:bg-[#e8c000] text-[#0f4a28] font-black text-sm px-5 py-3 rounded-xl transition-all hover:scale-105 shrink-0">
                Abone Ol <ArrowRight size={15} />
              </button>
            </form>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10">

            {/* Marka */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                {hasLogo ? (
                  <img src={club.logoUrl} alt={club.name} className="h-16 w-16 rounded-2xl object-contain bg-white/5 shadow-lg ring-1 ring-white/10" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFD100] text-[#0f4a28] font-black text-lg shadow-lg">{club.shortCode}</div>
                )}
                <div>
                  <p className="text-white font-black text-xl tracking-wide uppercase">{club.name}</p>
                  <p className="text-[#FFD100]/60 text-[11px] font-bold tracking-[0.2em] uppercase">Futbol Kulübü · {club.founded}</p>
                </div>
              </div>

              <p className="text-white/45 text-sm leading-relaxed max-w-sm">
                {club.founded} yılında kurulan {club.fullName}, Güneydoğu Anadolu'nun köklü ve tutkulu futbol kulübüdür.
              </p>

              <div className="space-y-2.5 text-sm text-white/50">
                <div className="flex items-start gap-2.5"><MapPin size={15} className="mt-0.5 shrink-0 text-[#FFD100]" /><span>{club.address}</span></div>
                <div className="flex items-center gap-2.5"><Phone size={15} className="shrink-0 text-[#FFD100]" /><span>{club.phone}</span></div>
                <div className="flex items-center gap-2.5"><Mail size={15} className="shrink-0 text-[#FFD100]" /><span>{club.email}</span></div>
              </div>

              <div className="flex gap-2">
                {socials.map(({ href, label, abbr }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-[#0f4a28] hover:bg-[#FFD100] hover:border-[#FFD100] transition-all text-xs font-black">
                    {abbr}
                  </a>
                ))}
              </div>
            </div>

            {/* Link kolonları */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-[11px] font-black tracking-[0.2em] uppercase text-[#FFD100] mb-5 flex items-center gap-2">
                  <span className="w-4 h-px bg-[#FFD100]/50" /> {title}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="group inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
                        <span className="w-0 group-hover:w-3 h-px bg-[#FFD100] transition-all duration-300" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Alt çizgi */}
          <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
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
