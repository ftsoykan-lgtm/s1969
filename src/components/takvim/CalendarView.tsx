'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, CalendarPlus, Download, Copy, Check, MapPin } from 'lucide-react'

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
  const byDate = useMemo(() => {
    const map = new Map<string, CalMatch[]>()
    for (const m of items) { const arr = map.get(m.date) ?? []; arr.push(m); map.set(m.date, arr) }
    return map
  }, [items])

  const { minK, maxK } = useMemo(() => {
    const keys = items.map((m) => { const [y, mo] = m.date.split('-').map(Number); return y * 12 + (mo - 1) })
    return keys.length ? { minK: Math.min(...keys), maxK: Math.max(...keys) } : { minK: 0, maxK: 0 }
  }, [items])

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const initK = useMemo(() => {
    const upcoming = items.filter((m) => m.date >= todayStr).sort((a, b) => a.date.localeCompare(b.date))[0]
    const ref = upcoming ?? items[items.length - 1]
    if (!ref) return today.getFullYear() * 12 + today.getMonth()
    const [y, mo] = ref.date.split('-').map(Number)
    return Math.min(Math.max(y * 12 + (mo - 1), minK), maxK)
  }, [items, minK, maxK]) // eslint-disable-line react-hooks/exhaustive-deps

  const [curK, setCurK] = useState(initK)
  useEffect(() => { setCurK(initK) }, [initK])
  const cur = { y: Math.floor(curK / 12), m: curK % 12 }
  const canPrev = curK > minK
  const canNext = curK < maxK

  const [ics, setIcs] = useState('/takvim.ics')
  const [webcal, setWebcal] = useState('')
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    setWebcal(`webcal://${window.location.host}/takvim.ics`)
    setIcs(`${window.location.origin}/takvim.ics`)
  }, [])

  const firstDay = new Date(cur.y, cur.m, 1)
  const startWd = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(cur.y, cur.m + 1, 0).getDate()
  const cells: (number | null)[] = [...Array(startWd).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  while (cells.length % 7 !== 0) cells.push(null)

  const dateStr = (d: number) => `${cur.y}-${String(cur.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  const copyLink = async () => { try { await navigator.clipboard.writeText(ics); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {} }
  const googleUrl = webcal ? `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcal)}` : '#'

  const result = (m: CalMatch) => {
    if (!m.isCompleted || m.homeScore == null || m.awayScore == null) return null
    const us = m.isHome ? m.homeScore : m.awayScore
    const them = m.isHome ? m.awayScore : m.homeScore
    return us > them ? 'G' : us < them ? 'M' : 'B'
  }

  const monthMatches = items
    .filter((m) => { const [y, mo] = m.date.split('-').map(Number); return y === cur.y && mo - 1 === cur.m })
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="space-y-7">
      {/* ── Takvim kartı (koyu/premium) ──────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden shadow-[0_25px_60px_-20px_rgba(9,45,24,0.6)] ring-1 ring-[#FFD100]/10 bg-gradient-to-br from-[#0c3a23] via-[#0a3320] to-[#08240f]">
        {/* atmosfer */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#1A6B3C]/30 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#FFD100]/[0.05] blur-[90px]" />
        {/* üst altın hat */}
        <div className="h-1 bg-gradient-to-r from-[#1A6B3C] via-[#FFD100] to-[#1A6B3C]" />

        <div className="relative">
          {/* Ay başlığı */}
          <div className="flex items-center justify-between px-5 sm:px-7 py-5">
            <button onClick={() => canPrev && setCurK((k) => k - 1)} disabled={!canPrev} aria-label="Önceki ay"
              className="h-11 w-11 flex items-center justify-center rounded-full text-white bg-white/[0.07] border border-white/10 hover:bg-[#FFD100] hover:text-[#0f4a28] hover:border-[#FFD100] transition-all disabled:opacity-20 disabled:hover:bg-white/[0.07] disabled:hover:text-white">
              <ChevronLeft size={20} />
            </button>
            <div className="text-center">
              <h2 className="font-heading text-2xl md:text-3xl font-black text-white leading-none uppercase tracking-tight">{AYLAR[cur.m]}</h2>
              <p className="text-[#FFD100] text-xs font-black tracking-[0.3em] mt-1.5">{cur.y}</p>
            </div>
            <button onClick={() => canNext && setCurK((k) => k + 1)} disabled={!canNext} aria-label="Sonraki ay"
              className="h-11 w-11 flex items-center justify-center rounded-full text-white bg-white/[0.07] border border-white/10 hover:bg-[#FFD100] hover:text-[#0f4a28] hover:border-[#FFD100] transition-all disabled:opacity-20 disabled:hover:bg-white/[0.07] disabled:hover:text-white">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Gün başlıkları */}
          <div className="grid grid-cols-7 px-2 sm:px-3">
            {GUNLER.map((g, i) => (
              <div key={g} className={`py-2.5 text-center text-[10px] sm:text-[11px] font-black tracking-wide uppercase ${i >= 5 ? 'text-[#FFD100]/80' : 'text-white/40'}`}>{g}</div>
            ))}
          </div>

          {/* Günler */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 px-2 sm:px-3 pb-3">
            {cells.map((d, i) => {
              if (d === null) return <div key={i} className="aspect-square sm:aspect-[1.05] rounded-xl sm:rounded-2xl bg-white/[0.015]" />
              const ds = dateStr(d)
              const dayMatches = byDate.get(ds) ?? []
              const isToday = ds === todayStr
              const m = dayMatches[0]
              const r = m ? result(m) : null

              const cell = (
                <div className={`relative h-full rounded-xl sm:rounded-2xl p-1.5 sm:p-2 flex flex-col transition-all ${
                  m
                    ? 'bg-gradient-to-b from-[#1A6B3C]/55 to-[#0f4a28]/40 ring-1 ring-[#FFD100]/30 hover:ring-[#FFD100]/70 hover:shadow-[0_8px_20px_-6px_rgba(255,209,0,0.3)] hover:-translate-y-0.5 cursor-pointer'
                    : 'bg-white/[0.03] hover:bg-white/[0.06]'
                }`}>
                  <span className={`text-[11px] sm:text-xs font-black self-start ${
                    isToday ? 'flex h-5 w-5 items-center justify-center rounded-full bg-[#FFD100] text-[#0f4a28]' : m ? 'text-white' : 'text-white/30'
                  }`}>{d}</span>
                  {m && (
                    <div className="flex-1 flex flex-col items-center justify-center gap-0.5 min-h-0">
                      <div className="relative h-7 w-7 sm:h-9 sm:w-9 bg-white rounded-lg p-0.5 shadow-md ring-1 ring-black/10">
                        <img src={m.opponentLogo} alt={m.opponent} className="w-full h-full object-contain" />
                      </div>
                      {m.isCompleted && m.homeScore != null ? (
                        <span className={`text-[9px] sm:text-[11px] font-black tabular-nums ${r === 'G' ? 'text-[#FFD100]' : r === 'M' ? 'text-red-300' : 'text-white/70'}`}>{m.homeScore}-{m.awayScore}</span>
                      ) : (
                        <span className="text-[8px] sm:text-[10px] font-black text-[#FFD100]/90 tabular-nums">{m.time || (m.isHome ? 'EV' : 'DEP')}</span>
                      )}
                    </div>
                  )}
                  {dayMatches.length > 1 && <span className="absolute top-1 right-1.5 text-[8px] font-black text-[#FFD100]">+{dayMatches.length - 1}</span>}
                </div>
              )
              return (
                <div key={i} className="aspect-square sm:aspect-[1.05]">
                  {m && m.macId ? <Link href={`/mac/${m.macId}`} className="block h-full">{cell}</Link> : cell}
                </div>
              )
            })}
          </div>

          {/* Bu ayın maç listesi */}
          {monthMatches.length > 0 && (
            <div className="border-t border-white/10 px-3 sm:px-5 py-4 space-y-1">
              <p className="text-[10px] font-black tracking-widest uppercase text-[#FFD100]/60 mb-2 px-1">Bu Ay {monthMatches.length} Maç</p>
              {monthMatches.map((m, idx) => {
                const r = result(m)
                const [, , dd] = m.date.split('-')
                const inner = (
                  <div className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors">
                    <div className="flex flex-col items-center w-9 shrink-0">
                      <span className="text-base font-black text-white tabular-nums leading-none">{Number(dd)}</span>
                      <span className="text-[9px] font-bold text-[#FFD100]/70">{m.time || '—'}</span>
                    </div>
                    <div className="relative h-7 w-7 shrink-0 bg-white rounded-md p-0.5"><img src={m.opponentLogo} alt="" className="w-full h-full object-contain" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black text-white truncate">{m.isHome ? '🏠 ' : '✈️ '}{m.opponent}</p>
                      <p className="text-[11px] text-white/45 truncate">{m.roundLabel ?? ''}{m.venue ? ` · ${m.venue}` : ''}</p>
                    </div>
                    {m.isCompleted && m.homeScore != null ? (
                      <span className={`shrink-0 text-sm font-black tabular-nums px-2 py-0.5 rounded-lg ${r === 'G' ? 'bg-[#FFD100] text-[#0f4a28]' : r === 'M' ? 'bg-red-500 text-white' : 'bg-white/15 text-white'}`}>{m.homeScore}-{m.awayScore}</span>
                    ) : (
                      <span className="shrink-0 text-[10px] font-black text-[#FFD100]/70 uppercase">{m.isHome ? 'Ev' : 'Dep'}</span>
                    )}
                  </div>
                )
                return m.macId ? <Link key={idx} href={`/mac/${m.macId}`} className="block">{inner}</Link> : <div key={idx}>{inner}</div>
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Senkronizasyon kartı ─────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-[#cbe0d4] shadow-[0_12px_40px_-18px_rgba(15,74,40,0.25)] p-6 md:p-8 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <CalendarPlus size={18} className="text-[#1A6B3C]" />
          <h3 className="font-heading text-xl font-black text-[#092d18]">Takvimi Senkronize Et</h3>
        </div>
        <p className="text-[#3d6b52] text-sm max-w-xl mb-5">
          Tüm maçları telefonunun takvimine ekle. TFF fikstürü değiştiğinde (saat/tarih/erteleme) telefonundaki takvim de <span className="text-[#1A6B3C] font-bold">otomatik güncellenir</span>.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <a href={webcal || '/takvim.ics'} className="inline-flex items-center gap-2 bg-[#0f4a28] text-white font-black text-[13px] px-5 py-3 rounded-full hover:bg-[#1A6B3C] transition-all">
            <CalendarPlus size={16} /> iPhone / Apple Takvim
          </a>
          <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#FFD100] text-[#0f4a28] font-black text-[13px] px-5 py-3 rounded-full hover:brightness-105 transition-all">
            <CalendarPlus size={16} /> Google Takvim
          </a>
          <a href="/takvim.ics" download className="inline-flex items-center gap-2 bg-[#f5f9f6] border border-[#ddeae2] text-[#092d18] font-black text-[13px] px-5 py-3 rounded-full hover:bg-[#edf7f2] transition-all">
            <Download size={16} /> .ics İndir
          </a>
          <button onClick={copyLink} className="inline-flex items-center gap-2 bg-[#f5f9f6] border border-[#ddeae2] text-[#092d18] font-black text-[13px] px-5 py-3 rounded-full hover:bg-[#edf7f2] transition-all">
            {copied ? <Check size={16} className="text-[#1A6B3C]" /> : <Copy size={16} />} {copied ? 'Kopyalandı' : 'Linki Kopyala'}
          </button>
        </div>
        <p className="text-[#7aab8e] text-[11px] mt-4 flex items-center gap-1.5"><MapPin size={11} /> {league}{season ? ` · ${season}` : ''}</p>
      </div>
    </div>
  )
}
