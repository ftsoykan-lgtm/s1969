import Link from 'next/link'
import { Swords } from 'lucide-react'
import type { Match } from '@/types'
import { matchHref } from '@/lib/tff'

/* Rakip/takım geçmişi — Şanlıurfaspor'un bu rakibe karşı tüm karşılaşmaları.
   Merkezî veriden (güncel + arşiv) otomatik; mevcut maç hariç tutulur.
   Premium/kurumsal + anlaşılır: koyu yeşil başlık kapağı, iki arma, ETİKETLİ
   G/B/M (net), oransal segment barı, detay mini-kartlar (attığı/yediği/averaj/
   galibiyet oranı), son form dizisi, rafine maç listesi. */

const TEAM = 'Şanlıurfaspor'

function fmtDate(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return d && m && y ? `${d}.${m}.${y}` : iso
}

function Crest({ name, logo, highlight }: { name: string; logo?: string | null; highlight?: boolean }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toLocaleUpperCase('tr-TR')
  return (
    <div className="flex w-16 shrink-0 flex-col items-center gap-2 text-center sm:w-20">
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f9f6] ring-1 ${highlight ? 'ring-2 ring-ugold' : 'ring-[#e6efe9]'}`}>
        {logo
          ? <img src={logo} alt="" className="h-10 w-10 object-contain" />
          : <span className="text-[13px] font-extrabold text-[#7aab8e]">{initials}</span>}
      </div>
      <span className={`line-clamp-2 text-[11px] font-extrabold leading-tight ${highlight ? 'text-ugreen' : 'text-ugreenm'}`}>{name}</span>
    </div>
  )
}

function Tally({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="text-center">
      <span className={`block font-heading text-[28px] font-extrabold leading-none tabular-nums sm:text-[34px] ${color}`}>{value}</span>
      <span className="mt-1.5 block text-[9px] font-extrabold uppercase tracking-wide text-[#7aab8e]">{label}</span>
    </div>
  )
}

function MiniStat({ value, label, accent }: { value: string | number; label: string; accent?: boolean }) {
  return (
    <div className="rounded-xl bg-[#f5f9f6] py-2.5 text-center ring-1 ring-[#e6efe9]">
      <p className={`text-base font-extrabold tabular-nums ${accent ? 'text-ugold' : 'text-ugreenm'}`}>{value}</p>
      <p className="mt-0.5 text-[9px] font-extrabold uppercase tracking-wide text-[#7aab8e]">{label}</p>
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

  // Listede mevcut maç hariç, geçmiş (oynanmış) karşılaşmalar (en yeni üstte)
  const others = meetings.filter((m) => m.macId !== currentMacId && m.isCompleted && m.homeScore != null)
  if (others.length === 0) return null

  const resultOf = (m: Match): 'G' | 'B' | 'M' => {
    const isHome = m.homeTeam === TEAM
    const us = (isHome ? m.homeScore : m.awayScore) as number
    const them = (isHome ? m.awayScore : m.homeScore) as number
    return us > them ? 'G' : us < them ? 'M' : 'B'
  }
  const badgeCls = (r: string) => (r === 'G' ? 'bg-ugreen text-white' : r === 'M' ? 'bg-[#d01b2a] text-white' : 'bg-ugold text-ugreend')

  // Şanlıurfaspor arması — herhangi bir karşılaşmadan çıkar
  const teamLogo = meetings.map((m) => (m.homeTeam === TEAM ? m.homeTeamLogo : m.awayTeamLogo)).find(Boolean)
  const totalPlayed = W + D + L
  const pct = (n: number) => (totalPlayed ? (n / totalPlayed) * 100 : 0)
  const winRate = totalPlayed ? Math.round((W / totalPlayed) * 100) : 0
  const av = GF - GA
  // Son form — en son oynanan 5 maç, eskiden yeniye (soldan sağa)
  const form = others.slice(0, 5).reverse().map(resultOf)

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
        {/* Karşılaşma özeti — armalar + ETİKETLİ G/B/M */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <Crest name={TEAM} logo={teamLogo} highlight />
          <div className="flex items-start gap-4 sm:gap-6">
            <Tally value={W} label="Galibiyet" color="text-ugreen" />
            <Tally value={D} label="Beraberlik" color="text-ugoldd" />
            <Tally value={L} label="Mağlubiyet" color="text-[#d01b2a]" />
          </div>
          <Crest name={opponent} logo={opponentLogo} />
        </div>
        <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-wide text-[#9bb5a8]">Şanlıurfaspor açısından</p>

        {/* Oransal G/B/M barı */}
        <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-[#eef5f0]">
          {W > 0 && <span className="bg-ugreen" style={{ width: `${pct(W)}%` }} />}
          {D > 0 && <span className="bg-ugold" style={{ width: `${pct(D)}%` }} />}
          {L > 0 && <span className="bg-[#d01b2a]" style={{ width: `${pct(L)}%` }} />}
        </div>

        {/* Detay mini-kartlar */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          <MiniStat value={GF} label="Attığı" />
          <MiniStat value={GA} label="Yediği" />
          <MiniStat value={av > 0 ? `+${av}` : av} label="Averaj" />
          <MiniStat value={`%${winRate}`} label="Galibiyet" accent />
        </div>

        {/* Son form */}
        {form.length > 0 && (
          <div className="mt-5 flex items-center justify-between gap-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7aab8e]">Son Form</span>
            <div className="flex items-center gap-1.5">
              {form.map((r, i) => (
                <span key={i} className={`flex h-7 w-7 items-center justify-center rounded-lg text-[12px] font-extrabold ${badgeCls(r)}`}>{r}</span>
              ))}
              <span className="ml-1 text-[9px] font-bold uppercase tracking-wide text-[#b6cdc0]">yeni →</span>
            </div>
          </div>
        )}

        {/* Geçmiş maç listesi */}
        <div className="mt-4 border-t border-[#edf7f2] pt-4">
          <p className="mb-2.5 text-[10px] font-extrabold uppercase tracking-widest text-[#7aab8e]">Tüm Karşılaşmalar</p>
          <div className="space-y-1.5">
            {others.map((m) => {
              const isHome = m.homeTeam === TEAM
              const r = resultOf(m)
              const initialsOf = (n: string) => n.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toLocaleUpperCase('tr-TR')
              const row = (
                <div className="flex items-center gap-3 rounded-xl border border-[#e6efe9] px-3 py-3 transition-all hover:border-ugreen/30 hover:bg-[#f8faf9] hover:shadow-sm">
                  {/* Her iki takımın arması */}
                  <div className="flex shrink-0 items-center">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-[#e6efe9]">
                      {m.homeTeamLogo
                        ? <img src={m.homeTeamLogo} alt="" className="h-6 w-6 object-contain" />
                        : <span className="text-[9px] font-extrabold text-[#7aab8e]">{initialsOf(m.homeTeam)}</span>}
                    </span>
                    <span className="-ml-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-[#e6efe9]">
                      {m.awayTeamLogo
                        ? <img src={m.awayTeamLogo} alt="" className="h-6 w-6 object-contain" />
                        : <span className="text-[9px] font-extrabold text-[#7aab8e]">{initialsOf(m.awayTeam)}</span>}
                    </span>
                  </div>
                  {/* Takımlar + tarih/hafta */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-bold text-ugreenm">
                      {m.homeTeam} <span className="font-extrabold tabular-nums text-ugreen">{m.homeScore}-{m.awayScore}</span> {m.awayTeam}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-[11px] font-bold tabular-nums text-[#4a6b5a]">{fmtDate(m.date)}</span>
                      {m.roundLabel && <span className="rounded bg-[#eef5f0] px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-ugreen">{m.roundLabel}</span>}
                    </div>
                  </div>
                  {/* Sonuç + saha */}
                  <div className="flex shrink-0 flex-col items-center gap-1">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-[12px] font-extrabold ${badgeCls(r)}`}>{r}</span>
                    <span className="text-[9px] font-extrabold uppercase tracking-wide text-[#9bb5a8]">{isHome ? 'Ev' : 'Dep'}</span>
                  </div>
                </div>
              )
              return m.macId
                ? <Link key={m.id} href={matchHref(m)} className="block">{row}</Link>
                : <div key={m.id}>{row}</div>
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
