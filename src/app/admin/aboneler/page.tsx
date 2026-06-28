'use client'

import { useEffect, useState } from 'react'
import { Loader2, Trash2, Download, Mail } from 'lucide-react'
import { getSubscribers, deleteSubscriber, type Subscriber } from '@/lib/supabase/settings'

export default function AdminAbonelerPage() {
  const [rows, setRows] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<number | null>(null)

  const load = () => { setLoading(true); getSubscribers().then((r) => { setRows(r); setLoading(false) }) }
  useEffect(() => { load() }, [])

  const handleDelete = async (s: Subscriber) => {
    if (!confirm(`${s.email} listeden silinsin mi?`)) return
    setBusy(s.id); await deleteSubscriber(s.id); await load(); setBusy(null)
  }

  const downloadCsv = () => {
    const header = 'email,tarih\n'
    const body = rows.map((r) => `${r.email},${new Date(r.created_at).toLocaleString('tr-TR')}`).join('\n')
    const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `aboneler-${new Date().toISOString().slice(0, 10)}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ugreenm">Bülten Aboneleri</h1>
          <p className="text-sm text-utxt2 mt-1">{rows.length} abone · footer &quot;Abone Ol&quot; formundan toplanır</p>
        </div>
        <button onClick={downloadCsv} disabled={!rows.length}
          className="inline-flex items-center gap-2 bg-ugreen hover:bg-ugreend disabled:opacity-50 text-white font-extrabold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
          <Download size={15} /> CSV İndir
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[#7aab8e]"><Loader2 size={14} className="animate-spin" /> Yükleniyor...</div>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ddeae2] p-12 text-center">
          <Mail size={28} className="mx-auto text-[#7aab8e] mb-3" />
          <p className="text-sm font-extrabold text-ugreenm">Henüz abone yok</p>
          <p className="text-xs text-[#7aab8e] mt-1">Ziyaretçiler footer&apos;daki &quot;Abone Ol&quot; ile kaydolunca burada listelenir.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm overflow-hidden divide-y divide-[#edf7f2]">
          {rows.map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[#f8faf9] transition-colors">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#edf7f2] text-ugreen shrink-0"><Mail size={15} /></span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-ugreenm truncate">{s.email}</p>
                <p className="text-[11px] text-[#7aab8e]">{new Date(s.created_at).toLocaleString('tr-TR')}</p>
              </div>
              <button onClick={() => handleDelete(s)} disabled={busy === s.id} aria-label="Sil"
                className="shrink-0 p-2 rounded-lg text-[#7aab8e] hover:text-red-600 hover:bg-red-50 transition-colors">
                {busy === s.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
