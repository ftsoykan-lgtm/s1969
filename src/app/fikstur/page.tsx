import type { Metadata } from 'next'
import { getTeamLogoMap, applyLogosToStandings, applyLogosToMatches } from '@/lib/supabase/logos-server'
import { getLiveTff } from '@/lib/supabase/tff-server'
import MacMerkezi from '@/components/macmerkezi/MacMerkezi'

export const metadata: Metadata = {
  title: 'Maç Merkezi',
  description: 'Şanlıurfaspor FK fikstür, sonuçlar ve puan durumu — TFF 2. Lig Beyaz Grup.',
}

export const dynamic = 'force-dynamic'

export default async function MacMerkeziPage() {
  const [{ standings: rawStandings, matches: rawMatches, meta }, logoMap] =
    await Promise.all([getLiveTff(), getTeamLogoMap()])
  const matches = applyLogosToMatches(rawMatches, logoMap)
  const standings = applyLogosToStandings(rawStandings, logoMap)

  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      <div className="bg-[#0f4a28] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-8 h-0.5 bg-[#FFD100]" />
            <p className="text-xs font-black tracking-widest uppercase text-[#FFD100]/60">{meta.league} · {meta.season}</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Maç <span className="text-[#FFD100]">Merkezi</span>
          </h1>
          <p className="mt-3 text-[11px] text-white/40">
            Veri kaynağı: TFF · Son güncelleme: {new Date(meta.updatedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <MacMerkezi all={matches} standings={standings} season={meta.season} />
      </div>
    </div>
  )
}
