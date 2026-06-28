'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

const positions = ['Kaleci', 'Defans', 'Orta Saha', 'Forvet']
const nationalities = ['Türkiye', 'Brezilya', 'Portekiz', 'Senegal', 'İtalya', 'Arjantin', 'Fransa', 'Belçika', 'Hollanda']
const flagCodes: Record<string, string> = { 'Türkiye': 'tr', 'Brezilya': 'br', 'Portekiz': 'pt', 'Senegal': 'sn', 'İtalya': 'it', 'Arjantin': 'ar', 'Fransa': 'fr', 'Belçika': 'be', 'Hollanda': 'nl' }

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-extrabold text-utxt2 mb-1.5 uppercase tracking-wide">{label}</label>
    {children}
  </div>
)

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-2.5 text-sm text-ugreenm placeholder-[#7aab8e] focus:outline-none focus:border-ugreen transition-colors" />
)

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) => (
  <select {...props} className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-2.5 text-sm text-ugreenm focus:outline-none focus:border-ugreen transition-colors">
    {props.children}
  </select>
)

export default function YeniOyuncuPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', number: '', position: 'Kaleci', nationality: 'Türkiye',
    birthDate: '', imageUrl: '',
    matches: '0', goals: '0', assists: '0', yellowCards: '0', redCards: '0',
  })

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    setLoading(false)
    router.push('/admin/kadro')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/kadro" className="p-2 text-[#7aab8e] hover:text-ugreen hover:bg-[#edf7f2] rounded-xl transition-all">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-extrabold text-ugreenm">Yeni Oyuncu</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6 space-y-4">
          <p className="text-xs font-extrabold text-[#7aab8e] uppercase tracking-widest mb-2">Kişisel Bilgiler</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Ad Soyad *">
              <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Oyuncu adı" required />
            </Field>
            <Field label="Forma Numarası *">
              <Input type="number" min="1" max="99" value={form.number} onChange={e => set('number', e.target.value)} placeholder="Ex: 9" required />
            </Field>
            <Field label="Mevki *">
              <Select value={form.position} onChange={e => set('position', e.target.value)}>
                {positions.map(p => <option key={p}>{p}</option>)}
              </Select>
            </Field>
            <Field label="Milliyet *">
              <Select value={form.nationality} onChange={e => set('nationality', e.target.value)}>
                {nationalities.map(n => <option key={n}>{n}</option>)}
              </Select>
            </Field>
            <Field label="Doğum Tarihi">
              <Input type="date" value={form.birthDate} onChange={e => set('birthDate', e.target.value)} />
            </Field>
            <Field label="Fotoğraf URL">
              <Input type="url" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://..." />
            </Field>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6 space-y-4">
          <p className="text-xs font-extrabold text-[#7aab8e] uppercase tracking-widest mb-2">Sezon İstatistikleri</p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {[
              { k: 'matches', label: 'Maç' },
              { k: 'goals', label: 'Gol' },
              { k: 'assists', label: 'Asist' },
              { k: 'yellowCards', label: 'Sarı Kart' },
              { k: 'redCards', label: 'Kırmızı Kart' },
            ].map(({ k, label }) => (
              <Field key={k} label={label}>
                <Input type="number" min="0" value={form[k as keyof typeof form]} onChange={e => set(k, e.target.value)} />
              </Field>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Link href="/admin/kadro" className="px-5 py-2.5 border border-[#ddeae2] text-utxt2 font-bold text-sm rounded-xl hover:bg-[#f5f9f6] transition-colors">İptal</Link>
          <button type="submit" disabled={loading}
            className="inline-flex items-center gap-2 bg-ugreen hover:bg-ugreend disabled:opacity-60 text-white font-extrabold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
            <Save size={15} />
            {loading ? 'Kaydediliyor...' : 'Oyuncu Ekle'}
          </button>
        </div>
      </form>
    </div>
  )
}
