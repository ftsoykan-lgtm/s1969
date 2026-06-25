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

function slugifyName(s) {
  return (s || '').toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

/* Oyuncu profillerini OTOMATİK yaz (sezon bazlı).
   Sadece TFF alanlarını upsert eder → admin'in girdiği foto/biyografi KORUNUR.
   Bu sezonda olup kadrodan çıkanları pasifleştirir; eski sezonlara dokunmaz. */
async function oyuncuProfilleriYaz(squad) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return
  const season = squad?.season
  const players = (squad?.players || []).filter((p) => p.tffId)
  if (!season || !players.length) { console.log('[TFF] (oyuncu profili: sezon/kadro yok, atlandı)'); return }
  const now = new Date().toISOString()
  const headers = { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`, 'Content-Type': 'application/json' }
  const rows = players.map((p) => ({
    season, tff_id: String(p.tffId), slug: slugifyName(p.name), name: p.name,
    position: p.position ?? null, number: p.number ?? null,
    birth_date: p.birthDate ?? null, birth_place: p.birthPlace ?? null,
    nationality: p.nationality ?? null, flag_code: p.flagCode ?? null,
    license_no: p.licenseNo ?? null, club: p.club ?? null, photo_tff: p.photo ?? null,
    active: true, updated_at: now,
  }))
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/player_profiles?on_conflict=season,tff_id`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify(rows),
    })
    if (!res.ok) {
      console.warn(`[TFF] ⚠ player_profiles yazılamadı (HTTP ${res.status}) — 009 migration çalıştırıldı mı?`, await res.text())
      return
    }
    console.log(`[TFF] 🟢 Oyuncu profilleri otomatik güncellendi (${rows.length} oyuncu, sezon ${season}) — admin alanları korundu`)
    // Ayrılanları pasifleştir — GÜVENLİ id-bazlı (aktifleri yanlışlıkla kapatmaz)
    try {
      const cur = new Set(rows.map((r) => r.tff_id))
      const exRes = await fetch(`${SUPABASE_URL}/rest/v1/player_profiles?season=eq.${encodeURIComponent(season)}&select=id,tff_id,manual,active`, { headers })
      if (exRes.ok) {
        const existing = await exRes.json()
        const departed = (existing || []).filter((r) => r.active && !r.manual && r.tff_id && !cur.has(String(r.tff_id))).map((r) => r.id)
        if (departed.length) {
          await fetch(`${SUPABASE_URL}/rest/v1/player_profiles?id=in.(${departed.join(',')})`, {
            method: 'PATCH', headers: { ...headers, Prefer: 'return=minimal' },
            body: JSON.stringify({ active: false, updated_at: now }),
          })
        }
      }
    } catch {}
  } catch (e) {
    console.warn('[TFF] ⚠ player_profiles hata:', e.message)
  }
}

async function supabaseYaz(data) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.log('[TFF] (Supabase env yok — sadece JSON yazıldı)')
    return
  }
  const headers = {
    apikey: SUPABASE_SERVICE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'resolution=merge-duplicates,return=minimal',
  }
  const now = new Date().toISOString()
  try {
    // 1) Güncel sezon → tff_data id=1 (site bunu okur)
    const res = await fetch(`${SUPABASE_URL}/rest/v1/tff_data?on_conflict=id`, {
      method: 'POST', headers,
      body: JSON.stringify({ id: 1, data, updated_at: now }),
    })
    if (!res.ok) {
      console.error(`[TFF] ❌ tff_data yazma hatası (HTTP ${res.status}):`, await res.text())
      process.exitCode = 1
    } else {
      console.log('[TFF] 🟢 tff_data güncellendi (güncel sezon, canlı)')
    }

    // 2) Sezon arşivi → tff_seasons (her sezon ayrı satır; eski sezonlar korunur)
    const season = data.season
    if (season) {
      const arch = await fetch(`${SUPABASE_URL}/rest/v1/tff_seasons?on_conflict=season`, {
        method: 'POST', headers,
        body: JSON.stringify({ season, data, updated_at: now }),
      })
      if (!arch.ok) {
        // Tablo henüz oluşmadıysa uyar ama akışı bozma
        console.warn(`[TFF] ⚠ tff_seasons arşiv yazılamadı (HTTP ${arch.status}) — 008 migration çalıştırıldı mı?`)
      } else {
        console.log(`[TFF] 🟢 tff_seasons arşivlendi (${season})`)
      }
    }
  } catch (e) {
    console.error('[TFF] ❌ Supabase bağlantı hatası:', e.message)
    process.exitCode = 1
  }
}

