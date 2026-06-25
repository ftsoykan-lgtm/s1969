'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, CalendarPlus, Download, Copy, Check } from 'lucide-react'

export interface CalMatch {
  date: string
  time: string
  macId: string | null
  opponent: string
  opponentLogo: string
  isHome: boolean
  isCompleted: boolean
  homeScore: number | null
  awayScore: number | null
  homeTeam: string
  awayTeam: string
  roundLabel: string | null
  venue: string
}

const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
const GUNLER = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

export default function CalendarView({ items, season, league }: { items: CalMatch[]; season?: string; league?: string }) {
  // Maçları tarihe göre indeksle
  const byDate = new Map<string, CalMatch[]>()
  for (const m of items) {
    const arr = byDate.get(m.date) ?? []
    arr.push(m); byDate.set(m.date, arr)
  }

  // Başlangıç ayı: ilk yaklaşan maçın ayı, yoksa bugün
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const firstUpcoming = items.find((m) => m.date >= todayStr) ?? items[items.length - 1]
  const init = firstUpcoming ? new Date(firstUpcoming.date) : today
  const [cur, setCur] = useState({ y: init.getFullYear(), m: init.getMonth() })

  const [webcal, setWebcal] = useState('')
  const [ics, setIcs] = useState('/takvim.ics')
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    const host = window.location.host
    setWebcal(`webcal://${host}/takvim.ics`)
    setIcs(`${window.location.origin}/takvim.ics`)
  }, [])

  // Ay grid (Pazartesi başlangıç)
  const firstDay = new Date(cur.y, cur.m, 1)
  const startWd = (firstDay.getDay() + 6) % 7 // Pzt=0
  const daysInMonth = new Date(cur.y, cur.m + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(startWd).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const dateStr = (d: number) => `${cur.y}-${String(cur.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  const prev = () => setCur(({ y, m }) => m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 })
  const next = () => setCur(({ y, m }) => m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 })

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(ics); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
  }
  const googleUrl = webcal ? `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcal)}` : '#'

  const result = (m: CalMatch) => {
    if (!m.isCompleted || m.homeScore == null || m.awayScore == null) return null
    const us = m.isHome ? m.homeScore : m.awayScore
    const them = m.isHome ? m.awayScore : m.homeScore
    return us > them ? 'G' : us < them ? 'M' : 'B'
  }

  return (
    <div className="space-y-8">
      {/* Takvim kartı */}
      <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm overflow-hidden">
        {/* Ay başlığı */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#edf7f2]">
          <button onClick={prev} aria-label="Önceki ay" className="h-10 w-10 flex items-center justify-center rounded-full text-[#0f4a28] hover:bg-[#f5f9f6] transition-colors"><ChevronLeft size={20} /></button>
          <h2 className="font-heading text-xl md:text-2xl font-black text-[#092d18]">{AYLAR[cur.m]} {cur.y}</h2>
          <button onClick={next} aria-label="Sonraki ay" className="h-10 w-10 flex items-center justify-center rounded-full text-[#0f4a28] hover:bg-[#f5f9f6] transition-colors"><ChevronRight size={20} /></button>
        </div>

        {/* Gün başlıkları */}
        <div className="grid grid-cols-7 border-b border-[#edf7f2]">
          {GUNLER.map((g) => (
            <div key={g} className="py-2.5 text-center text-[10px] sm:text-xs font-black tracking-wide uppercase text-[#7aab8e]">{g}</div>
          ))}
        </div>

        {/* Günler */}
        <div className="grid grid-cols-7">
          {cells.map((d, i) => {
            if (d === null) return <div key={i} className="aspect-square sm:aspect-[1.1] border-b border-r border-[#f1f7f3] bg-[#fafdfb]" />
            const ds = dateStr(d)
            const dayMatches = byDate.get(ds) ?? []
            const isToday = ds === todayStr
            const m = dayMatches[0]
            const r = m ? result(m) : null

            const inner = (
              <div className={`relative h-full p-1.5 sm:p-2 flex flex-col ${m ? 'bg-[#f5fbf7] hover:bg-[#edf7f2] cursor-pointer' : ''} transition-colors`}>
                <span className={`text-[11px] sm:text-xs font-bold ${isToday ? 'flex h-5 w-5 items-center justify-center rounded-full bg-[#FFD100] text-[#0f4a28]' : 'text-[#3d6b52]'}`}>{d}</span>
                {m && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-0.5 min-h-0">
                    <div className="relative h-7 w-7 sm:h-9 sm:w-9">
                      <img src={m.opponentLogo} alt={m.opponent} className="w-full h-full object-contain" />
                    </div>
                    {m.isCompleted && m.homeScore != null ? (
                      <span className={`text-[9px] sm:text-[10px] font-black tabular-nums ${r === 'G' ? 'text-[#1A6B3C]' : r === 'M' ? 'text-[#d01b2a]' : 'text-[#7aab8e]'}`}>{m.homeScore}-{m.awayScore}</span>
                    ) : (
                      <span className="text-[8px] sm:text-[9px] font-black text-[#7aab8e] tabular-nums">{m.time || (m.isHome ? 'EV' : 'DEP')}</span>
                    )}
                    {dayMatches.length > 1 && <span className="text-[7px] text-[#7aab8e]">+{dayMatches.length - 1}</span>}
                  </div>
                )}
              </div>
            )
            return (
              <div key={i} className="aspect-square sm:aspect-[1.1] border-b border-r border-[#f1f7f3] overflow-hidden">
                {m && m.macId ? <Link href={`/mac/${m.macId}`} className="block h-full">{inner}</Link> : inner}
              </div>
            )
          })}
        </div>
      </div>

      {/* Senkronizasyon kartı */}
      <div className="bg-gradient-to-br from-[#0f4a28] to-[#092d18] rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#FFD100]/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <CalendarPlus size={18} className="text-[#FFD100]" />
            <h3 className="font-heading text-xl font-black">Takvimi Senkronize Et</h3>
          </div>
          <p className="text-white/55 text-sm max-w-xl mb-5">
            Tüm maçları telefonunun takvimine ekle. TFF fikstürü değiştiğinde (saat/tarih/erteleme) telefonundaki takvim de <span className="text-[#FFD100]/80">otomatik güncellenir</span>.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <a href={webcal || '/takvim.ics'}
              className="inline-flex items-center gap-2 bg-[#FFD100] text-[#0f4a28] font-black text-[13px] px-5 py-3 rounded-full hover:brightness-105 transition-all">
              <CalendarPlus size={16} /> iPhone / Apple Takvim
            </a>
            <a href={googleUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white font-black text-[13px] px-5 py-3 rounded-full hover:bg-white/15 transition-all">
              <CalendarPlus size={16} /> Google Takvim
            </a>
            <a href="/takvim.ics" download
              className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white font-black text-[13px] px-5 py-3 rounded-full hover:bg-white/15 transition-all">
              <Download size={16} /> .ics İndir
            </a>
            <button onClick={copyLink}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white font-black text-[13px] px-5 py-3 rounded-full hover:bg-white/15 transition-all">
              {copied ? <Check size={16} className="text-[#FFD100]" /> : <Copy size={16} />} {copied ? 'Kopyalandı' : 'Linki Kopyala'}
            </button>
          </div>
          <p className="text-white/35 text-[11px] mt-4">
            {league}{season ? ` · ${season}` : ''} · Abonelik linki: <span className="text-white/50">{ics}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
