import type { Metadata } from 'next'
import { getLiveTff } from '@/lib/supabase/tff-server'
import { Users, ExternalLink, Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Takım Kadrosu',
  description: 'Şanlıurfaspor FK profesyonel takım kadrosu — TFF kaynaklı.',
}

export const dynamic = 'force-dynamic'

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toLocaleUpperCase('tr-TR')
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0f4a28] text-[#FFD100] text-sm font-black shrink-0">
      {initials}
    </div>
  )
}

export default async function KadroPage() {
  const { squad } = await getLiveTff()
  const players = squad.players

  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      {/* Header */}
      <div className="bg-[#0f4a28] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-8 h-0.5 bg-[#FFD100]" />
            <p className="text-xs font-black tracking-widest uppercase text-[#FFD100]/60">
              Profesyonel Takım{squad.season ? ` · ${squad.season}` : ''}
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Takım <span className="text-[#FFD100]">Kadrosu</span>
          </h1>
          {players.length > 0 && (
            <p className="mt-3 text-[11px] text-white/40">Veri kaynağı: TFF · {players.length} oyuncu</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {players.length === 0 ? (
          /* Kadro boş → Güncelleniyor */
          <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-16 text-center max-w-xl mx-auto">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf7f2] mb-5">
              <Loader2 size={28} className="text-[#1A6B3C] animate-spin" />
            </div>
            <h2 className="text-xl font-black text-[#092d18] mb-2">Kadro Güncelleniyor...</h2>
            <p className="text-sm text-[#3d6b52] leading-relaxed">
              Güncel sezon kadrosu TFF sisteminde henüz yayınlanmadı.
              Kadro açıklandığında bu sayfada otomatik olarak görünecek.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {players.map((p, i) => (
              <div key={`${p.name}-${i}`}
                className="group flex items-center gap-3 bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-3.5 hover:shadow-md hover:border-[#1A6B3C]/30 transition-all">
                <Avatar name={p.name} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#092d18] truncate">{p.name}</p>
                  <p className="text-[11px] text-[#7aab8e]">Profesyonel</p>
                </div>
                {p.tffId && (
                  <a href={`https://www.tff.org/Default.aspx?pageId=30&kisiId=${p.tffId}`}
                    target="_blank" rel="noopener noreferrer"
                    className="p-2 text-[#7aab8e] hover:text-[#1A6B3C] hover:bg-[#edf7f2] rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="TFF profili">
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {players.length > 0 && (
          <div className="mt-8 flex items-center gap-2 text-xs text-[#7aab8e]">
            <Users size={13} />
            Kadro her hafta TFF'den otomatik güncellenir.
          </div>
        )}
      </div>
    </div>
  )
}
