'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
    } catch (err) {
      setError('Bağlantı hatası. .env.local dosyasındaki Supabase bilgilerini kontrol edin.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f4a28] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#FFD100] text-[#0f4a28] font-black text-2xl shadow-xl mb-4">
            Ş
          </div>
          <h1 className="text-2xl font-black text-white">Admin Panel</h1>
          <p className="text-white/50 text-sm mt-1">Şanlıurfaspor Yönetim Sistemi</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-2xl p-8 space-y-5">
          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-[#3d6b52] mb-1.5 uppercase tracking-wide">
              E-posta
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7aab8e]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sanliurfask.org.tr"
                required
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 bg-[#f5f9f6] border border-[#ddeae2] rounded-xl text-sm text-[#15532f] placeholder-[#7aab8e] focus:outline-none focus:border-[#1A6B3C] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-[#3d6b52] mb-1.5 uppercase tracking-wide">
              Şifre
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7aab8e]" />
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-3 bg-[#f5f9f6] border border-[#ddeae2] rounded-xl text-sm text-[#15532f] placeholder-[#7aab8e] focus:outline-none focus:border-[#1A6B3C] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7aab8e] hover:text-[#1A6B3C] transition-colors"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A6B3C] hover:bg-[#0f4a28] disabled:opacity-60 text-white font-black py-3 rounded-xl transition-colors text-sm shadow-sm"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="mt-6 bg-white/5 rounded-2xl p-5 text-xs text-white/40 space-y-2">
          <p className="font-bold text-white/60 mb-2">Giriş yapamıyor musunuz?</p>
          <p>1. <span className="text-white/60">supabase.com</span> → projenize girin</p>
          <p>2. <span className="text-white/60">Authentication → Users</span> → <span className="text-white/60">Add user</span></p>
          <p>3. E-posta ve şifrenizi girin, <span className="text-white/60">Auto Confirm User</span> seçin</p>
          <p>4. <span className="text-white/60">Settings → API → anon public</span> key'i kopyalayıp <span className="text-white/60">.env.local</span>'a yapıştırın</p>
        </div>

        <p className="text-center text-white/20 text-xs mt-4">Şanlıurfaspor © 2026</p>
      </div>
    </div>
  )
}
