'use client'

import { useState } from 'react'
import { Plus, Trash2, Save, GripVertical, Eye, EyeOff } from 'lucide-react'

interface Slide {
  id: number
  title: string
  subtitle: string
  badge: string
  imageUrl: string
  ctaLabel: string
  ctaHref: string
  active: boolean
}

const initial: Slide[] = [
  { id: 1, title: 'Şampiyonluk Yolculuğu Devam Ediyor', subtitle: 'Süper Lig 2026-27 sezonu başladı', badge: '2026-27 Sezonu', imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600&q=80', ctaLabel: 'Fikstürü Gör', ctaHref: '/fikstur', active: true },
  { id: 2, title: 'Yeni Transfer Açıklandı', subtitle: 'Kadromuza güçlü bir takviye daha', badge: 'Transfer', imageUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1600&q=80', ctaLabel: 'Haberi Oku', ctaHref: '/haberler', active: true },
  { id: 3, title: 'GAP Arena Sizi Bekliyor', subtitle: 'Sezon biletleri satışta', badge: 'Bilet', imageUrl: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1600&q=80', ctaLabel: 'Bilet Al', ctaHref: '/bilet', active: true },
]

export default function AdminSliderPage() {
  const [slides, setSlides] = useState<Slide[]>(initial)
  const [editing, setEditing] = useState<number | null>(null)
  const [saved, setSaved] = useState(false)

  const update = (id: number, key: keyof Slide, value: string | boolean) =>
    setSlides(prev => prev.map(s => s.id === id ? { ...s, [key]: value } : s))

  const addSlide = () => {
    const newId = Math.max(...slides.map(s => s.id)) + 1
    setSlides(prev => [...prev, { id: newId, title: 'Yeni Slayt Başlığı', subtitle: 'Alt başlık', badge: 'Yeni', imageUrl: '', ctaLabel: 'Devamını Oku', ctaHref: '/', active: false }])
    setEditing(newId)
  }

  const removeSlide = (id: number) => {
    setSlides(prev => prev.filter(s => s.id !== id))
    if (editing === id) setEditing(null)
  }

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 400))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const currentSlide = slides.find(s => s.id === editing)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#092d18]">Slider Yönetimi</h1>
          <p className="text-sm text-[#3d6b52] mt-1">Ana sayfa hero slider</p>
        </div>
        <div className="flex gap-2">
          <button onClick={addSlide}
            className="inline-flex items-center gap-2 border border-[#ddeae2] text-[#3d6b52] font-black px-4 py-2.5 rounded-xl text-sm hover:bg-[#f5f9f6] transition-colors">
            <Plus size={15} /> Slayt Ekle
          </button>
          <button onClick={handleSave}
            className={`inline-flex items-center gap-2 font-black px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm ${saved ? 'bg-[#edf7f2] text-[#1A6B3C]' : 'bg-[#1A6B3C] hover:bg-[#0f4a28] text-white'}`}>
            <Save size={15} />
            {saved ? 'Kaydedildi ✓' : 'Kaydet'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Slayt listesi */}
        <div className="space-y-2">
          {slides.map((slide) => (
            <div key={slide.id} onClick={() => setEditing(slide.id)}
              className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${editing === slide.id ? 'border-[#1A6B3C] bg-[#edf7f2]' : 'border-[#ddeae2] bg-white hover:border-[#1A6B3C]/40'}`}>
              <GripVertical size={14} className="text-[#ddeae2] shrink-0" />
              <div className="w-14 h-10 rounded-lg overflow-hidden bg-[#f5f9f6] shrink-0">
                {slide.imageUrl ? (
                  <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#ddeae2]">
                    <span className="text-xs">Görsel</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#092d18] truncate">{slide.title}</p>
                <p className="text-xs text-[#7aab8e] truncate">{slide.badge}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={e => { e.stopPropagation(); update(slide.id, 'active', !slide.active) }}
                  className={`p-1.5 rounded-lg transition-all ${slide.active ? 'text-[#1A6B3C] bg-[#edf7f2]' : 'text-[#7aab8e] hover:bg-[#f5f9f6]'}`}>
                  {slide.active ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
                <button onClick={e => { e.stopPropagation(); removeSlide(slide.id) }}
                  className="p-1.5 text-[#7aab8e] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Slayt düzenleme */}
        {currentSlide ? (
          <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6 space-y-4">
            <p className="text-xs font-black text-[#7aab8e] uppercase tracking-widest">Slayt #{currentSlide.id} Düzenle</p>
            {currentSlide.imageUrl && (
              <div className="relative h-32 rounded-xl overflow-hidden bg-[#f5f9f6]">
                <img src={currentSlide.imageUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#0f4a28]/50 flex items-end p-3">
                  <p className="text-white font-black text-sm">{currentSlide.title}</p>
                </div>
              </div>
            )}
            {[
              { key: 'badge', label: 'Rozet Metni' },
              { key: 'title', label: 'Başlık' },
              { key: 'subtitle', label: 'Alt Başlık' },
              { key: 'imageUrl', label: 'Görsel URL' },
              { key: 'ctaLabel', label: 'Buton Metni' },
              { key: 'ctaHref', label: 'Buton Linki' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-black text-[#3d6b52] mb-1.5 uppercase tracking-wide">{label}</label>
                <input value={String(currentSlide[key as keyof Slide])}
                  onChange={e => update(currentSlide.id, key as keyof Slide, e.target.value)}
                  className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-2.5 text-sm text-[#092d18] focus:outline-none focus:border-[#1A6B3C] transition-colors" />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#f5f9f6] rounded-2xl border border-[#ddeae2] flex items-center justify-center h-64">
            <p className="text-sm text-[#7aab8e]">Düzenlemek için bir slayt seçin</p>
          </div>
        )}
      </div>
    </div>
  )
}
