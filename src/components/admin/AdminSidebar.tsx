'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { useState } from 'react'
import {
  LayoutDashboard, Newspaper, Users, Image,
  LogOut, ChevronRight, Settings, Star,
  FolderOpen, FileText
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navGroups = [
  {
    label: 'GENEL',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'İÇERİK',
    items: [
      { label: 'Haberler', href: '/admin/haberler', icon: Newspaper },
      { label: 'Kategoriler', href: '/admin/kategoriler', icon: FolderOpen },
      { label: 'Sayfalar', href: '/admin/sayfalar', icon: FileText },
    ],
  },
  {
    label: 'KULÜP',
    items: [
      { label: 'Kadro & Oyuncular', href: '/admin/kadro', icon: Users },
      { label: 'Sponsorlar', href: '/admin/sponsorlar', icon: Star },
      { label: 'Takım Logoları', href: '/admin/logolar', icon: Image },
    ],
  },
  {
    label: 'SİSTEM',
    items: [
      { label: 'Site Ayarları', href: '/admin/ayarlar', icon: Settings },
    ],
  },
]

export default function AdminSidebar({ logoUrl }: { logoUrl?: string | null }) {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogout = async () => {
    setLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const isActive = (item: { href: string; exact?: boolean }) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + '/')

  return (
    <aside className="w-56 shrink-0 bg-[#103f2e] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          {logoUrl ? (
            <img src={logoUrl} alt="" className="h-9 w-9 rounded-full object-contain bg-white ring-1 ring-[#f5c400]/30 shadow-md shrink-0" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5c400] text-[#103f2e] font-black text-base shadow-md shrink-0">Ş</div>
          )}
          <div className="min-w-0">
            <p className="text-white font-black text-[13px] leading-tight truncate uppercase">Şanlıurfaspor</p>
            <p className="text-[#f5c400]/40 text-[9px] font-bold tracking-[0.15em] uppercase">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-4 space-y-4 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[9px] font-black tracking-[0.18em] text-white/25 px-2.5 mb-1.5">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item)
                return (
                  <Link key={item.href} href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-2.5 py-2 rounded-xl text-[12px] font-bold transition-all duration-150 group',
                      active ? 'bg-[#f5c400] text-[#103f2e]' : 'text-white/55 hover:text-white hover:bg-white/8'
                    )}>
                    <item.icon size={14} className={active ? 'text-[#103f2e]' : 'opacity-60 group-hover:opacity-100'} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {active && <ChevronRight size={11} className="opacity-50 shrink-0" />}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2.5 pb-4 pt-3 border-t border-white/8 space-y-0.5">
        <a href="/" target="_blank"
          className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-[12px] font-bold text-white/35 hover:text-white/70 hover:bg-white/6 transition-all">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 shrink-0">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Siteyi Görüntüle
        </a>
        <button onClick={handleLogout} disabled={loggingOut}
          className="flex items-center gap-2 w-full px-2.5 py-2 rounded-xl text-[12px] font-bold text-white/35 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut size={13} className="shrink-0" />
          {loggingOut ? 'Çıkılıyor...' : 'Çıkış Yap'}
        </button>
      </div>
    </aside>
  )
}
