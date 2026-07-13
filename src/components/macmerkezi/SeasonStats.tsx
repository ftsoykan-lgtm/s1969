import type { Match } from '@/types'

/* Sezon özeti — merkezî maç verisinden otomatik hesaplanır (standings'in göstermediği
   iç/dış saha kırılımı, form, gol istatistikleri). Oynanmış maç yoksa sade bir not. */

const TEAM = 'Şanlıurfaspor'

type Result = 'G' | 'B' | 'M'
interface Split { W: number; D: number; L: number }

function computeStats(matches: Match[]) {
  const played = matches.filter((m) => m.isCompleted && m.homeScore != null && m.awayScore != null)
  let W = 0, D = 0, L = 0, GF = 0, GA = 0
  const home: Split = { W: 0, D: 0, L: 0 }
  const away: Split = { W: 0, D: 0, L: 0 }
  const form: Result[] = []
  let biggestWin: { m: Match; diff: number } | null = null
  // fikstür sırası kronolojik → form için doğru sırada
  for (const m of played) {
    const isHome = m.homeTeam === TEAM
    const us = (isHome ? m.homeScore : m.awayScore) as number
    const them = (isHome ? m.awayScore : m.homeScore) as number
    GF += us; GA += them
    const r: Result = us > them ? 'G' : us < them ? 'M' : 'B'
    if (r === 'G') { W++; (isHome ? home : away).W++; const diff = us - them; if (!biggestWin || diff > biggestWin.diff) biggestWin = { m, diff } }
    else if (r === 'B') { D++; (isHome ? home : away).D++ }
    else { L++; (isHome ? home : away).L++ }
    form.push(r)
  }
  return {
    played: played.length, W, D, L, GF, GA, GD: GF - GA, points: W * 3 + D,
    home, away, form: form.slice(-5), biggestWin,
    gfAvg: played.length ? (GF / played.length) : 0,
  }
}

const FORM_STYLE: Record<Result, string> = {
  G: 'bg-ugreen text-white',
  B: 'bg-ugold text-ugreend',
  M: 'bg-[#d01b2a] text-white',
}
const FORM_LABEL: Record<Result, string> = { G: 'Galibiyet', B: 'Beraberlik', M: 'Mağlubiyet' }

export default function SeasonStats({ matches, season }: { matches: Match[]; season: string }) {
  const s = computeStats(matches)

  if (s.played === 0) {
    return (
      <div className="panel-premium p-6 flex items-center gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ugreen/10 text-ugreen font-heading font-extrabold">{season.slice(2, 4)}</span>
        <div>
          <p className="font-heading text-lg font-extrabold text-ugreenm leading-tight">Sezon Özeti</p>
          <p className="text-[12px] text-[#7aab8e]">{season} sezonunda henüz oynanmış maç yok — ilk maçlar oynandıkça istatistikler burada belirir.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="panel-premium overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 bg-gradient-to-r from-ugreens to-ugreen">
        <div>
          <p className="text-[10px] font-extrabold tracking-[0.22em] uppercase text-ugold/80">Sezon Özeti</p>
          <p className="font-heading text-xl font-extrabold text-white leading-none mt-0.5">Şanlıurfaspor · {season}</p>
        </div>
        {/* Form (son 5) */}
        <div className="flex items-center gap-1.5">
          {s.form.map((r, i) => (
            <span key={i} title={FORM_LABEL[r]} className={`flex h-7 w-7 items-center justify-center rounded-lg text-[12px] font-extrabold shadow-sm ${FORM_STYLE[r]}`}>{r}</span>
          ))}
        </div>
      </div>

      {/* Genel künye */}
      <div className="grid grid-cols-3 sm:grid-cols-6 divide-x divide-[#edf7f2] border-b border-[#edf7f2]">
        <Stat label="Oynanan" value={s.played} />
        <Stat label="Galibiyet" value={s.W} tone="green" />
        <Stat label="Beraberlik" value={s.D} tone="gold" />
        <Stat label="Mağlubiyet" value={s.L} tone="red" />
        <Stat label="Averaj" value={s.GD > 0 ? `+${s.GD}` : s.GD} />
        <Stat label="Puan" value={s.points} tone="green" strong />
      </div>

      {/* İç saha / Deplasman + gol */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#edf7f2]">
        <SplitRow title="İç Saha" split={s.home} />
        <SplitRow title="Deplasman" split={s.away} />
        <div className="px-5 py-4">
          <p className="text-[10px] font-extrabold tracking-widest uppercase text-[#7aab8e] mb-2">Goller</p>
          <div className="flex items-baseline gap-4">
            <span className="text-sm font-bold text-ugreenm">Attığı <b className="text-ugreen tabular-nums">{s.GF}</b></span>
            <span className="text-sm font-bold text-ugreenm">Yediği <b className="text-[#d01b2a] tabular-nums">{s.GA}</b></span>
          </div>
          <p className="text-[11px] text-[#7aab8e] mt-1">Maç başı {s.gfAvg.toFixed(2)} gol</p>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, tone, strong }: { label: string; value: string | number; tone?: 'green' | 'gold' | 'red'; strong?: boolean }) {
  const color = tone === 'green' ? 'text-ugreen' : tone === 'gold' ? 'text-ugoldd' : tone === 'red' ? 'text-[#d01b2a]' : 'text-ugreenm'
  return (
    <div className="px-3 py-3.5 text-center">
      <p className={`font-heading ${strong ? 'text-2xl' : 'text-xl'} font-extrabold tabular-nums ${color}`}>{value}</p>
      <p className="text-[9px] font-extrabold tracking-wide uppercase text-[#7aab8e] mt-0.5">{label}</p>
    </div>
  )
}

function SplitRow({ title, split }: { title: string; split: Split }) {
  const total = split.W + split.D + split.L
  return (
    <div className="px-5 py-4">
      <p className="text-[10px] font-extrabold tracking-widest uppercase text-[#7aab8e] mb-2">{title}</p>
      <div className="flex items-center gap-3 text-sm font-bold">
        <span className="text-ugreen tabular-nums">{split.W}<span className="text-[10px] text-[#7aab8e] ml-0.5">G</span></span>
        <span className="text-ugoldd tabular-nums">{split.D}<span className="text-[10px] text-[#7aab8e] ml-0.5">B</span></span>
        <span className="text-[#d01b2a] tabular-nums">{split.L}<span className="text-[10px] text-[#7aab8e] ml-0.5">M</span></span>
        <span className="ml-auto text-[11px] text-[#7aab8e]">{total} maç</span>
      </div>
    </div>
  )
}
