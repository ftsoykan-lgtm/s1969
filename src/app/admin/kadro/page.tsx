'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  getPlayerProfilesAdmin, getProfileSeasons, savePlayerProfile, deletePlayerProfile,
  syncPlayersFromTff, uploadImage, type AdminPlayer,
} from '@/lib/supabase/settings'
import { Plus, Trash2, Upload, Loader2, Check, AlertCircle, RefreshCw, ChevronDown, ExternalLink, EyeOff } from 'lucide-react'

const FLAGS = [
  { code: '', label: '—' },
  { code: 'tr', label: 'Türkiye' }, { code: 'br', label: 'Brezilya' }, { code: 'pt', label: 'Portekiz' },
  { code: 'sn', label: 'Senegal' }, { code: 'ci', label: "Fildişi S." }, { code: 'fr', label: 'Fransa' },
  { code: 'ng', label: 'Nijerya' }, { code: 'cm', label: 'Kamerun' }, { code: 'gm', label: 'Gambiya' },
  { code: 'rs', label: 'Sırbistan' }, { code: 'ro', label: 'Romanya' }, { code: 'de', label: 'Almanya' },
  { code: 'nl', label: 'Hollanda' }, { code: 'gh', label: 'Gana' }, { code: 'ml', label: 'Mali' },
]

const slugify = (s: string) => (s || '').toLocaleLowerCase('tr-TR')
  .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

