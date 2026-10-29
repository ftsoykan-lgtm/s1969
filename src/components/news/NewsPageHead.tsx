import Link from 'next/link'

export type Crumb = { label: string; href?: string }

/* Breadcrumb — "Ana sayfa / Haberler / Kategori". Son öğe link değil (aria-current). */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Sayfa yolu" className="text-[13px] font-semibold text-[#7aab8e]">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((c, i) => {
          const last = i === items.length - 1
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden className="text-[#c2d8cb]">/</span>}
              {c.href && !last
                ? <Link href={c.href} className="transition-colors hover:text-ugreen">{c.label}</Link>
                : <span aria-current={last ? 'page' : undefined} className={last ? 'text-ugreenm' : undefined}>{c.label}</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/* Bölüm başlığı — altın çizgili üst yazı + büyük başlık; sağda opsiyonel slot (sayaç vb.). */
export function SectionHead({ eyebrow, title, as: Tag = 'h2', aside }: { eyebrow: string; title: string; as?: 'h1' | 'h2'; aside?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <span className="flex items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-ugoldd">
          <span aria-hidden className="h-[2px] w-7 rounded-full bg-ugold" />{eyebrow}
        </span>
        <Tag className="mt-2 font-heading text-[2rem] font-extrabold uppercase leading-none tracking-[-0.02em] text-ugreenm md:text-[2.6rem]">{title}</Tag>
      </div>
      {aside}
    </div>
  )
}
