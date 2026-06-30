import type { SitePage } from '@/lib/supabase/pages-server'
import { Info } from 'lucide-react'
import { PageShell, PageHero, Container, Intro, SectionTitle, pageData } from '../shared'

interface Color { name: string; hex: string; note?: string }
interface Value { title: string; text: string }
interface Data { intro?: string; colors?: Color[]; values?: Value[]; logoNote?: string }

/** Koyu zeminde okunur metin için basit parlaklık testi */
function isDark(hex: string): boolean {
  const h = hex.replace('#', '')
  if (h.length < 6) return true
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) < 150
}

export default function BrandPage({ page }: { page: SitePage }) {
  const d = pageData<Data>(page)
  const colors = d.colors ?? []
  const values = d.values ?? []

  return (
    <PageShell>
      <PageHero page={page} />
      <Container className="py-12 md:py-16">
        <Intro text={d.intro} />

        {/* Renk paleti */}
        {colors.length > 0 && (
          <section className="mt-12">
            <SectionTitle kicker="Palet" title="Renklerimiz" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {colors.map((c, i) => {
                const dark = isDark(c.hex)
                return (
                  <div key={i} className="reveal rounded-2xl overflow-hidden border border-[#ddeae2] shadow-sm">
                    <div className="h-32 flex items-end p-4" style={{ background: c.hex }}>
                      <span className={`text-sm font-mono font-bold ${dark ? 'text-white/90' : 'text-black/70'}`}>{c.hex}</span>
                    </div>
                    <div className="bg-white p-4">
                      <h3 className="font-heading text-base font-extrabold text-ugreenm">{c.name}</h3>
                      {c.note && <p className="mt-1 text-[13px] text-utxt2 leading-relaxed">{c.note}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Değerler */}
        {values.length > 0 && (
          <section className="mt-14">
            <SectionTitle kicker="Kimlik" title="Değerlerimiz" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {values.map((v, i) => (
                <div key={i} className="reveal card-premium p-6">
                  <span className="block font-heading text-4xl font-extrabold text-ugold/30 leading-none">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-2 font-heading text-lg font-extrabold text-ugreenm">{v.title}</h3>
                  <p className="mt-1.5 text-[14px] text-[#3d4a44] leading-relaxed">{v.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Logo kullanımı */}
        {d.logoNote && (
          <div className="reveal mt-12 flex items-start gap-3 rounded-2xl bg-ugreenm text-white p-6">
            <Info size={20} className="text-ugold shrink-0 mt-0.5" />
            <div>
              <h3 className="font-heading text-base font-extrabold text-ugold mb-1">Logo Kullanımı</h3>
              <p className="text-[14px] text-white/80 leading-relaxed">{d.logoNote}</p>
            </div>
          </div>
        )}
      </Container>
    </PageShell>
  )
}
