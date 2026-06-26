'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, CalendarPlus, Download, Copy, Check, MapPin, Bell, RefreshCw, Smartphone } from 'lucide-react'

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
      {/* ── Takvim kartı (açık · sarı-yeşil) ─────────────────────── */}
      <div className="rounded-3xl overflow-hidden bg-white ring-1 ring-[#d2e5da] shadow-[0_18px_45px_-22px_rgba(15,74,40,0.35)]">
        {/* Başlık (yeşil) */}
        <div className="relative bg-gradient-to-r from-[#1A6B3C] to-[#15592f] px-4 sm:px-7 py-4 sm:py-5 flex items-center justify-between">
          <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFD100]/70 to-transparent" />
          <button onClick={() => canPrev && setCurK((k) => k - 1)} disabled={!canPrev} aria-label="Önceki ay"
            className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full text-white bg-white/15 hover:bg-[#FFD100] hover:text-[#0f4a28] transition-all disabled:opacity-25 disabled:hover:bg-white/15 disabled:hover:text-white">
            <ChevronLeft size={18} />
          </button>
          <div className="text-center">
            <h2 className="font-heading text-xl sm:text-3xl font-black text-white leading-none uppercase tracking-tight">{AYLAR[cur.m]}</h2>
            <p className="text-[#FFD100] text-[10px] sm:text-xs font-black tracking-[0.3em] mt-1">{cur.y}</p>
          </div>
          <button onClick={() => canNext && setCurK((k) => k + 1)} disabled={!canNext} aria-label="Sonraki ay"
            className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full text-white bg-white/15 hover:bg-[#FFD100] hover:text-[#0f4a28] transition-all disabled:opacity-25 disabled:hover:bg-white/15 disabled:hover:text-white">
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Gün başlıkları */}
        <div className="grid grid-cols-7 bg-[#f3f9f5] border-b border-[#e3efe8]">
          {GUNLER.map((g, i) => (
            <div key={g} className={`py-2 sm:py-2.5 text-center text-[9px] sm:text-[11px] font-black tracking-wide uppercase ${i >= 5 ? 'text-[#d4ad00]' : 'text-[#7aab8e]'}`}>{g}</div>
          ))}
        </div>

        {/* Günler */}
        <div className="grid grid-cols-7">
          {cells.map((d, i) => {
            if (d === null) return <div key={i} className="aspect-square sm:aspect-[1.1] border-b border-r border-[#eef5f0] bg-[#fafdfb]" />
            const ds = dateStr(d)
            const dayMatches = byDate.get(ds) ?? []
            const isToday = ds === todayStr
            const m = dayMatches[0]
            const r = m ? result(m) : null

            const cell = (
              <div className={`relative h-full p-1 sm:p-2 flex flex-col transition-colors overflow-hidden ${
                m ? 'bg-[#f4faf0] hover:bg-[#ecf7e6] cursor-pointer' : 'bg-white hover:bg-[#f8faf9]'
              }`}>
                {m && <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FFD100] to-[#1A6B3C]" />}
                <span className={`text-[10px] sm:text-xs font-black self-start ${
                  isToday ? 'flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-[#FFD100] text-[#0f4a28]' : m ? 'text-[#0f4a28]' : 'text-[#b6cdc0]'
                }`}>{d}</span>
                {m && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-0.5 min-h-0">
                    <div className="relative h-6 w-6 sm:h-9 sm:w-9 bg-white rounded-md sm:rounded-lg p-0.5 shadow-sm ring-1 ring-[#FFD100]/30">
                      <img src={m.opponentLogo} alt={m.opponent} className="w-full h-full object-contain" />
                    </div>
                    {m.isCompleted && m.homeScore != null ? (
                      <span className={`text-[8px] sm:text-[11px] font-black tabular-nums ${r === 'G' ? 'text-[#1A6B3C]' : r === 'M' ? 'text-[#d01b2a]' : 'text-[#d4ad00]'}`}>{m.homeScore}-{m.awayScore}</span>
                    ) : (
                      <span className="hidden sm:block text-[10px] font-black text-[#1A6B3C] tabular-nums">{m.time || (m.isHome ? 'EV' : 'DEP')}</span>
                    )}
                  </div>
                )}
                {dayMatches.length > 1 && <span className="absolute top-0.5 right-1 text-[7px] sm:text-[8px] font-black text-[#d4ad00]">+{dayMatches.length - 1}</span>}
              </div>
            )
            return (
              <div key={i} className="aspect-square sm:aspect-[1.1] border-b border-r border-[#eef5f0] overflow-hidden">
                {m && m.macId ? <Link href={`/mac/${m.macId}`} className="block h-full">{cell}</Link> : cell}
              </div>
            )
          })}
        </div>

        {/* Bu ayın maç listesi */}
        {monthMatches.length > 0 && (
          <div className="px-2.5 sm:px-5 py-4 space-y-1.5 bg-[#fafdfb]">
            <p className="text-[10px] font-black tracking-widest uppercase text-[#7aab8e] mb-2 px-1">Bu Ay {monthMatches.length} Maç</p>
            {monthMatches.map((m, idx) => {
              const r = result(m)
              const [, , dd] = m.date.split('-')
              const inner = (
                <div className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl bg-white border border-[#edf7f2] hover:border-[#1A6B3C]/30 hover:shadow-sm transition-all">
                  <div className="flex flex-col items-center w-9 shrink-0">
                    <span className="text-base font-black text-[#0f4a28] tabular-nums leading-none">{Number(dd)}</span>
                    <span className="text-[9px] font-bold text-[#d4ad00]">{m.time || '—'}</span>
                  </div>
                  <div className="relative h-8 w-8 shrink-0"><img src={m.opponentLogo} alt="" className="w-full h-full object-contain" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-[#15532f] truncate">{m.isHome ? '🏠 ' : '✈️ '}{m.opponent}</p>
                    <p className="text-[11px] text-[#7aab8e] truncate">{m.roundLabel ?? ''}{m.venue ? ` · ${m.venue}` : ''}</p>
                  </div>
                  {m.isCompleted && m.homeScore != null ? (
                    <span className={`shrink-0 text-sm font-black tabular-nums px-2 py-0.5 rounded-lg ${r === 'G' ? 'bg-[#1A6B3C] text-white' : r === 'M' ? 'bg-[#d01b2a] text-white' : 'bg-[#FFD100] text-[#0f4a28]'}`}>{m.homeScore}-{m.awayScore}</span>
                  ) : (
                    <span className="shrink-0 text-[10px] font-black text-[#0f4a28] bg-[#FFD100] px-2 py-1 rounded-md uppercase">{m.isHome ? 'Ev' : 'Dep'}</span>
                  )}
                </div>
              )
              return m.macId ? <Link key={idx} href={`/mac/${m.macId}`} className="block">{inner}</Link> : <div key={idx}>{inner}</div>
            })}
          </div>
        )}
      </div>

      {/* ── Senkronizasyon kartı (bilgilendirici · özel) ─────────── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0f4a28] via-[#15592f] to-[#176437] text-white shadow-[0_20px_50px_-22px_rgba(9,45,24,0.6)]">
        {/* dekor */}
        <div className="pointer-events-none absolute -top-20 -right-16 w-72 h-72 rounded-full bg-[#FFD100]/10 blur-[90px]" />
        <div className="pointer-events-none absolute top-6 right-6 font-heading text-[7rem] font-black text-white/[0.03] leading-none select-none hidden sm:block">ŞFK</div>
        <div className="h-1 bg-gradient-to-r from-[#FFD100] via-[#1A6B3C] to-[#FFD100]" />

        <div className="relative p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFD100] text-[#0f4a28] shadow-lg shrink-0">
              <CalendarPlus size={22} />
            </span>
            <div>
              <h3 className="font-heading text-xl sm:text-2xl font-black leading-tight">Maç Takvimini Telefonuna Ekle</h3>
              <p className="text-[#FFD100]/70 text-[11px] font-black tracking-widest uppercase">Bir kez ekle · sürekli güncel</p>
            </div>
          </div>

          <p className="text-white/65 text-sm leading-relaxed max-w-2xl mb-6">
            Bu kart, Şanlıurfaspor&apos;un <span className="text-white font-semibold">tüm maçlarını telefonunun takvimine</span> (iPhone, Google, Outlook) tek dokunuşla ekler.
            Maçlar otomatik takvimine düşer; TFF fikstürü değiştiğinde (saat değişimi, erteleme) <span className="text-[#FFD100]">takvimin de kendiliğinden güncellenir</span> — elle bir şey yapmana gerek kalmaz.
          </p>

          {/* Nasıl çalışır — 3 adım */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7">
            {[
              { n: '1', icon: Smartphone, t: 'Takvime Ekle', d: 'Aşağıdaki butonla telefon takvimine abone ol.' },
              { n: '2', icon: Bell, t: 'Maçlar Düşer', d: 'Tüm maçlar tarih ve saatiyle takvimine gelir.' },
              { n: '3', icon: RefreshCw, t: 'Güncel Kalır', d: 'Fikstür değişince takvimin otomatik güncellenir.' },
            ].map((s) => (
              <div key={s.n} className="relative rounded-2xl bg-white/[0.06] border border-white/10 p-4">
                <span className="absolute top-3 right-3 font-heading text-2xl font-black text-white/15">{s.n}</span>
                <s.icon size={20} className="text-[#FFD100] mb-2.5" />
                <p className="text-sm font-black text-white">{s.t}</p>
                <p className="text-[12px] text-white/50 leading-snug mt-1">{s.d}</p>
              </div>
            ))}
          </div>

          {/* Butonlar */}
          <div className="flex flex-wrap gap-2.5">
            <a href={webcal || '/takvim.ics'} className="inline-flex items-center gap-2 bg-[#FFD100] text-[#0f4a28] font-black text-[13px] px-5 py-3 rounded-full hover:brightness-105 transition-all shadow-lg shadow-[#FFD100]/20">
              <CalendarPlus size={16} /> iPhone / Apple Takvim
            </a>
            <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white font-black text-[13px] px-5 py-3 rounded-full hover:bg-white/15 transition-all">
              <CalendarPlus size={16} /> Google Takvim
            </a>
            <a href="/takvim.ics" download className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white font-black text-[13px] px-5 py-3 rounded-full hover:bg-white/15 transition-all">
              <Download size={16} /> .ics İndir
            </a>
            <button onClick={copyLink} className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white font-black text-[13px] px-5 py-3 rounded-full hover:bg-white/15 transition-all">
              {copied ? <Check size={16} className="text-[#FFD100]" /> : <Copy size={16} />} {copied ? 'Kopyalandı' : 'Linki Kopyala'}
            </button>
          </div>
          <p className="text-white/30 text-[11px] mt-4 flex items-center gap-1.5"><MapPin size={11} /> {league}{season ? ` · ${season}` : ''}</p>
        </div>
      </div>
    </div>
  )
}
