/**
 * TFF Web Otomasyon Script'i — Şanlıurfaspor
 * ------------------------------------------------------------
 * Ne yapar:
 *   1. TFF 2. Lig Beyaz Grup PUAN DURUMU'nu çeker
 *   2. Sadece ŞANLIURFASPOR'un FİKSTÜRÜNÜ çeker (lig + kupa maçları)
 *   3. Sonucu  src/data/tff-live.json  dosyasına yazar + konsola basar
 *
 * Çalıştırma (sen istediğin zaman):
 *   npm run tff
 *
 * Notlar:
 *   - TFF sitesi bozuk SSL sertifikası kullanır     -> ignoreHTTPSErrors
 *   - Site windows-1254 + ASP.NET/Telerik postback  -> gerçek tarayıcı (Playwright)
 *   - Fikstür: sezon seçilir + "Ara" butonuna basılır
 *   - Sezonu değiştirmek için aşağıdaki SEASON değerini düzenle
 */

import { chromium } from 'playwright'
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_FILE = resolve(__dirname, '../src/data/tff-live.json')

// .env.local dosyasını elle yükle (node scriptleri otomatik okumaz)
const ENV_FILE = resolve(__dirname, '../.env.local')
if (existsSync(ENV_FILE)) {
  for (const line of readFileSync(ENV_FILE, 'utf-8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

// Supabase'e yazma (opsiyonel) — ortam değişkenleri varsa canlı tabloyu günceller
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

async function supabaseYaz(data) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.log('[TFF] (Supabase env yok — sadece JSON yazıldı)')
    return
  }
  try {
    // Kütüphane yerine doğrudan REST (WebSocket gerekmez, her Node sürümünde çalışır)
    const res = await fetch(`${SUPABASE_URL}/rest/v1/tff_data?on_conflict=id`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify({ id: 1, data, updated_at: new Date().toISOString() }),
    })
    if (!res.ok) {
      const txt = await res.text()
      console.error(`[TFF] ❌ Supabase yazma hatası (HTTP ${res.status}):`, txt)
      process.exitCode = 1
    } else {
      console.log('[TFF] 🟢 Supabase tff_data güncellendi (canlı)')
    }
  } catch (e) {
    console.error('[TFF] ❌ Supabase bağlantı hatası:', e.message)
    process.exitCode = 1
  }
}

/* ─── AYARLAR ──────────────────────────────────────────────── */
const SEASON = '2025-2026'        // Fikstür için sezon
const GRUP_ID = 2782              // 2. Lig Beyaz Grup (Şanlıurfaspor)
const KULUP_ID = 31               // Şanlıurfaspor kulüp ID
const TEAM_KEY = 'URFASPOR'       // Takımı tanımak için (büyük harf)

const STANDINGS_URL = `https://www.tff.org/default.aspx?pageID=976&grupID=${GRUP_ID}`
const FIXTURE_URL = `https://www.tff.org/Default.aspx?pageID=28&kulupID=${KULUP_ID}`

const log = (...a) => console.log('[TFF]', ...a)