export default function AdminKadroPage() {
  const [seasons, setSeasons] = useState<string[]>([])
  const [season, setSeason] = useState<string>('')
  const [rows, setRows] = useState<AdminPlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState<number | string | null>(null)
  const [busy, setBusy] = useState<number | string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [msg, setMsg] = useState<{ t: 'ok' | 'err'; m: string } | null>(null)

  const load = useCallback(async (s: string) => {
    setLoading(true)
    const list = await getPlayerProfilesAdmin(s)
    setRows(list)
    setLoading(false)
  }, [])

  useEffect(() => {
    getProfileSeasons().then((ss) => {
      const now = new Date()
      const guess = now.getMonth() + 1 >= 7 ? `${now.getFullYear()}-${now.getFullYear() + 1}` : `${now.getFullYear() - 1}-${now.getFullYear()}`
      const all = Array.from(new Set([guess, ...ss]))
      setSeasons(all)
      const sel = ss[0] ?? guess
      setSeason(sel)
      load(sel)
    })
  }, [load])

  const update = (i: number, patch: Partial<AdminPlayer>) =>
    setRows((prev) => prev.map((r, idx) => idx === i ? { ...r, ...patch } : r))

  const addNew = () => {
    setRows((prev) => [{ season, name: 'Yeni Oyuncu', active: true, manual: true, sort_order: 99 }, ...prev])
    setOpen('yeni')
  }

  const handleSave = async (i: number) => {
    const p = rows[i]
    setBusy(p.id ?? 'yeni'); setMsg(null)
    const res = await savePlayerProfile({ ...p, slug: p.slug || slugify(p.name) })
    if (res.ok) { setMsg({ t: 'ok', m: `${p.name} kaydedildi` }); await load(season) }
    else setMsg({ t: 'err', m: `Kaydedilemedi: ${res.error}` })
    setBusy(null)
  }

  const handleDelete = async (p: AdminPlayer, i: number) => {
    if (p.id) {
      if (!confirm(`${p.name} silinsin mi?`)) return
      setBusy(p.id); await deletePlayerProfile(p.id); await load(season); setBusy(null)
    } else setRows((prev) => prev.filter((_, idx) => idx !== i))
  }

  const handlePhoto = async (i: number, file: File) => {
    setBusy(rows[i].id ?? 'yeni')
    const res = await uploadImage(file, { folder: 'players', width: 400, height: 500, fit: 'cover' })
    if (res.ok && res.url) update(i, { photo: res.url })
    setBusy(null)
  }

  const handleSync = async () => {
    setSyncing(true); setMsg(null)
    const res = await syncPlayersFromTff(season)
    if (res.ok) {
      setMsg({ t: 'ok', m: `TFF senkronize edildi — ${res.count} oyuncu (${res.season})` })
      const ss = await getProfileSeasons()
      setSeasons((prev) => Array.from(new Set([...prev, ...ss])))
      await load(season)
    } else setMsg({ t: 'err', m: `Senkronizasyon: ${res.error}` })
    setSyncing(false)
  }

  const activeCount = rows.filter((r) => r.active).length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-[#15532f]">Kadro / Oyuncu Profilleri</h1>
          <p className="text-sm text-[#3d6b52] mt-1">{rows.length} oyuncu · {activeCount} aktif · Sezon {season}</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={season} onChange={(e) => { setSeason(e.target.value); load(e.target.value) }}
            className="bg-white border border-[#ddeae2] rounded-xl px-3 py-2.5 text-sm font-bold text-[#15532f] focus:outline-none focus:border-[#1A6B3C]">
            {seasons.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={handleSync} disabled={syncing}
            className="inline-flex items-center gap-2 bg-[#0f4a28] hover:bg-[#1A6B3C] disabled:opacity-60 text-white font-black px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
            {syncing ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />} TFF ile Senkronize Et
          </button>
          <button onClick={addNew}
            className="inline-flex items-center gap-2 bg-[#1A6B3C] hover:bg-[#0f4a28] text-white font-black px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
            <Plus size={15} /> Oyuncu Ekle
          </button>
        </div>
      </div>

      {msg && (
        <div className={`flex items-center gap-2.5 border rounded-xl px-4 py-3 text-sm ${msg.t === 'err' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-[#edf7f2] border-[#1A6B3C]/20 text-[#1A6B3C]'}`}>
          {msg.t === 'err' ? <AlertCircle size={15} /> : <Check size={15} />} {msg.m}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[#7aab8e]"><Loader2 size={14} className="animate-spin" /> Yükleniyor...</div>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ddeae2] p-10 text-center">
          <p className="text-sm font-bold text-[#15532f]">Bu sezon için oyuncu yok</p>
          <p className="text-xs text-[#7aab8e] mt-1">&quot;TFF ile Senkronize Et&quot; ile kadroyu çekin veya elle &quot;Oyuncu Ekle&quot;.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {rows.map((p, i) => {
            const id = p.id ?? 'yeni'
            const isOpen = open === id
            return (
              <div key={id + '-' + i} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${p.active ? 'border-[#ddeae2]' : 'border-[#ddeae2] opacity-70'}`}>
                <button onClick={() => setOpen(isOpen ? null : id)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#f8faf9] transition-colors">
                  <div className="w-10 h-12 rounded-lg bg-[#f5f9f6] border border-[#ddeae2] overflow-hidden shrink-0 flex items-center justify-center">
                    {(p.photo || p.photo_tff) ? <img src={p.photo || p.photo_tff!} alt="" className="w-full h-full object-cover" /> : <span className="text-[10px] text-[#7aab8e]">{p.number ?? '?'}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-[#15532f] truncate">{p.number != null ? `${p.number} · ` : ''}{p.name}</p>
                    <p className="text-[11px] text-[#7aab8e] truncate">{p.position || 'Mevki yok'}{p.manual ? ' · Elle eklendi' : p.tff_id ? ' · TFF' : ''}</p>
                  </div>
                  {!p.active && <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-[#7aab8e] bg-[#f5f9f6] rounded px-2 py-0.5"><EyeOff size={11} /> Pasif</span>}
                  {p.id && p.slug && <Link href={`/oyuncu/${p.slug}`} target="_blank" onClick={(e) => e.stopPropagation()} className="text-[#7aab8e] hover:text-[#1A6B3C] p-1"><ExternalLink size={14} /></Link>}
                  <ChevronDown size={16} className={`text-[#7aab8e] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-[#edf7f2] space-y-3">
                    <div className="flex gap-4">
                      <div className="shrink-0">
                        <div className="w-24 rounded-xl bg-[#f5f9f6] border border-[#ddeae2] overflow-hidden flex items-center justify-center" style={{ height: 120 }}>
                          {(p.photo || p.photo_tff) ? <img src={p.photo || p.photo_tff!} alt="" className="w-full h-full object-cover" /> : <span className="text-xs text-[#7aab8e]">foto</span>}
                        </div>
                        <label className="mt-2 flex items-center justify-center gap-1.5 cursor-pointer text-[11px] font-bold text-[#1A6B3C] bg-[#edf7f2] hover:bg-[#d0ead9] rounded-lg py-1.5 transition-colors">
                          <Upload size={12} /> Foto Yükle
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhoto(i, f) }} />
                        </label>
                      </div>
                      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        <Field label="Ad Soyad"><input value={p.name} onChange={(e) => update(i, { name: e.target.value })} className={inp} /></Field>
                        <Field label="Forma No"><input type="number" value={p.number ?? ''} onChange={(e) => update(i, { number: e.target.value ? +e.target.value : null })} className={inp} /></Field>
                        <Field label="Mevki"><input value={p.position ?? ''} onChange={(e) => update(i, { position: e.target.value })} placeholder="Kaleci / Defans..." className={inp} /></Field>
                        <Field label="Doğum Tarihi"><input value={p.birth_date ?? ''} onChange={(e) => update(i, { birth_date: e.target.value })} placeholder="gg.aa.yyyy" className={inp} /></Field>
                        <Field label="Doğum Yeri"><input value={p.birth_place ?? ''} onChange={(e) => update(i, { birth_place: e.target.value })} className={inp} /></Field>
                        <Field label="Uyruk">
                          <select value={p.flag_code ?? ''} onChange={(e) => { const f = FLAGS.find((x) => x.code === e.target.value); update(i, { flag_code: e.target.value, nationality: f && f.code ? f.label : p.nationality }) }} className={inp}>
                            {FLAGS.map((f) => <option key={f.code} value={f.code}>{f.label}</option>)}
                          </select>
                        </Field>
                        <Field label="Boy"><input value={p.height ?? ''} onChange={(e) => update(i, { height: e.target.value })} placeholder="1.85 m" className={inp} /></Field>
                        <Field label="Kilo"><input value={p.weight ?? ''} onChange={(e) => update(i, { weight: e.target.value })} placeholder="78 kg" className={inp} /></Field>
                        <Field label="Geldiği Takım"><input value={p.prev_team ?? ''} onChange={(e) => update(i, { prev_team: e.target.value })} className={inp} /></Field>
                        <Field label="Lisans No"><input value={p.license_no ?? ''} onChange={(e) => update(i, { license_no: e.target.value })} className={inp} /></Field>
                      </div>
                    </div>

                    <Field label="Biyografi">
                      <textarea value={p.bio ?? ''} onChange={(e) => update(i, { bio: e.target.value })} rows={4} placeholder="Oyuncu biyografisi..." className={inp + ' resize-y leading-relaxed'} />
                    </Field>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <Field label="Instagram"><input value={p.instagram ?? ''} onChange={(e) => update(i, { instagram: e.target.value })} placeholder="https://instagram.com/..." className={inp} /></Field>
                      <Field label="X / Twitter"><input value={p.twitter ?? ''} onChange={(e) => update(i, { twitter: e.target.value })} placeholder="https://x.com/..." className={inp} /></Field>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button onClick={() => handleSave(i)} disabled={busy !== null}
                        className="inline-flex items-center gap-1.5 bg-[#1A6B3C] hover:bg-[#0f4a28] disabled:opacity-60 text-white text-xs font-black px-4 py-2.5 rounded-lg transition-colors">
                        {busy === id ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Kaydet
                      </button>
                      <label className="flex items-center gap-2 text-sm font-bold text-[#3d6b52]">
                        <input type="checkbox" checked={p.active ?? true} onChange={(e) => update(i, { active: e.target.checked })} className="w-4 h-4 accent-[#1A6B3C]" /> Aktif kadroda
                      </label>
                      <button onClick={() => handleDelete(p, i)} className="ml-auto inline-flex items-center gap-1.5 text-[#7aab8e] hover:text-red-500 hover:bg-red-50 text-xs font-bold px-3 py-2.5 rounded-lg transition-all">
                        <Trash2 size={13} /> Sil
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const inp = 'w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-3 py-2 text-sm text-[#15532f] placeholder-[#7aab8e] focus:outline-none focus:border-[#1A6B3C] transition-colors'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-black text-[#3d6b52] mb-1 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}
