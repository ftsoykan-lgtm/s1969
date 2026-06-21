'use client'

import { useState } from 'react'
import { matchesData } from '@/data/fixtures'
import { formatDate } from '@/lib/utils'
import { Plus, Pencil, Check, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Match } from '@/types'

export default function AdminFiksturPage() {
  const [matches, setMatches] = useState<Match[]>(matchesData)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [scores, setScores] = useState<Record<string, { h: string; a: string }>>({})

  const startEdit = (m: Match) => {
    setEditingId(String(m.id))
    setScores(p => ({ ...p, [m.id]: { h: String(m.homeScore ?? ''), a: String(m.awayScore ?? '') } }))
  }

  const saveScore = (id: string) => {
    const s = scores[id]
    setMatches(prev => prev.map(m => String(m.id) === id
      ? { ...m, homeScore: Number(s.h), awayScore: Number(s.a), isCompleted: true }
      : m
    ))
    setEditingId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#092d18]">Fikstür & Sonuçlar</h1>
          <p className="text-sm text-[#3d6b52] mt-1">{matches.length} maç</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/fikstur/puan-tablosu"
            className="inline-flex items-center gap-2 border border-[#ddeae2] text-[#3d6b52] font-black px-4 py-2.5 rounded-xl text-sm hover:bg-[#f5f9f6] transition-colors">
            Puan Tablosu
          </Link>
          <Link href="/admin/fikstur/yeni"
            className="inline-flex items-center gap-2 bg-[#1A6B3C] hover:bg-[#0f4a28] text-white font-black px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
            <Plus size={15} /> Maç Ekle
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm overflow-hidden">
        <div className="grid grid-cols-[100px_1fr_140px_80px] gap-4 px-5 py-3 bg-[#f5f9f6] border-b border-[#ddeae2] text-[10px] font-black tracking-widest uppercase text-[#7aab8e]">
          <span>Tarih</span><span>Maç</span><span className="text-center">Skor</span><span className="text-right">İşlem</span>
        </div>
        {[...matches].reverse().map((match, i) => (
          <div key={match.id} className={`grid grid-cols-[100px_1fr_140px_80px] gap-4 items-center px-5 py-3.5 hover:bg-[#f5f9f6] transition-colors ${i < matches.length - 1 ? 'border-b border-[#edf7f2]' : ''}`}>
            <div>
              <p className="text-xs font-bold text-[#092d18]">{formatDate(match.date)}</p>
              <p className="text-[10px] text-[#7aab8e]">{match.time}</p>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-1.5 flex-1 justify-end">
                <span className="text-xs font-bold text-[#092d18] truncate text-right">{match.homeTeam}</span>
                <div className="relative w-5 h-5 shrink-0">
                  <Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-contain" />
                </div>
              </div>
              <span className="text-[10px] text-[#7aab8e] font-bold shrink-0">vs</span>
              <div className="flex items-center gap-1.5 flex-1">
                <div className="relative w-5 h-5 shrink-0">
                  <Image src={match.awayTeamLogo} alt={match.awayTeam} fill className="object-contain" />
                </div>
                <span className="text-xs font-bold text-[#092d18] truncate">{match.awayTeam}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              {editingId === String(match.id) ? (
                <>
                  <input type="number" min="0" max="20"
                    value={scores[match.id]?.h ?? ''}
                    onChange={e => setScores(p => ({ ...p, [match.id]: { ...p[match.id], h: e.target.value } }))}
                    className="w-12 text-center text-lg font-black text-[#092d18] bg-[#f5f9f6] border border-[#1A6B3C] rounded-lg py-1 focus:outline-none" />
                  <span className="font-black text-[#7aab8e]">—</span>
                  <input type="number" min="0" max="20"
                    value={scores[match.id]?.a ?? ''}
                    onChange={e => setScores(p => ({ ...p, [match.id]: { ...p[match.id], a: e.target.value } }))}
                    className="w-12 text-center text-lg font-black text-[#092d18] bg-[#f5f9f6] border border-[#1A6B3C] rounded-lg py-1 focus:outline-none" />
                </>
              ) : match.isCompleted ? (
                <span className="text-base font-black text-[#092d18]">{match.homeScore} — {match.awayScore}</span>
              ) : (
                <span className="text-xs font-bold text-[#7aab8e] bg-[#f5f9f6] px-2.5 py-1 rounded-full">Planlandı</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 justify-end">
              {editingId === String(match.id) ? (
                <>
                  <button onClick={() => saveScore(String(match.id))}
                    className="p-1.5 text-[#1A6B3C] bg-[#edf7f2] hover:bg-[#1A6B3C] hover:text-white rounded-lg transition-all">
                    <Check size={14} />
                  </button>
                  <button onClick={() => setEditingId(null)}
                    className="p-1.5 text-[#7aab8e] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <X size={14} />
                  </button>
                </>
              ) : (
                <button onClick={() => startEdit(match)}
                  className="p-1.5 text-[#7aab8e] hover:text-[#d4ad00] hover:bg-[#FFD100]/10 rounded-lg transition-all">
                  <Pencil size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
