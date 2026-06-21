import { Plus, Pencil, Trash2 } from 'lucide-react'

const members = [
  { name: 'Ahmet Yılmaz', role: 'Başkan', since: '2021' },
  { name: 'Mehmet Kaya', role: 'Başkan Yardımcısı', since: '2021' },
  { name: 'Fatma Demir', role: 'Genel Sekreter', since: '2023' },
  { name: 'Ali Çelik', role: 'Mali İşler', since: '2021' },
  { name: 'Hasan Öztürk', role: 'Teknik Direktör', since: '2024' },
  { name: 'Kemal Arslan', role: 'Sportif Direktör', since: '2022' },
]

export default function AdminYonetimPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#092d18]">Yönetim Kurulu</h1>
          <p className="text-sm text-[#3d6b52] mt-1">{members.length} üye</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#1A6B3C] hover:bg-[#0f4a28] text-white font-black px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
          <Plus size={15} /> Üye Ekle
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm overflow-hidden">
        {members.map((m, i) => (
          <div key={m.name} className={`flex items-center gap-4 px-5 py-4 hover:bg-[#f5f9f6] transition-colors ${i < members.length - 1 ? 'border-b border-[#edf7f2]' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-[#edf7f2] flex items-center justify-center text-[11px] font-black text-[#1A6B3C] shrink-0">
              {m.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#092d18]">{m.name}</p>
              <p className="text-xs text-[#7aab8e]">{m.role} · {m.since}'dan beri</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="p-1.5 text-[#7aab8e] hover:text-[#d4ad00] hover:bg-[#FFD100]/10 rounded-lg transition-all"><Pencil size={14} /></button>
              <button className="p-1.5 text-[#7aab8e] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