/* ─── AYARLAR ──────────────────────────────────────────────── */
// Aktif sezonu tarihten otomatik hesaplar (Temmuz'da yeni sezona geçer).
// Elle sabitlemek için: TFF_SEASON=2025-2026 ortam değişkeni.
function currentSeason() {
  if (process.env.TFF_SEASON) return process.env.TFF_SEASON
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth() + 1
  return m >= 7 ? `${y}-${y + 1}` : `${y - 1}-${y}`
}
function prevSeason(s) {
  const [a, b] = s.split('-').map(Number)
  return `${a - 1}-${b - 1}`
}
const SEASON = currentSeason()    // Fikstür için aktif sezon (otomatik)
const GRUP_ID = process.env.TFF_GRUP_ID || 2782  // YEDEK grup (otomatik bulunamazsa)
const KULUP_ID = 31               // Şanlıurfaspor kulüp ID (sezonlar arası sabit)
const TEAM_KEY = 'URFASPOR'       // Takımı tanımak için (büyük harf)

const GROUPS_URL = 'https://www.tff.org/default.aspx?pageID=976'  // tüm gruplar (güncel sezon)
const standingsUrl = (gid) => `https://www.tff.org/default.aspx?pageID=976&grupID=${gid}`
const FIXTURE_URL = `https://www.tff.org/Default.aspx?pageID=28&kulupID=${KULUP_ID}`

const log = (...a) => console.log('[TFF]', ...a)

/* Şanlıurfaspor'un güncel grubunu (grupID) otomatik bul.
   Sezon/grup/lig değişse bile çalışır → puan durumu hep doğru gruptan. */
