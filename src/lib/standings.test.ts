/* Puan durumu yardımcıları — node --test src/lib/standings.test.ts */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { zoneOf, resultOf, recentForm, signed } from './standings.ts'

test('zoneOf: 1 şampiyon, 2–5 play-off, son 3 küme düşme, gerisi yok', () => {
  assert.equal(zoneOf(1, 18), 'champion')
  assert.equal(zoneOf(2, 18), 'playoff')
  assert.equal(zoneOf(5, 18), 'playoff')
  assert.equal(zoneOf(6, 18), null)
  assert.equal(zoneOf(15, 18), null)
  assert.equal(zoneOf(16, 18), 'relegation')
  assert.equal(zoneOf(18, 18), 'relegation')
})

test('zoneOf: tablo boşsa (total 0) küme düşme işaretlenmez', () => {
  assert.equal(zoneOf(3, 0), 'playoff')
  assert.equal(zoneOf(9, 0), null)
})

const m = (isHome: boolean, homeScore: number | null, awayScore: number | null) =>
  ({ isHome, homeScore, awayScore, isCompleted: homeScore != null })

test('resultOf: ev/deplasman tarafına göre G/B/M', () => {
  assert.equal(resultOf(m(true, 2, 1)), 'G')
  assert.equal(resultOf(m(false, 2, 1)), 'M')
  assert.equal(resultOf(m(false, 0, 3)), 'G')
  assert.equal(resultOf(m(true, 1, 1)), 'B')
  assert.equal(resultOf(m(true, null, null)), null)
})

test('recentForm: oynanmış son 5 maç, en yeni sonda', () => {
  const ms = [m(true, 1, 0), m(false, 3, 3), m(true, 1, 1), m(false, 2, 1), m(true, 1, 1), m(false, 2, 3), m(true, null, null)]
  assert.deepEqual(recentForm(ms), ['B', 'B', 'M', 'B', 'G'])
})

test('signed: pozitif sayıya + eklenir', () => {
  assert.equal(signed(5), '+5')
  assert.equal(signed(0), '0')
  assert.equal(signed(-2), '-2')
})
