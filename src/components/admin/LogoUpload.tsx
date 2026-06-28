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

export default function LogoUpload({ value, onChange, size = 256, folder = 'logos', label = 'Logo' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<'idle' | 'uploading' | 'ok' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [manual, setManual] = useState(false)

  const handleFile = async (file: File) => {
    setState('uploading')
    setError(null)
    const res = await uploadImage(file, { folder, size })
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
              <p className="text-[11px] text-[#7aab8e] mt-1.5">PNG/JPG/WEBP — otomatik {size}×{size}px'e ölçeklenir</p>
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