async function grupIdBul(page) {
  try {
    await page.goto(GROUPS_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(800)
    const grupIds = await page.$$eval('a[href*="grupID="]', (as) =>
      Array.from(new Set(as.map((a) => {
        const m = (a.getAttribute('href') || '').match(/grupID=(\d+)/)
        return m ? m[1] : null
      }).filter(Boolean))))
    for (const gid of grupIds.slice(0, 20)) {
      try {
        await page.goto(standingsUrl(gid), { waitUntil: 'domcontentloaded', timeout: 40000 })
        await page.waitForSelector('.standings table tr', { timeout: 15000 })
        const has = await page.$$eval('.standings table td',
          (tds) => tds.some((td) => (td.textContent || '').toUpperCase().includes('URFASPOR')))
        if (has) { log(`✓ Grup otomatik bulundu: grupID=${gid}`); return gid }
      } catch {}
    }
  } catch (e) { log('Grup tespiti hatası:', e.message) }
  log(`⚠ Grup otomatik bulunamadı → yedek grupID=${GRUP_ID}`)
  return String(GRUP_ID)
}

/* ─── 1) PUAN DURUMU ───────────────────────────────────────── */
async function cekPuanDurumu(page) {
  const gid = await grupIdBul(page)
  log('Puan durumu çekiliyor →', standingsUrl(gid))
  await page.goto(standingsUrl(gid), { waitUntil: 'domcontentloaded', timeout: 60000 })
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
async function cekFikstur(page, season = SEASON) {
  log('Fikstür çekiliyor →', FIXTURE_URL, `(sezon: ${season})`)
  await page.goto(FIXTURE_URL, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(1500)

  // Sezonu seç (Telerik RadComboBox: yaz + Enter)
  const seasonInput = page.locator('[id*="m_28_398"][id$="SezonSelector1_combo_Input"]')
  const current = await seasonInput.inputValue().catch(() => '')
  if (current.trim() !== season) {
    log(`Sezon seçiliyor: "${current}" → "${season}"`)
    await seasonInput.click()
    await seasonInput.fill('')
    await seasonInput.type(season, { delay: 50 })
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

  // Sayfalı tablo: "Sonraki »" ile tüm sayfaları topla
  const rawRows = []
  const seen = new Set()
  for (let sayfa = 1; sayfa <= 12; sayfa++) {
    await page.waitForSelector('[id*="grdFikstur"] tr', { timeout: 30000 }).catch(() => {})
    const rows = await page.$$eval(
      '[id*="grdFikstur"] tr.GridRow_TFF_Contents, [id*="grdFikstur"] tr.GridAltRow_TFF_Contents',
      (trs) => trs.map((tr) => {
        const cells = Array.from(tr.querySelectorAll('td')).map((td) => td.textContent.replace(/\s+/g, ' ').trim())
        const link = tr.querySelector('a[href*="macID"], a[href*="macId"]')
        const m = link?.getAttribute('href')?.match(/mac[Ii][Dd]=(\d+)/)
        return { cells, macId: m ? m[1] : null }
      })
    )
    let yeni = 0
    for (const r of rows) {
      const key = r.cells.join('|')
      if (!seen.has(key)) { seen.add(key); rawRows.push(r); yeni++ }
    }
    // Yeni satır gelmediyse veya "Sonraki" yoksa dur
    const nextLink = page.locator('[id*="grdFikstur"] a').filter({ hasText: 'Sonraki' }).first()
    const hasNext = (await nextLink.count()) > 0
    if (sayfa > 1 && yeni === 0) break
    if (!hasNext) break
    await nextLink.click().catch(() => {})
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {})
    await page.waitForTimeout(1800)
  }

  const AYLAR = { Ocak: '01', Şubat: '02', Mart: '03', Nisan: '04', Mayıs: '05', Haziran: '06',
    Temmuz: '07', Ağustos: '08', Eylül: '09', Ekim: '10', Kasım: '11', Aralık: '12' }

  const fixtures = rawRows
    .map(({ cells, macId }) => {
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
        macId: macId ?? null,
        time: '',
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

  log(`✓ ${fixtures.length} maç çekildi (sezon: ${season})`)

  // Her maçın detayını çek (saat, stadyum, hakemler, kadrolar) — pageID=29&macID
  log('Maç detayları çekiliyor (saat, stadyum, hakem, kadro)...')
  let saatli = 0, statli = 0, detayli = 0, kadrolu = 0
  for (const f of fixtures) {
    if (!f.macId) continue
    try {
      await page.goto(`https://www.tff.org/Default.aspx?pageID=29&macID=${f.macId}`,
        { waitUntil: 'domcontentloaded', timeout: 25000 })
      await page.waitForTimeout(400)
      const d = await page.evaluate(({ homeName, awayName }) => {
        const clean = (s) => (s || '').replace(/\s+/g, ' ').trim()
        const body = document.body.innerText

        // Saat + stadyum — TFF maç bilgi DOM elementlerinden (güvenilir)
        const txt0 = (sel) => { const el = document.querySelector(sel); return el ? clean(el.textContent) : '' }
        let time = null, venue = null
        const tarihSaat = txt0('[id$="dtMacBilgisi_lblTarih"]')   // "12.04.2026 - 15:00"
        const tm = (tarihSaat || body).match(/(\d{1,2}:\d{2})/)
        if (tm) time = tm[1]
        const stadRaw = txt0('[id$="dtMacBilgisi_lnkStad"]')       // "11 NİSAN STADYUMU - ŞANLIURFA - ..."
        if (stadRaw) venue = stadRaw.split(/\s+-\s+/)[0].trim()    // sadece stadyum adı
        if (!venue) {
          const vm = body.match(/([^\n]{4,90})\n\s*\d{2}\.\d{2}\.\d{4}\s*[-–]\s*\d{2}:\d{2}/)
          if (vm) { const stat = vm[1].split(/\s+-\s+/)[0].trim(); if (stat && stat.length >= 4 && !/\d{2}:\d{2}/.test(stat)) venue = stat }
        }

        // Hakemler
        const referees = []
        body.split('\n').forEach((l) => {
          const m = clean(l).match(/^(.+?)\((Hakem|\d+\. Yardımcı Hakem|Dördüncü Hakem)\)$/)
          if (m) referees.push({ name: m[1].trim(), role: m[2] })
        })

        /* ── Kadrolar / olaylar — TFF DOM yapısından ────────────────
           grdTakim1 = ev sahibi, grdTakim2 = deplasman.
           rptKadrolar = İlk 11, rptYedekler = yedekler,
           rptGoller = goller, rptKartlar = kartlar, rptTeknikKadro = TD.
           Her oyuncu: ..._lnkOyuncu (isim) + ..._formaNo ("54."). */
        const txt = (el) => clean(el ? el.textContent : '')
        const readSquad = (rep) =>
          Array.from(document.querySelectorAll(`a[id*="${rep}"][id$="_lnkOyuncu"]`)).map((a) => {
            const noEl = document.getElementById(a.id.replace('_lnkOyuncu', '_formaNo'))
            const num = noEl ? parseInt(txt(noEl).replace(/\D/g, ''), 10) : NaN
            return { number: Number.isFinite(num) ? num : null, name: clean(a.textContent) }
          }).filter((p) => p.name)
        const readCoach = (gr) => {
          const a = document.querySelector(`a[id*="${gr}_rptTeknikKadro"][id$="_lnkTeknikSorumlu"]`)
          return a ? clean(a.textContent) : null
        }
        const readGoals = (gr, team) =>
          Array.from(document.querySelectorAll(`a[id*="${gr}_rptGoller"][id$="_lblGol"]`)).map((a) => {
            const t = clean(a.textContent)                 // "İSİM,14.dk (P)"
            const name = t.split(',')[0].trim()
            const mm = t.match(/(\d{1,3})\.?\s*dk/i)
            const note = (t.match(/\(([^)]+)\)/) || [])[1]
            const detail = note === 'P' ? 'Penaltı' : note === 'K' ? 'Kendi kalesine' : null
            return { minute: mm ? parseInt(mm[1], 10) : null, type: 'goal', team, player: name, detail }
          }).filter((e) => e.player)
        const readCards = (gr, team) =>
          Array.from(document.querySelectorAll(`a[id*="${gr}_rptKartlar"][id$="_lblKart"]`)).map((a) => {
            const img = document.getElementById(a.id.replace('_lblKart', '_k'))
            const dEl = document.getElementById(a.id.replace('_lblKart', '_d'))
            const alt = img ? (img.getAttribute('alt') || '') : ''
            const type = /kırmızı/i.test(alt) ? 'red' : 'yellow'
            const mm = txt(dEl).match(/(\d{1,3})/)
            return { minute: mm ? parseInt(mm[1], 10) : null, type, team, player: clean(a.textContent), detail: null }
          }).filter((e) => e.player)

        const lineBlocks = {
          home: { starters: readSquad('grdTakim1_rptKadrolar'), subs: readSquad('grdTakim1_rptYedekler'), coach: readCoach('grdTakim1') },
          away: { starters: readSquad('grdTakim2_rptKadrolar'), subs: readSquad('grdTakim2_rptYedekler'), coach: readCoach('grdTakim2') },
        }
        const events = [
          ...readGoals('grdTakim1', 'home'), ...readGoals('grdTakim2', 'away'),
          ...readCards('grdTakim1', 'home'), ...readCards('grdTakim2', 'away'),
        ]

        return { time, venue, referees, lineups: lineBlocks, events }
      }, { homeName: f.homeTeam, awayName: f.awayTeam })

      if (d.time) { f.time = d.time; saatli++ }
      if (d.venue) { f.venue = titleCaseTr(d.venue); statli++ }
      if (d.referees.length) detayli++

      const tc = (arr) => arr.map((p) => ({ number: p.number, name: titleCaseTr(p.name) }))
      const homeStart = tc(d.lineups.home.starters), awayStart = tc(d.lineups.away.starters)
      const hasLineup = homeStart.length >= 7 || awayStart.length >= 7
      const events = (d.events || []).map((e) => ({
        minute: e.minute, type: e.type, team: e.team, player: titleCaseTr(e.player), detail: e.detail || undefined,
      }))

      f.detail = {
        referees: d.referees.map((r) => ({ name: titleCaseTr(r.name), role: r.role })),
        lineups: hasLineup ? {
          home: { starters: homeStart, subs: tc(d.lineups.home.subs), coach: d.lineups.home.coach ? titleCaseTr(d.lineups.home.coach) : null },
          away: { starters: awayStart, subs: tc(d.lineups.away.subs), coach: d.lineups.away.coach ? titleCaseTr(d.lineups.away.coach) : null },
        } : null,
        events,
      }
      if (hasLineup) kadrolu++
    } catch {}
  }
  log(`✓ Saat: ${saatli}/${fixtures.length} · Stadyum: ${statli}/${fixtures.length} · Hakem: ${detayli}/${fixtures.length} · Kadro: ${kadrolu}/${fixtures.length}`)

  // macId'yi koru (detay sayfası linki için), geçici alan yok
  return fixtures
}

/* ─── 3) KADRO (oyuncular) ─────────────────────────────────── */
// BÜYÜK HARF ismi → "Başlık Düzeni"
function titleCaseTr(s) {
  return s.toLocaleLowerCase('tr-TR').split(' ')
    .map((w) => (w ? w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1) : w)).join(' ').trim()
}

/* Türkçe tarih "1 Ocak 2004" → "01.01.2004" */
const TR_AYLAR = { ocak: 1, şubat: 2, mart: 3, nisan: 4, mayıs: 5, haziran: 6, temmuz: 7, ağustos: 8, eylül: 9, ekim: 10, kasım: 11, aralık: 12 }
function trTarihToISO(s) {
  if (!s) return null
  const m = s.trim().match(/^(\d{1,2})\s+([A-Za-zçğıöşüÇĞİÖŞÜ]+)\s+(\d{4})$/)
  if (m) {
    const ay = TR_AYLAR[m[2].toLocaleLowerCase('tr-TR')]
    if (ay) return `${String(+m[1]).padStart(2, '0')}.${String(ay).padStart(2, '0')}.${m[3]}`
  }
  const dm = s.trim().match(/(\d{1,2})[.\/](\d{1,2})[.\/](\d{4})/)
  if (dm) return `${dm[1].padStart(2, '0')}.${dm[2].padStart(2, '0')}.${dm[3]}`
  return s.trim() || null
}

/* Uyruk metni → { label, code } */
const UYRUK_MAP = {
  tc: ['Türkiye', 'tr'], 'türkiye': ['Türkiye', 'tr'],
  brezilya: ['Brezilya', 'br'], portekiz: ['Portekiz', 'pt'], senegal: ['Senegal', 'sn'],
  'fildişi sahili': ['Fildişi Sahili', 'ci'], fransa: ['Fransa', 'fr'], nijerya: ['Nijerya', 'ng'],
  kamerun: ['Kamerun', 'cm'], gambiya: ['Gambiya', 'gm'], sırbistan: ['Sırbistan', 'rs'],
  romanya: ['Romanya', 'ro'], almanya: ['Almanya', 'de'], hollanda: ['Hollanda', 'nl'],
  gana: ['Gana', 'gh'], mali: ['Mali', 'ml'],
}
function uyrukCoz(s) {
  if (!s) return { label: null, code: null }
  const k = s.trim().toLocaleLowerCase('tr-TR')
  const hit = UYRUK_MAP[k]
  if (hit) return { label: hit[0], code: hit[1] }
  return { label: titleCaseTr(s), code: null }
}

/* TFF oyuncu profil sayfasından kişisel + lisans bilgilerini çek */
async function cekOyuncuDetay(page, kisiId) {
  await page.goto(`https://www.tff.org/Default.aspx?pageId=30&kisiId=${kisiId}`,
    { waitUntil: 'domcontentloaded', timeout: 20000 })
  await page.waitForTimeout(250)
  return await page.evaluate(() => {
    const t = (sel) => { const e = document.querySelector(sel); return e ? (e.textContent || '').replace(/\s+/g, ' ').trim() : '' }
    let birthPlace = t('[id$="oyuncuBilgileri_Label1"]')
    let birthDate = t('[id$="oyuncuBilgileri_Label2"]')
    let nationality = t('[id$="oyuncuBilgileri_Label3"]')
    const licenseNo = t('[id$="oyuncuLisansBilgileri_Label4"]')
    const club = t('[id$="oyuncuLisansBilgileri_Label5"]')
    // Yedek: innerText'te "etiket\ndeğer" sırası
    if (!birthDate || !nationality || !birthPlace) {
      const lines = document.body.innerText.split('\n').map((s) => s.trim())
      const after = (label) => { const i = lines.findIndex((l) => l === label); return i >= 0 && lines[i + 1] ? lines[i + 1] : '' }
      birthPlace = birthPlace || after('Doğum Yeri')
      birthDate = birthDate || after('Doğum Tarihi')
      nationality = nationality || after('Uyruk')
    }
    return { birthPlace, birthDate, nationality, licenseNo, club }
  })
}

async function cekKadro(page) {
  log('Kadro çekiliyor → en güncel dolu sezon aranıyor...')
  // En yeniden eskiye dinamik liste (gelecekte de çalışır)
  const nextSeason = (s) => { const [a, b] = s.split('-').map(Number); return `${a + 1}-${b + 1}` }
  const seasonlar = [nextSeason(SEASON), SEASON, prevSeason(SEASON), prevSeason(prevSeason(SEASON))]
    .filter((v, i, a) => a.indexOf(v) === i)
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
      // Durum filtresini "Tümü" yap (Faal sezon bitince boş döner)
      const fInput = page.locator('#ctl00_MPane_m_28_196_ctnr_m_28_196_f_Input')
      const fCur = await fInput.inputValue().catch(() => '')
      if (fCur.trim() !== 'Tümü') {
        await fInput.click(); await fInput.fill(''); await fInput.type('Tümü', { delay: 40 })
        await page.waitForTimeout(700); await fInput.press('Enter')
        await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {})
        await page.waitForTimeout(1000)
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
        log(`✓ Kadro: ${list.length} oyuncu (sezon: ${season}) — profil detayları çekiliyor...`)

        // Her oyuncunun TFF profilini ziyaret et (doğum yeri/tarihi, uyruk, lisans, kulüp)
        let detayli = 0
        for (const p of list) {
          if (!p.tffId) continue
          try {
            const det = await cekOyuncuDetay(page, p.tffId)
            p.birthPlace = det.birthPlace ? titleCaseTr(det.birthPlace) : null
            p.birthDate = trTarihToISO(det.birthDate)
            const u = uyrukCoz(det.nationality)
            p.nationality = u.label
            p.flagCode = u.code
            p.licenseNo = det.licenseNo || null
            p.club = det.club ? titleCaseTr(det.club) : null
            if (p.birthDate || p.nationality) detayli++
          } catch {}
        }
        log(`✓ Oyuncu profil detayı: ${detayli}/${list.length}`)
        return { season, players: list }
      }
    } catch (e) {
      log(`Kadro sezon ${season} denenirken hata: ${e.message}`)
    }
  }
  log('⚠ Kadro: hiçbir sezonda oyuncu bulunamadı (Kadro Güncelleniyor durumu)')
  return { season: null, players: [] }
}

