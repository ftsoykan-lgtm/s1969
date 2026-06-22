import type { Metadata } from 'next'
import { Inter, Sora } from 'next/font/google'
import './globals.css'
import SiteShell from '@/components/layout/SiteShell'
import { getClubInfo } from '@/lib/supabase/club-server'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

// Başlıklar için karakterli display fontu
const sora = Sora({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
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
  const club = await getClubInfo()
  return (
    <html lang="tr" className={`${inter.variable} ${sora.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#f8faf9] antialiased">
        <SiteShell club={club}>{children}</SiteShell>
      </body>
    </html>
  )
}