/* ─── 1) PUAN DURUMU ───────────────────────────────────────── */
async function cekPuanDurumu(page) {
  log('Puan durumu çekiliyor →', STANDINGS_URL)
  await page.goto(STANDINGS_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForSelector('.standings table tr', { timeout: 30000 })

  // Her satırın hücrelerini + kulupID (logo için) yakala
  const rows = await page.$$eval('.standings table tr', (trs) =>
    trs.map((tr) => {
      const cells = Array.from(tr.querySelectorAll('td')).map((td) => td.textContent.trim()).filter(Boolean)
      const link = tr.querySelector('a[href*="kulupID="], a[href*="kulupId="]')
      const href = link?.getAttribute('href') ?? ''
      const idm = href.match(/kulup[Ii][Dd]=(\d+)/)
      return { cells, kulupId: idm ? idm[1] : null }
    })
  )

  const standings = rows
    .map(({ cells: c, kulupId }) => {
      const m = c[0]?.match(/^(\d+)\.(.*)$/)   // "5.KIZILKAYA TARIM ŞANLIURFASPOR"
      if (!m) return null                       // başlık satırını ele
      const team = m[2].trim()
      return {
        rank: Number(m[1]),
        team,
        kulupId,
        isSanliurfaspor: team.toUpperCase().includes(TEAM_KEY),
        played: Number(c[1]),
        won: Number(c[2]),
        drawn: Number(c[3]),
        lost: Number(c[4]),
        goalsFor: Number(c[5]),
        goalsAgainst: Number(c[6]),
        goalDiff: Number(c[7]),
        points: Number(c[8]),
      }
    })
    .filter(Boolean)

  log(`✓ ${standings.length} takım çekildi`)
  return standings
}

/* ─── 1b) TAKIM LOGOLARINI OTOMATİK ÇEK ────────────────────── */
async function cekLogolar(page, standings) {
  log('Takım logoları çekiliyor (TFF kulüp sayfaları)...')
  const logos = {}
  for (const s of standings) {
    if (!s.kulupId) continue
    try {
      await page.goto(`https://www.tff.org/Default.aspx?pageID=28&kulupID=${s.kulupId}`,
        { waitUntil: 'domcontentloaded', timeout: 30000 })
      let src = await page.$eval('img[src*="KulupLogolari"]', (el) => el.getAttribute('src')).catch(() => null)
      if (src) {
        src = src.replace(/\\/g, '/')                       // ters slash → düz
        if (src.startsWith('//')) src = 'https:' + src
        if (src.startsWith('/')) src = 'https://www.tff.org' + src
        logos[s.team] = src
        process.stdout.write('  ✓ ' + s.team + '\n')
      }
    } catch {
      process.stdout.write('  ✗ ' + s.team + ' (logo alınamadı)\n')
    }
  }
  log(`✓ ${Object.keys(logos).length} logo bulundu`)
  return logos
}

/* ─── 2) ŞANLIURFASPOR FİKSTÜRÜ ────────────────────────────── */
async function cekFikstur(page) {
  log('Fikstür çekiliyor →', FIXTURE_URL)
  await page.goto(FIXTURE_URL, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(1500)

  // Sezonu seç (Telerik RadComboBox: yaz + Enter)
  const seasonInput = page.locator('[id*="m_28_398"][id$="SezonSelector1_combo_Input"]')
  const current = await seasonInput.inputValue().catch(() => '')
  if (current.trim() !== SEASON) {
    log(`Sezon seçiliyor: "${current}" → "${SEASON}"`)
    await seasonInput.click()
    await seasonInput.fill('')
    await seasonInput.type(SEASON, { delay: 50 })
    await page.waitForTimeout(1000)
    await seasonInput.press('Enter')
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {})
    await page.waitForTimeout(1500)
  }

  // "Ara" butonuna bas → fikstür gridini doldur
  log('Fikstür listeleniyor (Ara)...')
  await page.locator('#ctl00_MPane_m_28_398_ctnr_m_28_398_bntAra').click()
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {})
  await page.waitForTimeout(2500)
  await page.waitForSelector('[id*="grdFikstur"] tr', { timeout: 30000 }).catch(() => {})

  const rawRows = await page.$$eval(
    '[id*="grdFikstur"] tr.GridRow_TFF_Contents, [id*="grdFikstur"] tr.GridAltRow_TFF_Contents',
    (trs) =>
      trs.map((tr) =>
        Array.from(tr.querySelectorAll('td')).map((td) => td.textContent.replace(/\s+/g, ' ').trim())
      )
  )

  const AYLAR = { Ocak: '01', Şubat: '02', Mart: '03', Nisan: '04', Mayıs: '05', Haziran: '06',
    Temmuz: '07', Ağustos: '08', Eylül: '09', Ekim: '10', Kasım: '11', Aralık: '12' }

  const fixtures = rawRows
    .map((cells) => {
      const c = cells.filter(Boolean)
      // Skor hücresini bul (örn "2-0")
      const scoreIdx = c.findIndex((x) => /^\d+\s*-\s*\d+$/.test(x))
      if (scoreIdx < 1) return null
      const home = c[scoreIdx - 1]
      const away = c[scoreIdx + 1]
      const score = c[scoreIdx].replace(/\s/g, '')
      const [hs, as] = score.split('-').map(Number)
      const dateRaw = c[scoreIdx + 2] || ''
      const comp = c[scoreIdx + 3] || ''
      // "24 Ağustos 2025" → ISO
      let dateISO = null
      const dm = dateRaw.match(/(\d{1,2})\s+([A-Za-zÇĞİÖŞÜçğıöşü]+)\s+(\d{4})/)
      if (dm && AYLAR[dm[2]]) dateISO = `${dm[3]}-${AYLAR[dm[2]]}-${dm[1].padStart(2, '0')}`

      const homeIsSfk = home.toUpperCase().includes(TEAM_KEY)
      return {
        week: /^\d+$/.test(c[0]) ? Number(c[0]) : null,
        homeTeam: home,
        awayTeam: away,
        homeScore: hs,
        awayScore: as,
        date: dateISO,
        dateText: dateRaw,
        competition: comp,
        isHome: homeIsSfk,
        opponent: homeIsSfk ? away : home,
        result: hs === as ? 'B' : (homeIsSfk ? (hs > as ? 'G' : 'M') : (as > hs ? 'G' : 'M')),
      }
    })
    .filter(Boolean)

  log(`✓ ${fixtures.length} maç çekildi (sezon: ${SEASON})`)
  return fixtures
}

