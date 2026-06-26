'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { label: 'Son Maçlar', href: '/mac-merkezi' },
  { label: 'Tüm Maçlar', href: '/mac-merkezi/gecmis-maclar' },
]

export default function MatchTabs() {
  const pathname = usePathname()
  return (
    <div className="flex items-center gap-1.5 bg-white border border-[#ddeae2] rounded-full p-1.5 shadow-sm w-fit">
      {TABS.map((t) => {
        const active = pathname === t.href
        return (
          <Link key={t.href} href={t.href}
            className={`px-5 py-2.5 rounded-full text-[13px] font-black tracking-wide transition-all ${
              active ? 'bg-[#103f2e] text-white shadow' : 'text-[#356152] hover:bg-[#f5f9f6]'
            }`}>
            {t.label}
          </Link>
        )
      })}
    </div>
  )
}
