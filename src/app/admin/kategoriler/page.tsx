'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCategoriesAdmin, saveCategory, deleteCategory, type CategoryRow } from '@/lib/supabase/settings'
import { Plus, Trash2, Loader2, Check, ArrowLeft, AlertCircle } from 'lucide-react'

export default function AdminKategorilerPage() {
  const [rows, setRows] = useState<CategoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [yeni, setYeni] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const load = () => getCategoriesAdmin().then((r) => { setRows(r); setLoading(false) })
  useEffect(() => { load() }, [])

  const ekle = async () => {
    if (!yeni.trim()) return
    setBusy(true); setErr(null)
    const res = await saveCategory({ name: yeni.trim(), slug: '', sort_order: rows.length + 1 })
    if (res.ok) { setYeni(''); await load() } else { setErr(`Eklenemedi: ${res.error}`) }
    setBusy(false)
  }

  const sil = async (c: CategoryRow) => {
    if (!c.id) return
    if (!confirm(`"${c.name}" kategorisi silinsin mi?`)) return
    await deleteCategory(c.id); await load()
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/haberler" className="p-2 text-[#7aab8e] hover:text-ugreen hover:bg-[#edf7f2] rounded-xl transition-all"><ArrowLeft size={18} /></Link>
        <h1 className="text-2xl font-extrabold text-ugreenm">Haber Kategorileri</h1>
      </div>

      {err && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"><AlertCircle size={15} /> {err}</div>}

      <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6">
        <div className="flex gap-2 mb-6">
          <input value={yeni} onChange={(e) => setYeni(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && ekle()}
            placeholder="Yeni kategori adı..." className="flex-1 bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-2.5 text-sm text-ugreenm placeholder-[#7aab8e] focus:outline-none focus:border-ugreen" />
          <button onClick={ekle} disabled={busy || !yeni.trim()}
            className="inline-flex items-center gap-2 bg-ugreen hover:bg-ugreend disabled:opacity-60 text-white font-extrabold px-4 py-2.5 rounded-xl text-sm transition-colors">
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />} Ekle
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-[#7aab8e]"><Loader2 size={14} className="animate-spin" /> Yükleniyor...</div>
        ) : rows.length === 0 ? (
          <p className="text-sm text-[#7aab8e] text-center py-6">Henüz kategori yok.</p>
        ) : (
          <div className="space-y-2">
            {rows.map((c) => (
              <div key={c.id} className="flex items-center gap-3 bg-[#f5f9f6] rounded-xl px-4 py-3">
                <Check size={14} className="text-ugreen" />
                <span className="flex-1 text-sm font-bold text-ugreenm">{c.name}</span>
                <span className="text-[11px] text-[#7aab8e] font-mono">{c.slug}</span>
                <button onClick={() => sil(c)} className="p-1.5 text-[#7aab8e] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={13} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
