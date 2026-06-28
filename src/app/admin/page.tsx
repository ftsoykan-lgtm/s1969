import { createClient as createServerClient } from '@/lib/supabase/server'
import { Newspaper, Users, FileText, Star, FolderOpen, Image as ImageIcon, Settings, ArrowUpRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'

async function count(table: string): Promise<number | null> {
  try {
    const supabase = await createServerClient()
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true })
    return error ? null : (count ?? 0)
  } catch { return null }
}

export default async function AdminDashboard() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [haberler, oyuncular, sayfalar, sponsorlar] = await Promise.all([
    count('news'), count('player_profiles'), count('site_pages'), count('sponsors'),
  ])
  const fmt = (n: number | null) => (n === null ? '—' : String(n))

  const stats = [
    { label: 'Haberler', value: fmt(haberler), icon: Newspaper, href: '/admin/haberler', color: 'bg-[#edf7f2] text-ugreen' },
    { label: 'Oyuncular', value: fmt(oyuncular), icon: Users, href: '/admin/kadro', color: 'bg-ugold/15 text-ugoldd' },
    { label: 'Sayfalar', value: fmt(sayfalar), icon: FileText, href: '/admin/sayfalar', color: 'bg-[#edf7f2] text-ugreen' },
    { label: 'Sponsorlar', value: fmt(sponsorlar), icon: Star, href: '/admin/sponsorlar', color: 'bg-ugold/15 text-ugoldd' },
  ]

  const sections = [
    { label: 'Haberler', desc: 'Haber ekle, düzenle, story', href: '/admin/haberler', icon: Newspaper },
    { label: 'Kategoriler', desc: 'Haber kategorileri', href: '/admin/kategoriler', icon: FolderOpen },
    { label: 'Sayfalar', desc: 'Kulüp, tesisler, kurumsal sayfalar', href: '/admin/sayfalar', icon: FileText },
    { label: 'Kadro & Oyuncular', desc: 'Oyuncu profilleri, sezon', href: '/admin/kadro', icon: Users },
    { label: 'Sponsorlar', desc: 'Ana / resmi / destekçi', href: '/admin/sponsorlar', icon: Star },
    { label: 'Takım Logoları', desc: 'Rakip + turnuva logoları', href: '/admin/logolar', icon: ImageIcon },
    { label: 'Site Ayarları', desc: 'Kulüp bilgileri, SEO, video', href: '/admin/ayarlar', icon: Settings },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-ugreenm">Dashboard</h1>
        <p className="text-sm text-utxt2 mt-1">Hoş geldiniz, <span className="font-bold">{user?.email}</span></p>
      </div>

      {/* Sayımlar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}
            className="group bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-5 hover:shadow-md hover:border-ugreen/30 transition-all">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl mb-3 ${s.color}`}>
              <s.icon size={18} />
            </div>
            <p className="text-2xl font-extrabold text-ugreenm tabular-nums">{s.value}</p>
            <p className="text-xs text-[#7aab8e] font-semibold mt-0.5">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Hızlı işlemler */}
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/haberler" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-extrabold bg-ugreen text-white hover:bg-ugreend transition-colors">Yeni Haber Ekle <ArrowUpRight size={13} /></Link>
        <Link href="/admin/kadro" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-extrabold bg-ugold text-ugreenm hover:brightness-105 transition-all">Kadroyu Güncelle <ArrowUpRight size={13} /></Link>
        <Link href="/admin/sayfalar" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-extrabold border border-[#ddeae2] text-ugreenm hover:bg-[#f5f9f6] transition-colors">Sayfa Düzenle <ArrowUpRight size={13} /></Link>
      </div>

      {/* Yönetim bölümleri */}
      <div>
        <h2 className="text-xs font-extrabold tracking-widest uppercase text-[#7aab8e] mb-3">Yönetim</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sections.map((s) => (
            <Link key={s.href} href={s.href}
              className="group flex items-center gap-3.5 bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-4 hover:shadow-md hover:border-ugreen/30 transition-all">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf7f2] text-ugreen shrink-0">
                <s.icon size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-ugreenm">{s.label}</p>
                <p className="text-[11px] text-[#7aab8e] truncate">{s.desc}</p>
              </div>
              <ArrowRight size={15} className="text-[#cfe3d8] group-hover:text-ugreen transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Otomatik içerik bilgisi */}
      <div className="bg-[#edf7f2] border border-ugreen/20 rounded-2xl p-6">
        <h2 className="text-sm font-extrabold text-ugreen mb-2">Maç Merkezi & Kadro otomatik</h2>
        <p className="text-sm text-utxt2">Fikstür, sonuçlar, puan durumu, maç kadroları ve oyuncu profilleri her gün TFF'den otomatik çekilir. Manuel girdiğin bilgiler (foto, biyografi, açıklama) korunur. Diğer tüm içerik bu panelden yönetilir.</p>
      </div>
    </div>
  )
}
