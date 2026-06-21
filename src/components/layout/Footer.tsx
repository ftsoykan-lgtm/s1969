import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
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
    { label: 'Teknik Kadro', href: '/kadro/teknik' },
    { label: 'Fikstür', href: '/fikstur' },
    { label: 'İstatistikler', href: '/istatistikler' },
  ],
  'Haberler': [
    { label: 'Tüm Haberler', href: '/haberler' },
    { label: 'Transferler', href: '/haberler?kategori=transfer' },
    { label: 'Maç Raporları', href: '/haberler?kategori=mac-raporu' },
    { label: 'Basın Bültenleri', href: '/haberler?kategori=basin-bildirisi' },
  ],
  'Taraftar': [
    { label: 'Bilet Al', href: '/bilet' },
    { label: 'Forma & Mağaza', href: '/magaza' },
    { label: 'Taraftar Kartı', href: '/taraftar-karti' },
    { label: 'İletişim', href: '/iletisim' },
  ],
}

export default function Footer({ club = defaultClub }: { club?: ClubInfo }) {
  const socials = [
    { label: 'Facebook', href: club.social.facebook, abbr: 'f' },
    { label: 'X', href: club.social.twitter, abbr: 'X' },
    { label: 'Instagram', href: club.social.instagram, abbr: 'ig' },
    { label: 'YouTube', href: club.social.youtube, abbr: 'yt' },
  ]
  const hasLogo = club.logoUrl && !club.logoUrl.includes('placehold.co')
  return (
    <footer className="bg-[#0f4a28]">
      {/* Sarı şerit üstte */}
      <div className="h-1 bg-[#FFD100]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">

          {/* Marka + iletişim */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              {hasLogo ? (
                <img src={club.logoUrl} alt={club.name}
                  className="h-14 w-14 rounded-full object-contain bg-white/5 shadow-lg" />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFD100] text-[#0f4a28] font-black text-base shadow-lg">
                  {club.shortCode}
                </div>
              )}
              <div>
                <p className="text-white font-black text-lg tracking-wide uppercase">{club.name}</p>
                <p className="text-[#FFD100]/60 text-[11px] font-semibold tracking-widest uppercase">Futbol Kulübü — {club.founded}</p>
              </div>
            </div>

            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              {club.founded} yılında kurulan {club.fullName}, Güneydoğu Anadolu'nun köklü ve tutkulu futbol kulübüdür.
            </p>

            {/* İletişim bilgileri */}
            <div className="space-y-2.5 text-sm text-white/50">
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 shrink-0 text-[#FFD100]" />
                <span>{club.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="shrink-0 text-[#FFD100]" />
                <span>{club.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="shrink-0 text-[#FFD100]" />
                <span>{club.email}</span>
              </div>
            </div>

            {/* Sosyal medya */}
            <div className="flex gap-2">
              {socials.map(({ href, label, abbr }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/50 hover:text-[#FFD100] hover:border-[#FFD100]/50 hover:bg-[#FFD100]/10 transition-all text-xs font-black"
                >
                  {abbr}
                </a>
              ))}
            </div>
          </div>

          {/* Link kolonları */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-4">
              <h3 className="text-[10px] font-black tracking-widest uppercase text-[#FFD100]">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Alt çizgi */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Şanlıurfaspor FK. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-6 text-xs text-white/30">
            <Link href="/gizlilik" className="hover:text-white/60 transition-colors">Gizlilik</Link>
            <Link href="/kullanim" className="hover:text-white/60 transition-colors">Kullanım Koşulları</Link>
            <Link href="/cerez" className="hover:text-white/60 transition-colors">Çerezler</Link>
          </div>
        </div>
      </div>

      {/* En altta 3 renk şeridi */}
      <div className="flex h-1">
        <div className="flex-1 bg-[#1A6B3C]" />
        <div className="flex-1 bg-[#FFD100]" />
        <div className="flex-1 bg-white" />
      </div>
    </footer>
  )
}
