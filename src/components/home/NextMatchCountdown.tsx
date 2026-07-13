'use client'

import { useState, useEffect } from 'react'

export interface NextMatchInfo {
  opponent: string
  isHome: boolean
  label?: string | null   // "1. Hafta" / "Play-Off 1. Tur" / rakip turnuva
  date: string | null     // ISO; yoksa tarih henüz açıklanmadı
  time?: string
}

function calc(target: string) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now())
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  }
}
const pad = (n?: number) => String(n ?? 0).padStart(2, '0')

export default function NextMatchCountdown({ match }: { match: NextMatchInfo | null }) {
  const target = match?.date
    ? `${match.date}T${match.time && /^\d{1,2}:\d{2}$/.test(match.time) ? match.time : '00:00'}:00`
    : null
  const [t, setT] = useState<ReturnType<typeof calc> | null>(null)

  useEffect(() => {
    if (!target) return
    const tick = () => setT(calc(target))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  if (!match) {
    return (
      <div className="flex items-center gap-2.5">
        <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#7aab8e]">Sıradaki Maç</span>
        <span className="text-sm font-bold text-ugreenm bg-[#f5f9f6] border border-[#ddeae2] rounded-lg px-3 py-1.5">
          Maç bulunmuyor
        </span>
      </div>
    )
  }

  // Maç künyesi: rakip + iç saha/deplasman + hafta/etiket
  const meta = (
    <div className="min-w-0">
      <p className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-[#8a6d00] mb-0.5">Sıradaki Maç</p>
      <p className="text-[15px] font-extrabold text-ugreenm leading-tight truncate">
        {match.isHome ? '' : '@ '}{match.opponent}
      </p>
      <p className="text-[10px] font-bold text-[#7aab8e] mt-0.5">
        {match.isHome ? 'İç Saha' : 'Deplasman'}{match.label ? ` · ${match.label}` : ''}
      </p>
    </div>
  )

  // Tarih yoksa geri sayım yerine "Tarih yakında" rozeti
  if (!target) {
    return (
      <div className="flex items-center gap-3.5">
        {meta}
        <span className="shrink-0 text-[11px] font-extrabold text-ugreend bg-ugold/90 rounded-lg px-3 py-2 leading-tight text-center">
          Tarih<br />yakında
        </span>
      </div>
    )
  }

  const boxes: [string, number | undefined][] = [
    ['GÜN', t?.d], ['SAAT', t?.h], ['DK', t?.m], ['SN', t?.s],
  ]
  return (
    <div className="flex items-center gap-3.5">
      {meta}
      <div className="flex items-start gap-1.5 shrink-0">
        {boxes.map(([label, val], i) => (
          <div key={label} className="flex items-start gap-1.5">
            <div className="text-center">
              <div className="font-heading text-2xl md:text-3xl font-extrabold text-ugreen tabular-nums leading-none w-9">{pad(val)}</div>
              <div className="text-[8px] font-extrabold tracking-wide uppercase text-[#7aab8e] mt-1">{label}</div>
            </div>
            {i < boxes.length - 1 && <span className="text-xl md:text-2xl font-extrabold text-ugold leading-none">:</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
