'use client'

import { useState } from 'react'
import { Loader2, Check } from 'lucide-react'
import { subscribeEmail } from '@/lib/supabase/settings'

export default function NewsletterForm({ placeholder, buttonLabel }: { placeholder: string; buttonLabel: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')
  const [msg, setMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'loading') return
    setStatus('loading'); setMsg('')
    const res = await subscribeEmail(email)
    if (res.ok) {
      setStatus('ok')
      setMsg(res.already ? 'Zaten abonesin, teşekkürler!' : 'Abone olundu — teşekkürler!')
      setEmail('')
    } else {
      setStatus('err')
      setMsg(res.error ?? 'Bir hata oluştu, tekrar dene.')
    }
  }

  return (
    <div className="w-full md:w-auto">
      <form onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-full bg-white/[0.05] border border-white/10 p-1.5 backdrop-blur-sm">
        <input type="email" required value={email} onChange={(e) => { setEmail(e.target.value); if (status !== 'idle') setStatus('idle') }}
          placeholder={placeholder} aria-label="E-posta"
          className="flex-1 md:w-64 bg-transparent px-4 py-2 text-sm text-white placeholder-white/35 focus:outline-none" />
        <button type="submit" disabled={status === 'loading'}
          className="shrink-0 inline-flex items-center gap-1.5 text-ugreenm font-extrabold text-[11px] tracking-wide uppercase px-5 py-2.5 rounded-full bg-gradient-to-b from-ugoldl to-ugold shadow-[0_4px_14px_rgba(255,209,0,0.3)] hover:scale-[1.03] transition-transform disabled:opacity-70 disabled:hover:scale-100">
          {status === 'loading' ? <Loader2 size={14} className="animate-spin" /> : status === 'ok' ? <Check size={14} /> : null}
          {buttonLabel}
        </button>
      </form>
      {msg && (
        <p className={`mt-2 text-[12px] font-medium px-2 ${status === 'err' ? 'text-red-300' : 'text-ugold'}`} role="status">{msg}</p>
      )}
    </div>
  )
}
