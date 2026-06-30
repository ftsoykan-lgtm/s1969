'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getPagesAdmin, savePage, deletePage, uploadImage, type AdminPage } from '@/lib/supabase/settings'
import { seedSitePages } from '@/lib/supabase/pages-seed'
import { getSpec } from '@/lib/pages/specs'
import StructuredEditor from '@/components/admin/StructuredEditor'
import { Plus, Trash2, Upload, Loader2, Check, AlertCircle, ExternalLink, ChevronDown, Sparkles, LayoutTemplate } from 'lucide-react'

const GROUPS: { key: string; label: string }[] = [
  { key: 'kulup', label: 'Kulüp' },
  { key: 'tesisler', label: 'Tesisler' },
  { key: 'kurumsal', label: 'Kurumsal' },
  { key: 'taraftar', label: 'Taraftar' },
  { key: 'yasal', label: 'Yasal' },
]

const slugify = (s: string) =>
  s.toLocaleLowerCase('tr-TR').replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

export default function AdminSayfalarPage() {
  const [rows, setRows] = useState<(AdminPage & { _orig?: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)
  const [seeding, setSeeding] = useState(false)

  const handleSeed = async () => {
    setSeeding(true); setErr(null); setOk(null)
    const res = await seedSitePages()
    if (res.ok) {
      setOk(res.created > 0 ? `${res.created} sayfa içerikle oluşturuldu (${res.skipped} zaten vardı).` : 'Tüm menü sayfaları zaten mevcut.')
      await load()
    } else setErr(`Oluşturulamadı: ${res.error ?? 'bilinmeyen hata'}`)
    setSeeding(false)
  }

  const load = () => getPagesAdmin().then((r) => {
    setRows(r.map((p) => ({ ...p, _orig: p.slug })))
    setLoading(false)
  })
  useEffect(() => { load() }, [])

  const update = (i: number, patch: Partial<AdminPage>) =>
    setRows((prev) => prev.map((r, idx) => idx === i ? { ...r, ...patch } : r))

  const addNew = () => {
    const np = { slug: '', title: 'Yeni Sayfa', subtitle: '', body: '', nav_group: 'kulup', sort: 99, published: true }
    setRows((prev) => [np, ...prev])
    setOpen('__yeni__')
  }

  const handleSave = async (i: number) => {
    const p = rows[i]
    const slug = p.slug || slugify(p.title)
    setBusy(p._orig ?? '__yeni__'); setErr(null); setOk(null)
    const res = await savePage({ ...p, slug }, p._orig)
    if (res.ok) { setOk(`"${p.title}" kaydedildi`); await load() }
    else setErr(`Kaydedilemedi: ${res.error}`)
    setBusy(null)
  }

  const handleDelete = async (p: AdminPage & { _orig?: string }, i: number) => {
    if (p._orig) {
      if (!confirm(`"${p.title}" sayfası silinsin mi?`)) return
      setBusy(p._orig); await deletePage(p._orig); await load(); setBusy(null)
    } else setRows((prev) => prev.filter((_, idx) => idx !== i))
  }

  const handleHero = async (i: number, file: File) => {
    setBusy(rows[i]._orig ?? '__yeni__')
    const res = await uploadImage(file, { folder: 'pages', width: 1920, height: 960, fit: 'cover', format: 'jpeg', quality: 0.9 })
    if (res.ok && res.url) update(i, { hero_image: res.url })
    setBusy(null)
  }

  const grouped = GROUPS.map((g) => ({ ...g, items: rows.map((r, i) => ({ r, i })).filter(({ r }) => (r.nav_group ?? 'kulup') === g.key) }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ugreenm">Sayfalar</h1>
          <p className="text-sm text-utxt2 mt-1">{rows.length} sayfa · Tarihçe hariç tüm bilgi sayfaları buradan yönetilir</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleSeed} disabled={seeding}
            className="inline-flex items-center gap-2 bg-white border border-[#ddeae2] hover:border-ugreen/40 text-ugreenm font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm disabled:opacity-60">
            {seeding ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} className="text-ugreen" />}
            {seeding ? 'Oluşturuluyor...' : 'Menü sayfalarını oluştur'}
          </button>
          <button onClick={addNew}
            className="inline-flex items-center gap-2 bg-ugreen hover:bg-ugreend text-white font-extrabold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
            <Plus size={15} /> Sayfa Ekle
          </button>
        </div>
      </div>

      {err && <Banner tone="err"><AlertCircle size={15} className="shrink-0" /> {err}</Banner>}
      {ok && <Banner tone="ok"><Check size={15} className="shrink-0" /> {ok}</Banner>}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[#7aab8e]"><Loader2 size={14} className="animate-spin" /> Yükleniyor...</div>
      ) : (
        <div className="space-y-6">
          {grouped.map((g) => g.items.length > 0 && (
            <div key={g.key}>
              <p className="text-[11px] font-extrabold tracking-widest uppercase text-[#7aab8e] mb-2">{g.label}</p>
              <div className="space-y-2.5">
                {g.items.map(({ r, i }) => {
                  const id = r._orig ?? '__yeni__'
                  const isOpen = open === id || (!r._orig && open === '__yeni__')
                  return (
                    <div key={id + i} className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm overflow-hidden">
                      <button onClick={() => setOpen(isOpen ? null : id)}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-[#f8faf9] transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-extrabold text-ugreenm truncate">{r.title}</p>
                          <p className="text-[11px] text-[#7aab8e] truncate">/sayfa/{r.slug || slugify(r.title)}</p>
                        </div>
                        {!r.published && <span className="text-[10px] font-extrabold uppercase text-[#7aab8e] bg-[#f5f9f6] rounded px-2 py-0.5">Taslak</span>}
                        {r._orig && <Link href={`/sayfa/${r.slug}`} target="_blank" onClick={(e) => e.stopPropagation()} className="text-[#7aab8e] hover:text-ugreen p-1"><ExternalLink size={14} /></Link>}
                        <ChevronDown size={16} className={`text-[#7aab8e] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 border-t border-[#edf7f2] space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field label="Başlık"><input value={r.title} onChange={(e) => update(i, { title: e.target.value })} className={inputCls} /></Field>
                            <Field label="Kısa Açıklama"><input value={r.subtitle ?? ''} onChange={(e) => update(i, { subtitle: e.target.value })} className={inputCls} /></Field>
                            <Field label="Bağlantı (slug)"><input value={r.slug} onChange={(e) => update(i, { slug: e.target.value })} placeholder={slugify(r.title)} className={inputCls} /></Field>
                            <Field label="Menü Grubu">
                              <select value={r.nav_group ?? 'kulup'} onChange={(e) => update(i, { nav_group: e.target.value })} className={inputCls}>
                                {GROUPS.map((g) => <option key={g.key} value={g.key}>{g.label}</option>)}
                              </select>
                            </Field>
                          </div>
                          {(() => {
                            const spec = getSpec(r.slug)
                            if (spec) {
                              return (
                                <div className="rounded-2xl border border-[#dbeee4] bg-[#f3faf6] p-4">
                                  <div className="flex items-center gap-2 mb-3">
                                    <LayoutTemplate size={14} className="text-ugreen" />
                                    <span className="text-[11px] font-extrabold uppercase tracking-wide text-ugreenm">Özel tasarım içeriği</span>
                                    <span className="text-[10px] text-[#7aab8e]">— bu sayfanın kendine özgü şablonu var</span>
                                  </div>
                                  <StructuredEditor
                                    fields={spec.fields}
                                    value={{ ...spec.defaults, ...((r.data as Record<string, unknown>) ?? {}) }}
                                    onChange={(d) => update(i, { data: d })}
                                  />
                                </div>
                              )
                            }
                            return (
                              <Field label="İçerik">
                                <textarea value={r.body ?? ''} onChange={(e) => update(i, { body: e.target.value })} rows={8}
                                  placeholder="Paragrafları boş satırla ayırın..." className={inputCls + ' resize-y leading-relaxed'} />
                              </Field>
                            )
                          })()}
                          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 items-end">
                            <Field label="Kapak Görseli (opsiyonel)">
                              <div className="flex items-center gap-1.5">
                                <input value={r.hero_image ?? ''} onChange={(e) => update(i, { hero_image: e.target.value })} placeholder="URL veya yükle" className={inputCls} />
                                <label className="shrink-0 cursor-pointer p-2 text-[#7aab8e] hover:text-ugreen hover:bg-[#edf7f2] rounded-lg transition-all">
                                  <Upload size={15} />
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleHero(i, f) }} />
                                </label>
                              </div>
                            </Field>
                            <label className="flex items-center gap-2 text-sm font-bold text-utxt2 pb-2">
                              <input type="checkbox" checked={r.published ?? true} onChange={(e) => update(i, { published: e.target.checked })} className="w-4 h-4 accent-ugreen" />
                              Yayında
                            </label>
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            <button onClick={() => handleSave(i)} disabled={busy !== null}
                              className="inline-flex items-center gap-1.5 bg-ugreen hover:bg-ugreend disabled:opacity-60 text-white text-xs font-extrabold px-4 py-2.5 rounded-lg transition-colors">
                              {busy === id ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Kaydet
                            </button>
                            <button onClick={() => handleDelete(r, i)}
                              className="inline-flex items-center gap-1.5 text-[#7aab8e] hover:text-red-500 hover:bg-red-50 text-xs font-bold px-3 py-2.5 rounded-lg transition-all">
                              <Trash2 size={13} /> Sil
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
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

function Banner({ tone, children }: { tone: 'err' | 'ok'; children: React.ReactNode }) {
  const cls = tone === 'err' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-[#edf7f2] border-ugreen/20 text-ugreen'
  return <div className={`flex items-center gap-2.5 border rounded-xl px-4 py-3 text-sm ${cls}`}>{children}</div>
}
