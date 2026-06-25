import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Saira } from 'next/font/google'
import './globals.css'
import SiteShell from '@/components/layout/SiteShell'
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

export const metadata: Metadata = {
  title: {
    default: 'Şanlıurfaspor FK — Resmi Web Sitesi',
    template: '%s | Şanlıurfaspor FK',
  },
  description: 'Şanlıurfaspor Futbol Kulübü resmi web sitesi. Son haberler, kadro, fikstür ve daha fazlası.',
  keywords: ['Şanlıurfaspor', 'futbol', 'süper lig', 'urfa'],
  openGraph: {
    siteName: 'Şanlıurfaspor FK',
    locale: 'tr_TR',
    type: 'website',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [club, sponsors] = await Promise.all([getClubInfo(), getSponsors()])
  return (
    <html lang="tr" className={`${inter.variable} ${sora.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#f8faf9] antialiased">
        <SiteShell club={club} sponsors={sponsors}>{children}</SiteShell>
      </body>
    </html>
  )
}
