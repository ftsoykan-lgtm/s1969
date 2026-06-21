'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import type { ClubInfo } from '@/data/club'

export default function SiteShell({ club, children }: { club: ClubInfo; children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) return <>{children}</>

  return (
    <>
      <Navbar club={club} />
      <main className="flex-1">{children}</main>
      <Footer club={club} />
    </>
  )
}
