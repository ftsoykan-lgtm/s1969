/**
 * Sayfa gövdesi (düz metin) → zengin blok yapısı.
 * Admin düz metin yazar; burada premium düzen için bloklara ayrıştırılır.
 *
 * Satır-satır sınıflandırılır; tek (\n) veya çift (\n\n) satır arası fark etmez.
 * Ardışık aynı-tip satırlar tek blokta gruplanır.
 *
 * Tanınan desenler:
 *  - "(...)"           → editöryel not (satır tümüyle parantez içiyse)
 *  - "Başlık:"         → alt başlık (sonu ':' biten, içeriksiz kısa satır)
 *  - "Etiket: değer"×2 → künye/istatistik ızgarası (≥2 ardışık satır)
 *  - "Terim — açıklama"×2 → tanım listesi (≥2 ardışık satır)
 *  - diğer             → paragraf (her satır ayrı)
 */

export type PageBlock =
  | { kind: 'heading'; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'note'; text: string }
  | { kind: 'stats'; items: { label: string; value: string }[] }
  | { kind: 'deflist'; items: { term: string; desc: string }[] }

const STAT = /^([^:\n]{2,30}):[ \t]+(.+)$/
const DEF = /^(.{2,30}?)[ \t]+[—–][ \t]+(.+)$/
const NOTE = /^\((.+)\)$/

type LineKind = 'stat' | 'def' | 'prose'
const lineKind = (l: string): LineKind => (STAT.test(l) ? 'stat' : DEF.test(l) ? 'def' : 'prose')
const isHeading = (l: string): boolean => /:$/.test(l) && l.length <= 48 && !STAT.test(l)

export function parsePageBody(body: string | null | undefined): PageBlock[] {
  const lines = (body ?? '').split('\n').map((l) => l.trim()).filter(Boolean)
  const blocks: PageBlock[] = []

  let run: { kind: LineKind; lines: string[] } | null = null

  const flush = () => {
    if (!run) return
    const { kind, lines: ls } = run
    run = null
    if (kind === 'stat' && ls.length >= 2) {
      blocks.push({ kind: 'stats', items: ls.map((l) => { const m = l.match(STAT)!; return { label: m[1].trim(), value: m[2].trim() } }) })
    } else if (kind === 'def' && ls.length >= 2) {
      blocks.push({ kind: 'deflist', items: ls.map((l) => { const m = l.match(DEF)!; return { term: m[1].trim(), desc: m[2].trim() } }) })
    } else {
      // tek elemanlı stat/def veya prose → ayrı paragraflar
      for (const l of ls) blocks.push({ kind: 'paragraph', text: l })
    }
  }

  for (const line of lines) {
    const note = line.match(NOTE)
    if (note) { flush(); blocks.push({ kind: 'note', text: note[1].trim() }); continue }
    if (isHeading(line)) { flush(); blocks.push({ kind: 'heading', text: line.replace(/:$/, '').trim() }); continue }

    const k = lineKind(line)
    if (run && run.kind === k) run.lines.push(line)
    else { flush(); run = { kind: k, lines: [line] } }
  }
  flush()

  return blocks
}

/** İlk gerçek paragrafın index'i (drop-cap için) */
export function firstParagraphIndex(blocks: PageBlock[]): number {
  return blocks.findIndex((b) => b.kind === 'paragraph')
}
