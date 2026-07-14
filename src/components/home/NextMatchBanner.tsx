import Link from 'next/link'
import { CalendarDays, MapPin, ArrowRight } from 'lucide-react'
import { getLiveTff } from '@/lib/supabase/tff-server'
import { getTeamLogoMap, applyLogosToMatches } from '@/lib/supabase/logos-server'
import { nextMatch, matchHref } from '@/lib/tff'
import CountdownTiles from './CountdownTiles'

const TR_MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
function fmtDate(iso: string) {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  return m ? `${+m[3]} ${TR_MONTHS[+m[2] - 1]} ${m[1]}` : ''
}
const validTime = (t?: string | null) => (t && /^\d{1,2}:\d{2}$/.test(t) ? t : null)

/* Karşılaşmanın bir tarafı — arma + takım adı. Şanlıurfaspor tarafı altınla vurgulanır. */
function Side({ name, logo, isUs }: { name: string; logo?: string | null; isUs: boolean }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toLocaleUpperCase('tr-TR')
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2.5 text-center">
      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.08] ring-1 md:h-20 md:w-20 ${isUs ? 'ring-ugold/45' : 'ring-white/15'}`}>
        {logo
          ? <img src={logo} alt="" className="h-11 w-11 object-contain md:h-14 md:w-14" />
          : <span className="text-lg font-extrabold text-white/70">{initials}</span>}
      </div>
      <p className={`line-clamp-2 text-[13px] font-extrabold leading-tight md:text-sm ${isUs ? 'text-ugold' : 'text-white'}`}>{name}</p>
    </div>
  )
}

/**
 * Sıradaki Maç bandı — hero'nun hemen altında, tam genişlikte kurumsal fikstür
 * kartı. ŞFK arması VS rakip arması + tarih/saat/saha + canlı geri sayım + CTA.
 * Yaklaşan maç yoksa hiç render edilmez.
 */
export default async function NextMatchBanner() {
  const [{ matches, meta }, logoMap] = await Promise.all([getLiveTff(), getTeamLogoMap()])
  const next = nextMatch(applyLogosToMatches(matches, logoMap))
  if (!next) return null

  const tm = validTime(next.time)
  const target = next.date ? `${next.date}T${tm ?? '00:00'}:00` : null
  const label = next.roundLabel ?? next.competition ?? null
  const detail = next.macId
    ? { href: matchHref(next), text: 'Maç Detayı' }
    : { href: '/mac-merkezi', text: 'Maç Merkezi' }

  return (
    <section className="relative bg-[#f8faf9] pt-10 md:pt-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ugreend via-ugreenm to-[#062018] p-6 ring-1 ring-white/10 shadow-[0_30px_60px_-24px_rgba(8,40,26,0.6)] md:p-9">
          <div aria-hidden className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-ugold/10 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ugold/50 to-transparent" />

          {/* Üst şerit */}
          <div className="relative mb-6 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-ugold">
              <span className="h-1.5 w-1.5 rounded-full bg-ugold motion-safe:animate-pulse" />
              Sıradaki Maç{label && <span className="text-ugold/55"> · {label}</span>}
            </span>
            <span className="hidden text-[11px] font-extrabold uppercase tracking-wide text-white/40 sm:block">{meta.league}</span>
          </div>

          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center md:gap-9">
            {/* Karşılaşma + künye */}
            <div>
              <div className="flex items-center justify-center gap-4 md:gap-10">
                <Side name={next.homeTeam} logo={next.homeTeamLogo} isUs={next.isHome} />
                <div className="shrink-0 font-heading text-2xl font-extrabold text-white/25 md:text-3xl">VS</div>
                <Side name={next.awayTeam} logo={next.awayTeamLogo} isUs={!next.isHome} />
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] font-semibold text-white/55">
                {target && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={14} className="text-ugold" />{fmtDate(next.date!)}{tm ? ` · ${tm}` : ''}
                  </span>
                )}
                {next.venue && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} className="text-ugold" />{next.venue}
                  </span>
                )}
              </div>
            </div>

            {/* Geri sayım + CTA */}
            <div className="md:w-[300px] md:border-l md:border-white/10 md:pl-9">
              {target ? (
                <CountdownTiles target={target} />
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-ugold/10 px-4 py-3 ring-1 ring-ugold/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-ugold" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wide text-ugold">Tarih yakında açıklanacak</span>
                </div>
              )}
              <Link
                href={detail.href}
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-ugold px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-wide text-ugreend shadow-sm transition-colors hover:bg-white"
              >
                {detail.text}<ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
