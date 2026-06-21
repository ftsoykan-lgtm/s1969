'use client'

import { useState, useEffect } from 'react'
import { getTffSquad } from '@/lib/supabase/settings'
import { Search, Loader2, ExternalLink, RefreshCw } from 'lucide-react'

export default function AdminKadroPage() {
  const [squad, setSquad] = useState<{ season: string | null; players: { name: string; tffId: string | null }[] }>({ season: null, players: [] })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getTffSquad().then((s) => { setSquad(s); setLoading(false) })
  }, [])

  const filtered = squad.players.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#092d18]">Kadro</h1>
          <p className="text-sm text-[#3d6b52] mt-1">
            {squad.players.length} oyuncu{squad.season ? ` · ${squad.season}` : ''} · TFF'den otomatik
          </p>
        </div>
      </div>

      {/* Bilgi kutusu */}
      <div className="flex items-start gap-2.5 bg-[#edf7f2] border border-[#1A6B3C]/20 rounded-xl p-4">
        <RefreshCw size={15} className="text-[#1A6B3C] mt-0.5 shrink-0" />
        <p className="text-sm text-[#3d6b52]">
          Kadro her hafta <span className="font-bold text-[#1A6B3C]">TFF'den otomatik</span> çekilir; elle düzenleme gerekmez.
          Numara, mevki ve fotoğraf TFF listesinde yer almadığı için isim bazlı gösterilir.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7aab8e]" />
        <input type="search" placeholder="Oyuncu ara..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#ddeae2] rounded-xl text-sm text-[#092d18] placeholder-[#7aab8e] focus:outline-none focus:border-[#1A6B3C] transition-colors" />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[#7aab8e]"><Loader2 size={14} className="animate-spin" /> Yükleniyor...</div>
      ) : squad.players.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ddeae2] p-10 text-center">
          <p className="text-sm font-bold text-[#092d18]">Kadro henüz senkronize edilmedi</p>
          <p className="text-xs text-[#7aab8e] mt-1">GitHub Actions → "TFF Verisini Güncelle" çalıştığında dolar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm overflow-hidden">
          {filtered.map((p, i) => {
            const initials = p.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toLocaleUpperCase('tr-TR')
            return (
              <div key={`${p.name}-${i}`} className={`flex items-center gap-3 px-5 py-3 hover:bg-[#f5f9f6] transition-colors ${i < filtered.length - 1 ? 'border-b border-[#edf7f2]' : ''}`}>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0f4a28] text-[#FFD100] text-[11px] font-black shrink-0">{initials}</div>
                <span className="flex-1 text-sm font-bold text-[#092d18] truncate">{p.name}</span>
                {p.tffId && (
                  <a href={`https://www.tff.org/Default.aspx?pageId=30&kisiId=${p.tffId}`} target="_blank" rel="noopener noreferrer"
                    className="p-1.5 text-[#7aab8e] hover:text-[#1A6B3C] hover:bg-[#edf7f2] rounded-lg transition-all">
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
