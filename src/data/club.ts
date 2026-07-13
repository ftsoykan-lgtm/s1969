/**
 * MERKEZİ KULÜP BİLGİLERİ
 * ------------------------------------------------------------
 * Sitedeki tüm kulüp bilgileri buradan beslenir (footer, iletişim,
 * tarihçe, meta etiketler, navbar...). Admin → Site Ayarları'ndan
 * düzenlenebilir. Tek kaynak burası olduğu için bir yeri değiştirince
 * tüm site güncellenir.
 *
 * Bilgiler araştırma ile dolduruldu (Vikipedi / TFF). Doğrulanmamış
 * alanlar (başkan, teknik direktör) admin panelden güncellenmelidir.
 */

export interface ClubInfo {
  // Kimlik
  name: string
  fullName: string
  shortCode: string
  nickname: string
  brandTagline: string   // navbar'da kulüp adının altında — admin'den düzenlenir
  founded: string
  colors: string

  // Lig
  league: string
  group: string

  // Stadyum
  stadium: string
  stadiumCapacity: string

  // Yönetim (admin'den güncellenecek)
  president: string
  headCoach: string

  // İletişim
  city: string
  address: string
  phone: string
  email: string
  website: string
  workHours: string
  mapEmbedUrl: string

  // Sosyal medya
  social: {
    facebook: string
    twitter: string
    instagram: string
    youtube: string
    tiktok: string
  }
  hashtag: string

  // Görseller
  logoUrl: string
  logoSize: number    // navbar'da logonun görünüm boyutu (px) — admin'den ayarlanır
  faviconUrl: string  // tarayıcı sekmesi ikonu — admin'den yüklenir (boşsa varsayılan favicon.ico)
  heroVideo: string   // header (üst) alanı için arka plan videosu — boşsa haber slider gösterilir

  // SEO (admin'den yönetilir)
  seoTitle: string
  seoDescription: string
  seoKeywords: string

  // Footer
  footerText: string  // footer'daki tanıtım paragrafı
  footer: FooterConfig // footer'daki tüm metinler (admin'den düzenlenir)

  // Tema (renk paleti) — admin'den seçilir
  theme: 'emerald' | 'classic'  // emerald = zümrüt (mevcut), classic = canlı yeşil + neon sarı (önceki)
}

export interface FooterLink { label: string; href: string }
export interface FooterColumn { title: string; links: FooterLink[] }
export interface FooterConfig {
  newsletterKicker: string       // "Haberdar Ol"
  newsletterTitle: string        // "Ceylanlar'dan hiçbir an kaçmasın"
  newsletterButton: string       // "Abone Ol"
  newsletterPlaceholder: string  // "E-posta adresiniz"
  columns: FooterColumn[]        // link kolonları
  legalLinks: FooterLink[]       // alt bar yasal linkleri
  copyright: string              // "© {year} {name}. Tüm hakları saklıdır." ({year}/{name} otomatik dolar)
}

export const defaultFooter: FooterConfig = {
  newsletterKicker: 'Haberdar Ol',
  newsletterTitle: "Ceylanlar'dan hiçbir an kaçmasın",
  newsletterButton: 'Abone Ol',
  newsletterPlaceholder: 'E-posta adresiniz',
  columns: [
    { title: 'Kulüp', links: [
      { label: 'Tarihçe', href: '/kulup/tarihce' },
      { label: 'Yönetim Kurulu', href: '/kulup/yonetim' },
      { label: 'Tesisler', href: '/sayfa/gap-arena' },
      { label: 'İletişim', href: '/iletisim' },
    ]},
    { title: 'Takım', links: [
      { label: 'Kadro', href: '/kadro' },
      { label: 'Maç Merkezi', href: '/mac-merkezi' },
      { label: 'Haberler', href: '/haberler' },
      { label: 'Taraftar', href: '/sayfa/taraftar' },
    ]},
    { title: 'Hizmetler', links: [
      { label: 'Bilet Al', href: '/bilet' },
      { label: 'Mağaza', href: '/magaza' },
      { label: 'Üyelik', href: '/sayfa/uyelik' },
      { label: 'Sponsorluk', href: '/sayfa/sponsorluk' },
    ]},
  ],
  legalLinks: [
    { label: 'Gizlilik', href: '/sayfa/gizlilik' },
    { label: 'Kullanım Koşulları', href: '/sayfa/kullanim' },
    { label: 'Çerezler', href: '/sayfa/cerez' },
  ],
  copyright: '© {year} {name}. Tüm hakları saklıdır.',
}

export const clubInfo: ClubInfo = {
  name: 'Şanlıurfaspor',
  fullName: 'Şanlıurfaspor Futbol Kulübü',
  shortCode: 'ŞANLIURFASPOR',
  nickname: 'Ceylanlar',
  brandTagline: 'Resmi Web Sitesi',
  founded: '1969',
  colors: 'Sarı - Yeşil',

  league: 'TFF 2. Lig',
  group: 'Beyaz Grup',

  stadium: 'Şanlıurfa 11 Nisan Stadyumu',
  stadiumCapacity: '28.965',

  president: '',          // ← Admin panelden girilecek
  headCoach: '',          // ← Admin panelden girilecek

  city: 'Şanlıurfa',
  address: 'Şanlıurfa 11 Nisan Stadyumu, Şanlıurfa',
  phone: '+90 (414) 000 00 00',
  email: 'info@sanliurfaspor.org',
  website: 'https://www.sanliurfaspor.org',
  workHours: 'Pzt – Cuma: 09:00 – 18:00',
  mapEmbedUrl: '',

  social: {
    facebook: 'https://www.facebook.com/Sanliurfaspor',
    twitter: 'https://x.com/sanliurfaspor',
    instagram: 'https://www.instagram.com/sanliurfaspor',
    youtube: 'https://www.youtube.com/@sanliurfaspor',
    tiktok: 'https://www.tiktok.com/@sanliurfaspor',
  },
  hashtag: '#Şanlıurfaspor',

  logoUrl: 'https://placehold.co/96x96/1A6B3C/FFD100?text=%C5%9EFK',
  logoSize: 72,
  faviconUrl: '',  // Admin → Site Ayarları → SEO'dan yüklenir (boşsa varsayılan favicon.ico)
  heroVideo: '',   // Admin → Site Ayarları'ndan eklenir (boşsa haber slider gösterilir)

  seoTitle: 'Şanlıurfaspor — Resmi Web Sitesi',
  seoDescription: 'Şanlıurfaspor Futbol Kulübü resmi web sitesi. Son haberler, kadro, fikstür ve daha fazlası.',
  seoKeywords: 'Şanlıurfaspor, futbol, TFF 2. Lig, Ceylanlar, Urfa',

  footerText: "1969 yılında kurulan Şanlıurfaspor, Güneydoğu Anadolu'nun köklü ve tutkulu futbol kulübüdür. Sahada ve tribünde bir.",
  footer: defaultFooter,
  theme: 'emerald',
}
