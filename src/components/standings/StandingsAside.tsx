import Link from 'next/link'
import type { Match } from '@/types'
import { matchHref } from '@/lib/tff'
import { resultOf } from '@/lib/standings'
import { ZONE_STYLE } from './StandingsTable'
import { FORM_CHIP } from './StandingsSummary'

function AsideBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#e3ede7] bg-white p-5">
      <h2 className="mb-4 flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.16em] text-ugreenm">
        <span aria-hidden className="h-4 w-1 rounded-full bg-ugold" />{title}
      </h2>
      {children}
    </section>
  )
}

const shortDate = (iso: string) => iso.replace(/^(\d{4})-(\d{2})-(\d{2}).*/, '$3.$2.$1')

/* Son sonuçlarımız — en yeni üstte; satır maç detayına gider. */
export function LastResults({ matches }: { matches: Match[] }) {
  if (!matches.length) return null
  return (
    <AsideBox title="Son Sonuçlar">
      <ul className="-mx-2 space-y-1">
        {matches.map((m) => {
          const r = resultOf(m)
          const row = (
            <>
              {r && <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-[10px] font-extrabold ${FORM_CHIP[r]}`}>{r}</span>}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-bold text-ugreenm">{m.homeTeam}</span>
                <span className="block truncate text-[13px] font-bold text-ugreenm">{m.awayTeam}</span>
                {m.date && <span className="block text-[11px] font-semibold text-[#7aab8e]">{shortDate(m.date)}</span>}
              </span>
              <span className="flex shrink-0 flex-col items-end font-heading text-[15px] font-extrabold leading-[1.35] tabular-nums text-ugreen">
                <span>{m.homeScore}</span><span>{m.awayScore}</span>
              </span>
            </>
          )
          return (
            <li key={m.id}>
              {m.macId
                ? <Link href={matchHref(m)} className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-[#f2f8f4]">{row}</Link>
                : <div className="flex items-center gap-3 px-2 py-2">{row}</div>}
            </li>
          )
        })}
      </ul>
    </AsideBox>
  )
}

const ZONE_DESC: Record<keyof typeof ZONE_STYLE, string> = {
  champion: 'Grup şampiyonu — doğrudan üst lige yükselir',
  playoff: 'Play-off hattı — yükselme play-off\'larına katılır',
  relegation: 'Küme düşme hattı',
}

/* Bölge rehberi — tablodaki renk barlarının anlamı. */
export function ZoneGuide() {
  return (
    <AsideBox title="Bölge Rehberi">
      <ul className="space-y-3">
        {(Object.keys(ZONE_STYLE) as (keyof typeof ZONE_STYLE)[]).map((z) => (
          <li key={z} className="flex items-start gap-3 text-[13px] font-semibold text-utxt2">
            <span aria-hidden className={`mt-0.5 h-4 w-1.5 shrink-0 rounded-full ${ZONE_STYLE[z].bar}`} />
            {ZONE_DESC[z]}
          </li>
        ))}
        <li className="flex items-start gap-3 text-[13px] font-semibold text-utxt2">
          <span aria-hidden className="mt-0.5 h-4 w-4 shrink-0 rounded bg-ugreenm" />
          Şanlıurfaspor
        </li>
      </ul>
    </AsideBox>
  )
}
