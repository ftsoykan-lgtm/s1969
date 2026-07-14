import { Ticket, MapPin, Clock, Info } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Bilet Al' }

const matches = [
  { id: 1, opponent: 'Galatasaray', date: '2026-07-12', time: '19:00', venue: '11 Nisan Stadyumu', prices: { ucurtma: 150, orta: 250, vip: 500 } },
  { id: 2, opponent: 'Fenerbahçe', date: '2026-07-26', time: '20:30', venue: '11 Nisan Stadyumu', prices: { ucurtma: 200, orta: 350, vip: 750 } },
  { id: 3, opponent: 'Beşiktaş', date: '2026-08-09', time: '19:00', venue: '11 Nisan Stadyumu', prices: { ucurtma: 150, orta: 250, vip: 500 } },
]

export default function BiletPage() {
  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      <div className="page-hero py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-[-0.03em] leading-[0.95]">
            Bilet <span className="text-ugold">Al</span>
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 pb-20 space-y-6">
        <div className="flex items-start gap-3 bg-ugold/10 border border-ugold/30 rounded-xl p-4">
          <Info size={16} className="text-ugoldd mt-0.5 shrink-0" />
          <p className="text-sm text-ugreenm">Biletler çevrimiçi satın alınabilir veya 11 Nisan Stadyumu gişesinden temin edilebilir. Üye indirimi için giriş yapın.</p>
        </div>

        {matches.map((m) => (
          <div key={m.id} className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm overflow-hidden">
            <div className="bg-ugreend px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-ugold text-xs font-extrabold tracking-widest uppercase mb-1">Ev Sahibi Maçı</p>
                <h2 className="text-white font-extrabold text-xl">Şanlıurfaspor <span className="text-white/40 mx-2 font-normal">vs</span> {m.opponent}</h2>
              </div>
              <div className="flex items-center gap-4 text-sm text-white/70">
                <span className="flex items-center gap-1"><Clock size={13} />{m.date} — {m.time}</span>
                <span className="flex items-center gap-1"><MapPin size={13} />{m.venue}</span>
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { tier: 'Uçurtma Tribün', price: m.prices.ucurtma, color: 'border-[#ddeae2]', badge: 'bg-[#edf7f2] text-ugreen' },
                { tier: 'Orta Tribün', price: m.prices.orta, color: 'border-ugreen/40', badge: 'bg-ugreen text-white' },
                { tier: 'VIP Tribün', price: m.prices.vip, color: 'border-ugold/60', badge: 'bg-ugold text-ugreenm' },
              ].map(({ tier, price, color, badge }) => (
                <div key={tier} className={`rounded-xl border-2 ${color} p-4 flex flex-col gap-3`}>
                  <span className={`inline-block self-start px-2.5 py-1 rounded-full text-[11px] font-extrabold ${badge}`}>{tier}</span>
                  <p className="text-2xl font-extrabold text-ugreenm">₺{price}</p>
                  <button className="w-full bg-ugreen hover:bg-ugreend text-white text-sm font-extrabold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
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
