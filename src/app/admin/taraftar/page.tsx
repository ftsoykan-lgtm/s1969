import { Plus } from 'lucide-react'

export default function AdminTaraftarPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#092d18]">Taraftar İçeriği</h1>
          <p className="text-sm text-[#3d6b52] mt-1">Taraftar duyuruları ve içerikleri</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#1A6B3C] hover:bg-[#0f4a28] text-white font-black px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
          <Plus size={15} /> Duyuru Ekle
        </button>
      </div>
      <div className="bg-[#edf7f2] border border-[#1A6B3C]/20 rounded-2xl p-6">
        <p className="text-sm font-black text-[#1A6B3C] mb-1">Yakında</p>
        <p className="text-sm text-[#3d6b52]">Taraftar duyuruları, üyelik bilgileri ve stat haritası yönetimi bu bölümden yapılacak.</p>
      </div>
    </div>
  )
}
