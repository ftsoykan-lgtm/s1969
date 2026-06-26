'use client'

import { useState, useEffect } from 'react'

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

export default function NextMatchCountdown({ target }: { target: string | null }) {
  const [t, setT] = useState<ReturnType<typeof calc> | null>(null)

  useEffect(() => {
    if (!target) return
    const tick = () => setT(calc(target))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  if (!target) {
    return (
      <div className="flex items-center gap-2.5">
        <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[#7aab8e]">Sıradaki Maç</span>
        <span className="text-sm font-bold text-ugreenm bg-[#f5f9f6] border border-[#ddeae2] rounded-lg px-3 py-1.5">
          Maç bulunmuyor
        </span>
      </div>
    )
  }

  const boxes: [string, number | undefined][] = [
    ['GÜN', t?.d], ['SAAT', t?.h], ['DAKİKA', t?.m], ['SANİYE', t?.s],
  ]

  return (
    <div className="flex items-center gap-3">
      <span className="hidden md:block text-[11px] font-black tracking-[0.2em] uppercase text-[#7aab8e] leading-tight text-right">
        Sıradaki<br />Maç
      </span>
      <div className="flex items-start gap-1.5">
        {boxes.map(([label, val], i) => (
          <div key={label} className="flex items-start gap-1.5">
            <div className="text-center">
              <div className="font-heading text-2xl md:text-3xl font-black text-ugreen tabular-nums leading-none w-9">{pad(val)}</div>
              <div className="text-[8px] font-black tracking-wide uppercase text-[#7aab8e] mt-1">{label}</div>
            </div>
            {i < boxes.length - 1 && <span className="text-xl md:text-2xl font-black text-ugold leading-none">:</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
