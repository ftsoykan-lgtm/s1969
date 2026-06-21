'use client'

import { useState, useEffect } from 'react'
import { standingsData } from '@/data/fixtures'
import { getTeamLogos, saveTeamLogo, uploadImage } from '@/lib/supabase/settings'
import { Upload, Loader2, Check, Link as LinkIcon } from 'lucide-react'

export default function AdminLogolarPage() {
  const teams = Array.from(new Set(standingsData.map((s) => s.team)))
  // Başlangıç: TFF'den otomatik çekilen logolar
  const autoLogos = Object.fromEntries(standingsData.map((s) => [s.team, s.teamLogo]))
  const [logos, setLogos] = useState<Record<string, string>>(autoLogos)
  const [busy, setBusy] = useState<string | null>(null)
  const [okTeam, setOkTeam] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🟣 [LogolarPage] Sayfa açıldı. Takım sayısı:', teams.length)
    getTeamLogos().then((saved) => {
      console.log('🟣 [LogolarPage] Supabase kayıtlı logolar:', saved)
      // Otomatik logoların üzerine, manuel kaydedilmiş olanları uygula
      setLogos((prev) => ({ ...prev, ...saved }))
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setLogo = (team: string, url: string) => setLogos((p) => ({ ...p, [team]: url }))

  const handleUpload = async (team: string, file: File) => {
    setBusy(team)
    const res = await uploadImage(file, { folder: 'teams', size: 128 })
    if (res.ok && res.url) {
      setLogo(team, res.url)
      await saveTeamLogo(team, res.url)
      setOkTeam(team)
      setTimeout(() => setOkTeam(null), 2000)
    }
    setBusy(null)
  }

  const handleSaveUrl = async (team: string) => {
    setBusy(team)
    await saveTeamLogo(team, logos[team] ?? '')
    setOkTeam(team)
    setTimeout(() => setOkTeam(null), 2000)
    setBusy(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#092d18]">Takım Logoları</h1>
        <p className="text-sm text-[#3d6b52] mt-1">
          Puan tablosu ve fikstürdeki takımların logoları. Yükleyebilir veya URL girebilirsiniz.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[#7aab8e]">
          <Loader2 size={14} className="animate-spin" /> Yükleniyor...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {teams.map((team) => (
            <div key={team} className="flex items-center gap-3 bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-3">
              <div className="w-12 h-12 rounded-xl border border-[#ddeae2] bg-[#f5f9f6] flex items-center justify-center overflow-hidden shrink-0">
                {logos[team] ? (
                  <img src={logos[team]} alt={team} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-[9px] text-[#7aab8e]">logo</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#092d18] truncate mb-1.5">{team}</p>
                <div className="flex items-center gap-1.5">
                  <input
                    value={logos[team] ?? ''}
                    onChange={(e) => setLogo(team, e.target.value)}
                    onBlur={() => handleSaveUrl(team)}
                    placeholder="Logo URL..."
                    className="flex-1 min-w-0 bg-[#f5f9f6] border border-[#ddeae2] rounded-lg px-2.5 py-1.5 text-xs text-[#092d18] placeholder-[#7aab8e] focus:outline-none focus:border-[#1A6B3C]"
                  />
                  <label className="shrink-0 cursor-pointer p-1.5 text-[#7aab8e] hover:text-[#1A6B3C] hover:bg-[#edf7f2] rounded-lg transition-all">
                    {busy === team ? <Loader2 size={14} className="animate-spin" />
                      : okTeam === team ? <Check size={14} className="text-[#1A6B3C]" />
                      : <Upload size={14} />}
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(team, f) }} />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-start gap-2.5 bg-[#FFD100]/10 border border-[#FFD100]/30 rounded-xl p-4 text-sm text-[#092d18]">
        <LinkIcon size={15} className="text-[#d4ad00] mt-0.5 shrink-0" />
        <span>Logolar otomatik 128×128px'e ölçeklenir ve Supabase Storage'a yüklenir. URL alanından çıkınca otomatik kaydedilir.</span>
      </div>
    </div>
  )
}
