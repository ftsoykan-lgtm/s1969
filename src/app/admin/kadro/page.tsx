'use client'

import { useState, useEffect } from 'react'
import { getTffSquad, getPlayerDetails, savePlayerDetail, uploadImage, type PlayerDetail } from '@/lib/supabase/settings'
import { Search, Loader2, Pencil, Check, X, Upload, RefreshCw } from 'lucide-react'

const POSITIONS = ['Kaleci', 'Defans', 'Orta Saha', 'Forvet']
const FLAGS = [
  { code: 'tr', label: 'Türkiye 🇹🇷' }, { code: 'br', label: 'Brezilya 🇧🇷' },
  { code: 'sn', label: 'Senegal 🇸🇳' }, { code: 'ci', label: 'Fildişi 🇨🇮' },
  { code: 'fr', label: 'Fransa 🇫🇷' }, { code: 'pt', label: 'Portekiz 🇵🇹' },
  { code: 'ng', label: 'Nijerya 🇳🇬' }, { code: 'cm', label: 'Kamerun 🇨🇲' },
  { code: 'gm', label: 'Gambiya 🇬🇲' }, { code: 'ro', label: 'Romanya 🇷🇴' },
  { code: 'rs', label: 'Sırbistan 🇷🇸' }, { code: 'gh', label: 'Gana 🇬🇭' },
  { code: 'ml', label: 'Mali 🇲🇱' }, { code: 'ma', label: 'Fas 🇲🇦' },
]

type Row = { name: string; tffId: string | null; detail: PlayerDetail }

