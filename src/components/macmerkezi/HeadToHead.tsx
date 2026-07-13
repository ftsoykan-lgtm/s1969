import Link from 'next/link'
import Image from 'next/image'
import type { Match } from '@/types'
import { matchHref } from '@/lib/tff'

/* Rakip/takım geçmişi — Şanlıurfaspor'un bu rakibe karşı tüm karşılaşmaları.
   Merkezî veriden (güncel + arşiv) otomatik; mevcut maç hariç tutulur. */

const TEAM = 'Şanlıurfaspor'

function fmtDate(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return d && m && y ? `${d}.${m}.${y}` : iso
}

export default function HeadToHead({
  meetings, currentMacId, opponent, opponentLogo,
}: {
  meetings: Match[]
  currentMacId: string | null
  opponent: string
  opponentLogo?: string
}) {
  const played = meetings.filter((m) => m.isCompleted && m.homeScore != null && m.awayScore != null)
  // H2H özeti — Şanlıurfaspor perspektifinden
  let W = 0, D = 0, L = 0, GF = 0, GA = 0
  for (const m of played) {
    const isHome = m.homeTeam === TEAM
    const us = (isHome ? m.homeScore : m.awayScore) as number
    const them = (isHome ? m.awayScore : m.homeScore) as number
    GF += us; GA += them
    if (us > them) W++; else if (us < them) L++; else D++
  }

  // Listede mevcut maç hariç, geçmiş (oynanmış) karşılaşmalar
  const others = meetings.filter((m) => m.macId !== currentMacId && m.isCompleted && m.homeScore != null)
  if (others.length === 0) return null

  return (
    <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6">
      <h2 className="text-xs font-extrabold tracking-widest uppercase text-[#7aab8e] mb-5 flex items-center gap-2">
        <span className="inline-block w-1 h-4 bg-ugold rounded-full" />Geçmiş Karşılaşmalar
      </h2>

      {/* H2H özeti */}
      <div className="flex items-center justify-center gap-4 sm:gap-8 mb-6">
        <TeamMini name={TEAM} highlight />
        <div className="flex items-center gap-3 sm:gap-5 text-center">
          <HtStat value={W} label="Galibiyet" tone="green" />
          <span className="text-[#ddeae2] font-extrabold">·</span>
          <HtStat value={D} label="Beraberlik" tone="gold" />
          <span className="text-[#ddeae2] font-extrabold">·</span>
          <HtStat value={L} label={`${opponent} G.`} tone="red" />
        </div>
        <TeamMini name={opponent} logo={opponentLogo} />
      </div>
      <p className="text-center text-[11px] text-[#7aab8e] -mt-4 mb-6">
        {played.length} karşılaşma · Şanlıurfaspor {GF}-{GA} gol
      </p>

      {/* Geçmiş maç listesi */}
      <div className="divide-y divide-[#edf7f2] border-t border-[#edf7f2]">
        {others.map((m) => {
          const isHome = m.homeTeam === TEAM
          const us = (isHome ? m.homeScore : m.awayScore) as number
          const them = (isHome ? m.awayScore : m.homeScore) as number
          const r = us > them ? 'G' : us < them ? 'M' : 'B'
          const badge = r === 'G' ? 'bg-ugreen text-white' : r === 'M' ? 'bg-[#d01b2a] text-white' : 'bg-ugold text-ugreend'
          const row = (
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-2.5 hover:bg-[#f5f9f6] transition-colors -mx-2 px-2 rounded-lg">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-extrabold ${badge}`}>{r}</span>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-ugreenm truncate">
                  {m.homeTeam} <span className="tabular-nums text-ugreen">{m.homeScore}-{m.awayScore}</span> {m.awayTeam}
                </p>
                <p className="text-[10px] text-[#7aab8e]">{fmtDate(m.date)}{m.roundLabel ? ` · ${m.roundLabel}` : ''}</p>
              </div>
              <span className="text-[10px] font-bold text-[#7aab8e] shrink-0">{isHome ? 'İç Saha' : 'Deplasman'}</span>
            </div>
          )
          return m.macId
            ? <Link key={m.id} href={matchHref(m)} className="block">{row}</Link>
            : <div key={m.id}>{row}</div>
        })}
      </div>
    </div>
  )
}

function HtStat({ value, label, tone }: { value: number; label: string; tone: 'green' | 'gold' | 'red' }) {
  const color = tone === 'green' ? 'text-ugreen' : tone === 'gold' ? 'text-ugoldd' : 'text-[#d01b2a]'
  return (
    <div>
      <p className={`font-heading text-3xl font-extrabold tabular-nums ${color}`}>{value}</p>
      <p className="text-[9px] font-extrabold tracking-wide uppercase text-[#7aab8e] mt-0.5 max-w-[64px] leading-tight">{label}</p>
    </div>
  )
}

function TeamMini({ name, logo, highlight }: { name: string; logo?: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5 w-16 shrink-0">
      <div className="relative w-9 h-9">
        {logo ? <Image src={logo} alt={name} fill unoptimized sizes="36px" className="object-contain" /> : <span className="flex h-full w-full items-center justify-center rounded-full bg-ugreen/10 text-ugreen text-[11px] font-extrabold">{name.slice(0, 3).toUpperCase()}</span>}
      </div>
      <span className={`text-[10px] font-bold text-center leading-tight line-clamp-2 ${highlight ? 'text-ugreen' : 'text-ugreenm'}`}>{name}</span>
    </div>
  )
}
