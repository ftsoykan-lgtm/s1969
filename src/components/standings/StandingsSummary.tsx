import type { StandingRow } from '@/types'
import { signed, type FormResult } from '@/lib/standings'

type Tone = 'gold' | 'green' | 'red' | 'plain'

const TONE: Record<Tone, string> = {
  gold: 'text-ugoldd',
  green: 'text-ugreen',
  red: 'text-[#d01b2a]',
  plain: 'text-ugreenm',
}

export const FORM_CHIP: Record<FormResult, string> = {
  G: 'bg-ugreen text-white',
  B: 'bg-ugold text-ugreend',
  M: 'bg-[#d01b2a] text-white',
}

function Tile({ value, label, tone, accent = false }: { value: string | number; label: string; tone: Tone; accent?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-white px-3 py-4 text-center ${accent ? 'border-ugold/50 shadow-[0_14px_30px_-20px_rgba(201,162,0,0.7)]' : 'border-[#e3ede7]'}`}>
      {accent && <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-ugold" />}
      <b className={`block font-heading text-[2rem] font-extrabold leading-none tabular-nums ${TONE[tone]}`}>{value}</b>
      <span className="mt-2 block text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#7aab8e]">{label}</span>
    </div>
  )
}

/* Kulübün özet kartları (referans: sivasspor puan-ozet) + son 5 maç formu. */
export default function StandingsSummary({ row, form }: { row: StandingRow; form: FormResult[] }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        <Tile value={row.rank} label="Sıra" tone="gold" accent />
        <Tile value={row.points} label="Puan" tone="gold" accent />
        <Tile value={row.played} label="Oynadı" tone="plain" />
        <Tile value={row.won} label="Galibiyet" tone="green" />
        <Tile value={row.drawn} label="Beraberlik" tone="plain" />
        <Tile value={row.lost} label="Mağlubiyet" tone="red" />
        <Tile value={signed(row.goalsFor - row.goalsAgainst)} label="Averaj" tone="plain" />
      </div>

      {form.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#e3ede7] bg-white px-4 py-3">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-ugreenm">Son {form.length} Maç</span>
          <ol className="flex gap-1.5" aria-label="Son maçların sonuçları, eskiden yeniye">
            {form.map((r, i) => (
              <li key={i} className={`flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-extrabold ${FORM_CHIP[r]}`}>{r}</li>
            ))}
          </ol>
          <span className="ml-auto text-[11px] font-semibold text-[#7aab8e]">G: Galibiyet · B: Beraberlik · M: Mağlubiyet</span>
        </div>
      )}
    </div>
  )
}
