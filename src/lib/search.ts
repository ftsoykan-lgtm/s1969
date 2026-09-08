/** Site içi arama — saf yardımcılar (server + client ortak, bağımlılık yok).
 *
 *  Türkçe kritik: Postgres `ilike` ve JS `toLowerCase()` I/ı/İ/i çiftini
 *  doğru katlamaz ("İSTANBUL".toLowerCase() → "i̇stanbul", nokta kalır).
 *  Bu yüzden hem indeks hem sorgu aynı `normalize()`'dan geçer.
 *  Aynı katlama deseni projede zaten var: lib/tff.ts urlSlugPart(). */

export type SearchType = 'haber' | 'oyuncu' | 'mac' | 'sayfa'

/** Aranabilir tek kayıt. `haystack` önceden normalize edilmiş arama metnidir. */
export interface SearchDoc {
  type: SearchType
  title: string
  subtitle?: string
  meta?: string
  href: string
  imageUrl?: string | null
  /** normalize edilmiş başlık — skorlamada ağır basar */
  nTitle: string
  /** normalize edilmiş tüm metin (başlık + alt başlık + gövde) */
  nBody: string
  /** yeniden sıralamada küçük tazelik katkısı (haberler için tarih) */
  ts?: number
}

/** Kullanıcıya dönen sonuç (indeks alanları çıkarılmış). */
export type SearchHit = Omit<SearchDoc, 'nTitle' | 'nBody' | 'ts'> & { score: number }

export const TYPE_LABEL: Record<SearchType, string> = {
  haber: 'Haberler',
  oyuncu: 'Oyuncular',
  mac: 'Maçlar',
  sayfa: 'Sayfalar',
}

/** Türkçe duyarlı katlama: aksanları ASCII'ye indirger, boşlukları sadeleştirir. */
export function normalize(s: string | null | undefined): string {
  return (s || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i').replace(/İ/g, 'i').replace(/i̇/g, 'i')
    .replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u')
    .replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/â/g, 'a').replace(/î/g, 'i').replace(/û/g, 'u')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

/** Sorguyu anlamlı parçalara böler (tek harflik gürültü elenir). */
export function tokenize(q: string): string[] {
  const t = normalize(q).split(' ').filter((w) => w.length >= 2)
  // tek karakterli sorguya da izin ver ("6" gibi forma no aramaları)
  if (t.length === 0) {
    const raw = normalize(q)
    return raw ? [raw] : []
  }
  return t
}

/** Kelime sınırında geçiyor mu (ortada rastgele eşleşmeyi ayırt etmek için). */
function hasWordStart(hay: string, token: string): boolean {
  if (hay.startsWith(token)) return true
  return hay.includes(' ' + token)
}

/** Tek kaydın skoru. 0 → eşleşme yok (sonuçtan düşer).
 *  Kural: sorgudaki HER parça bir yerde geçmeli (AND mantığı). */
export function scoreDoc(doc: SearchDoc, tokens: string[]): number {
  if (tokens.length === 0) return 0
  const full = tokens.join(' ')
  let score = 0

  // Tam başlık eşleşmesi her şeyi ezer
  if (doc.nTitle === full) score += 1000
  else if (doc.nTitle.startsWith(full)) score += 400
  else if (doc.nTitle.includes(full)) score += 220

  for (const tk of tokens) {
    const inTitle = doc.nTitle.includes(tk)
    const inBody = doc.nBody.includes(tk)
    if (!inTitle && !inBody) return 0          // AND: eksik parça varsa eleme

    if (inTitle) score += hasWordStart(doc.nTitle, tk) ? 60 : 30
    else score += hasWordStart(doc.nBody, tk) ? 14 : 7
  }

  // Kısa başlık = daha isabetli eşleşme (uzun metinde tesadüfi geçişi cezalandır)
  score += Math.max(0, 24 - doc.nTitle.length / 4)

  // Tazelik: yalnız zaman damgası olanlarda (haber) küçük katkı, sıralamayı domine etmez
  if (doc.ts) {
    const gunFarki = (Date.now() - doc.ts) / 86_400_000
    if (gunFarki >= 0 && gunFarki < 365) score += Math.round(20 * (1 - gunFarki / 365))
  }

  return score
}

/** Tüm indeksi tarar, skora göre sıralar. */
export function runSearch(docs: SearchDoc[], q: string, limit = 24): SearchHit[] {
  const tokens = tokenize(q)
  if (tokens.length === 0) return []
  const hits: SearchHit[] = []
  for (const d of docs) {
    const score = scoreDoc(d, tokens)
    if (score <= 0) continue
    hits.push({
      type: d.type, title: d.title, subtitle: d.subtitle, meta: d.meta,
      href: d.href, imageUrl: d.imageUrl, score,
    })
  }
  hits.sort((a, b) => b.score - a.score)
  return hits.slice(0, limit)
}

/** Vurgulama için: normalize ile AYNI harf katlamasını yapar ama karakter
 *  sayısını korur (her ayırıcı tek boşluğa döner, run'lar çökmez).
 *  Böylece normalize edilmiş metindeki indeksler orijinal metinde birebir
 *  aynı yere denk gelir. `normalize()` sonuç kalitesi için run'ları çökertir;
 *  burada çökertmek indeks hizasını bozardı (ör. "A — B" 3 karakter kaybeder). */
function normalizeKeepLength(s: string): string {
  return s
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i').replace(/İ/g, 'i')
    .replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u')
    .replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/â/g, 'a').replace(/î/g, 'i').replace(/û/g, 'u')
    .replace(/[^\p{L}\p{N}]/gu, ' ')   // + YOK: her karakter tek karaktere döner
}

/** Eşleşen parçayı vurgulamak için metni dilimler (client tarafında <mark>). */
export function highlightParts(text: string, q: string): { text: string; hit: boolean }[] {
  const tokens = tokenize(q)
  if (!text || tokens.length === 0) return [{ text, hit: false }]

  const n = normalizeKeepLength(text)
  // Türkçe 'İ' bazı ortamlarda i + birleşik nokta (U+0307) olarak katlanır;
  // hizalama bozulursa vurgulamayı sessizce atla (metin yine tam gösterilir).
  if (n.length !== text.length) return [{ text, hit: false }]

  const isHit = new Array<boolean>(text.length).fill(false)
  for (const tk of tokens) {
    let from = 0
    for (;;) {
      const i = n.indexOf(tk, from)
      if (i === -1) break
      for (let j = i; j < i + tk.length; j++) isHit[j] = true
      from = i + tk.length
    }
  }

  const parts: { text: string; hit: boolean }[] = []
  let start = 0
  for (let i = 1; i <= text.length; i++) {
    if (i === text.length || isHit[i] !== isHit[start]) {
      parts.push({ text: text.slice(start, i), hit: isHit[start] })
      start = i
    }
  }
  return parts
}
