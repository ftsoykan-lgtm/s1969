import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { Match } from '@/types'
import { MapPin } from 'lucide-react'
import { getTeamLogoMap, applyLogosToMatches } from '@/lib/supabase/logos-server'
import { getLiveTff } from '@/lib/supabase/tff-server'

function MatchCard({ match }: { match: Match }) {
  const urfaIsHome = match.homeTeam === 'Şanlıurfaspor'
  const urfaScore = urfaIsHome ? match.homeScore : match.awayScore
  const oppScore = urfaIsHome ? match.awayScore : match.homeScore
  const result = match.isCompleted && urfaScore !== null && oppScore !== null
    ? urfaScore > oppScore ? 'G' : urfaScore < oppScore ? 'M' : 'B'
    : null

  // Sonuca göre kart rengi (G: yeşil, M: kırmızı, B: sarı)
  const cardStyle =
    result === 'G' ? 'bg-[#edf7f2] border-[#1A6B3C]/40'
    : result === 'M' ? 'bg-red-50 border-red-200'
    : 'bg-white border-[#ddeae2]'
  const scoreColor =
    result === 'G' ? 'text-[#1A6B3C]'
    : result === 'M' ? 'text-red-600'
    : 'text-[#0f4a28]'

  return (
    <div className={`rounded-2xl p-5 border-2 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 ${cardStyle}`}>
      {/* Üst etiket */}
      <div className="flex items-center justify-between mb-4 h-4">
        <span className="text-[10px] font-black tracking-widest uppercase text-[#1A6B3C] truncate">
          {match.competition}{match.week ? ` ${match.week}.Hafta` : ''}
        </span>
        {!match.isCompleted && (
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FFD100]/30 text-[#0f4a28] shrink-0 ml-2">YAKLAŞAN</span>
        )}
      </div>

      {/* Takımlar ve skor — sabit 3 sütun (kaymaz) */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2">
        {/* Ev sahibi */}
        <div className="flex flex-col items-center gap-2 min-w-0">
          <div className="relative w-10 h-10 shrink-0">
            <Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-contain" />
          </div>
          <span className="text-xs font-bold text-[#092d18] text-center w-full truncate">{match.homeTeam}</span>
        </div>

        {/* Skor — sabit genişlik, asla bölünmez */}
        <div className="flex items-center justify-center px-1 pt-1 shrink-0">
          {match.isCompleted ? (
            <span className={`text-2xl font-black tabular-nums whitespace-nowrap tracking-tight ${scoreColor}`}>
              {match.homeScore}<span className="text-[#7aab8e] mx-1">-</span>{match.awayScore}
            </span>
          ) : (
            <div className="text-center whitespace-nowrap">
              <div className="text-base font-black text-[#1A6B3C]">{match.time || 'vs'}</div>
              <div className="text-[10px] text-[#7aab8e] mt-0.5">{formatDate(match.date)}</div>
            </div>
          )}
        </div>

        {/* Deplasman */}
        <div className="flex flex-col items-center gap-2 min-w-0">
          <div className="relative w-10 h-10 shrink-0">
            <Image src={match.awayTeamLogo} alt={match.awayTeam} fill className="object-contain" />
          </div>
          <span className="text-xs font-bold text-[#092d18] text-center w-full truncate">{match.awayTeam}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-[11px] text-[#7aab8e] border-t border-black/5 pt-3">
        <MapPin size={11} className="shrink-0 text-[#1A6B3C]" />
        <span className="truncate">{match.venue}</span>
      </div>
    </div>
  )
}

export default async function FixturePreview() {
  const [{ matches, meta: fixtureMeta }, logoMap] = await Promise.all([getLiveTff(), getTeamLogoMap()])
  const allMatches = applyLogosToMatches(matches, logoMap)
  const upcomingMatches = allMatches.filter((m) => !m.isCompleted).slice(0, 4)
  // Yaklaşan maç yoksa (sezon arası) son oynanan 4 maçı göster
  const displayMatches = upcomingMatches.length >= 4
    ? upcomingMatches
    : [...allMatches.filter((m) => m.isCompleted).slice(-(4 - upcomingMatches.length)), ...upcomingMatches]

  return (
    <section className="py-16 bg-[#f8faf9]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="block w-6 h-0.5 bg-[#1A6B3C]" />
              <p className="text-xs font-black tracking-widest uppercase text-[#1A6B3C]/70">{fixtureMeta.league} · {fixtureMeta.season}</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#092d18] tracking-tight">
              Fikstür & <span className="text-[#1A6B3C]">Sonuçlar</span>
            </h2>
          </div>
          <Link
            href="/fikstur"
            className="hidden sm:inline-flex text-sm font-bold text-white bg-[#1A6B3C] rounded-xl px-4 py-2 hover:bg-[#0f4a28] transition-colors shadow-sm"
          >
            Tam Fikstür →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayMatches.map((m) => <MatchCard key={m.id} match={m} />)}
        </div>
      </div>
    </section>
  )
}
