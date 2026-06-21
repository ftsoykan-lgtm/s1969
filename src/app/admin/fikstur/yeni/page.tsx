'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

const competitions = ['Süper Lig', 'Türkiye Kupası', 'Hazırlık Maçı', 'UEFA']

export default function YeniMacPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [form, setForm] = useState({
    homeTeam: 'Şanlıurfaspor', awayTeam: '', homeTeamLogo: 'https://placehold.co/40x40/1A6B3C/FFD100?text=ŞFK',
    awayTeamLogo: '', homeScore: '', awayScore: '',
    date: '', time: '19:00', venue: 'GAP Arena', competition: 'Süper Lig',
  })

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    setLoading(false)
    router.push('/admin/fikstur')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/fikstur" className="p-2 text-[#7aab8e] hover:text-[#1A6B3C] hover:bg-[#edf7f2] rounded-xl transition-all">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-black text-[#092d18]">Yeni Maç</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6 space-y-4">
          <p className="text-xs font-black text-[#7aab8e] uppercase tracking-widest">Maç Bilgileri</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-[#3d6b52] mb-1.5 uppercase tracking-wide">Ev Sahibi *</label>
              <input value={form.homeTeam} onChange={e => set('homeTeam', e.target.value)} required
                className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-2.5 text-sm text-[#092d18] focus:outline-none focus:border-[#1A6B3C] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-black text-[#3d6b52] mb-1.5 uppercase tracking-wide">Deplasman *</label>
              <input value={form.awayTeam} onChange={e => set('awayTeam', e.target.value)} required placeholder="Rakip takım"
                className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-2.5 text-sm text-[#092d18] placeholder-[#7aab8e] focus:outline-none focus:border-[#1A6B3C] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-black text-[#3d6b52] mb-1.5 uppercase tracking-wide">Tarih *</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} required
                className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-2.5 text-sm text-[#092d18] focus:outline-none focus:border-[#1A6B3C] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-black text-[#3d6b52] mb-1.5 uppercase tracking-wide">Saat</label>
              <input type="time" value={form.time} onChange={e => set('time', e.target.value)}
                className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-2.5 text-sm text-[#092d18] focus:outline-none focus:border-[#1A6B3C] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-black text-[#3d6b52] mb-1.5 uppercase tracking-wide">Stat</label>
              <input value={form.venue} onChange={e => set('venue', e.target.value)}
                className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-2.5 text-sm text-[#092d18] focus:outline-none focus:border-[#1A6B3C] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-black text-[#3d6b52] mb-1.5 uppercase tracking-wide">Organizasyon</label>
              <select value={form.competition} onChange={e => set('competition', e.target.value)}
                className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-2.5 text-sm text-[#092d18] focus:outline-none focus:border-[#1A6B3C] transition-colors">
                {competitions.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-[#7aab8e] uppercase tracking-widest">Sonuç</p>
            <label className="flex items-center gap-2 cursor-pointer">
              <div onClick={() => setIsCompleted(!isCompleted)}
                className={`w-10 h-5 rounded-full transition-colors relative ${isCompleted ? 'bg-[#1A6B3C]' : 'bg-[#ddeae2]'}`}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${isCompleted ? 'left-5' : 'left-0.5'}`} />
              </div>
              <span className="text-sm font-bold text-[#3d6b52]">Maç oynandı</span>
            </label>
          </div>
          {isCompleted && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-[#3d6b52] mb-1.5 uppercase tracking-wide">{form.homeTeam || 'Ev Sahibi'} Golü</label>
                <input type="number" min="0" max="20" value={form.homeScore} onChange={e => set('homeScore', e.target.value)}
                  className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-3 text-2xl font-black text-[#092d18] text-center focus:outline-none focus:border-[#1A6B3C] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-black text-[#3d6b52] mb-1.5 uppercase tracking-wide">{form.awayTeam || 'Deplasman'} Golü</label>
                <input type="number" min="0" max="20" value={form.awayScore} onChange={e => set('awayScore', e.target.value)}
                  className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-3 text-2xl font-black text-[#092d18] text-center focus:outline-none focus:border-[#1A6B3C] transition-colors" />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Link href="/admin/fikstur" className="px-5 py-2.5 border border-[#ddeae2] text-[#3d6b52] font-bold text-sm rounded-xl hover:bg-[#f5f9f6] transition-colors">İptal</Link>
          <button type="submit" disabled={loading}
            className="inline-flex items-center gap-2 bg-[#1A6B3C] hover:bg-[#0f4a28] disabled:opacity-60 text-white font-black px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
            <Save size={15} />
            {loading ? 'Kaydediliyor...' : 'Maç Ekle'}
          </button>
        </div>
      </form>
    </div>
  )
}
