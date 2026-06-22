import { createClient as createServerClient } from '@/lib/supabase/server'
import { Newspaper, Users, FileText, Star, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

const stats = [
  { label: 'Haberler', value: 'Yönet', icon: Newspaper, href: '/admin/haberler', color: 'bg-[#edf7f2] text-[#1A6B3C]' },
  { label: 'Kadro', value: 'Yönet', icon: Users, href: '/admin/kadro', color: 'bg-[#FFD100]/15 text-[#d4ad00]' },
  { label: 'Sayfalar', value: 'Yönet', icon: FileText, href: '/admin/sayfalar', color: 'bg-[#edf7f2] text-[#1A6B3C]' },
  { label: 'Sponsorlar', value: 'Yönet', icon: Star, href: '/admin/sponsorlar', color: 'bg-[#FFD100]/15 text-[#d4ad00]' },
]

const quickLinks = [
  { label: 'Yeni Haber Ekle', href: '/admin/haberler/yeni', color: 'bg-[#1A6B3C] text-white' },
  { label: 'Sayfa Düzenle', href: '/admin/sayfalar', color: 'bg-[#FFD100] text-[#092d18]' },
  { label: 'Oyuncu Güncelle', href: '/admin/kadro', color: 'border border-[#ddeae2] text-[#092d18]' },
]

export default async function AdminDashboard() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#092d18]">Dashboard</h1>
        <p className="text-sm text-[#3d6b52] mt-1">Hoş geldiniz, <span className="font-bold">{user?.email}</span></p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}
            className="group bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-5 hover:shadow-md hover:border-[#1A6B3C]/30 transition-all">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl mb-3 ${s.color}`}>
              <s.icon size={18} />
            </div>
            <p className="text-2xl font-black text-[#092d18]">{s.value}</p>
            <p className="text-xs text-[#7aab8e] font-semibold mt-0.5">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6">
        <h2 className="text-sm font-black text-[#092d18] mb-4 uppercase tracking-wide">Hızlı İşlemler</h2>
        <div className="flex flex-wrap gap-3">
          {quickLinks.map((q) => (
            <Link key={q.label} href={q.href}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all hover:scale-105 ${q.color}`}>
              {q.label}
              <ArrowUpRight size={13} />
            </Link>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-[#edf7f2] border border-[#1A6B3C]/20 rounded-2xl p-6">
        <h2 className="text-sm font-black text-[#1A6B3C] mb-2">Maç Merkezi otomatik</h2>
        <p className="text-sm text-[#3d6b52]">Fikstür, sonuçlar, puan durumu ve maç kadroları her gün TFF'den otomatik çekilir — elle girişe gerek yoktur. Diğer tüm içerik (haberler, kadro, sayfalar, sponsorlar, ayarlar) bu panelden yönetilir.</p>
      </div>
    </div>
  )
}
