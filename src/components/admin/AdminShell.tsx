'use client'

import { usePathname } from 'next/navigation'
import AdminSidebar from './AdminSidebar'

export default function AdminShell({ children, logoUrl }: { children: React.ReactNode; logoUrl?: string | null }) {
  const pathname = usePathname()
  const isLogin = pathname === '/admin/login'

  if (isLogin) {
    return (
      <div className="min-h-screen bg-ugreend">
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f9f6] flex">
      <AdminSidebar logoUrl={logoUrl} />
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Admin topbar */}
        <div className="h-14 bg-white border-b border-[#ddeae2] flex items-center px-6 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-ugreen" />
            <span className="text-xs font-bold text-utxt2">Şanlıurfaspor — Yönetim Paneli</span>
          </div>
        </div>
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
