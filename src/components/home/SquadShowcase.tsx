'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import type { CardPlayer } from '@/components/players/PlayerCard'

/* Ana sayfa kadro — öne çıkan oyuncu vitrini (ibfk.com.tr tarzı, yeşil-altın).
   Büyük foto + forma no + isim (2 satır) + mevki + DETAY/TÜM OYUNCULAR;
   arkada dev soyisim filigranı, ‹ › ile gezinme + otomatik geçiş. */

export default function SquadShowcase({ players }: { players: CardPlayer[] }) {
  // Vitrin için fotoğraflı oyuncuları tercih et; hiç yoksa tümü (baş harf yedeği)
  const withPhoto = players.filter((p) => p.photoUrl)
  const list = withPhoto.length >= 1 ? withPhoto : players
  const n = list.length
  const [idx, setIdx] = useState(0)
  const [hover, setHover] = useState(false)

  const go = useCallback((d: number) => setIdx((i) => (((i + d) % n) + n) % n), [n])

  useEffect(() => {
    if (n < 2 || hover) return
    const t = setInterval(() => go(1), 5500)
    return () => clearInterval(t)
  }, [n, hover, go])

  if (!n) return null
  const p = list[idx]
  const parts = p.name.split(' ').filter(Boolean)
  const first = parts[0] ?? p.name
  const rest = parts.slice(1).join(' ')
  const surname = parts.length > 1 ? parts[parts.length - 1] : p.name
  const initials = parts.slice(0, 2).map((w) => w[0]).join('').toLocaleUpperCase('tr-TR')

  return (
    <div
      className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Dev soyisim filigranı */}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-heading text-[26vw] lg:text-[18rem] font-extrabold uppercase leading-none text-white/[0.04] select-none whitespace-nowrap overflow-hidden">
        {surname}
      </span>

      <div className="relative grid lg:grid-cols-[minmax(0,460px)_1fr] items-center gap-8 lg:gap-12 py-4">
        {/* ── Fotoğraf + marka patlaması ── */}
        <div className="relative mx-auto w-full max-w-[420px]">
          <span aria-hidden className="pointer-events-none absolute -inset-3 rounded-[28px] bg-ugold/15 blur-2xl" />
          <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden ring-1 ring-white/12 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.8)]">
            {/* açısal marka patlaması (foto arkası) */}
            <div aria-hidden className="absolute inset-0 bg-[conic-gradient(from_210deg_at_50%_40%,#1b5e44,#f5c400_25%,#ffffff_45%,#1b5e44_70%,#0c2e22_100%)] opacity-90" />
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_120%,rgba(12,46,34,0.85),transparent_60%)]" />
            {p.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.photoUrl} alt={p.name} className="relative h-full w-full object-cover object-top" />
            ) : (
              <span className="relative flex h-full w-full items-center justify-center font-heading text-8xl font-extrabold text-white/25">{initials}</span>
            )}
          </div>
          {/* sayaç */}
          {n > 1 && (
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-ugreendd/80 backdrop-blur px-3 py-1.5 ring-1 ring-white/10">
              <span className="text-[11px] font-extrabold tabular-nums text-ugold">{String(idx + 1).padStart(2, '0')}</span>
              <span className="text-[11px] font-bold text-white/40">/ {String(n).padStart(2, '0')}</span>
            </div>
          )}
        </div>

        {/* ── Künye ── */}
        <div className="relative text-center lg:text-left">
          <div className="flex items-start justify-center lg:justify-start gap-3 sm:gap-5">
            {p.number != null && (
              <span className="font-heading text-6xl sm:text-7xl lg:text-8xl font-extrabold text-ugold leading-[0.85]">{p.number}</span>
            )}
            <div className="min-w-0">
              <h3 className="font-heading font-extrabold uppercase text-white tracking-tight leading-[0.9] text-5xl sm:text-6xl lg:text-7xl">
                <span className="block">{first}</span>
                {rest && <span className="block">{rest}</span>}
              </h3>
              {p.position && (
                <p className="mt-2 font-heading text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-ugoldl">{p.position}</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <Link href={`/oyuncu/${p.slug}`}
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-ugoldl to-ugold text-ugreend font-extrabold text-[13px] tracking-wide uppercase px-6 py-3.5 shadow-[0_12px_28px_-10px_rgba(245,196,0,0.7)] transition-all hover:-translate-y-0.5">
              Detay <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/kadro"
              className="inline-flex items-center gap-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-extrabold text-[13px] tracking-wide uppercase px-6 py-3.5 ring-1 ring-white/15 transition-colors">
              Tüm Oyuncular
            </Link>
          </div>
        </div>
      </div>

      {/* ── Ok navigasyonu ── */}
      {n > 1 && (
        <>
          <button onClick={() => go(-1)} aria-label="Önceki oyuncu"
            className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-white/15 text-white hover:bg-ugold hover:text-ugreend hover:ring-ugold transition-all">
            <ChevronLeft size={22} />
          </button>
          <button onClick={() => go(1)} aria-label="Sonraki oyuncu"
            className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-white/15 text-white hover:bg-ugold hover:text-ugreend hover:ring-ugold transition-all">
            <ChevronRight size={22} />
          </button>
        </>
      )}
    </div>
  )
}
