import Link from 'next/link'
import { Shield, Building2, Briefcase, Users, Scale, ChevronRight, ArrowUpRight, Info, Calendar, Trophy, MapPin, Palette } from 'lucide-react'
import { clubInfo } from '@/data/club'
import type { SitePage } from '@/lib/supabase/pages-server'
import { parsePageBody, firstParagraphIndex, type PageBlock } from '@/lib/page-content'
import { pageHref, groupLabel } from '@/lib/pages-meta'

const GROUP_ICON: Record<string, typeof Shield> = {
  kulup: Shield,
  tesisler: Building2,
  kurumsal: Briefcase,
  taraftar: Users,
  yasal: Scale,
}

const FACTS = [
  { icon: Calendar, label: 'Kuruluş', value: clubInfo.founded },
  { icon: Trophy, label: 'Lig', value: `${clubInfo.league} · ${clubInfo.group}` },
  { icon: MapPin, label: 'Stadyum', value: `${clubInfo.stadium} (${clubInfo.stadiumCapacity})` },
  { icon: Palette, label: 'Renkler', value: clubInfo.colors },
]

interface Props {
  page: SitePage
  related?: { slug: string; title: string }[]
}

export default function PremiumPage({ page, related = [] }: Props) {
  const blocks = parsePageBody(page.body)
  const dropIdx = firstParagraphIndex(blocks)
  const GroupIcon = GROUP_ICON[page.navGroup] ?? Shield
  const label = groupLabel(page.navGroup)

  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      {/* ═══ HERO ═══ */}
      <header className="page-hero overflow-hidden">
        {page.heroImage && (
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={page.heroImage} alt="" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0c3a23]/80 via-ugreenm/85 to-ugreen" />
          </div>
        )}

        {/* Devasa hayalet kuruluş yılı — atmosfer */}
        <span
          aria-hidden
          className="pointer-events-none select-none absolute -top-6 -right-4 md:right-6 font-heading font-extrabold leading-none text-[26vw] md:text-[15rem] text-ugold/[0.07] tracking-tighter"
        >
          {clubInfo.founded}
        </span>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-16 md:pb-20">
          {/* Breadcrumb */}
          <nav aria-label="Konum" className="flex items-center gap-1.5 text-[12px] text-white/45 mb-6 reveal">
            <Link href="/" className="hover:text-ugold transition-colors">Ana Sayfa</Link>
            <ChevronRight size={13} className="text-white/30" />
            <span className="text-white/60">{label}</span>
            <ChevronRight size={13} className="text-white/30" />
            <span className="text-ugold/90 font-semibold truncate max-w-[40vw]">{page.title}</span>
          </nav>

          {/* Eyebrow */}
          <div className="flex items-center gap-2.5 mb-4 reveal">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-ugold/15 ring-1 ring-ugold/25 text-ugold">
              <GroupIcon size={17} strokeWidth={2.2} />
            </span>
            <span className="text-[11px] font-extrabold tracking-[0.25em] uppercase text-ugold/80">{label}</span>
          </div>

          {/* Başlık */}
          <h1 className="reveal font-heading text-[2.6rem] leading-[0.95] md:text-7xl font-extrabold text-white tracking-[-0.03em] max-w-3xl">
            {page.title}
          </h1>

          {page.subtitle && (
            <p className="reveal mt-4 text-white/65 text-base md:text-xl max-w-2xl leading-relaxed">{page.subtitle}</p>
          )}

          {/* Altın hairline accent */}
          <div className="reveal mt-7 h-1 w-20 rounded-full bg-gradient-to-r from-ugold to-ugold/0" />
        </div>
      </header>

      {/* ═══ İÇERİK ═══ */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_clamp(280px,26vw,340px)] gap-8 lg:gap-12 items-start">
          {/* Ana makale */}
          <article className="reveal bg-white rounded-3xl border border-[#ddeae2] shadow-sm p-7 sm:p-10 md:p-12">
            {blocks.length > 0 ? (
              <div className="space-y-7">
                {blocks.map((b, i) => (
                  <Block key={i} block={b} dropCap={i === dropIdx} />
                ))}
              </div>
            ) : (
              <p className="text-[#7aab8e] text-sm">İçerik yakında eklenecek.</p>
            )}

            {/* İmza şeridi */}
            <div className="mt-10 pt-6 border-t border-[#edf7f2] flex items-center gap-2.5 text-[12px] text-[#7aab8e]">
              <span className="inline-block w-5 h-0.5 bg-ugold/60" />
              <span className="font-semibold text-utxt2">{clubInfo.name}</span>
              <span>·</span>
              <span>{label}</span>
            </div>
          </article>

          {/* Yan panel */}
          <aside className="reveal lg:sticky lg:top-24 space-y-5">
            {/* Künye */}
            <div className="bg-gradient-to-br from-ugreenm to-ugreen rounded-3xl p-6 text-white shadow-sm relative overflow-hidden">
              <span aria-hidden className="pointer-events-none absolute -bottom-8 -right-6 font-heading font-extrabold text-[7rem] leading-none text-white/[0.06]">
                {clubInfo.shortCode.slice(0, 3)}
              </span>
              <p className="relative text-[11px] font-extrabold tracking-[0.2em] uppercase text-ugold/80 mb-4">Künye</p>
              <dl className="relative space-y-4">
                {FACTS.map((f) => (
                  <div key={f.label} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 text-ugold shrink-0">
                      <f.icon size={15} strokeWidth={2.2} />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-[11px] uppercase tracking-wide text-white/45 font-bold">{f.label}</dt>
                      <dd className="text-sm font-semibold text-white/90 leading-snug">{f.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            {/* İlgili sayfalar */}
            {related.length > 0 && (
              <div className="bg-white rounded-3xl border border-[#ddeae2] shadow-sm p-6">
                <p className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#7aab8e] mb-3">{label} sayfaları</p>
                <ul className="space-y-1">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={pageHref(r.slug)}
                        className="group flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 -mx-1 hover:bg-[#f5f9f6] transition-colors"
                      >
                        <span className="text-sm font-semibold text-utxt2 group-hover:text-ugreen transition-colors truncate">{r.title}</span>
                        <ArrowUpRight size={15} className="text-[#bcd4c7] group-hover:text-ugold shrink-0 transition-colors" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* İletişim CTA */}
            <Link
              href="/iletisim"
              className="group flex items-center justify-between gap-3 bg-ugold hover:bg-ugoldd text-ugreendd rounded-3xl p-5 shadow-sm transition-colors"
            >
              <div>
                <p className="text-[11px] font-extrabold tracking-wide uppercase opacity-70">Sorunuz mu var?</p>
                <p className="text-base font-extrabold">Bize ulaşın</p>
              </div>
              <ArrowUpRight size={22} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2.4} />
            </Link>
          </aside>
        </div>
      </div>
    </div>
  )
}

/* ─── Tekil blok render ─── */
function Block({ block, dropCap }: { block: PageBlock; dropCap: boolean }) {
  switch (block.kind) {
    case 'heading':
      return (
        <h2 className="font-heading text-xl md:text-2xl font-extrabold text-ugreenm tracking-[-0.02em] flex items-center gap-3 pt-2">
          <span className="inline-block w-7 h-[3px] rounded-full bg-ugold" />
          {block.text}
        </h2>
      )

    case 'paragraph':
      return (
        <p
          className={
            'text-[15px] md:text-[17px] text-[#3d4a44] leading-[1.85] whitespace-pre-line' +
            (dropCap
              ? ' first-letter:float-left first-letter:font-heading first-letter:font-extrabold first-letter:text-ugreen first-letter:text-6xl md:first-letter:text-7xl first-letter:leading-[0.78] first-letter:mr-3 first-letter:mt-1'
              : '')
          }
        >
          {block.text}
        </p>
      )

    case 'note':
      return (
        <div className="flex items-start gap-3 rounded-2xl bg-[#f5f9f6] border border-[#e3efe8] px-4 py-3.5">
          <Info size={17} className="text-ugreen/60 shrink-0 mt-0.5" />
          <p className="text-[13px] text-[#5b7a6b] italic leading-relaxed">{block.text}</p>
        </div>
      )

    case 'stats':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {block.items.map((it, i) => (
            <div key={i} className="rounded-2xl border border-[#e3efe8] bg-gradient-to-br from-white to-[#f7fbf9] px-5 py-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#7aab8e]">{it.label}</p>
              <p className="mt-1 text-lg font-extrabold text-ugreenm leading-tight">{it.value}</p>
            </div>
          ))}
        </div>
      )

    case 'deflist':
      return (
        <ul className="space-y-2.5">
          {block.items.map((it, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-2 w-2 h-2 rounded-full bg-ugold shrink-0" />
              <p className="text-[15px] md:text-base text-[#3d4a44] leading-relaxed">
                <span className="font-extrabold text-ugreenm">{it.term}</span>
                <span className="text-[#9bb5a8] mx-1.5">—</span>
                {it.desc}
              </p>
            </li>
          ))}
        </ul>
      )
  }
}
