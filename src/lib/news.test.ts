/* Haber yardımcıları — Node yerleşik test koşucusu (ek bağımlılık yok):
   node --test src/lib/news.test.ts */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { paginate, pageNumbers, readingMinutes, relatedNews, newsListHref, parsePage, categoryCounts } from './news.ts'

const mk = (i: number, category = 'haber') => ({ id: String(i), slug: `h-${i}`, category })

test('paginate: 12li sayfalar, son sayfa kısmi', () => {
  const items = Array.from({ length: 30 }, (_, i) => i)
  assert.deepEqual(paginate(items, 1, 12), { items: items.slice(0, 12), page: 1, totalPages: 3 })
  assert.deepEqual(paginate(items, 3, 12).items, items.slice(24))
})

test('paginate: aralık dışı sayfa son/ilk sayfaya sıkıştırılır', () => {
  const items = Array.from({ length: 5 }, (_, i) => i)
  assert.equal(paginate(items, 9, 12).page, 1)
  assert.equal(paginate(items, -2, 12).page, 1)
  assert.deepEqual(paginate([], 1, 12), { items: [], page: 1, totalPages: 1 })
})

test('parsePage: geçersiz değerler 1 olur', () => {
  assert.equal(parsePage('3'), 3)
  assert.equal(parsePage(undefined), 1)
  assert.equal(parsePage('abc'), 1)
  assert.equal(parsePage(['2', '5']), 2)
  assert.equal(parsePage('0'), 1)
})

test('pageNumbers: az sayfada hepsi, çok sayfada boşluklu', () => {
  assert.deepEqual(pageNumbers(1, 3), [1, 2, 3])
  assert.deepEqual(pageNumbers(1, 17), [1, 2, 3, '…', 17])
  assert.deepEqual(pageNumbers(9, 17), [1, '…', 8, 9, 10, '…', 17])
  assert.deepEqual(pageNumbers(17, 17), [1, '…', 15, 16, 17])
})

test('readingMinutes: ~200 kelime/dk, en az 1', () => {
  assert.equal(readingMinutes(''), 1)
  assert.equal(readingMinutes('kelime '.repeat(450)), 3)
})

test('relatedNews: önce aynı kategori, kendisi hariç, en fazla limit', () => {
  const all = [mk(1, 'transfer'), mk(2, 'haber'), mk(3, 'transfer'), mk(4, 'haber'), mk(5, 'transfer')]
  const r = relatedNews(all, all[0], 3)
  assert.deepEqual(r.map((n) => n.id), ['3', '5', '2'])
})

test('newsListHref: varsayılanlar URL\'ye yazılmaz', () => {
  assert.equal(newsListHref({}), '/haberler')
  assert.equal(newsListHref({ kategori: 'transfer' }), '/haberler?kategori=transfer')
  assert.equal(newsListHref({ kategori: 'transfer', sayfa: 2 }), '/haberler?kategori=transfer&sayfa=2')
  assert.equal(newsListHref({ sayfa: 1 }), '/haberler')
})

test('categoryCounts: kategori başına haber sayısı', () => {
  const counts = categoryCounts([mk(1, 'a'), mk(2, 'b'), mk(3, 'a')])
  assert.equal(counts.get('a'), 2)
  assert.equal(counts.get('b'), 1)
  assert.equal(counts.get('c') ?? 0, 0)
})
