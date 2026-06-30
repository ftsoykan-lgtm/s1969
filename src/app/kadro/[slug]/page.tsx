import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { playersData } from '@/data/players'
import { formatDate } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return playersData.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const player = playersData.find((p) => p.slug === slug)
  if (!player) return {}
  return { title: player.name }
}

export default async function OyuncuDetayPage({ params }: Props) {
  const { slug } = await params
  const player = playersData.find((p) => p.slug === slug)
  if (!player) notFound()

  const FLAG: Record<string, string> = { tr: '🇹🇷', br: '🇧🇷', pt: '🇵🇹', sn: '🇸🇳', it: '🇮🇹' }
  const stats = [
    { label: 'Maç', value: player.stats.matches, color: 'text-ugreenm' },
    { label: 'Gol', value: player.stats.goals, color: 'text-ugreen' },
    { label: 'Asist', value: player.stats.assists, color: 'text-ugoldd' },
    { label: 'Sarı Kart', value: player.stats.yellowCards, color: 'text-yellow-500' },
    { label: 'Kırmızı', value: player.stats.redCards, color: 'text-red-500' },
  ]

  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      {/* Hero banner */}
      <div className="page-hero py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link href="/kadro" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-6">
            <ArrowLeft size={16} /> Kadroya Dön
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ugold text-ugreend font-extrabold text-2xl shadow-lg">
              {player.number}
            </div>
            <div>
              <p className="text-ugold text-xs font-extrabold tracking-widest uppercase">{player.position}</p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">{player.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          {/* Fotoğraf */}
          <div className="relative rounded-2xl overflow-hidden h-96 border border-[#ddeae2] shadow-lg">
            <Image src={player.imageUrl} alt={player.name} fill sizes="(max-width: 768px) 100vw, 380px" className="object-cover object-top" />
          </div>

          {/* Bilgiler */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6">
              <h2 className="text-xs font-extrabold tracking-widest uppercase text-[#7aab8e] mb-5">Oyuncu Bilgileri</h2>
              <dl className="space-y-3">
                {[
                  { label: 'Uyruk', value: `${FLAG[player.flagCode] ?? '🌍'} ${player.nationality}` },
                  { label: 'Doğum Tarihi', value: formatDate(player.birthDate) },
                  { label: 'Forma No', value: `#${player.number}` },
                  { label: 'Mevki', value: player.position },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-[#edf7f2] last:border-0">
                    <dt className="text-sm text-utxt2">{label}</dt>
                    <dd className="text-sm font-extrabold text-ugreenm">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6">
              <h2 className="text-xs font-extrabold tracking-widest uppercase text-[#7aab8e] mb-5">Sezon İstatistikleri</h2>
              <div className="grid grid-cols-5 gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="text-center bg-[#f5f9f6] rounded-xl py-4">
                    <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
                    <div className="text-[10px] text-[#7aab8e] mt-1 font-semibold uppercase tracking-wide">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
