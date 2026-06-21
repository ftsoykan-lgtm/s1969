'use client'

import { useState } from 'react'
import { standingsData } from '@/data/fixtures'
import { clubInfo } from '@/data/club'
import { Save, Plus, Trash2 } from 'lucide-react'
import type { StandingRow } from '@/types'

// Bir satırın bizim kulübümüz olup olmadığını isimden otomatik anla
const bizMiyiz = (team: string) =>
  team.toLocaleLowerCase('tr-TR').includes('urfaspor') ||
  team.toLocaleLowerCase('tr-TR').includes(clubInfo.name.toLocaleLowerCase('tr-TR'))

export default function AdminPuanTablosuPage() {
  const [rows, setRows] = useState<StandingRow[]>(standingsData)
  const [saved, setSaved] = useState(false)

  const update = (rank: number, key: keyof StandingRow, value: string | number) => {
    setRows(prev => prev.map(r => r.rank === rank ? { ...r, [key]: value } : r))
    setSaved(false)
  }

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 400))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addRow = () => {
    const newRank = Math.max(0, ...rows.map(r => r.rank)) + 1
    setRows(prev => [...prev, {
      rank: newRank, team: 'Yeni Takım', teamLogo: 'https://placehold.co/20x20/ddeae2/7aab8e?text=T',
      played: 0, won: 0, drawn: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0, isCurrentTeam: false
    }])
  }

  const removeRow = (rank: number) => setRows(prev => prev.filter(r => r.rank !== rank))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#092d18]">Puan Tablosu</h1>
          <p className="text-sm text-[#3d6b52] mt-1">{rows.length} takım · {clubInfo.league} {clubInfo.group}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={addRow}
            className="inline-flex items-center gap-2 border border-[#ddeae2] text-[#3d6b52] font-black px-4 py-2.5 rounded-xl text-sm hover:bg-[#f5f9f6] transition-colors">
            <Plus size={15} /> Takım Ekle
          </button>
          <button onClick={handleSave}
            className={`inline-flex items-center gap-2 font-black px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm ${saved ? 'bg-[#edf7f2] text-[#1A6B3C]' : 'bg-[#1A6B3C] hover:bg-[#0f4a28] text-white'}`}>
            <Save size={15} />
            {saved ? 'Kaydedildi ✓' : 'Kaydet'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm overflow-hidden">
        <div className="grid grid-cols-[40px_1fr_60px_60px_60px_60px_64px_44px] gap-2 px-4 py-3 bg-[#f5f9f6] border-b border-[#ddeae2] text-[10px] font-black tracking-widest uppercase text-[#7aab8e]">
          <span>#</span><span>Takım</span><span className="text-center">O</span>
          <span className="text-center">G</span><span className="text-center">B</span><span className="text-center">M</span>
          <span className="text-center text-[#1A6B3C]">Puan</span><span></span>
        </div>
        {rows.map((row) => {
          const biz = bizMiyiz(row.team)
          return (
            <div key={row.rank} className={`grid grid-cols-[40px_1fr_60px_60px_60px_60px_64px_44px] gap-2 items-center px-4 py-2.5 border-b border-[#edf7f2] last:border-0 ${biz ? 'bg-[#edf7f2] border-l-4 border-l-[#1A6B3C]' : ''}`}>
              <span className="text-xs font-black text-[#7aab8e]">{row.rank}</span>
              <div className="flex items-center gap-2 min-w-0">
                <input value={row.team} onChange={e => update(row.rank, 'team', e.target.value)}
                  className={`text-sm bg-transparent border-b border-transparent hover:border-[#ddeae2] focus:border-[#1A6B3C] focus:outline-none transition-colors px-1 py-0.5 w-full ${biz ? 'font-black text-[#1A6B3C]' : 'font-bold text-[#092d18]'}`} />
                {biz && <span className="shrink-0 text-[9px] font-black bg-[#1A6B3C] text-white px-1.5 py-0.5 rounded-full">BİZ</span>}
              </div>
              {(['played','won','drawn','lost','points'] as const).map(k => (
                <input key={k} type="number" min="0" value={row[k] ?? 0} onChange={e => update(row.rank, k, Number(e.target.value))}
                  className={`text-center text-sm rounded-lg bg-transparent border border-transparent hover:border-[#ddeae2] focus:border-[#1A6B3C] focus:outline-none py-1 transition-colors ${k === 'points' ? 'font-black text-[#1A6B3C]' : 'text-[#3d6b52]'}`} />
              ))}
              <button onClick={() => removeRow(row.rank)} className="p-1.5 text-[#7aab8e] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all justify-self-center">
                <Trash2 size={13} />
              </button>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-[#7aab8e]">
        Kulübümüz (<span className="font-bold text-[#1A6B3C]">{clubInfo.name}</span>) puan tablosunda otomatik olarak <span className="font-bold">BİZ</span> etiketiyle işaretlenir.
      </p>
    </div>
  )
}
