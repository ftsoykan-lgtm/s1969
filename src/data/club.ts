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
  heroVideo: string   // header (üst) alanı için arka plan videosu — boşsa haber slider gösterilir

  // SEO (admin'den yönetilir)
  seoTitle: string
  seoDescription: string
  seoKeywords: string

  // Footer
  footerText: string  // footer'daki tanıtım paragrafı
}

export const clubInfo: ClubInfo = {
  name: 'Şanlıurfaspor',
  fullName: 'Şanlıurfaspor Futbol Kulübü',
  shortCode: 'ŞANLIURFASPOR',
  nickname: 'Ceylanlar',
  founded: '1969',
  colors: 'Sarı - Yeşil',

  league: 'TFF 2. Lig',
  group: 'Beyaz Grup',

  stadium: 'Şanlıurfa GAP Stadyumu',
  stadiumCapacity: '28.965',

  president: '',          // ← Admin panelden girilecek
  headCoach: '',          // ← Admin panelden girilecek

  city: 'Şanlıurfa',
  address: 'Şanlıurfa GAP Stadyumu, Karaköprü, Şanlıurfa',
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
  heroVideo: '',   // Admin → Site Ayarları'ndan eklenir (boşsa haber slider gösterilir)

  seoTitle: 'Şanlıurfaspor — Resmi Web Sitesi',
  seoDescription: 'Şanlıurfaspor Futbol Kulübü resmi web sitesi. Son haberler, kadro, fikstür ve daha fazlası.',
  seoKeywords: 'Şanlıurfaspor, futbol, TFF 2. Lig, Ceylanlar, Urfa',

  footerText: "1969 yılında kurulan Şanlıurfaspor, Güneydoğu Anadolu'nun köklü ve tutkulu futbol kulübüdür. Sahada ve tribünde bir.",
}
