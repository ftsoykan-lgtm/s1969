'use client'

import { useState, useEffect } from 'react'
import { standingsData } from '@/data/fixtures'
import { getTeamLogos, saveTeamLogo, uploadImage, getTffCompetitions } from '@/lib/supabase/settings'
import { importTeamLogos, type LogoImportResult } from '@/lib/supabase/logos-import'
import { canonicalCompetition } from '@/lib/tff'
import { Upload, Loader2, Check, Link as LinkIcon, DownloadCloud } from 'lucide-react'

export default function AdminLogolarPage() {
  const teams = Array.from(new Set(standingsData.map((s) => s.team)))
  const autoLogos = Object.fromEntries(standingsData.map((s) => [s.team, s.teamLogo]))
  const [logos, setLogos] = useState<Record<string, string>>(autoLogos)
  const [competitions, setCompetitions] = useState<string[]>([])
  const [busy, setBusy] = useState<string | null>(null)
  const [okKey, setOkKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<LogoImportResult | null>(null)

  const handleImport = async () => {
    setImporting(true)
    setImportResult(null)
    const res = await importTeamLogos()
    setImportResult(res)
    if (res.ok) {
      const saved = await getTeamLogos()
      setLogos((prev) => ({ ...prev, ...saved }))
    }
    setImporting(false)
  }

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
    const res = await uploadImage(file, { folder: 'logos', original: true })
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
        <p className="text-sm font-bold text-ugreenm truncate mb-1.5">{name}</p>
        <div className="flex items-center gap-1.5">
          <input value={logos[name] ?? ''} onChange={(e) => setLogo(name, e.target.value)} onBlur={() => handleSaveUrl(name)}
            placeholder="Logo URL..."
            className="flex-1 min-w-0 bg-[#f5f9f6] border border-[#ddeae2] rounded-lg px-2.5 py-1.5 text-xs text-ugreenm placeholder-[#7aab8e] focus:outline-none focus:border-ugreen" />
          <label className="shrink-0 cursor-pointer p-1.5 text-[#7aab8e] hover:text-ugreen hover:bg-[#edf7f2] rounded-lg transition-all">
            {busy === name ? <Loader2 size={14} className="animate-spin" /> : okKey === name ? <Check size={14} className="text-ugreen" /> : <Upload size={14} />}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(name, f) }} />
          </label>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ugreenm">Logolar</h1>
          <p className="text-sm text-utxt2 mt-1">Takım ve turnuva logoları. Yükleyin veya URL girin.</p>
        </div>
        <button onClick={handleImport} disabled={importing}
          className="inline-flex items-center gap-2 bg-ugreen hover:bg-ugreend text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-sm transition-colors disabled:opacity-60">
          {importing ? <Loader2 size={15} className="animate-spin" /> : <DownloadCloud size={15} />}
          {importing ? 'İçe aktarılıyor...' : 'TFF logolarını içe aktar'}
        </button>
      </div>

      {importResult && (
        <div className={`rounded-xl border p-4 text-sm ${importResult.ok ? 'bg-ugreen/10 border-ugreen/30 text-ugreenm' : 'bg-[#fdecec] border-[#d01b2a]/30 text-[#9c1320]'}`}>
          {importResult.ok ? (
            <>
              <span className="font-bold">{importResult.imported}</span> logo Supabase&apos;e indirildi,{' '}
              <span className="font-bold">{importResult.skipped}</span> atlandı (zaten kayıtlı).
              {importResult.failed.length > 0 && (
                <span className="block mt-1 text-[#9c1320]">Çekilemeyen ({importResult.failed.length}): {importResult.failed.join(', ')} — tekrar deneyebilirsiniz.</span>
              )}
            </>
          ) : (
            <>İçe aktarma başarısız: {importResult.error ?? 'bilinmeyen hata'}</>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[#7aab8e]"><Loader2 size={14} className="animate-spin" /> Yükleniyor...</div>
      ) : (
        <>
          {/* Turnuva logoları */}
          <div>
            <p className="text-xs font-extrabold tracking-widest uppercase text-ugreen mb-3 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-ugold inline-block" /> Turnuva Logoları
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
            <p className="text-xs font-extrabold tracking-widest uppercase text-ugreen mb-3 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-ugold inline-block" /> Takım Logoları
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teams.map((t) => <LogoRow key={t} name={t} />)}
            </div>
          </div>
        </>
      )}

      <div className="flex items-start gap-2.5 bg-ugold/10 border border-ugold/30 rounded-xl p-4 text-sm text-ugreenm">
        <LinkIcon size={15} className="text-ugoldd mt-0.5 shrink-0" />
        <span>{"Logolar otomatik 128×128px'e ölçeklenir ve Supabase Storage'a yüklenir. URL alanından çıkınca otomatik kaydedilir. Takım logoları TFF'den otomatik gelir; turnuva logolarını siz eklersiniz. \"TFF logolarını içe aktar\" ile tüm takım logolarını tek seferde veritabanına indirebilirsiniz."}</span>
      </div>
    </div>
  )
}
