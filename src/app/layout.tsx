import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SiteShell from '@/components/layout/SiteShell'
import { getClubInfo } from '@/lib/supabase/club-server'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
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
    <html lang="tr" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#f8faf9] antialiased">
        <SiteShell club={club}>{children}</SiteShell>
      </body>
    </html>
  )
}
