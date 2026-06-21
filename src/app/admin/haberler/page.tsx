import { newsData } from '@/data/news'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function AdminHaberlerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#092d18]">Haberler</h1>
          <p className="text-sm text-[#3d6b52] mt-1">{newsData.length} haber</p>
        </div>
        <Link href="/admin/haberler/yeni"
          className="inline-flex items-center gap-2 bg-[#1A6B3C] hover:bg-[#0f4a28] text-white font-black px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
          <Plus size={15} /> Yeni Haber
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_120px_100px] gap-4 px-6 py-3 bg-[#f5f9f6] border-b border-[#ddeae2] text-[10px] font-black tracking-widest uppercase text-[#7aab8e]">
          <span>Başlık</span>
          <span>Kategori</span>
          <span>Tarih</span>
          <span className="text-right">İşlemler</span>
        </div>
        {newsData.map((item) => (
          <div key={item.id} className="grid grid-cols-[1fr_120px_120px_100px] gap-4 items-center px-6 py-4 border-b border-[#edf7f2] last:border-0 hover:bg-[#f5f9f6] transition-colors group">
            <div>
              <p className="text-sm font-bold text-[#092d18] truncate">{item.title}</p>
              <p className="text-xs text-[#7aab8e] truncate mt-0.5">{item.excerpt}</p>
            </div>
            <span className="inline-flex self-start items-center bg-[#edf7f2] text-[#1A6B3C] text-[10px] font-black px-2.5 py-1 rounded-full">{item.category}</span>
            <span className="text-xs text-[#3d6b52]">{formatDate(item.date)}</span>
            <div className="flex items-center gap-1.5 justify-end">
              <Link href={`/haberler/${item.slug}`} target="_blank"
                className="p-1.5 text-[#7aab8e] hover:text-[#1A6B3C] hover:bg-[#edf7f2] rounded-lg transition-all">
                <Eye size={14} />
              </Link>
              <button className="p-1.5 text-[#7aab8e] hover:text-[#d4ad00] hover:bg-[#FFD100]/10 rounded-lg transition-all">
                <Pencil size={14} />
              </button>
              <button className="p-1.5 text-[#7aab8e] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
