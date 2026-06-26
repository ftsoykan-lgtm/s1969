import { Ticket, MapPin, Clock, Info } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Bilet Al' }

const matches = [
  { id: 1, opponent: 'Galatasaray', date: '2026-07-12', time: '19:00', venue: 'GAP Arena', prices: { ucurtma: 150, orta: 250, vip: 500 } },
  { id: 2, opponent: 'Fenerbahçe', date: '2026-07-26', time: '20:30', venue: 'GAP Arena', prices: { ucurtma: 200, orta: 350, vip: 750 } },
  { id: 3, opponent: 'Beşiktaş', date: '2026-08-09', time: '19:00', venue: 'GAP Arena', prices: { ucurtma: 150, orta: 250, vip: 500 } },
]

export default function BiletPage() {
  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      <div className="bg-[#1A6B3C] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-8 h-0.5 bg-[#FFD100]" />
            <p className="text-xs font-black tracking-widest uppercase text-[#FFD100]/60">Maç Biletleri</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Bilet <span className="text-[#FFD100]">Al</span>
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 pb-20 space-y-6">
        <div className="flex items-start gap-3 bg-[#FFD100]/10 border border-[#FFD100]/30 rounded-xl p-4">
          <Info size={16} className="text-[#d4ad00] mt-0.5 shrink-0" />
          <p className="text-sm text-[#15532f]">Biletler çevrimiçi satın alınabilir veya GAP Arena gişesinden temin edilebilir. Üye indirimi için giriş yapın.</p>
        </div>

        {matches.map((m) => (
          <div key={m.id} className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm overflow-hidden">
            <div className="bg-[#0f4a28] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-[#FFD100] text-xs font-black tracking-widest uppercase mb-1">Ev Sahibi Maçı</p>
                <h2 className="text-white font-black text-xl">Şanlıurfaspor <span className="text-white/40 mx-2 font-normal">vs</span> {m.opponent}</h2>
              </div>
              <div className="flex items-center gap-4 text-sm text-white/70">
                <span className="flex items-center gap-1"><Clock size={13} />{m.date} — {m.time}</span>
                <span className="flex items-center gap-1"><MapPin size={13} />{m.venue}</span>
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { tier: 'Uçurtma Tribün', price: m.prices.ucurtma, color: 'border-[#ddeae2]', badge: 'bg-[#edf7f2] text-[#1A6B3C]' },
                { tier: 'Orta Tribün', price: m.prices.orta, color: 'border-[#1A6B3C]/40', badge: 'bg-[#1A6B3C] text-white' },
                { tier: 'VIP Tribün', price: m.prices.vip, color: 'border-[#FFD100]/60', badge: 'bg-[#FFD100] text-[#15532f]' },
              ].map(({ tier, price, color, badge }) => (
                <div key={tier} className={`rounded-xl border-2 ${color} p-4 flex flex-col gap-3`}>
                  <span className={`inline-block self-start px-2.5 py-1 rounded-full text-[11px] font-black ${badge}`}>{tier}</span>
                  <p className="text-2xl font-black text-[#15532f]">₺{price}</p>
                  <button className="w-full bg-[#1A6B3C] hover:bg-[#0f4a28] text-white text-sm font-black py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <Ticket size={14} /> Satın Al
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
