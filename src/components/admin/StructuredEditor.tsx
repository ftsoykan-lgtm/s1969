'use client'

import { useState } from 'react'
import { Plus, Trash2, ChevronUp, ChevronDown, Upload, Loader2 } from 'lucide-react'
import { uploadImage } from '@/lib/supabase/settings'
import type { Field, SubField } from '@/lib/pages/fields'

const inputCls =
  'w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-3 py-2 text-sm text-ugreenm placeholder-[#7aab8e] focus:outline-none focus:border-ugreen transition-colors'

type Data = Record<string, unknown>

/** Belirli bir slug'ın alan şemasına göre yapılandırılmış içeriği düzenler. */
export default function StructuredEditor({
  fields,
  value,
  onChange,
}: {
  fields: Field[]
  value: Data
  onChange: (next: Data) => void
}) {
  const setKey = (key: string, v: unknown) => onChange({ ...value, [key]: v })

  return (
    <div className="space-y-4">
      {fields.map((f) =>
        f.type === 'list' ? (
          <ListField key={f.key} field={f} value={(value[f.key] as Data[]) ?? []} onChange={(v) => setKey(f.key, v)} />
        ) : (
          <div key={f.key}>
            <label className="block text-[10px] font-extrabold text-utxt2 mb-1 uppercase tracking-wide">{f.label}</label>
            <SimpleInput field={f} value={(value[f.key] as string) ?? ''} onChange={(v) => setKey(f.key, v)} />
          </div>
        ),
      )}
    </div>
  )
}

/* ─── Tekrarlanabilir liste ─── */
function ListField({
  field,
  value,
  onChange,
}: {
  field: Extract<Field, { type: 'list' }>
  value: Data[]
  onChange: (v: Data[]) => void
}) {
  const items = Array.isArray(value) ? value : []

  const updateItem = (i: number, patch: Data) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)))
  const addItem = () => onChange([...items, emptyItem(field.item)])
  const removeItem = (i: number) => onChange(items.filter((_, idx) => idx !== i))
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div className="rounded-xl border border-[#e3efe8] bg-[#fafdfb] p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-extrabold text-ugreenm uppercase tracking-wide">{field.label}</span>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1 text-[12px] font-bold text-ugreen hover:text-ugreend bg-white border border-[#ddeae2] rounded-lg px-2.5 py-1.5 transition-colors"
        >
          <Plus size={13} /> {field.addLabel ?? 'Ekle'}
        </button>
      </div>

      <div className="space-y-2.5">
        {items.map((it, i) => (
          <div key={i} className="rounded-lg border border-[#ddeae2] bg-white p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wide text-[#7aab8e]">{(field.itemLabel ?? 'Öğe')} {i + 1}</span>
              <div className="flex items-center gap-0.5">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-1 text-[#7aab8e] hover:text-ugreen disabled:opacity-30"><ChevronUp size={14} /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="p-1 text-[#7aab8e] hover:text-ugreen disabled:opacity-30"><ChevronDown size={14} /></button>
                <button type="button" onClick={() => removeItem(i)} className="p-1 text-[#7aab8e] hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {field.item.map((sf) => (
                <div key={sf.key} className={sf.type === 'textarea' || sf.type === 'image' ? 'sm:col-span-2' : ''}>
                  <label className="block text-[9px] font-bold text-[#7aab8e] mb-0.5 uppercase tracking-wide">{sf.label}</label>
                  <SimpleInput field={sf} value={(it[sf.key] as string) ?? ''} onChange={(v) => updateItem(i, { [sf.key]: v })} />
                </div>
              ))}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-[12px] text-[#7aab8e] py-2 text-center">Henüz öğe yok — &quot;{field.addLabel ?? 'Ekle'}&quot; ile başlayın.</p>}
      </div>
    </div>
  )
}

/* ─── Basit alan girdisi (text/textarea/color/image) ─── */
function SimpleInput({ field, value, onChange }: { field: Field | SubField; value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false)
  const placeholder = 'placeholder' in field ? field.placeholder : undefined

  if (field.type === 'textarea') {
    return <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder} className={inputCls + ' resize-y leading-relaxed'} />
  }

  if (field.type === 'color') {
    return (
      <div className="flex items-center gap-2">
        <input type="color" value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : '#1b5e44'} onChange={(e) => onChange(e.target.value)} className="w-10 h-9 rounded-lg border border-[#ddeae2] bg-white p-0.5 cursor-pointer shrink-0" />
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="#1b5e44" className={inputCls + ' font-mono'} />
      </div>
    )
  }

  if (field.type === 'image') {
    const handleFile = async (file: File) => {
      setBusy(true)
      const res = await uploadImage(file, { folder: 'pages', width: 800, height: 800, fit: 'cover', format: 'jpeg', quality: 0.88 })
      if (res.ok && res.url) onChange(res.url)
      setBusy(false)
    }
    return (
      <div className="flex items-center gap-1.5">
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="URL veya yükle" className={inputCls} />
        <label className="shrink-0 cursor-pointer p-2 text-[#7aab8e] hover:text-ugreen hover:bg-[#edf7f2] rounded-lg transition-all">
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
        </label>
      </div>
    )
  }

  return <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
}

function emptyItem(sub: SubField[]): Data {
  return Object.fromEntries(sub.map((s) => [s.key, '']))
}
