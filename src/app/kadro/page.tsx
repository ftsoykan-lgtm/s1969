'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { playersData } from '@/data/players'
import { Player } from '@/types'

const POSITIONS: Array<Player['position'] | 'Tümü'> = ['Tümü', 'Kaleci', 'Defans', 'Orta Saha', 'Forvet']
const FLAG: Record<string, string> = { tr: '🇹🇷', br: '🇧🇷', pt: '🇵🇹', sn: '🇸🇳', it: '🇮🇹' }

export default function KadroPage() {
  const [activePos, setActivePos] = useState<Player['position'] | 'Tümü'>('Tümü')
  const filtered = activePos === 'Tümü' ? playersData : playersData.filter((p) => p.position === activePos)
  const groups: Player['position'][] = ['Kaleci', 'Defans', 'Orta Saha', 'Forvet']

  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      {/* Header */}
      <div className="bg-[#0f4a28] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-8 h-0.5 bg-[#FFD100]" />
            <p className="text-xs font-black tracking-widest uppercase text-[#FFD100]/60">2026-27 Sezonu</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Takım <span className="text-[#FFD100]">Kadrosu</span>
          </h1>
          <div className="flex flex-wrap gap-2 mt-8">
            {POSITIONS.map((pos) => (
              <button key={pos} onClick={() => setActivePos(pos)}
                className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wide transition-all ${
                  activePos === pos ? 'bg-[#FFD100] text-[#092d18]' : 'border border-white/20 text-white/60 hover:border-white/50 hover:text-white'
                }`}>
                {pos}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Oyuncular */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {(activePos === 'Tümü' ? groups : [activePos as Player['position']]).map((pos) => {
          const group = filtered.filter((p) => p.position === pos)
          if (!group.length) return null
          return (
            <div key={pos} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="block w-4 h-0.5 bg-[#FFD100]" />
                <h2 className="text-sm font-black tracking-widest uppercase text-[#1A6B3C]">{pos}ler</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {group.map((player) => (
                  <Link key={player.id} href={`/kadro/${player.slug}`}
                    className="group rounded-2xl overflow-hidden bg-white border border-[#ddeae2] shadow-sm hover:shadow-lg hover:border-[#FFD100] transition-all duration-300 hover:-translate-y-1.5">
                    <div className="relative h-52 overflow-hidden bg-[#edf7f2]">
                      <Image src={player.imageUrl} alt={player.name} fill sizes="20vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 w-9 h-9 flex items-center justify-center rounded-full bg-[#FFD100] text-[#0f4a28] text-xs font-black shadow-md border-2 border-white">
                        {player.number}
                      </div>
                      <div className="absolute top-3 right-3 text-lg">{FLAG[player.flagCode] ?? '🌍'}</div>
                    </div>
                    <div className="p-3">
                      <p className="text-[#092d18] text-sm font-black leading-tight">{player.name}</p>
                      <p className="text-[#1A6B3C] text-[11px] font-bold mt-0.5">{player.position}</p>
                      <div className="mt-2.5 grid grid-cols-3 gap-1 text-center text-[10px]">
                        {[
                          { v: player.stats.matches, l: 'Maç', c: 'text-[#092d18]' },
                          { v: player.stats.goals, l: 'Gol', c: 'text-[#1A6B3C]' },
                          { v: player.stats.assists, l: 'Ast', c: 'text-[#d4ad00]' },
                        ].map(({ v, l, c }) => (
                          <div key={l} className="bg-[#f5f9f6] rounded-lg py-1.5">
                            <div className={`text-sm font-black ${c}`}>{v}</div>
                            <div className="text-[9px] text-[#7aab8e] font-semibold uppercase tracking-wide">{l}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
