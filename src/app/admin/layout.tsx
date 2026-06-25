import type { Metadata } from 'next'
import AdminShell from '@/components/admin/AdminShell'
import { getClubInfo } from '@/lib/supabase/club-server'

export const metadata: Metadata = {
  title: {
    default: 'Admin Panel — Şanlıurfaspor',
    template: '%s | Admin',
  },
  // Arama motorları admin panelini indexlemesin
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const club = await getClubInfo()
  const logoUrl = club.logoUrl && !club.logoUrl.includes('placehold.co') ? club.logoUrl : null
  return <AdminShell logoUrl={logoUrl}>{children}</AdminShell>
}
