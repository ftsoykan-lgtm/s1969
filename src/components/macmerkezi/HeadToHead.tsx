import Link from 'next/link'
import { Swords } from 'lucide-react'
import type { Match } from '@/types'
import { matchHref } from '@/lib/tff'

/* Rakip/takım geçmişi — Şanlıurfaspor'un bu rakibe karşı tüm karşılaşmaları.
   Merkezî veriden (güncel + arşiv) otomatik; mevcut maç hariç tutulur.
   Premium/kurumsal: koyu yeşil başlık kapağı, iki arma karşılaşması,
   oransal G/B/M segment barı, gol & galibiyet oranı, rafine maç listesi. */

const TEAM = 'Şanlıurfaspor'

function fmtDate(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return d && m && y ? `${d}.${m}.${y}` : iso
}

function Crest({ name, logo, highlight }: { name: string; logo?: string | null; highlight?: boolean }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toLocaleUpperCase('tr-TR')
  return (
    <div className="flex w-20 shrink-0 flex-col items-center gap-2 text-center">
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f9f6] ring-1 ${highlight ? 'ring-2 ring-ugold' : 'ring-[#e6efe9]'}`}>
        {logo
          ? <img src={logo} alt="" className="h-10 w-10 object-contain" />
          : <span className="text-[13px] font-extrabold text-[#7aab8e]">{initials}</span>}
      </div>
      <span className={`line-clamp-2 text-[11px] font-extrabold leading-tight ${highlight ? 'text-ugreen' : 'text-ugreenm'}`}>{name}</span>
    </div>
  )
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

  // Şanlıurfaspor arması — herhangi bir karşılaşmadan çıkar
  const teamLogo = meetings.map((m) => (m.homeTeam === TEAM ? m.homeTeamLogo : m.awayTeamLogo)).find(Boolean)
  const totalPlayed = W + D + L
  const pct = (n: number) => (totalPlayed ? (n / totalPlayed) * 100 : 0)
  const winRate = totalPlayed ? Math.round((W / totalPlayed) * 100) : 0

  return (
    <div
      className="overflow-hidden rounded-2xl border border-[#dce9e2] bg-white"
      style={{ boxShadow: '0 2px 6px rgba(12, 46, 34, 0.05), 0 22px 46px -26px rgba(12, 46, 34, 0.28)' }}
    >
      {/* Başlık kapağı — koyu yeşil */}
      <div className="relative flex items-center justify-between gap-2 overflow-hidden bg-gradient-to-r from-ugreen to-ugreend px-5 py-3.5">
        <div aria-hidden className="pointer-events-none absolute -top-8 -right-6 h-24 w-24 rounded-full bg-ugold/10 blur-2xl" />
        <span className="relative inline-flex items-center gap-2">
          <Swords size={16} className="text-ugold" />
          <span className="font-heading text-base font-extrabold uppercase tracking-wide text-white">Geçmiş Karşılaşmalar</span>
        </span>
        <span className="relative rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-extrabold tabular-nums text-white ring-1 ring-white/15">{played.length} maç</span>
      </div>

      <div className="p-5 sm:p-6">
        {/* Karşılaşma özeti — armalar + G/B/M */}
        <div className="flex items-center justify-between gap-3">
          <Crest name={TEAM} logo={teamLogo} highlight />
          <div className="text-center">
            <div className="flex items-baseline justify-center gap-1.5 font-heading leading-none">
              <span className="text-[32px] font-extrabold tabular-nums text-ugreen">{W}</span>
              <span className="text-lg font-extrabold text-[#c8d6cf]">-</span>
              <span className="text-[32px] font-extrabold tabular-nums text-ugoldd">{D}</span>
              <span className="text-lg font-extrabold text-[#c8d6cf]">-</span>
              <span className="text-[32px] font-extrabold tabular-nums text-[#d01b2a]">{L}</span>
            </div>
            <p className="mt-1.5 text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#7aab8e]">Galibiyet · Beraberlik · Mağlubiyet</p>
          </div>
          <Crest name={opponent} logo={opponentLogo} />
        </div>

        {/* Oransal G/B/M barı */}
        <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-[#eef5f0]">
          {W > 0 && <span className="bg-ugreen" style={{ width: `${pct(W)}%` }} />}
          {D > 0 && <span className="bg-ugold" style={{ width: `${pct(D)}%` }} />}
          {L > 0 && <span className="bg-[#d01b2a]" style={{ width: `${pct(L)}%` }} />}
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] font-bold text-[#5b8771]">
          <span className="tabular-nums">Şanlıurfaspor <span className="text-ugreenm">{GF}-{GA}</span> gol</span>
          <span className="tabular-nums">%{winRate} galibiyet</span>
        </div>

        {/* Geçmiş maç listesi */}
        <div className="mt-5 space-y-1.5">
          {others.map((m) => {
            const isHome = m.homeTeam === TEAM
            const us = (isHome ? m.homeScore : m.awayScore) as number
            const them = (isHome ? m.awayScore : m.homeScore) as number
            const r = us > them ? 'G' : us < them ? 'M' : 'B'
            const badge = r === 'G' ? 'bg-ugreen text-white' : r === 'M' ? 'bg-[#d01b2a] text-white' : 'bg-ugold text-ugreend'
            const row = (
              <div className="flex items-center gap-3 rounded-xl border border-[#edf7f2] px-3 py-2.5 transition-all hover:border-ugreen/30 hover:bg-[#f8faf9]">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[12px] font-extrabold ${badge}`}>{r}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-ugreenm">
                    {m.homeTeam} <span className="font-extrabold tabular-nums text-ugreen">{m.homeScore}-{m.awayScore}</span> {m.awayTeam}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#7aab8e]">{fmtDate(m.date)}{m.roundLabel ? ` · ${m.roundLabel}` : ''}</p>
                </div>
                <span className="shrink-0 rounded-md bg-[#f5f9f6] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-[#7aab8e]">{isHome ? 'Ev' : 'Dep'}</span>
              </div>
            )
            return m.macId
              ? <Link key={m.id} href={matchHref(m)} className="block">{row}</Link>
              : <div key={m.id}>{row}</div>
          })}
        </div>
      </div>
    </div>
  )
}
