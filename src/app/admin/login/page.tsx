import type { Metadata } from 'next'
import { ShieldCheck } from 'lucide-react'
import { getClubInfo } from '@/lib/supabase/club-server'
import ClubLogo from '@/components/ui/ClubLogo'
import LoginForm from './LoginForm'

export const metadata: Metadata = { title: 'Yönetim Girişi' }

export default async function AdminLoginPage() {
  const club = await getClubInfo()
  const hasLogo = !!club.logoUrl && !club.logoUrl.includes('placehold.co')
  const year = new Date().getFullYear()
  const crest = (club.shortCode || club.name || 'ŞFK').slice(0, 3).toLocaleUpperCase('tr-TR')

  return (
    <div className="grid min-h-screen bg-[#f5f9f6] lg:grid-cols-[1fr_1.05fr]">
      {/* ══ SOL — RESMİ KULÜP KİMLİĞİ ══ */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0b3a23] via-ugreend to-ugreenm p-10 text-white lg:flex xl:p-14">
        <div aria-hidden className="pointer-events-none absolute -left-24 -top-40 h-[520px] w-[520px] rounded-full bg-ugreen/40 blur-[130px]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 right-0 h-[420px] w-[420px] rounded-full bg-ugold/10 blur-[120px]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:22px_22px]" />
        <span aria-hidden className="pointer-events-none absolute -right-10 top-1/4 select-none font-heading text-[15rem] font-extrabold leading-none text-white/[0.03]">{crest}</span>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-ugold/60 to-transparent" />

        {/* Üst: logo + isim */}
        <div className="relative flex items-center gap-4">
          {hasLogo ? (
            <ClubLogo src={club.logoUrl} size={64} priority className="rounded-2xl bg-white/10 object-contain p-1.5 ring-1 ring-white/15" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ugold font-heading text-2xl font-extrabold text-ugreend">{crest[0]}</span>
          )}
          <div>
            <p className="font-heading text-xl font-extrabold uppercase leading-none tracking-tight">{club.name}</p>
            {club.brandTagline && <p className="mt-1.5 text-[10px] font-extrabold uppercase tracking-[0.22em] text-ugold/70">{club.brandTagline}</p>}
          </div>
        </div>

        {/* Orta: başlık */}
        <div className="relative max-w-md">
          <p className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.25em] text-ugold">
            <span className="h-1.5 w-1.5 rounded-full bg-ugold" /> Resmi Yönetim Paneli
          </p>
          <h1 className="mt-4 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight xl:text-5xl">
            Kulübün dijital<br />merkezini <span className="text-ugold">yönet.</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Haberler, kadro, fikstür, puan durumu ve site ayarları — hepsi tek panelden. Devam etmek için yetkili hesabınla giriş yap.
          </p>
        </div>

        {/* Alt: künye */}
        <div className="relative flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-bold text-white/45">
          {club.founded && <span>Kuruluş <b className="text-white/80">{club.founded}</b></span>}
          {club.colors && (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-ugold" />
              <span className="h-2.5 w-2.5 rounded-full bg-ugreen" />
              {club.colors}
            </span>
          )}
          {club.league && <span className="text-white/60">{club.league}{club.group ? ` · ${club.group}` : ''}</span>}
        </div>
      </div>

      {/* ══ SAĞ — GİRİŞ ══ */}
      <div className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          {/* Başlık (mobilde logo da) */}
          <div className="mb-8 flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="mb-4 lg:hidden">
              {hasLogo ? (
                <ClubLogo src={club.logoUrl} size={56} priority className="rounded-2xl bg-ugreen/[0.04] object-contain p-1.5 ring-1 ring-[#dce9e2]" />
              ) : (
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ugreen font-heading text-xl font-extrabold text-white">{crest[0]}</span>
              )}
            </div>
            <p className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-ugreen">
              <ShieldCheck size={13} /> Yönetim Girişi
            </p>
            <h2 className="mt-2 font-heading text-2xl font-extrabold text-ugreenm">Tekrar hoş geldin</h2>
            <p className="mt-1 text-sm text-[#7aab8e]">Devam etmek için hesabına giriş yap.</p>
          </div>

          <LoginForm />

          <p className="mt-8 text-center text-[11px] text-[#9bb5a8] lg:text-left">
            {club.name} © {year} · Güvenli yönetim bağlantısı
          </p>
        </div>
      </div>
    </div>
  )
}
