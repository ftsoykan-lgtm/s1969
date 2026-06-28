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
      {/* ── Takvim kartı (premium · sarı-yeşil) ──────────────────── */}
      <div className="rounded-3xl overflow-hidden bg-white ring-1 ring-[#d2e5da] shadow-[0_28px_60px_-28px_rgba(15,74,40,0.5)]">
        {/* Başlık (yeşil · premium) */}
        <div className="relative bg-gradient-to-br from-ugreens via-ugreen to-ugreend px-4 sm:px-7 py-5 sm:py-7 flex items-center justify-between overflow-hidden">
          <span aria-hidden className="pointer-events-none absolute -top-8 right-8 font-heading text-[7rem] font-extrabold text-white/[0.05] leading-none select-none hidden sm:block">{cur.y}</span>
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-ugold/60 to-transparent" />
          <button onClick={() => canPrev && setCurK((k) => k - 1)} disabled={!canPrev} aria-label="Önceki ay"
            className="relative h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center rounded-full text-white bg-white/10 ring-1 ring-white/15 hover:bg-ugold hover:text-ugreend hover:ring-ugold transition-all disabled:opacity-25 disabled:hover:bg-white/10 disabled:hover:text-white">
            <ChevronLeft size={19} />
          </button>
          <div className="relative text-center">
            <p className="text-ugold text-[10px] sm:text-[11px] font-extrabold tracking-[0.35em] uppercase mb-1">Maç Takvimi</p>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white leading-none uppercase tracking-[-0.02em]">{AYLAR[cur.m]} <span className="text-ugold">{cur.y}</span></h2>
          </div>
          <button onClick={() => canNext && setCurK((k) => k + 1)} disabled={!canNext} aria-label="Sonraki ay"
            className="relative h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center rounded-full text-white bg-white/10 ring-1 ring-white/15 hover:bg-ugold hover:text-ugreend hover:ring-ugold transition-all disabled:opacity-25 disabled:hover:bg-white/10 disabled:hover:text-white">
            <ChevronRight size={19} />
          </button>
        </div>

        {/* Gün başlıkları */}
        <div className="grid grid-cols-7 bg-[#f3f9f5] border-b border-[#e3efe8]">
          {GUNLER.map((g, i) => (
            <div key={g} className={`py-2 sm:py-2.5 text-center text-[9px] sm:text-[11px] font-extrabold tracking-wide uppercase ${i >= 5 ? 'text-ugoldd' : 'text-[#7aab8e]'}`}>{g}</div>
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
              <div className={`group/cell relative h-full p-1.5 sm:p-2 flex flex-col transition-all overflow-hidden ${
                m ? 'bg-gradient-to-b from-[#f4faf0] to-[#e9f7ee] hover:to-[#dcf2e3] cursor-pointer' : 'bg-white hover:bg-[#f8faf9]'
              } ${isToday ? 'ring-2 ring-inset ring-ugold/55' : ''}`}>
                {m && <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-ugold to-ugreen" />}
                <span className={`text-[10px] sm:text-xs font-extrabold self-start ${
                  isToday ? 'flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-ugold text-ugreend shadow-sm' : m ? 'text-ugreend' : 'text-[#b6cdc0]'
                }`}>{d}</span>
                {m && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-1 min-h-0">
                    <div className="relative h-7 w-7 sm:h-10 sm:w-10 bg-white rounded-lg p-1 ring-1 ring-ugold/40 shadow-[0_5px_12px_-4px_rgba(15,74,40,0.4)] transition-transform group-hover/cell:scale-105">
                      <img src={m.opponentLogo} alt={m.opponent} className="w-full h-full object-contain" />
                    </div>
                    {m.isCompleted && m.homeScore != null ? (
                      <span className={`text-[9px] sm:text-[11px] font-extrabold tabular-nums px-1.5 py-0.5 rounded-md leading-none ${r === 'G' ? 'bg-ugreen text-white' : r === 'M' ? 'bg-[#d01b2a] text-white' : 'bg-ugold text-ugreend'}`}>{m.homeScore}-{m.awayScore}</span>
                    ) : (
                      <span className="hidden sm:block text-[10px] font-extrabold text-ugreen tabular-nums">{m.time || (m.isHome ? 'EV' : 'DEP')}</span>
                    )}
                  </div>
                )}
                {dayMatches.length > 1 && <span className="absolute top-1 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-ugold text-ugreend text-[8px] font-extrabold">+{dayMatches.length - 1}</span>}
              </div>
            )
            return (
              <div key={i} className="aspect-square sm:aspect-[1.1] border-b border-r border-[#eef5f0] overflow-hidden">
                {m && m.macId ? <Link href={`/mac/${m.macId}`} className="block h-full">{cell}</Link> : cell}
              </div>
            )
          })}
        </div>

        {/* Sonuç renk lejantı */}
        <div className="flex items-center justify-center flex-wrap gap-x-5 gap-y-1.5 px-4 py-3 bg-[#f7fbf8] border-t border-[#eef5f0]">
          {[
            { c: 'bg-ugreen', t: 'Galibiyet' },
            { c: 'bg-ugold', t: 'Beraberlik' },
            { c: 'bg-[#d01b2a]', t: 'Mağlubiyet' },
            { c: 'bg-ugold ring-2 ring-ugold/30', t: 'Bugün' },
          ].map((l) => (
            <span key={l.t} className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[#7aab8e]">
              <span className={`w-2.5 h-2.5 rounded-full ${l.c}`} />{l.t}
            </span>
          ))}
        </div>

        {/* Bu ayın maç listesi */}
        {monthMatches.length > 0 && (
          <div className="px-2.5 sm:px-5 py-4 space-y-1.5 bg-[#fafdfb]">
            <p className="text-[10px] font-extrabold tracking-widest uppercase text-[#7aab8e] mb-2 px-1">Bu Ay {monthMatches.length} Maç</p>
            {monthMatches.map((m, idx) => {
              const r = result(m)
              const [, mmStr, dd] = m.date.split('-')
              const shortMonth = AYLAR[Number(mmStr) - 1]?.slice(0, 3) ?? ''
              const inner = (
                <div className="relative flex items-center gap-3 pl-4 pr-3 py-3 rounded-xl bg-white border border-[#edf7f2] hover:border-ugreen/40 hover:shadow-[0_10px_26px_-16px_rgba(15,74,40,0.4)] transition-all overflow-hidden">
                  <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-ugold to-ugreen" />
                  <div className="flex flex-col items-center justify-center w-12 shrink-0 leading-none">
                    <span className="text-2xl font-extrabold text-ugreend tabular-nums">{Number(dd)}</span>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-ugoldd mt-1">{shortMonth}</span>
                  </div>
                  <span className="w-px self-stretch bg-[#edf7f2] shrink-0" />
                  <div className="relative h-10 w-10 shrink-0 bg-white rounded-lg p-1 ring-1 ring-ugold/30 shadow-sm"><img src={m.opponentLogo} alt="" className="w-full h-full object-contain" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-extrabold text-ugreenm truncate">{m.isHome ? '🏠 ' : '✈️ '}{m.opponent}</p>
                    <p className="text-[11px] text-[#7aab8e] truncate">{m.time ? `${m.time} · ` : ''}{m.roundLabel ?? ''}{m.venue ? ` · ${m.venue}` : ''}</p>
                  </div>
                  {m.isCompleted && m.homeScore != null ? (
                    <span className={`shrink-0 text-sm font-extrabold tabular-nums px-2 py-0.5 rounded-lg ${r === 'G' ? 'bg-ugreen text-white' : r === 'M' ? 'bg-[#d01b2a] text-white' : 'bg-ugold text-ugreend'}`}>{m.homeScore}-{m.awayScore}</span>
                  ) : (
                    <span className="shrink-0 text-[10px] font-extrabold text-ugreend bg-ugold px-2 py-1 rounded-md uppercase">{m.isHome ? 'Ev' : 'Dep'}</span>
                  )}
                </div>
              )
              return m.macId ? <Link key={idx} href={`/mac/${m.macId}`} className="block">{inner}</Link> : <div key={idx}>{inner}</div>
            })}
          </div>
        )}
      </div>

      {/* ── Senkronizasyon kartı (bilgilendirici · özel) ─────────── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-ugreend via-[#15592f] to-ugreens text-white shadow-[0_20px_50px_-22px_rgba(9,45,24,0.6)]">
        {/* dekor */}
        <div className="pointer-events-none absolute -top-20 -right-16 w-72 h-72 rounded-full bg-ugold/10 blur-[90px]" />
        <div className="pointer-events-none absolute top-6 right-6 font-heading text-[7rem] font-extrabold text-white/[0.03] leading-none select-none hidden sm:block">ŞFK</div>
        <div className="h-1 bg-gradient-to-r from-ugold via-ugreen to-ugold" />

        <div className="relative p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ugold text-ugreend shadow-lg shrink-0">
              <CalendarPlus size={22} />
            </span>
            <div>
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold leading-tight">Maç Takvimini Telefonuna Ekle</h3>
              <p className="text-ugold/70 text-[11px] font-extrabold tracking-widest uppercase">Bir kez ekle · sürekli güncel</p>
            </div>
          </div>

          <p className="text-white/65 text-sm leading-relaxed max-w-2xl mb-6">
            Bu kart, Şanlıurfaspor&apos;un <span className="text-white font-semibold">tüm maçlarını telefonunun takvimine</span> (iPhone, Google, Outlook) tek dokunuşla ekler.
            Maçlar otomatik takvimine düşer; TFF fikstürü değiştiğinde (saat değişimi, erteleme) <span className="text-ugold">takvimin de kendiliğinden güncellenir</span> — elle bir şey yapmana gerek kalmaz.
          </p>

          {/* Nasıl çalışır — 3 adım */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7">
            {[
              { n: '1', icon: Smartphone, t: 'Takvime Ekle', d: 'Aşağıdaki butonla telefon takvimine abone ol.' },
              { n: '2', icon: Bell, t: 'Maçlar Düşer', d: 'Tüm maçlar tarih ve saatiyle takvimine gelir.' },
              { n: '3', icon: RefreshCw, t: 'Güncel Kalır', d: 'Fikstür değişince takvimin otomatik güncellenir.' },
            ].map((s) => (
              <div key={s.n} className="relative rounded-2xl bg-white/[0.06] border border-white/10 p-4">
                <span className="absolute top-3 right-3 font-heading text-2xl font-extrabold text-white/15">{s.n}</span>
                <s.icon size={20} className="text-ugold mb-2.5" />
                <p className="text-sm font-extrabold text-white">{s.t}</p>
                <p className="text-[12px] text-white/50 leading-snug mt-1">{s.d}</p>
              </div>
            ))}
          </div>

          {/* Butonlar */}
          <div className="flex flex-wrap gap-2.5">
            <a href={webcal || '/takvim.ics'} className="inline-flex items-center gap-2 bg-ugold text-ugreend font-extrabold text-[13px] px-5 py-3 rounded-full hover:brightness-105 transition-all shadow-lg shadow-ugold/20">
              <CalendarPlus size={16} /> iPhone / Apple Takvim
            </a>
            <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white font-extrabold text-[13px] px-5 py-3 rounded-full hover:bg-white/15 transition-all">
              <CalendarPlus size={16} /> Google Takvim
            </a>
            <a href="/takvim.ics" download className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white font-extrabold text-[13px] px-5 py-3 rounded-full hover:bg-white/15 transition-all">
              <Download size={16} /> .ics İndir
            </a>
            <button onClick={copyLink} className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white font-extrabold text-[13px] px-5 py-3 rounded-full hover:bg-white/15 transition-all">
              {copied ? <Check size={16} className="text-ugold" /> : <Copy size={16} />} {copied ? 'Kopyalandı' : 'Linki Kopyala'}
            </button>
          </div>
          <p className="text-white/30 text-[11px] mt-4 flex items-center gap-1.5"><MapPin size={11} /> {league}{season ? ` · ${season}` : ''}</p>
        </div>
      </div>
    </div>
  )
}
