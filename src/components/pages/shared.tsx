import Link from 'next/link'
import type { ReactNode } from 'react'
import { Shield, Building2, Briefcase, Users, Scale, ChevronRight } from 'lucide-react'
import { clubInfo } from '@/data/club'
import type { SitePage } from '@/lib/supabase/pages-server'
import { groupLabel } from '@/lib/pages-meta'
import { getSpec } from '@/lib/pages/specs'

const GROUP_ICON: Record<string, typeof Shield> = {
  kulup: Shield,
  tesisler: Building2,
  kurumsal: Briefcase,
  taraftar: Users,
  yasal: Scale,
}

/** DB `data` (varsa) varsayılanların üzerine biner → sayfa hiç boş kalmaz. */
export function pageData<T = Record<string, unknown>>(page: SitePage): T {
  const defaults = getSpec(page.slug)?.defaults ?? {}
  const saved = (page.data && typeof page.data === 'object') ? page.data : {}
  return { ...defaults, ...saved } as T
}

/* ─── Premium iç-sayfa hero bandı (tüm şablonlarda ortak) ─── */
export function PageHero({ page, children }: { page: SitePage; children?: ReactNode }) {
  const GroupIcon = GROUP_ICON[page.navGroup] ?? Shield
  const label = groupLabel(page.navGroup)
  return (
    <header className="page-hero overflow-hidden">
      {page.heroImage && (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={page.heroImage} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c3a23]/80 via-ugreenm/85 to-ugreen" />
        </div>
      )}
      <span
        aria-hidden
        className="pointer-events-none select-none absolute -top-6 -right-4 md:right-6 font-heading font-extrabold leading-none text-[26vw] md:text-[15rem] text-ugold/[0.07] tracking-tighter"
      >
        {clubInfo.founded}
      </span>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-16 md:pb-20">
        <nav aria-label="Konum" className="flex items-center gap-1.5 text-[12px] text-white/45 mb-6 reveal">
          <Link href="/" className="hover:text-ugold transition-colors">Ana Sayfa</Link>
          <ChevronRight size={13} className="text-white/30" />
          <span className="text-white/60">{label}</span>
          <ChevronRight size={13} className="text-white/30" />
          <span className="text-ugold/90 font-semibold truncate max-w-[40vw]">{page.title}</span>
        </nav>

        <div className="flex items-center gap-2.5 mb-4 reveal">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-ugold/15 ring-1 ring-ugold/25 text-ugold">
            <GroupIcon size={17} strokeWidth={2.2} />
          </span>
          <span className="text-[11px] font-extrabold tracking-[0.25em] uppercase text-ugold/80">{label}</span>
        </div>

        <h1 className="reveal font-heading text-[2.6rem] leading-[0.95] md:text-7xl font-extrabold text-white tracking-[-0.03em] max-w-3xl">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="reveal mt-4 text-white/65 text-base md:text-xl max-w-2xl leading-relaxed">{page.subtitle}</p>
        )}

        {children}

        <div className="reveal mt-7 h-1 w-20 rounded-full bg-gradient-to-r from-ugold to-ugold/0" />
      </div>
    </header>
  )
}

/* ─── Sayfa içi bölüm başlığı ─── */
export function SectionTitle({ kicker, title }: { kicker?: string; title: string }) {
  return (
    <div className="mb-7 reveal">
      {kicker && <p className="text-[11px] font-extrabold tracking-[0.22em] uppercase text-ugold mb-1.5">{kicker}</p>}
      <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-ugreenm tracking-[-0.02em]">{title}</h2>
    </div>
  )
}

/* ─── Giriş paragrafı (drop-cap'li, geniş) ─── */
export function Intro({ text }: { text?: string }) {
  if (!text) return null
  return (
    <p className="reveal max-w-3xl text-[16px] md:text-[19px] leading-[1.8] text-[#3d4a44] first-letter:float-left first-letter:font-heading first-letter:font-extrabold first-letter:text-ugreen first-letter:text-6xl md:first-letter:text-7xl first-letter:leading-[0.78] first-letter:mr-3 first-letter:mt-1">
      {text}
    </p>
  )
}

/* ─── Sayfa gövde kabı ─── */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      {children}
    </div>
  )
}

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
}
