import type { Metadata } from 'next'
import { getClubInfo } from '@/lib/supabase/club-server'
import ClubLogo from '@/components/ui/ClubLogo'
import LoginForm from './LoginForm'

export const metadata: Metadata = { title: 'Giriş' }

export default async function AdminLoginPage() {
  const club = await getClubInfo()
  const hasLogo = !!club.logoUrl && !club.logoUrl.includes('placehold.co')
  const year = new Date().getFullYear()
  const crest = (club.shortCode || club.name || 'ŞFK').slice(0, 1).toLocaleUpperCase('tr-TR')

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f8f5] px-5 py-10">
      {/* Atmosfer — çok hafif, kurumsal */}
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[440px] w-[440px] -translate-x-1/2 rounded-full bg-ugreen/[0.07] blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ugreen/25 to-transparent" />

      <div className="relative w-full max-w-[380px]">
        <div className="overflow-hidden rounded-2xl border border-[#e2ede7] bg-white shadow-[0_1px_3px_rgba(12,46,34,0.04),0_24px_48px_-24px_rgba(12,46,34,0.18)]">
          {/* Altın ince üst şerit — kurumsal kimlik dokunuşu */}
          <div aria-hidden className="h-1 bg-gradient-to-r from-ugold via-ugold to-ugreen" />

          <div className="px-7 pb-8 pt-9">
            {/* Arma + kulüp adı (mütevazı kimlik) */}
            <div className="flex flex-col items-center text-center">
              {hasLogo ? (
                <ClubLogo src={club.logoUrl} size={60} priority className="rounded-2xl bg-ugreen/[0.04] object-contain p-1.5 ring-1 ring-[#e2ede7]" />
              ) : (
                <span className="flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-ugreen font-heading text-2xl font-extrabold text-white">{crest}</span>
              )}
              <p className="mt-4 font-heading text-[15px] font-extrabold uppercase leading-none tracking-tight text-ugreenm">{club.name}</p>
              <p className="mt-1.5 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#9bb5a8]">Yönetim Paneli</p>
            </div>

            {/* Ayırıcı */}
            <div className="my-6 h-px bg-[#eef4f0]" />

            <LoginForm />
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-[#9bb5a8]">
          {club.name} © {year} · Yetkili erişim
        </p>
      </div>
    </div>
  )
}
