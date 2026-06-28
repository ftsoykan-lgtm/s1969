'use client'

import { useState, useEffect } from 'react'
import { getSponsorsAdmin, saveSponsor, deleteSponsor, uploadImage, type SponsorRow } from '@/lib/supabase/settings'
import { Plus, Trash2, Upload, Loader2, Check, AlertCircle } from 'lucide-react'

const TIERS: { key: SponsorRow['tier']; label: string }[] = [
  { key: 'ana', label: 'Ana Sponsor' },
  { key: 'resmi', label: 'Resmi Sponsor' },
  { key: 'destekci', label: 'Destekçi' },
]

export default function AdminSponsorlarPage() {
  const [rows, setRows] = useState<SponsorRow[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<number | 'yeni' | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const load = () => getSponsorsAdmin().then((r) => { setRows(r); setLoading(false) })
  useEffect(() => { load() }, [])

  const update = (i: number, patch: Partial<SponsorRow>) =>
    setRows((prev) => prev.map((r, idx) => idx === i ? { ...r, ...patch } : r))

  const addNew = () =>
    setRows((prev) => [...prev, { name: 'Yeni Sponsor', tier: 'destekci', website: '#', active: true, sort_order: prev.length }])

  const handleSave = async (i: number) => {
    const s = rows[i]
    setBusy(s.id ?? 'yeni'); setErr(null)
    const res = await saveSponsor(s)
    if (res.ok) { await load() } else { setErr(`Kaydedilemedi: ${res.error}`) }
    setBusy(null)
  }

  const handleDelete = async (s: SponsorRow, i: number) => {
    if (s.id) {
      setBusy(s.id)
      await deleteSponsor(s.id)
      await load()
      setBusy(null)
    } else {
      setRows((prev) => prev.filter((_, idx) => idx !== i))
    }
  }

  const handlePhoto = async (i: number, file: File) => {
    setBusy(rows[i].id ?? 'yeni')
    const res = await uploadImage(file, { folder: 'sponsors', width: 320, height: 120, fit: 'contain' })
    if (res.ok && res.url) update(i, { logo_url: res.url })
    setBusy(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ugreenm">Sponsorlar</h1>
          <p className="text-sm text-utxt2 mt-1">{rows.length} sponsor · Ana / Resmi / Destekçi</p>
        </div>
        <button onClick={addNew}
          className="inline-flex items-center gap-2 bg-ugreen hover:bg-ugreend text-white font-extrabold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
          <Plus size={15} /> Sponsor Ekle
        </button>
      </div>

      {err && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={15} className="shrink-0" /> {err}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[#7aab8e]"><Loader2 size={14} className="animate-spin" /> Yükleniyor...</div>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ddeae2] p-10 text-center">
          <p className="text-sm font-bold text-ugreenm">Henüz sponsor yok</p>
          <p className="text-xs text-[#7aab8e] mt-1">"Sponsor Ekle" ile başlayın.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((s, i) => (
            <div key={s.id ?? `yeni-${i}`} className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-4">
              <div className="flex items-start gap-4">
                {/* Logo */}
                <div className="w-28 h-14 rounded-xl border border-[#ddeae2] bg-[#f5f9f6] flex items-center justify-center overflow-hidden shrink-0">
                  {s.logo_url ? <img src={s.logo_url} alt={s.name} className="max-w-full max-h-full object-contain" /> : <span className="text-[10px] text-[#7aab8e]">logo</span>}
                </div>

                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Ad">
                    <input value={s.name} onChange={(e) => update(i, { name: e.target.value })} className={inputCls} />
                  </Field>
                  <Field label="Kademe">
                    <select value={s.tier} onChange={(e) => update(i, { tier: e.target.value as SponsorRow['tier'] })} className={inputCls}>
                      {TIERS.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Web Sitesi">
                    <input value={s.website ?? ''} onChange={(e) => update(i, { website: e.target.value })} placeholder="https://..." className={inputCls} />
                  </Field>
                  <Field label="Logo">
                    <div className="flex items-center gap-1.5">
                      <input value={s.logo_url ?? ''} onChange={(e) => update(i, { logo_url: e.target.value })} placeholder="URL veya yükle" className={inputCls} />
                      <label className="shrink-0 cursor-pointer p-2 text-[#7aab8e] hover:text-ugreen hover:bg-[#edf7f2] rounded-lg transition-all">
                        <Upload size={15} />
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhoto(i, f) }} />
                      </label>
                    </div>
                  </Field>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <button onClick={() => handleSave(i)} disabled={busy !== null}
                    className="inline-flex items-center gap-1.5 bg-ugreen hover:bg-ugreend disabled:opacity-60 text-white text-xs font-extrabold px-3 py-2 rounded-lg transition-colors">
                    {busy === (s.id ?? 'yeni') ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Kaydet
                  </button>
                  <button onClick={() => handleDelete(s, i)}
                    className="inline-flex items-center justify-center gap-1.5 text-[#7aab8e] hover:text-red-500 hover:bg-red-50 text-xs font-bold px-3 py-2 rounded-lg transition-all">
                    <Trash2 size={13} /> Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const inputCls = 'w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-3 py-2 text-sm text-ugreenm placeholder-[#7aab8e] focus:outline-none focus:border-ugreen transition-colors'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-extrabold text-utxt2 mb-1 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}
