import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import SiteShell from '@/components/layout/SiteShell'
import ScrollReveal from '@/components/layout/ScrollReveal'
import { getClubInfo } from '@/lib/supabase/club-server'
import { getSponsors } from '@/lib/supabase/sponsors-server'

// Marka tipografisi — Montserrat: futbol kulüplerinin kurumsal standardı
// (Gotham ailesinin açık karşılığı). Başlık/gövde tek ailede ağırlıkla
// ayrışır; BÜYÜK HARF menü ve başlıklarda güçlü durur. Türkçe: latin-ext.
const brandFont = Montserrat({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const club = await getClubInfo()
  const title = club.seoTitle || `${club.name} — Resmi Web Sitesi`
  const description = club.seoDescription || `${club.fullName} resmi web sitesi.`
  const keywords = (club.seoKeywords || '').split(',').map((k) => k.trim()).filter(Boolean)
  return {
    title: { default: title, template: `%s | ${club.name}` },
    description,
    keywords,
    // Admin → Site Ayarları → SEO'dan yüklenen favicon; boşsa varsayılan app/favicon.ico
    icons: club.faviconUrl
      ? { icon: [{ url: club.faviconUrl }], shortcut: club.faviconUrl, apple: club.faviconUrl }
      : undefined,
    openGraph: {
      title,
      description,
      siteName: club.name,
      images: club.logoUrl && !club.logoUrl.includes('placehold.co') ? [club.logoUrl] : undefined,
      locale: 'tr_TR',
      type: 'website',
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [club, sponsors] = await Promise.all([getClubInfo(), getSponsors()])
  return (
    <html lang="tr" data-theme={club.theme === 'classic' ? 'classic' : 'emerald'} className={`h-full ${brandFont.variable}`}>
      <body className="min-h-full flex flex-col bg-[#f8faf9] antialiased">
        <ScrollReveal />
        <SiteShell club={club} sponsors={sponsors}>{children}</SiteShell>
      </body>
    </html>
  )
}
