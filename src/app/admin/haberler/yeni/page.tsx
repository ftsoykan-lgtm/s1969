'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

const categories = ['transfer', 'mac', 'kulup', 'taraftar', 'sponsor', 'altyapi']
const CATEGORY_LABELS: Record<string, string> = {
  transfer: 'Transfer', mac: 'Maç', kulup: 'Kulüp', taraftar: 'Taraftar', sponsor: 'Sponsor', altyapi: 'Altyapı'
}

export default function YeniHaberPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', category: 'kulup', imageUrl: '' })

  const update = (k: string, v: string) => setForm((prev) => ({ ...prev, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    router.push('/admin/haberler')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/haberler" className="p-2 text-[#7aab8e] hover:text-[#1A6B3C] hover:bg-[#edf7f2] rounded-xl transition-all">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-black text-[#092d18]">Yeni Haber</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-xs font-black text-[#3d6b52] mb-1.5 uppercase tracking-wide">Başlık *</label>
            <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)} required
              placeholder="Haber başlığı..."
              className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-3 text-sm text-[#092d18] placeholder-[#7aab8e] focus:outline-none focus:border-[#1A6B3C] transition-colors" />
          </div>

          <div>
            <label className="block text-xs font-black text-[#3d6b52] mb-1.5 uppercase tracking-wide">Kategori</label>
            <select value={form.category} onChange={(e) => update('category', e.target.value)}
              className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-3 text-sm text-[#092d18] focus:outline-none focus:border-[#1A6B3C] transition-colors">
              {categories.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-[#3d6b52] mb-1.5 uppercase tracking-wide">Kapak Görseli URL</label>
            <input type="url" value={form.imageUrl} onChange={(e) => update('imageUrl', e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-3 text-sm text-[#092d18] placeholder-[#7aab8e] focus:outline-none focus:border-[#1A6B3C] transition-colors" />
          </div>

          <div>
            <label className="block text-xs font-black text-[#3d6b52] mb-1.5 uppercase tracking-wide">Özet *</label>
            <textarea rows={2} value={form.excerpt} onChange={(e) => update('excerpt', e.target.value)} required
              placeholder="Kısa açıklama..."
              className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-3 text-sm text-[#092d18] placeholder-[#7aab8e] focus:outline-none focus:border-[#1A6B3C] transition-colors resize-none" />
          </div>

          <div>
            <label className="block text-xs font-black text-[#3d6b52] mb-1.5 uppercase tracking-wide">İçerik *</label>
            <textarea rows={10} value={form.content} onChange={(e) => update('content', e.target.value)} required
              placeholder="Haber içeriği..."
              className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-3 text-sm text-[#092d18] placeholder-[#7aab8e] focus:outline-none focus:border-[#1A6B3C] transition-colors resize-y" />
          </div>
        </div>

        <div className="flex gap-3">
          <Link href="/admin/haberler"
            className="px-5 py-2.5 border border-[#ddeae2] text-[#3d6b52] font-bold text-sm rounded-xl hover:bg-[#f5f9f6] transition-colors">
            İptal
          </Link>
          <button type="submit" disabled={loading}
            className="inline-flex items-center gap-2 bg-[#1A6B3C] hover:bg-[#0f4a28] disabled:opacity-60 text-white font-black px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
            <Save size={15} />
            {loading ? 'Kaydediliyor...' : 'Yayınla'}
          </button>
        </div>
      </form>
    </div>
  )
}
