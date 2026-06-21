import { sponsorsData } from '@/data/sponsors'
import { Plus, Pencil, Trash2 } from 'lucide-react'

const TIER_LABEL: Record<string, string> = { ana: 'Ana Sponsor', resmi: 'Resmi Sponsor', destekci: 'Destekçi' }
const TIER_COLOR: Record<string, string> = {
  ana: 'bg-[#FFD100] text-[#092d18]',
  resmi: 'bg-[#edf7f2] text-[#1A6B3C]',
  destekci: 'bg-[#f5f9f6] text-[#3d6b52]',
}

export default function AdminSponsorlarPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#092d18]">Sponsorlar</h1>
          <p className="text-sm text-[#3d6b52] mt-1">{sponsorsData.length} sponsor</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#1A6B3C] hover:bg-[#0f4a28] text-white font-black px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
          <Plus size={15} /> Sponsor Ekle
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm overflow-hidden">
        {sponsorsData.map((s, i) => (
          <div key={s.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-[#f5f9f6] transition-colors ${i < sponsorsData.length - 1 ? 'border-b border-[#edf7f2]' : ''}`}>
            <div className="w-16 h-10 bg-[#f5f9f6] rounded-lg flex items-center justify-center text-[10px] font-black text-[#7aab8e] shrink-0">LOGO</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#092d18]">{s.name}</p>
            </div>
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full shrink-0 ${TIER_COLOR[s.tier] ?? TIER_COLOR.destekci}`}>
              {TIER_LABEL[s.tier] ?? s.tier}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button className="p-1.5 text-[#7aab8e] hover:text-[#d4ad00] hover:bg-[#FFD100]/10 rounded-lg transition-all"><Pencil size={14} /></button>
              <button className="p-1.5 text-[#7aab8e] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
