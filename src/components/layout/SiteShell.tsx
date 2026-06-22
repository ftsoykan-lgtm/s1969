'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import SplashScreen from './SplashScreen'
import SponsorsSection from '@/components/home/SponsorsSection'
import type { ClubInfo } from '@/data/club'
import type { Sponsor } from '@/types'

export default function SiteShell({
  club, sponsors, children,
}: {
  club: ClubInfo
  sponsors: Sponsor[]
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) return <>{children}</>

  return (
    <>
      <SplashScreen club={club} />
      <Navbar club={club} />
      <main className="flex-1">{children}</main>
      <SponsorsSection sponsors={sponsors} />
      <Footer club={club} />
    </>
  )
}
