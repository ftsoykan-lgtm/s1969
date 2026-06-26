'use client'

import { useState, useEffect } from 'react'
import { standingsData } from '@/data/fixtures'
import { getTeamLogos, saveTeamLogo, uploadImage, getTffCompetitions } from '@/lib/supabase/settings'
import { canonicalCompetition } from '@/lib/tff'
import { Upload, Loader2, Check, Link as LinkIcon } from 'lucide-react'

export default function AdminLogolarPage() {
  const teams = Array.from(new Set(standingsData.map((s) => s.team)))
  const autoLogos = Object.fromEntries(standingsData.map((s) => [s.team, s.teamLogo]))
  const [logos, setLogos] = useState<Record<string, string>>(autoLogos)
  const [competitions, setCompetitions] = useState<string[]>([])
  const [busy, setBusy] = useState<string | null>(null)
  const [okKey, setOkKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getTeamLogos(), getTffCompetitions()]).then(([saved, comps]) => {
      // Eski (grup/play-off) anahtarlarla kayıtlı turnuva logosunu kanonik slota taşı
      const canon: Record<string, string> = {}
      for (const [k, v] of Object.entries(saved)) {
        const c = canonicalCompetition(k)
        if (c !== k && v && !saved[c]) canon[c] = v
      }
      setLogos((prev) => ({ ...prev, ...saved, ...canon }))
      setCompetitions(comps)
      setLoading(false)
    })
  }, [])

  const setLogo = (key: string, url: string) => setLogos((p) => ({ ...p, [key]: url }))

  const handleUpload = async (key: string, file: File) => {
    setBusy(key)
    const res = await uploadImage(file, { folder: 'logos', size: 128 })
    if (res.ok && res.url) {
      setLogo(key, res.url)
      await saveTeamLogo(key, res.url)
      setOkKey(key); setTimeout(() => setOkKey(null), 2000)
    }
    setBusy(null)
  }

  const handleSaveUrl = async (key: string) => {
    setBusy(key)
    await saveTeamLogo(key, logos[key] ?? '')
    setOkKey(key); setTimeout(() => setOkKey(null), 2000)
    setBusy(null)
  }

  const LogoRow = ({ name }: { name: string }) => (
    <div className="flex items-center gap-3 bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-3">
      <div className="w-12 h-12 rounded-xl border border-[#ddeae2] bg-[#f5f9f6] flex items-center justify-center overflow-hidden shrink-0">
        {logos[name] ? <img src={logos[name]} alt={name} className="w-full h-full object-contain" /> : <span className="text-[9px] text-[#7aab8e]">logo</span>}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#154836] truncate mb-1.5">{name}</p>
        <div className="flex items-center gap-1.5">
          <input value={logos[name] ?? ''} onChange={(e) => setLogo(name, e.target.value)} onBlur={() => handleSaveUrl(name)}
            placeholder="Logo URL..."
            className="flex-1 min-w-0 bg-[#f5f9f6] border border-[#ddeae2] rounded-lg px-2.5 py-1.5 text-xs text-[#154836] placeholder-[#7aab8e] focus:outline-none focus:border-[#1b5e44]" />
          <label className="shrink-0 cursor-pointer p-1.5 text-[#7aab8e] hover:text-[#1b5e44] hover:bg-[#edf7f2] rounded-lg transition-all">
            {busy === name ? <Loader2 size={14} className="animate-spin" /> : okKey === name ? <Check size={14} className="text-[#1b5e44]" /> : <Upload size={14} />}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(name, f) }} />
          </label>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#154836]">Logolar</h1>
        <p className="text-sm text-[#356152] mt-1">Takım ve turnuva logoları. Yükleyin veya URL girin.</p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[#7aab8e]"><Loader2 size={14} className="animate-spin" /> Yükleniyor...</div>
      ) : (
        <>
          {/* Turnuva logoları */}
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-[#1b5e44] mb-3 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-[#f5c400] inline-block" /> Turnuva Logoları
            </p>
            {competitions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#ddeae2] p-5 text-sm text-[#7aab8e]">
                Turnuvalar TFF verisi senkronize edilince listelenir (Nesine 2. Lig, Ziraat Türkiye Kupası).
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {competitions.map((c) => <LogoRow key={c} name={c} />)}
              </div>
            )}
          </div>

          {/* Takım logoları */}
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-[#1b5e44] mb-3 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-[#f5c400] inline-block" /> Takım Logoları
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teams.map((t) => <LogoRow key={t} name={t} />)}
            </div>
          </div>
        </>
      )}

      <div className="flex items-start gap-2.5 bg-[#f5c400]/10 border border-[#f5c400]/30 rounded-xl p-4 text-sm text-[#154836]">
        <LinkIcon size={15} className="text-[#c9a200] mt-0.5 shrink-0" />
        <span>Logolar otomatik 128×128px'e ölçeklenir ve Supabase Storage'a yüklenir. URL alanından çıkınca otomatik kaydedilir. Takım logoları TFF'den otomatik gelir; turnuva logolarını siz eklersiniz.</span>
      </div>
    </div>
  )
}
