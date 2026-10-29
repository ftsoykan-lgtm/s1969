import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getLiveTff } from '@/lib/supabase/tff-server'
import { getTeamLogoMap, applyLogosToMatches } from '@/lib/supabase/logos-server'
import { nextMatch, matchHref } from '@/lib/tff'
import { formatDate } from '@/lib/utils'
import CountdownTiles from '@/components/home/CountdownTiles'

const validTime = (t?: string | null) => (t && /^\d{1,2}:\d{2}$/.test(t) ? t : null)

function Crest({ name, logo }: { name: string; logo?: string | null }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/[0.06] ring-1 ring-white/10">
        {logo ? <img src={logo} alt="" className="h-10 w-10 object-contain" /> : null}
      </div>
      <p className="line-clamp-2 text-[12px] font-extrabold leading-tight text-white">{name}</p>
    </div>
  )
}

/* Yan panel "Sıradaki Maç" — koyu yeşil kimlik kartı + geri sayım (haber detayında).
   Yaklaşan maç yoksa hiç render edilmez. */
export default async function NextMatchSide() {
  const [{ matches }, logoMap] = await Promise.all([getLiveTff(), getTeamLogoMap()])
  const next = nextMatch(applyLogosToMatches(matches, logoMap))
  if (!next) return null
  const tm = validTime(next.time)
  const target = next.date ? `${next.date}T${tm ?? '00:00'}:00` : null

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ugreend to-ugreendd p-5 text-white shadow-[0_20px_40px_-24px_rgba(12,46,34,0.7)]">
      <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-ugold" />
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-ugold">Sıradaki Maç</h2>
        {next.roundLabel && <span className="rounded-full bg-ugold/15 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-ugold ring-1 ring-ugold/30">{next.roundLabel}</span>}
      </div>

      <div className="mt-5 flex items-start gap-2">
        <Crest name={next.homeTeam} logo={next.homeTeamLogo} />
        <span className="mt-4 shrink-0 rounded-full bg-ugold px-2 py-1 font-heading text-[11px] font-extrabold text-ugreend">VS</span>
        <Crest name={next.awayTeam} logo={next.awayTeamLogo} />
      </div>

      <p className="mt-4 text-center text-[12px] font-semibold text-white/65">
        {next.date ? formatDate(next.date) : 'Tarih yakında'}{tm ? ` · ${tm}` : ''}
        {next.venue && <><br />{next.venue}</>}
      </p>

      {target && <div className="mt-4"><CountdownTiles target={target} tone="dark" /></div>}

      <Link href={next.macId ? matchHref(next) : '/mac-merkezi'}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-white/15 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-white transition-colors hover:border-ugold hover:bg-ugold hover:text-ugreend">
        {next.macId ? 'Maç Detayı' : 'Fikstürün Tamamı'}<ArrowRight size={14} aria-hidden />
      </Link>
    </section>
  )
}
