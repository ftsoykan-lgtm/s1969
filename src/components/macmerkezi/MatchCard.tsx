'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Calendar } from 'lucide-react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { Match } from '@/types'
import { competitionLogo } from '@/lib/tff'
import { useMounted } from '@/lib/use-mounted'

/* Tarih + saat → "24.08.2025 19:00" */
function tarihSaat(dateISO: string, time?: string): string {
  if (!dateISO) return time || ''
  const [y, m, d] = dateISO.split('-')
  const g = d && m && y ? `${d}.${m}.${y}` : dateISO
  return time ? `${g} · ${time}` : g
}

type ResultKind = 'G' | 'M' | 'B'

/* Sonuca göre canlı tema — üst aksan + rozet + yumuşak zemin tonu */
const THEME: Record<ResultKind, { label: string; bar: string; pill: string; tint: string }> = {
  G: { label: 'Galibiyet', bar: 'from-ugreen to-ugreend', pill: 'bg-ugreen text-white', tint: 'from-ugreen/[0.07]' },
  M: { label: 'Mağlubiyet', bar: 'from-[#d01b2a] to-[#9c1320]', pill: 'bg-[#d01b2a] text-white', tint: 'from-[#d01b2a]/[0.06]' },
  B: { label: 'Beraberlik', bar: 'from-ugold to-[#d6a915]', pill: 'bg-ugold text-ugreend', tint: 'from-ugold/[0.10]' },
}
const NEUTRAL_BAR = 'from-ugold via-ugreen to-ugreend'

const easeOut = (p: number) => 1 - Math.pow(1 - p, 3)

/* Görünüme girince 0'dan gerçek skora sayan rakam.
   SSR + ilk paint nihai değeri gösterir (hydration güvenli); animasyon başlangıcı
   state yerine ref'te tutulur → ekstra render / set-state-in-effect yok, flash yok.
   Erişilebilirlik: animasyonlu rakam aria-hidden, gerçek skor sr-only olarak okunur. */
function ScoreCount({ value }: { value: number }) {
  const [display, setDisplay] = useState(value)
  const prefersReduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const startRef = useRef<number | null>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })

  useEffect(() => {
    if (prefersReduced || !inView || value === 0) return
    let raf = 0
    const dur = 700
    startRef.current = null
    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t
      const p = Math.min(1, (t - startRef.current) / dur)
      setDisplay(Math.round(value * easeOut(p)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, prefersReduced, value])

  return (
    <>
      <span ref={ref} aria-hidden className="tabular-nums">{display}</span>
      <span className="sr-only">{value}</span>
    </>
  )
}

/* Sütun genişliğine göre ölçeklenen logo çipi — dar kartta da asla taşmaz */
function TeamLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="group/logo relative aspect-square w-full max-w-[52px] mx-auto">
      <span className="absolute inset-0 rounded-full bg-white ring-1 ring-[#e3efe8] shadow-[0_2px_8px_-3px_rgba(12,46,34,0.25)]" />
      <span className="absolute inset-0 rounded-full bg-ugreen/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <Image src={src} alt={alt} fill sizes="52px" className="relative object-contain p-2 transition-transform duration-500 group-hover:scale-110" />
    </div>
  )
}

function TeamColumn({ name, logo, highlight }: { name: string; logo: string; highlight: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2 min-w-0">
      <TeamLogo src={logo} alt={name} />
      <span className={`text-[11px] font-bold text-center w-full leading-tight line-clamp-2 min-h-[28px] ${highlight ? 'text-ugreen' : 'text-ugreenm'}`}>{name}</span>
    </div>
  )
}

