/* Haber listesi/detay için saf yardımcılar (bileşenlerden bağımsız, test edilebilir).
   Not: Burada çalışma zamanı importu yok — `node --test` ile doğrudan koşar. */

export const NEWS_PAGE_SIZE = 12
const WORDS_PER_MINUTE = 200

type Categorized = { id: string; category: string }

/** ?sayfa= değerini güvenli sayıya çevir (geçersiz → 1). */
export function parsePage(raw: string | string[] | undefined): number {
  const v = Array.isArray(raw) ? raw[0] : raw
  const n = Number.parseInt(v ?? '', 10)
  return Number.isFinite(n) && n >= 1 ? n : 1
}

/** Diziyi sayfalara böl; aralık dışı sayfa geçerli aralığa sıkıştırılır. */
export function paginate<T>(items: readonly T[], page: number, size = NEWS_PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / size))
  const current = Math.min(Math.max(1, page), totalPages)
  return { items: items.slice((current - 1) * size, current * size), page: current, totalPages }
}

/** Sayfalama düğmeleri: 1 … 8 9 10 … 17 (çok sayfada boşluklu). */
export function pageNumbers(page: number, totalPages: number): (number | '…')[] {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
  const near = [page - 1, page, page + 1].filter((p) => p > 1 && p < totalPages)
  if (page <= 2) near.push(2, 3)
  if (page >= totalPages - 1) near.push(totalPages - 2, totalPages - 1)
  const pages = [...new Set([1, ...near, totalPages])].sort((a, b) => a - b)
  return pages.flatMap((p, i) => (i > 0 && p - pages[i - 1] > 1 ? ['…' as const, p] : [p]))
}

/** Okuma süresi (dk) — en az 1. */
export function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

/** İlgili haberler: önce aynı kategori, sonra diğerleri (sıra korunur), kendisi hariç. */
export function relatedNews<T extends Categorized>(all: readonly T[], current: T, limit = 4): T[] {
  const others = all.filter((n) => n.id !== current.id)
  const same = others.filter((n) => n.category === current.category)
  const rest = others.filter((n) => n.category !== current.category)
  return [...same, ...rest].slice(0, limit)
}

/** Kategori → haber sayısı. */
export function categoryCounts(all: readonly Categorized[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const n of all) counts.set(n.category, (counts.get(n.category) ?? 0) + 1)
  return counts
}

/** Liste URL'si — varsayılan değerler (tüm kategoriler, 1. sayfa) yazılmaz. */
export function newsListHref({ kategori, sayfa }: { kategori?: string | null; sayfa?: number }): string {
  const q = new URLSearchParams()
  if (kategori) q.set('kategori', kategori)
  if (sayfa && sayfa > 1) q.set('sayfa', String(sayfa))
  const s = q.toString()
  return s ? `/haberler?${s}` : '/haberler'
}
