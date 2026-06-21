import { Plus, X } from 'lucide-react'

const tags = ['Transfer', 'Maç', 'Kulüp', 'Taraftar', 'Sponsor', 'Altyapı', 'Süper Lig', 'Kupa', 'Milli Takım', 'Sağlık']

export default function AdminEtiketlerPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-[#092d18]">Etiketler</h1>
      </div>
      <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6">
        <div className="flex gap-2 mb-6">
          <input type="text" placeholder="Yeni etiket..."
            className="flex-1 bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-2.5 text-sm text-[#092d18] placeholder-[#7aab8e] focus:outline-none focus:border-[#1A6B3C] transition-colors" />
          <button className="inline-flex items-center gap-2 bg-[#1A6B3C] hover:bg-[#0f4a28] text-white font-black px-4 py-2.5 rounded-xl text-sm transition-colors">
            <Plus size={15} /> Ekle
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1.5 bg-[#edf7f2] text-[#1A6B3C] text-sm font-bold px-3 py-1.5 rounded-full">
              {tag}
              <button className="text-[#1A6B3C]/50 hover:text-red-500 transition-colors">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
