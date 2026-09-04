'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Eye, EyeOff, Lock, Mail, AlertCircle, ArrowRight, Loader2, HelpCircle } from 'lucide-react'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showHelp, setShowHelp] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (authError) {
        if (authError.message.includes('Invalid login') || authError.message.includes('invalid_credentials')) {
          setError('E-posta veya şifre hatalı. Lütfen tekrar deneyin.')
        } else if (authError.message.includes('Email not confirmed')) {
          setError('E-posta adresiniz onaylanmamış. Supabase panelinden kullanıcıyı onaylayın.')
        } else {
          setError(`Hata: ${authError.message}`)
        }
        setLoading(false)
        return
      }
      if (data.user) {
        router.push('/admin')
        router.refresh()
      }
    } catch {
      setError('Bağlantı hatası. .env.local dosyasındaki Supabase bilgilerini kontrol edin.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* E-posta */}
      <div>
        <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wide text-utxt2">E-posta</label>
        <div className="group relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9bb5a8] transition-colors group-focus-within:text-ugreen" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@sanliurfaspor.org"
            required
            autoComplete="email"
            className="h-12 w-full rounded-xl border border-[#dce9e2] bg-white pl-11 pr-4 text-sm font-medium text-ugreenm placeholder-[#9bb5a8] transition-all focus:border-ugreen focus:outline-none focus:ring-4 focus:ring-ugreen/10"
          />
        </div>
      </div>

      {/* Şifre */}
      <div>
        <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wide text-utxt2">Şifre</label>
        <div className="group relative">
          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9bb5a8] transition-colors group-focus-within:text-ugreen" />
          <input
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className="h-12 w-full rounded-xl border border-[#dce9e2] bg-white pl-11 pr-11 text-sm font-medium text-ugreenm placeholder-[#9bb5a8] transition-all focus:border-ugreen focus:outline-none focus:ring-4 focus:ring-ugreen/10"
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            aria-label={showPw ? 'Şifreyi gizle' : 'Şifreyi göster'}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9bb5a8] transition-colors hover:text-ugreen"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Giriş */}
      <button
        type="submit"
        disabled={loading}
        className="group mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ugreen to-ugreend text-sm font-extrabold uppercase tracking-wide text-white shadow-[0_14px_30px_-12px_rgba(12,46,34,0.6)] transition-all hover:shadow-[0_18px_36px_-12px_rgba(12,46,34,0.7)] disabled:opacity-60"
      >
        {loading ? (
          <><Loader2 size={16} className="animate-spin" /> Giriş yapılıyor...</>
        ) : (
          <>Giriş Yap <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" /></>
        )}
      </button>

      {/* Yardım */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowHelp((v) => !v)}
          className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#7aab8e] transition-colors hover:text-ugreen"
        >
          <HelpCircle size={13} /> Giriş yapamıyor musun?
        </button>
        {showHelp && (
          <div className="mt-3 space-y-1.5 rounded-xl border border-[#e6efe9] bg-[#f5f9f6] p-4 text-[11px] leading-relaxed text-[#7aab8e]">
            <p><b className="text-ugreenm">1.</b> supabase.com → projene gir</p>
            <p><b className="text-ugreenm">2.</b> Authentication → Users → Add user</p>
            <p><b className="text-ugreenm">3.</b> E-posta ve şifreni gir, <span className="text-ugreen">Auto Confirm User</span> seç</p>
            <p><b className="text-ugreenm">4.</b> Settings → API → anon public anahtarını <span className="text-ugreen">.env.local</span>'a yapıştır</p>
          </div>
        )}
      </div>
    </form>
  )
}