/* ─── 3) KADRO (oyuncular) ─────────────────────────────────── */
// BÜYÜK HARF ismi → "Başlık Düzeni"
function titleCaseTr(s) {
  return s.toLocaleLowerCase('tr-TR').split(' ')
    .map((w) => (w ? w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1) : w)).join(' ').trim()
}

async function cekKadro(page) {
  log('Kadro çekiliyor → en güncel dolu sezon aranıyor...')
  // En yeniden eskiye dene; ilk dolu sezonu kullan
  const seasonlar = ['2026-2027', '2025-2026', '2024-2025']
  for (const season of seasonlar) {
    try {
      await page.goto(FIXTURE_URL, { waitUntil: 'networkidle', timeout: 60000 })
      await page.waitForTimeout(1200)
      const si = page.locator('#ctl00_MPane_m_28_196_ctnr_m_28_196_SezonSelector1_combo_Input')
      const cur = await si.inputValue().catch(() => '')
      if (cur.trim() !== season) {
        await si.click(); await si.fill(''); await si.type(season, { delay: 40 })
        await page.waitForTimeout(800); await si.press('Enter')
        await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {})
        await page.waitForTimeout(1200)
      }
      await page.locator('#ctl00_MPane_m_28_196_ctnr_m_28_196_btnAra').click().catch(() => {})
      await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {})
      await page.waitForTimeout(2000)

      const players = await page.$$eval(
        '[id*="grdKadro"] tr.GridRow_TFF_Contents a[id*="lnkOyuncu"], [id*="grdKadro"] tr.GridAltRow_TFF_Contents a[id*="lnkOyuncu"]',
        (as) => as.map((a) => ({
          name: a.textContent.replace(/\s+/g, ' ').trim(),
          href: a.getAttribute('href') || '',
        }))
      )
      if (players.length > 0) {
        const list = players.map((p) => {
          const idm = p.href.match(/kisiId=(\d+)/i)
          return { name: titleCaseTr(p.name), tffId: idm ? idm[1] : null }
        })
        log(`✓ Kadro: ${list.length} oyuncu (sezon: ${season})`)
        return { season, players: list }
      }
    } catch (e) {
      log(`Kadro sezon ${season} denenirken hata: ${e.message}`)
    }
  }
  log('⚠ Kadro: hiçbir sezonda oyuncu bulunamadı (Kadro Güncelleniyor durumu)')
  return { season: null, players: [] }
}

/* ─── ANA AKIŞ ─────────────────────────────────────────────── */
async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
  })
  const page = await context.newPage()

  try {
    const standings = await cekPuanDurumu(page)
    const logos = await cekLogolar(page, standings)
    const fixtures = await cekFikstur(page)
    const kadro = await cekKadro(page)

    // Logoları standings satırlarına ekle
    standings.forEach((s) => { s.logo = logos[s.team] ?? null })

    const data = {
      updatedAt: new Date().toISOString(),
      source: 'tff.org',
      league: 'TFF 2. Lig — Beyaz Grup',
      season: SEASON,
      standings,
      logos,
      sanliurfasporFixtures: fixtures,
      squad: kadro,
    }

    mkdirSync(dirname(OUT_FILE), { recursive: true })
    writeFileSync(OUT_FILE, JSON.stringify(data, null, 2), 'utf-8')

    // Supabase'e canlı yaz (env varsa)
    await supabaseYaz(data)

    const sfk = standings.find((s) => s.isSanliurfaspor)
    console.log('\n══════════════ PUAN DURUMU (Beyaz Grup) ══════════════')
    console.table(
      standings.map((s) => ({
        '#': s.rank, Takım: s.team.slice(0, 26),
        O: s.played, G: s.won, B: s.drawn, M: s.lost, Av: s.goalDiff, P: s.points,
      }))
    )
    if (sfk) console.log(`→ ŞANLIURFASPOR: ${sfk.rank}. sıra, ${sfk.points} puan`)

    console.log(`\n═════════ ŞANLIURFASPOR FİKSTÜRÜ (${fixtures.length} maç) ═════════`)
    fixtures.forEach((f) => {
      const skor = `${f.homeScore}-${f.awayScore}`
      const rb = { G: '✅', M: '❌', B: '➖' }[f.result] || ''
      console.log(`${rb} ${(f.dateText || '').padEnd(18)} ${f.homeTeam} ${skor} ${f.awayTeam}  [${f.competition}]`)
    })

    console.log(`\n✅ Kaydedildi → ${OUT_FILE}`)
  } catch (err) {
    console.error('\n❌ HATA:', err.message)
    process.exitCode = 1
  } finally {
    await browser.close()
  }
}

main()
