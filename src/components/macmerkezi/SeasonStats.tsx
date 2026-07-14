import { Trophy } from 'lucide-react'
import type { Match } from '@/types'

/* Sezon özeti — merkezî maç verisinden otomatik hesaplanır (standings'in göstermediği
   iç/dış saha kırılımı, form, gol istatistikleri, en farklı galibiyet).
   Premium/anlaşılır: koyu yeşil başlık + form, 4 anahtar kart, oransal G/B/M barı,
   iç/dış saha mini-barları, goller ve en farklı galibiyet. */

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
    winRate: played.length ? Math.round((W / played.length) * 100) : 0,
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
      <div className="panel-premium flex items-center gap-4 p-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ugreen/10 font-heading font-extrabold text-ugreen">{season.slice(2, 4)}</span>
        <div>
          <p className="font-heading text-lg font-extrabold leading-tight text-ugreenm">Sezon Özeti</p>
          <p className="text-[12px] text-[#7aab8e]">{season} sezonunda henüz oynanmış maç yok — ilk maçlar oynandıkça istatistikler burada belirir.</p>
        </div>
      </div>
    )
  }

  const total = s.W + s.D + s.L || 1
  const pct = (n: number) => (n / total) * 100

  // En farklı galibiyet künyesi
  let bw: { score: string; opp: string } | null = null
  if (s.biggestWin) {
    const m = s.biggestWin.m
    const isHome = m.homeTeam === TEAM
    bw = {
      score: `${isHome ? m.homeScore : m.awayScore}-${isHome ? m.awayScore : m.homeScore}`,
      opp: isHome ? m.awayTeam : m.homeTeam,
    }
  }

  return (
    <div
      className="overflow-hidden rounded-2xl border border-[#dce9e2] bg-white"
      style={{ boxShadow: '0 2px 6px rgba(12, 46, 34, 0.05), 0 24px 48px -26px rgba(12, 46, 34, 0.28)' }}
    >
      {/* Başlık — koyu yeşil + form */}
      <div className="relative flex items-center justify-between gap-3 overflow-hidden bg-gradient-to-r from-ugreens to-ugreen px-5 py-4">
        <div aria-hidden className="pointer-events-none absolute -top-10 -right-8 h-28 w-28 rounded-full bg-ugold/10 blur-2xl" />
        <div className="relative">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.22em] text-ugold/85">
            <Trophy size={12} /> Sezon Özeti
          </p>
          <p className="mt-0.5 font-heading text-xl font-extrabold leading-none text-white">Şanlıurfaspor · {season}</p>
        </div>
        <div className="relative flex flex-col items-end gap-1">
          <span className="text-[8px] font-extrabold uppercase tracking-widest text-white/45">Son Form</span>
          <div className="flex items-center gap-1.5">
            {s.form.map((r, i) => (
              <span key={i} title={FORM_LABEL[r]} className={`flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-extrabold shadow-sm ${FORM_STYLE[r]}`}>{r}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        {/* Anahtar metrikler */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <BigStat label="Oynanan" value={s.played} />
          <BigStat label="Puan" value={s.points} accent />
          <BigStat label="Averaj" value={s.GD > 0 ? `+${s.GD}` : s.GD} />
          <BigStat label="Galibiyet Oranı" value={`%${s.winRate}`} />
        </div>

        {/* Oransal G/B/M barı + etiketli sayımlar */}
        <div>
          <div className="flex h-3 overflow-hidden rounded-full bg-[#eef5f0]">
            {s.W > 0 && <span className="bg-ugreen" style={{ width: `${pct(s.W)}%` }} />}
            {s.D > 0 && <span className="bg-ugold" style={{ width: `${pct(s.D)}%` }} />}
            {s.L > 0 && <span className="bg-[#d01b2a]" style={{ width: `${pct(s.L)}%` }} />}
          </div>
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <LabeledCount value={s.W} label="Galibiyet" dot="bg-ugreen" />
            <LabeledCount value={s.D} label="Beraberlik" dot="bg-ugold" />
            <LabeledCount value={s.L} label="Mağlubiyet" dot="bg-[#d01b2a]" />
          </div>
        </div>

        {/* İç Saha / Deplasman */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SplitCard title="İç Saha" split={s.home} />
          <SplitCard title="Deplasman" split={s.away} />
        </div>

        {/* Goller + En Farklı Galibiyet */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-[#f5f9f6] p-3.5 ring-1 ring-[#e6efe9]">
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-[#7aab8e]">Goller</p>
            <div className="flex items-baseline gap-4">
              <span className="text-[13px] font-bold text-ugreenm">Attığı <b className="text-base tabular-nums text-ugreen">{s.GF}</b></span>
              <span className="text-[13px] font-bold text-ugreenm">Yediği <b className="text-base tabular-nums text-[#d01b2a]">{s.GA}</b></span>
            </div>
            <p className="mt-1.5 text-[11px] text-[#7aab8e]">Maç başı {s.gfAvg.toFixed(2)} gol</p>
          </div>
          {bw && (
            <div className="rounded-xl bg-gradient-to-br from-ugreen/[0.07] to-transparent p-3.5 ring-1 ring-ugreen/15">
              <p className="mb-2 inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-ugreen"><Trophy size={11} /> En Farklı Galibiyet</p>
              <p className="font-heading text-xl font-extrabold tabular-nums text-ugreenm">{bw.score}</p>
              <p className="mt-0.5 truncate text-[11px] text-[#7aab8e]">{bw.opp} karşısında</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BigStat({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="rounded-xl bg-[#f5f9f6] py-3 text-center ring-1 ring-[#e6efe9]">
      <p className={`font-heading text-2xl font-extrabold tabular-nums ${accent ? 'text-ugreen' : 'text-ugreenm'}`}>{value}</p>
      <p className="mt-0.5 text-[9px] font-extrabold uppercase tracking-wide text-[#7aab8e]">{label}</p>
    </div>
  )
}

function LabeledCount({ value, label, dot }: { value: number; label: string; dot: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      <span className="text-sm font-extrabold tabular-nums text-ugreenm">{value}</span>
      <span className="text-[10px] font-bold text-[#7aab8e]">{label}</span>
    </span>
  )
}

function SplitCard({ title, split }: { title: string; split: Split }) {
  const total = split.W + split.D + split.L
  const t = total || 1
  return (
    <div className="rounded-xl bg-[#f5f9f6] p-3.5 ring-1 ring-[#e6efe9]">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#7aab8e]">{title}</p>
        <span className="text-[10px] font-bold text-[#9bb5a8]">{total} maç</span>
      </div>
      <div className="mb-2.5 flex h-2 overflow-hidden rounded-full bg-white ring-1 ring-[#e6efe9]">
        {split.W > 0 && <span className="bg-ugreen" style={{ width: `${(split.W / t) * 100}%` }} />}
        {split.D > 0 && <span className="bg-ugold" style={{ width: `${(split.D / t) * 100}%` }} />}
        {split.L > 0 && <span className="bg-[#d01b2a]" style={{ width: `${(split.L / t) * 100}%` }} />}
      </div>
      <div className="flex items-center gap-3 text-[13px] font-bold">
        <span className="tabular-nums text-ugreen">{split.W}<span className="ml-0.5 text-[9px] text-[#7aab8e]">G</span></span>
        <span className="tabular-nums text-ugoldd">{split.D}<span className="ml-0.5 text-[9px] text-[#7aab8e]">B</span></span>
        <span className="tabular-nums text-[#d01b2a]">{split.L}<span className="ml-0.5 text-[9px] text-[#7aab8e]">M</span></span>
      </div>
    </div>
  )
}
