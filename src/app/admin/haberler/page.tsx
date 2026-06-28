'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  getNewsAdmin, saveNews, deleteNews, getCategoriesAdmin, uploadImage,
  type NewsRow, type CategoryRow,
} from '@/lib/supabase/settings'
import { Plus, Pencil, Trash2, Eye, Star, Upload, Loader2, Check, X, AlertCircle } from 'lucide-react'

const empty: NewsRow = { title: '', slug: '', excerpt: '', content: '', image_url: '', category: 'haber', featured: false, published: true }

export default function AdminHaberlerPage() {
  const [rows, setRows] = useState<NewsRow[]>([])
  const [cats, setCats] = useState<CategoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<NewsRow | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const load = () => getNewsAdmin().then((r) => { setRows(r); setLoading(false) })
  useEffect(() => {
    Promise.all([getNewsAdmin(), getCategoriesAdmin()]).then(([n, c]) => { setRows(n); setCats(c); setLoading(false) })
  }, [])

  const save = async () => {
    if (!editing) return
    setBusy(true); setErr(null)
    const res = await saveNews(editing)
    if (res.ok) { setEditing(null); await load() } else { setErr(`Kaydedilemedi: ${res.error}`) }
    setBusy(false)
  }

  const remove = async (n: NewsRow) => {
    if (!n.id) return
    if (!confirm(`"${n.title}" silinsin mi?`)) return
    await deleteNews(n.id); await load()
  }

  const onPhoto = async (file: File) => {
    if (!editing) return
    setBusy(true)
    const res = await uploadImage(file, { folder: 'news', width: 1920, height: 1080, fit: 'cover', format: 'jpeg', quality: 0.9 })
    if (res.ok && res.url) setEditing({ ...editing, image_url: res.url })
    setBusy(false)
  }

  const catName = (slug: string) => cats.find((c) => c.slug === slug)?.name ?? slug

  // ── Editör ──
  if (editing) {
    return (
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center gap-3">
          <button onClick={() => setEditing(null)} className="p-2 text-[#7aab8e] hover:text-ugreen hover:bg-[#edf7f2] rounded-xl transition-all"><X size={18} /></button>
          <h1 className="text-2xl font-extrabold text-ugreenm">{editing.id ? 'Haberi Düzenle' : 'Yeni Haber'}</h1>
        </div>

        {err && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"><AlertCircle size={15} /> {err}</div>}

        <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6 space-y-4">
          <Field label="Başlık *">
            <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inp} placeholder="Haber başlığı" />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Kategori">
              <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className={inp}>
                {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Tarih">
              <input type="date" value={editing.published_at ?? ''} onChange={(e) => setEditing({ ...editing, published_at: e.target.value })} className={inp} />
            </Field>
          </div>

          {/* Kapak görseli */}
          <Field label="Kapak Görseli">
            <div className="flex items-center gap-3">
              <div className="w-28 h-16 rounded-lg overflow-hidden bg-[#f5f9f6] border border-[#ddeae2] shrink-0 flex items-center justify-center">
                {editing.image_url ? <img src={editing.image_url} alt="" className="w-full h-full object-cover" /> : <span className="text-[10px] text-[#7aab8e]">görsel</span>}
              </div>
              <input value={editing.image_url ?? ''} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} className={inp} placeholder="URL veya yükle" />
              <label className="shrink-0 cursor-pointer p-2.5 text-[#7aab8e] hover:text-ugreen hover:bg-[#edf7f2] rounded-lg transition-all">
                <Upload size={16} />
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onPhoto(f) }} />
              </label>
            </div>
          </Field>

          <Field label="Özet">
            <textarea rows={2} value={editing.excerpt ?? ''} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} className={`${inp} resize-none`} placeholder="Kısa açıklama" />
          </Field>
          <Field label="İçerik">
            <textarea rows={10} value={editing.content ?? ''} onChange={(e) => setEditing({ ...editing, content: e.target.value })} className={`${inp} resize-y`} placeholder="Haber metni" />
          </Field>

          {/* Toggle'lar */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Toggle on={!!editing.featured} onClick={() => setEditing({ ...editing, featured: !editing.featured })}
              label="Hero'da (slider) göster" icon={Star} />
            <Toggle on={editing.published ?? true} onClick={() => setEditing({ ...editing, published: !(editing.published ?? true) })}
              label="Yayında" icon={Eye} />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setEditing(null)} className="px-5 py-2.5 border border-[#ddeae2] text-utxt2 font-bold text-sm rounded-xl hover:bg-[#f5f9f6]">İptal</button>
          <button onClick={save} disabled={busy || !editing.title}
            className="inline-flex items-center gap-2 bg-ugreen hover:bg-ugreend disabled:opacity-60 text-white font-extrabold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Kaydet
          </button>
        </div>
      </div>
    )
  }

  // ── Liste ──
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ugreenm">Haberler</h1>
          <p className="text-sm text-utxt2 mt-1">{rows.length} haber</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/kategoriler" className="inline-flex items-center gap-2 border border-[#ddeae2] text-utxt2 font-extrabold px-4 py-2.5 rounded-xl text-sm hover:bg-[#f5f9f6]">Kategoriler</Link>
          <button onClick={() => setEditing({ ...empty, published_at: new Date().toISOString().slice(0, 10) })}
            className="inline-flex items-center gap-2 bg-ugreen hover:bg-ugreend text-white font-extrabold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
            <Plus size={15} /> Yeni Haber
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[#7aab8e]"><Loader2 size={14} className="animate-spin" /> Yükleniyor...</div>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ddeae2] p-10 text-center">
          <p className="text-sm font-bold text-ugreenm">Henüz haber yok</p>
          <p className="text-xs text-[#7aab8e] mt-1">"Yeni Haber" ile başlayın. (Boşken site örnek haberleri gösterir.)</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm overflow-hidden">
          {rows.map((n, i) => (
            <div key={n.id ?? i} className={`flex items-center gap-3 px-4 py-3 hover:bg-[#f5f9f6] transition-colors ${i < rows.length - 1 ? 'border-b border-[#edf7f2]' : ''}`}>
              <div className="w-16 h-10 rounded-lg overflow-hidden bg-[#f5f9f6] shrink-0">
                {n.image_url ? <img src={n.image_url} alt="" className="w-full h-full object-cover" /> : null}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ugreenm truncate">{n.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-extrabold text-ugreen bg-[#edf7f2] px-2 py-0.5 rounded-full">{catName(n.category)}</span>
                  {n.featured && <span className="text-[10px] font-extrabold text-ugoldd bg-ugold/15 px-2 py-0.5 rounded-full flex items-center gap-1"><Star size={9} /> Hero</span>}
                  {!n.published && <span className="text-[10px] font-extrabold text-[#7aab8e] bg-[#f5f9f6] px-2 py-0.5 rounded-full">Taslak</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setEditing(n)} className="p-1.5 text-[#7aab8e] hover:text-ugoldd hover:bg-ugold/10 rounded-lg transition-all"><Pencil size={14} /></button>
                <button onClick={() => remove(n)} className="p-1.5 text-[#7aab8e] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const inp = 'w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-2.5 text-sm text-ugreenm placeholder-[#7aab8e] focus:outline-none focus:border-ugreen transition-colors'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs font-extrabold text-utxt2 mb-1.5 uppercase tracking-wide">{label}</label>{children}</div>
}

function Toggle({ on, onClick, label, icon: Icon }: { on: boolean; onClick: () => void; label: string; icon: React.ComponentType<{ size?: number }> }) {
  return (
    <button onClick={onClick} type="button"
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${on ? 'bg-[#edf7f2] border-ugreen/40 text-ugreen' : 'bg-white border-[#ddeae2] text-[#7aab8e]'}`}>
      <span className={`w-9 h-5 rounded-full relative transition-colors ${on ? 'bg-ugreen' : 'bg-[#ddeae2]'}`}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${on ? 'left-4' : 'left-0.5'}`} />
      </span>
      <Icon size={14} /> {label}
    </button>
  )
}
