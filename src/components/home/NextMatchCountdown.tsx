'use client'

import { useState, useEffect } from 'react'

export interface NextMatchInfo {
  opponent: string
  isHome: boolean
  label?: string | null       // "1. Hafta" / "Play-Off 1. Tur" / rakip turnuva
  date: string | null         // ISO; yoksa tarih henüz açıklanmadı
  time?: string
  opponentLogo?: string | null
  venue?: string | null
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

const TR_MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
function fmtDate(iso: string, time?: string) {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return ''
  const t = time && /^\d{1,2}:\d{2}$/.test(time) ? ` · ${time}` : ''
  return `${+m[3]} ${TR_MONTHS[+m[2] - 1]} ${m[1]}${t}`
}

/* Premium koyu-yeşil marka kartı — tüm durumlar aynı zemini paylaşır */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full sm:w-[330px] overflow-hidden rounded-2xl bg-gradient-to-br from-ugreend to-[#08281a] ring-1 ring-white/10 shadow-[0_24px_48px_-20px_rgba(8,40,26,0.7)] px-5 py-4">
      <div aria-hidden className="pointer-events-none absolute -top-12 -right-10 h-36 w-36 rounded-full bg-ugold/10 blur-2xl" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ugold/50 to-transparent" />
      <div className="relative">{children}</div>
    </div>
  )
}

function Kicker() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold tracking-[0.22em] uppercase text-ugold">
      <span className="h-1.5 w-1.5 rounded-full bg-ugold motion-safe:animate-pulse" />
      Sıradaki Maç
    </span>
  )
}

function Crest({ logo, name }: { logo?: string | null; name: string }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toLocaleUpperCase('tr-TR')
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/15">
      {logo
        ? <img src={logo} alt="" className="h-8 w-8 object-contain" />
        : <span className="text-xs font-extrabold text-white/70">{initials}</span>}
    </div>
  )
}

function Matchup({ match }: { match: NextMatchInfo }) {
  return (
    <div className="flex items-center gap-3">
      <Crest logo={match.opponentLogo} name={match.opponent} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-extrabold leading-tight text-white">{match.opponent}</p>
        <p className="mt-0.5 truncate text-[10px] font-bold text-white/45">
          {match.isHome ? 'İç Saha' : 'Deplasman'}{match.venue ? ` · ${match.venue}` : ''}
        </p>
      </div>
      <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${
        match.isHome ? 'bg-ugold text-ugreend' : 'bg-white/10 text-white/70 ring-1 ring-white/15'
      }`}>
        {match.isHome ? 'Ev' : 'Dep'}
      </span>
    </div>
  )
}

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
      <Card>
        <div className="flex items-center justify-between">
          <Kicker />
        </div>
        <p className="mt-4 text-sm font-bold text-white/70">Yaklaşan maç bulunmuyor</p>
        <p className="mt-1 text-[11px] text-white/40">Fikstür açıklandığında burada görünecek.</p>
      </Card>
    )
  }

  const boxes: [string, number | undefined][] = [
    ['Gün', t?.d], ['Saat', t?.h], ['Dk', t?.m], ['Sn', t?.s],
  ]

  return (
    <Card>
      <div className="mb-3.5 flex items-center justify-between gap-2">
        <Kicker />
        {match.label && (
          <span className="shrink-0 truncate text-[10px] font-extrabold uppercase tracking-wide text-white/45">{match.label}</span>
        )}
      </div>

      <Matchup match={match} />

      {target ? (
        <>
          <p className="mt-3.5 text-[11px] font-extrabold tabular-nums text-ugold/90">{fmtDate(match.date!, match.time)}</p>
          <div className="mt-2 grid grid-cols-4 gap-1.5">
            {boxes.map(([label, val]) => (
              <div key={label} className="rounded-lg bg-white/[0.06] py-2 text-center ring-1 ring-white/10">
                <div className="font-heading text-2xl font-extrabold leading-none text-white tabular-nums">{pad(val)}</div>
                <div className="mt-1 text-[8px] font-extrabold uppercase tracking-wider text-white/40">{label}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-3.5 flex items-center gap-2 rounded-lg bg-ugold/10 px-3 py-2 ring-1 ring-ugold/20">
          <span className="h-1.5 w-1.5 rounded-full bg-ugold" />
          <span className="text-[11px] font-extrabold uppercase tracking-wide text-ugold">Tarih yakında açıklanacak</span>
        </div>
      )}
    </Card>
  )
}
