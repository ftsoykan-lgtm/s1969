import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Saira } from 'next/font/google'
import './globals.css'
import SiteShell from '@/components/layout/SiteShell'
import ScrollReveal from '@/components/layout/ScrollReveal'
import { getClubInfo } from '@/lib/supabase/club-server'
import { getSponsors } from '@/lib/supabase/sponsors-server'

// Gövde fontu — Plus Jakarta Sans (modern, okunaklı)
const inter = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

// Başlıklar için endüstriyel/DIN tarzı display fontu — Saira (URW DIN Black benzeri)
const sora = Saira({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-display',
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
    <html lang="tr" data-theme={club.theme === 'classic' ? 'classic' : 'emerald'} className={`${inter.variable} ${sora.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#f8faf9] antialiased">
        <ScrollReveal />
        <SiteShell club={club} sponsors={sponsors}>{children}</SiteShell>
      </body>
    </html>
  )
}
