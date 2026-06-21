'use client'

import { useState } from 'react'
import { playersData } from '@/data/players'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Player } from '@/types'

const POSITIONS: Array<Player['position'] | 'Tümü'> = ['Tümü', 'Kaleci', 'Defans', 'Orta Saha', 'Forvet']

export default function AdminKadroPage() {
  const [search, setSearch] = useState('')
  const [pos, setPos] = useState<Player['position'] | 'Tümü'>('Tümü')

  const filtered = playersData.filter(p =>
    (pos === 'Tümü' || p.position === pos) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || String(p.number).includes(search))
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#092d18]">Kadro</h1>
          <p className="text-sm text-[#3d6b52] mt-1">{playersData.length} oyuncu</p>
        </div>
        <Link href="/admin/kadro/yeni"
          className="inline-flex items-center gap-2 bg-[#1A6B3C] hover:bg-[#0f4a28] text-white font-black px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
          <Plus size={15} /> Oyuncu Ekle
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7aab8e]" />
          <input type="search" placeholder="Ad veya forma no ara..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#ddeae2] rounded-xl text-sm text-[#092d18] placeholder-[#7aab8e] focus:outline-none focus:border-[#1A6B3C] transition-colors" />
        </div>
        <div className="flex gap-1">
          {POSITIONS.map(p => (
            <button key={p} onClick={() => setPos(p)}
              className={`px-3 py-2 text-xs font-black rounded-xl transition-all ${pos === p ? 'bg-[#1A6B3C] text-white' : 'bg-white border border-[#ddeae2] text-[#3d6b52] hover:border-[#1A6B3C]/40'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm overflow-hidden">
        <div className="grid grid-cols-[40px_40px_1fr_100px_80px_80px_80px_80px] gap-3 px-5 py-3 bg-[#f5f9f6] border-b border-[#ddeae2] text-[10px] font-black tracking-widest uppercase text-[#7aab8e]">
          <span></span><span>#</span><span>Ad</span><span>Mevki</span>
          <span className="text-center">Maç</span><span className="text-center">Gol</span><span className="text-center">Asist</span>
          <span className="text-right">İşlem</span>
        </div>
        {filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-[#7aab8e]">Oyuncu bulunamadı</div>
        ) : filtered.map((player, i) => (
          <div key={player.id} className={`grid grid-cols-[40px_40px_1fr_100px_80px_80px_80px_80px] gap-3 items-center px-5 py-3 hover:bg-[#f5f9f6] transition-colors ${i < filtered.length - 1 ? 'border-b border-[#edf7f2]' : ''}`}>
            <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-[#edf7f2] shrink-0">
              <Image src={player.imageUrl} alt={player.name} fill sizes="36px" className="object-cover object-top" />
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFD100] text-[#0f4a28] text-[10px] font-black">
              {player.number}
            </div>
            <div>
              <p className="text-sm font-bold text-[#092d18] truncate">{player.name}</p>
              <p className="text-[10px] text-[#7aab8e]">{player.nationality}</p>
            </div>
            <span className="text-xs text-[#3d6b52] font-medium truncate">{player.position}</span>
            <span className="text-sm text-center text-[#092d18]">{player.stats.matches}</span>
            <span className="text-sm text-center font-bold text-[#1A6B3C]">{player.stats.goals}</span>
            <span className="text-sm text-center font-bold text-[#d4ad00]">{player.stats.assists}</span>
            <div className="flex items-center gap-1 justify-end">
              <button className="p-1.5 text-[#7aab8e] hover:text-[#d4ad00] hover:bg-[#FFD100]/10 rounded-lg transition-all"><Pencil size={13} /></button>
              <button className="p-1.5 text-[#7aab8e] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