export default function AdminKadroPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState<PlayerDetail | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    Promise.all([getTffSquad(), getPlayerDetails()]).then(([squad, details]) => {
      const merged: Row[] = squad.players.map((p) => ({
        name: p.name, tffId: p.tffId,
        detail: details[p.name] ?? { name: p.name, tff_id: p.tffId },
      }))
      setRows(merged)
      setLoading(false)
    })
  }, [])

  const startEdit = (r: Row) => { setEditing(r.name); setDraft({ ...r.detail, name: r.name, tff_id: r.tffId }) }
  const cancel = () => { setEditing(null); setDraft(null) }

  const save = async () => {
    if (!draft) return
    setBusy(true)
    const res = await savePlayerDetail(draft)
    if (res.ok) {
      setRows((prev) => prev.map((r) => r.name === draft.name ? { ...r, detail: draft } : r))
      setEditing(null); setDraft(null)
    }
    setBusy(false)
  }

  const onPhoto = async (file: File) => {
    if (!draft) return
    setBusy(true)
    const res = await uploadImage(file, { folder: 'players', width: 400, height: 500, fit: 'cover' })
    if (res.ok && res.url) setDraft({ ...draft, photo_url: res.url })
    setBusy(false)
  }

  const filtered = rows.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#092d18]">Kadro</h1>
        <p className="text-sm text-[#3d6b52] mt-1">{rows.length} oyuncu · İsimler TFF'den, detaylar elle</p>
      </div>

      <div className="flex items-start gap-2.5 bg-[#edf7f2] border border-[#1A6B3C]/20 rounded-xl p-4">
        <RefreshCw size={15} className="text-[#1A6B3C] mt-0.5 shrink-0" />
        <p className="text-sm text-[#3d6b52]">
          Oyuncu <span className="font-bold text-[#1A6B3C]">isimleri TFF'den otomatik</span> gelir.
          Fotoğraf, forma numarası, mevki ve uyruğu her oyuncu için <span className="font-bold">elle</span> ekleyebilirsiniz; siteye anında yansır.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7aab8e]" />
        <input type="search" placeholder="Oyuncu ara..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#ddeae2] rounded-xl text-sm text-[#092d18] placeholder-[#7aab8e] focus:outline-none focus:border-[#1A6B3C]" />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[#7aab8e]"><Loader2 size={14} className="animate-spin" /> Yükleniyor...</div>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ddeae2] p-10 text-center">
          <p className="text-sm font-bold text-[#092d18]">Kadro henüz senkronize edilmedi</p>
          <p className="text-xs text-[#7aab8e] mt-1">GitHub Actions çalıştığında dolar.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => {
            const d = r.detail
            const isEdit = editing === r.name
            return (
              <div key={r.name} className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm overflow-hidden">
                {/* Satır */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-11 h-14 rounded-lg overflow-hidden bg-[#f5f9f6] shrink-0 flex items-center justify-center">
                    {d.photo_url ? <img src={d.photo_url} alt={r.name} className="w-full h-full object-cover" /> : <span className="text-[9px] text-[#7aab8e]">foto</span>}
                  </div>
                  {d.number != null && <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFD100] text-[#0f4a28] text-[11px] font-black shrink-0">{d.number}</span>}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#092d18] truncate">{r.name}</p>
                    <p className="text-xs text-[#7aab8e]">{d.position || 'Mevki girilmedi'}{d.flag_code ? ` · ${d.flag_code.toUpperCase()}` : ''}</p>
                  </div>
                  {!isEdit ? (
                    <button onClick={() => startEdit(r)} className="p-2 text-[#7aab8e] hover:text-[#1A6B3C] hover:bg-[#edf7f2] rounded-lg transition-all">
                      <Pencil size={15} />
                    </button>
                  ) : (
                    <div className="flex gap-1.5">
                      <button onClick={save} disabled={busy} className="p-2 text-[#1A6B3C] bg-[#edf7f2] hover:bg-[#1A6B3C] hover:text-white rounded-lg transition-all">
                        {busy ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                      </button>
                      <button onClick={cancel} className="p-2 text-[#7aab8e] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><X size={15} /></button>
                    </div>
                  )}
                </div>

                {/* Düzenleme paneli */}
                {isEdit && draft && (
                  <div className="border-t border-[#edf7f2] p-4 bg-[#f5f9f6] grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 flex items-center gap-3">
                      <div className="w-16 h-20 rounded-lg overflow-hidden bg-white border border-[#ddeae2] shrink-0 flex items-center justify-center">
                        {draft.photo_url ? <img src={draft.photo_url} alt="" className="w-full h-full object-cover" /> : <span className="text-[9px] text-[#7aab8e]">foto</span>}
                      </div>
                      <label className="inline-flex items-center gap-2 bg-[#1A6B3C] hover:bg-[#0f4a28] text-white text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors">
                        <Upload size={14} /> Fotoğraf Yükle
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onPhoto(f) }} />
                      </label>
                    </div>
                    <Field label="Forma No">
                      <input type="number" min="1" max="99" value={draft.number ?? ''} onChange={(e) => setDraft({ ...draft, number: e.target.value ? Number(e.target.value) : null })} className={inputCls} />
                    </Field>
                    <Field label="Mevki">
                      <select value={draft.position ?? ''} onChange={(e) => setDraft({ ...draft, position: e.target.value || null })} className={inputCls}>
                        <option value="">Seçin</option>
                        {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </Field>
                    <Field label="Uyruk">
                      <select value={draft.flag_code ?? ''} onChange={(e) => {
                        const f = FLAGS.find((x) => x.code === e.target.value)
                        setDraft({ ...draft, flag_code: e.target.value || null, nationality: f ? f.label.split(' ')[0] : null })
                      }} className={inputCls}>
                        <option value="">Seçin</option>
                        {FLAGS.map((f) => <option key={f.code} value={f.code}>{f.label}</option>)}
                      </select>
                    </Field>
                    <Field label="Doğum Tarihi">
                      <input type="date" value={draft.birth_date ?? ''} onChange={(e) => setDraft({ ...draft, birth_date: e.target.value || null })} className={inputCls} />
                    </Field>
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

const inputCls = 'w-full bg-white border border-[#ddeae2] rounded-xl px-3 py-2.5 text-sm text-[#092d18] focus:outline-none focus:border-[#1A6B3C] transition-colors'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-black text-[#3d6b52] mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}
