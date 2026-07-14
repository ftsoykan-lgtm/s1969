import Link from 'next/link'
import { CalendarDays, MapPin, ArrowRight } from 'lucide-react'
import { matchHref } from '@/lib/tff'
import type { Match } from '@/types'
import CountdownTiles from './CountdownTiles'

const TR_MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
function fmtDate(iso: string) {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  return m ? `${+m[3]} ${TR_MONTHS[+m[2] - 1]} ${m[1]}` : ''
}
const validTime = (t?: string | null) => (t && /^\d{1,2}:\d{2}$/.test(t) ? t : null)

/* Karşılaşmanın bir tarafı — arma + takım adı. ŞFK tarafı altın arma-çerçevesi
   ve marka-yeşili adla ince biçimde vurgulanır (kurumsal, az renk). */
function Side({ name, logo, isUs }: { name: string; logo?: string | null; isUs: boolean }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toLocaleUpperCase('tr-TR')
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2.5 text-center">
      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f5f9f6] ring-1 md:h-20 md:w-20 ${isUs ? 'ring-2 ring-ugold' : 'ring-[#e6efe9]'}`}>
        {logo
          ? <img src={logo} alt="" className="h-11 w-11 object-contain md:h-14 md:w-14" />
          : <span className="text-lg font-extrabold text-[#7aab8e]">{initials}</span>}
      </div>
      <p className={`line-clamp-2 text-[13px] font-extrabold leading-tight md:text-sm ${isUs ? 'text-ugreen' : 'text-ugreenm'}`}>{name}</p>
    </div>
  )
}

/**
 * Sıradaki Maç kartı — AÇIK/KURUMSAL. Maç Merkezi başlığının altında kullanılır.
 * Beyaz zemin + ince çerçeve/yumuşak gölge; yeşil-altın yalnızca vurgu.
 * ŞFK arması VS rakip arması + tarih/saat/saha + canlı geri sayım + CTA.
 * Veriyi ebeveyn (FixturePreview) sağlar; yaklaşan maç yoksa hiç render edilmez.
 */
export default function NextMatchBanner({ next, league }: { next: Match | null; league: string }) {
  if (!next) return null

  const tm = validTime(next.time)
  const target = next.date ? `${next.date}T${tm ?? '00:00'}:00` : null
  const label = next.roundLabel ?? next.competition ?? null
  const detail = next.macId
    ? { href: matchHref(next), text: 'Maç Detayı' }
    : { href: '/mac-merkezi', text: 'Maç Merkezi' }

  return (
    <div className="relative mb-10 overflow-hidden rounded-3xl border border-[#e6efe9] bg-white p-6 shadow-[0_28px_64px_-32px_rgba(12,46,34,0.28)] md:p-9">
      {/* İnce altın üst vurgu */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-ugold to-transparent" />

      {/* Üst şerit */}
      <div className="relative mb-6 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-ugreen">
          <span className="h-1.5 w-1.5 rounded-full bg-ugold" />
          Sıradaki Maç{label && <span className="text-[#93a89e]"> · {label}</span>}
        </span>
        <span className="hidden text-[11px] font-extrabold uppercase tracking-wide text-[#93a89e] sm:block">{league}</span>
      </div>

      <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center md:gap-9">
        {/* Karşılaşma + künye */}
        <div>
          <div className="flex items-center justify-center gap-4 md:gap-10">
            <Side name={next.homeTeam} logo={next.homeTeamLogo} isUs={next.isHome} />
            <div className="shrink-0 font-heading text-2xl font-extrabold text-[#c8d6cf] md:text-3xl">VS</div>
            <Side name={next.awayTeam} logo={next.awayTeamLogo} isUs={!next.isHome} />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] font-semibold text-[#5c6f66]">
            {target && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} className="text-ugreen" />{fmtDate(next.date!)}{tm ? ` · ${tm}` : ''}
              </span>
            )}
            {next.venue && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} className="text-ugreen" />{next.venue}
              </span>
            )}
          </div>
        </div>

        {/* Geri sayım + CTA */}
        <div className="md:w-[300px] md:border-l md:border-[#e6efe9] md:pl-9">
          {target ? (
            <CountdownTiles target={target} />
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-[#fff7db] px-4 py-3 ring-1 ring-ugold/30">
              <span className="h-1.5 w-1.5 rounded-full bg-ugold" />
              <span className="text-[11px] font-extrabold uppercase tracking-wide text-[#8a6d00]">Tarih yakında açıklanacak</span>
            </div>
          )}
          <Link
            href={detail.href}
            className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-ugreen px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-wide text-white shadow-[0_10px_24px_-12px_rgba(12,46,34,0.5)] transition-colors hover:bg-ugreend"
          >
            {detail.text}<ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  )
}
