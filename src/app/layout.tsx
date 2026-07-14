import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import SiteShell from '@/components/layout/SiteShell'
import ScrollReveal from '@/components/layout/ScrollReveal'
import { getClubInfo } from '@/lib/supabase/club-server'
import { getSponsors } from '@/lib/supabase/sponsors-server'

// Marka tipografisi — iki seçenek admin panelden seçilebilir (data-font):
//  • Montserrat: futbol kulübü kurumsal standardı (varsayılan)
//  • BT Geometric 706: lisanslı, self-host (ibfk.com.tr ile birebir geometrik sans)
// Her ikisi de <html>'e yüklenir; aktif olan globals.css'te --font-body ile seçilir.
const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-montserrat',
  display: 'swap',
})

// BT Geometric 706 — lisanslı, self-host. İki ağırlık: medium (400) + black (700).
const btGeometric706 = localFont({
  src: [
    { path: './fonts/bt-geometric-706-medium.woff2', weight: '400', style: 'normal' },
    { path: './fonts/bt-geometric-706-black.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-bt706',
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
    <html lang="tr" data-theme={club.theme === 'classic' ? 'classic' : 'emerald'} data-font={club.font === 'bt706' ? 'bt706' : 'montserrat'} className={`h-full ${montserrat.variable} ${btGeometric706.variable}`}>
      <body className="min-h-full flex flex-col bg-[#f8faf9] antialiased">
        <ScrollReveal />
        <SiteShell club={club} sponsors={sponsors}>{children}</SiteShell>
      </body>
    </html>
  )
}
