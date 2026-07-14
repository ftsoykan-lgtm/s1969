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

/* Geri sayım karoları — açık/kurumsal kart için (açık zemin, koyu rakam).
   İlk render (SSR) "00" gösterir; mount sonrası saniye saniye güncellenir. */
export default function CountdownTiles({ target }: { target: string }) {
  const [t, setT] = useState<ReturnType<typeof calc> | null>(null)

  useEffect(() => {
    const tick = () => setT(calc(target))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  const boxes: [string, number | undefined][] = [
    ['Gün', t?.d], ['Saat', t?.h], ['Dk', t?.m], ['Sn', t?.s],
  ]
  return (
    <div className="grid grid-cols-4 gap-2">
      {boxes.map(([label, val]) => (
        <div key={label} className="rounded-xl bg-[#f5f9f6] py-2.5 text-center ring-1 ring-[#e6efe9]">
          <div className="font-heading text-2xl md:text-3xl font-extrabold leading-none text-ugreenm tabular-nums">{pad(val)}</div>
          <div className="mt-1.5 text-[9px] font-extrabold uppercase tracking-wider text-[#7aab8e]">{label}</div>
        </div>
      ))}
    </div>
  )
}
