'use client'

import { useState, useRef } from 'react'
import { Upload, Loader2, Check, AlertCircle, Link as LinkIcon } from 'lucide-react'
import { uploadImage } from '@/lib/supabase/settings'

interface Props {
  value: string
  onChange: (url: string) => void
  size?: number          // çıktı boyutu (px), kare
  folder?: string
  label?: string
}

// Logo master boyutu — yükleme anında bu boyuta yüksek kaliteyle küçültülür
// (büyütülmez). Kayıpsız PNG → keskin kenarlar + şeffaflık korunur. Sitede
// next/image bu master'dan gösterime uygun (retina) sürümleri üretir.
const MAX_LOGO_DIM = 512

/** Yüklenen görseli yüksek kaliteyle yeniden boyutlandırıp PNG'ye çevirir.
 *  SVG (vektör) dokunulmadan geçer; hata olursa orijinal dosya kullanılır. */
async function resizeToPng(file: File, maxDim: number): Promise<File> {
  if (file.type === 'image/svg+xml') return file
  try {
    const bmp = await createImageBitmap(file)
    const scale = Math.min(1, maxDim / Math.max(bmp.width, bmp.height)) // yalnız küçült
    const w = Math.max(1, Math.round(bmp.width * scale))
    const h = Math.max(1, Math.round(bmp.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) { bmp.close?.(); return file }
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(bmp, 0, 0, w, h)
    bmp.close?.()
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'))
    if (!blob) return file
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.png', { type: 'image/png' })
  } catch {
    return file
  }
}

export default function LogoUpload({ value, onChange, folder = 'logos', label = 'Logo' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<'idle' | 'uploading' | 'ok' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [manual, setManual] = useState(false)

  const handleFile = async (file: File) => {
    setState('uploading')
    setError(null)
    // Yükleme anında yüksek kaliteyle uygun boyuta getir (SVG hariç)
    const prepared = await resizeToPng(file, MAX_LOGO_DIM)
    const res = await uploadImage(prepared, { folder, original: true })
    if (res.ok && res.url) {
      onChange(res.url)
      setState('ok')
      setTimeout(() => setState('idle'), 2000)
    } else {
      setState('error')
      setError(res.error ?? 'Yükleme başarısız')
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <label className="text-xs font-extrabold text-utxt2 uppercase tracking-wide">{label}</label>
        <button type="button" onClick={() => setManual(!manual)}
          className="text-[10px] font-bold text-[#7aab8e] hover:text-ugreen flex items-center gap-1">
          <LinkIcon size={10} /> {manual ? 'Yükle' : 'URL gir'}
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Önizleme */}
        <div className="w-16 h-16 rounded-xl border border-[#ddeae2] bg-[#f5f9f6] flex items-center justify-center overflow-hidden shrink-0">
          {value ? (
            <img src={value} alt="" className="w-full h-full object-contain" />
          ) : (
            <span className="text-[10px] text-[#7aab8e]">yok</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {manual ? (
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-3 py-2.5 text-sm text-ugreenm placeholder-[#7aab8e] focus:outline-none focus:border-ugreen transition-colors"
            />
          ) : (
            <>
              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
              />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={state === 'uploading'}
                className="inline-flex items-center gap-2 bg-ugreen hover:bg-ugreend disabled:opacity-60 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
              >
                {state === 'uploading' ? <Loader2 size={14} className="animate-spin" />
                  : state === 'ok' ? <Check size={14} />
                  : <Upload size={14} />}
                {state === 'uploading' ? 'Yükleniyor...' : state === 'ok' ? 'Yüklendi' : 'Görsel Yükle'}
              </button>
              <p className="text-[11px] text-[#7aab8e] mt-1.5">PNG / JPG / WEBP / SVG — yüksek kaliteyle otomatik boyutlandırılır. En net sonuç için yüksek çözünürlüklü ya da SVG (vektör) yükleyin.</p>
            </>
          )}
          {state === 'error' && error && (
            <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={11} /> {error}</p>
          )}
        </div>
      </div>
    </div>
  )
}