/* ─── Paylaşılan premium maç kartı (ana sayfa + maç merkezi aynı) ───── */
export default function MatchCard({
  match, logos = {}, index = 0,
}: {
  match: Match
  logos?: Record<string, string>
  index?: number
}) {
  const mounted = useMounted()
  const prefersReduced = useReducedMotion()

  const urfaIsHome = match.isHome
  const urfaScore = urfaIsHome ? match.homeScore : match.awayScore
  const oppScore = urfaIsHome ? match.awayScore : match.homeScore
  const result: ResultKind | null =
    match.isCompleted && urfaScore !== null && oppScore !== null
      ? urfaScore > oppScore ? 'G' : urfaScore < oppScore ? 'M' : 'B'
      : null
  const theme = result ? THEME[result] : null
  const tournamentLogo = competitionLogo(logos, match.competition)
  const roundText = match.roundLabel ?? (match.week ? `${match.week}. Hafta` : match.competition)

  const card = (
    <div className="card-premium relative h-full overflow-hidden">
      {/* sonuca göre renkli üst aksan */}
      <span aria-hidden className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${theme?.bar ?? NEUTRAL_BAR}`} />
      {/* canlı zemin tonu */}
      {theme && <span aria-hidden className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${theme.tint} to-transparent`} />}

      <div className="relative">
        {/* Üst şerit: turnuva + hafta · sonuç rozeti */}
        <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            {tournamentLogo && (
              <div className="relative w-5 h-5 shrink-0">
                <Image src={tournamentLogo} alt={match.competition} fill sizes="20px" className="object-contain" />
              </div>
            )}
            <span className="text-[10px] font-extrabold tracking-widest uppercase text-ugreen truncate">{roundText}</span>
          </div>
          {theme && (
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide shadow-sm ${theme.pill}`}>
              {theme.label}
            </span>
          )}
        </div>

        <div className="px-4 pb-4">
          {/* Tarih */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#7aab8e] font-semibold mb-4">
            <Calendar size={11} className="text-ugreen shrink-0" />
            <span className="tabular-nums">{tarihSaat(match.date, match.time)}</span>
          </div>

          {/* Takımlar + skor */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2">
            <TeamColumn name={match.homeTeam} logo={match.homeTeamLogo} highlight={urfaIsHome} />

            <div className="flex items-center gap-1 shrink-0 pt-1.5">
              {match.isCompleted && match.homeScore !== null && match.awayScore !== null ? (
                <>
                  <span className="flex w-9 h-10 items-center justify-center rounded-lg bg-gradient-to-br from-ugreen to-ugreend text-lg font-extrabold text-white shadow-[0_5px_12px_-4px_rgba(12,46,34,0.55)]">
                    <ScoreCount value={match.homeScore} />
                  </span>
                  <span className="flex w-9 h-10 items-center justify-center rounded-lg bg-gradient-to-br from-ugreen to-ugreend text-lg font-extrabold text-white shadow-[0_5px_12px_-4px_rgba(12,46,34,0.55)]">
                    <ScoreCount value={match.awayScore} />
                  </span>
                </>
              ) : (
                <span className="text-sm font-extrabold text-[#7aab8e] px-2">VS</span>
              )}
            </div>

            <TeamColumn name={match.awayTeam} logo={match.awayTeamLogo} highlight={!urfaIsHome} />
          </div>

          {/* Stadyum */}
          <div className="mt-4 pt-3 border-t border-[#edf7f2] flex items-center justify-center gap-1.5 text-[11px] text-[#7aab8e]">
            <MapPin size={11} className="text-ugreen shrink-0" />
            <span className="truncate">{match.venue || '—'}</span>
          </div>
        </div>
      </div>
    </div>
  )

  const linked = match.macId
    ? <Link href={`/mac/${match.macId}`} className="group block h-full">{card}</Link>
    : <div className="group h-full">{card}</div>

  // Mount öncesi (SSR + ilk paint) ve reduced-motion: animasyonsuz, görünür — hydration güvenli.
  if (!mounted || prefersReduced) {
    return <div className="h-full">{linked}</div>
  }

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 26, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      {linked}
    </motion.div>
  )
}