/** Arşivdeki sezon tamamlandı mı? (tüm maçlar oynanmış + complete bayrağı) */
async function arsivdekiSezonTamamMi(season) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return false
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/tff_seasons?season=eq.${encodeURIComponent(season)}&select=data`,
      { headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` } },
    )
    if (!res.ok) return false
    const rows = await res.json()
    return rows?.[0]?.data?.complete === true
  } catch { return false }
}

/* ─── ANA AKIŞ ─────────────────────────────────────────────── */
async function main() {
  // Tamamlanmış + arşivlenmiş sezonu yeniden çekme (FORCE_TFF=1 ile zorla)
  if (!process.env.FORCE_TFF && await arsivdekiSezonTamamMi(SEASON)) {
    console.log(`[TFF] ⏭  Sezon ${SEASON} zaten tamamlanmış ve arşivde — yeniden çekilmeyecek. (Zorlamak için FORCE_TFF=1)`)
    return
  }

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

    // Aktif sezon fikstürü; boşsa (sezon başı henüz açılmadıysa) bir önceki sezona düş
    let actualSeason = SEASON
    let fixtures = await cekFikstur(page, SEASON)
    if (!fixtures.length) {
      actualSeason = prevSeason(SEASON)
      log(`Aktif sezon (${SEASON}) boş — bir önceki sezona düşülüyor: ${actualSeason}`)
      fixtures = await cekFikstur(page, actualSeason)
    }

    const kadro = await cekKadro(page)

    // Logoları standings satırlarına ekle
    standings.forEach((s) => { s.logo = logos[s.team] ?? null })

    // Sezon tamam mı? Tüm maçlar oynanmış (skorlu) ise final veri kabul edilir.
    const complete = fixtures.length > 0 && fixtures.every((f) => f.homeScore != null && f.awayScore != null)

    const data = {
      updatedAt: new Date().toISOString(),
      source: 'tff.org',
      league: 'TFF 2. Lig — Beyaz Grup',
      season: actualSeason,
      complete,
      standings,
      logos,
      sanliurfasporFixtures: fixtures,
      squad: kadro,
    }
    if (complete) log(`🏁 Sezon ${actualSeason} tamamlandı olarak işaretlendi (sonraki çalıştırmalarda atlanır)`)

    mkdirSync(dirname(OUT_FILE), { recursive: true })
    writeFileSync(OUT_FILE, JSON.stringify(data, null, 2), 'utf-8')

    // Supabase'e canlı yaz (env varsa)
    await supabaseYaz(data)
    // Oyuncu profillerini otomatik işle (sezon bazlı, admin verisi korunur)
    await oyuncuProfilleriYaz(data.squad)

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
