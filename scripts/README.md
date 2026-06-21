# TFF Veri Çekme Otomasyonu

Şanlıurfaspor'un **puan durumu** ve **fikstürünü** TFF resmi sitesinden (tff.org) çeker.

## İlk kurulum (bir kez)

```bash
npm install -D playwright
npx playwright install chromium
```

## Kullanım (istediğin zaman)

```bash
npm run tff
```

Script çalışınca:
1. TFF 2. Lig Beyaz Grup **puan durumunu** çeker
2. Şanlıurfaspor'un **tüm maçlarını** (lig + kupa) çeker
3. Sonucu `src/data/tff-live.json` dosyasına yazar
4. Özeti konsola basar

## Çıktı dosyası

`src/data/tff-live.json`:

```json
{
  "updatedAt": "2026-...",
  "league": "TFF 2. Lig — Beyaz Grup",
  "season": "2025-2026",
  "standings": [ { "rank": 5, "team": "...ŞANLIURFASPOR", "points": 65, ... } ],
  "sanliurfasporFixtures": [
    { "week": 1, "homeTeam": "...", "awayTeam": "...", "homeScore": 2, "awayScore": 0,
      "date": "2025-08-24", "competition": "Nesine 2. Lig Beyaz",
      "isHome": true, "opponent": "BEYKOZ...", "result": "G" }
  ]
}
```

## Ayarlar

`scripts/tff-cek.mjs` dosyasının başındaki değerler:

| Değişken | Açıklama | Varsayılan |
|----------|----------|------------|
| `SEASON`  | Fikstür sezonu | `2025-2026` |
| `GRUP_ID` | 2. Lig Beyaz Grup | `2782` |
| `KULUP_ID`| Şanlıurfaspor kulüp ID | `31` |

> Yeni sezon (2026-2027) başlayınca `SEASON` değerini güncelle.

## Teknik notlar

- TFF sitesi **bozuk SSL sertifikası** kullandığı için `ignoreHTTPSErrors: true` gerekir.
- Site **windows-1254** encoding + **ASP.NET/Telerik postback** kullanır; bu yüzden basit HTTP isteği yetmez, gerçek tarayıcı (Playwright) gerekir.
- Fikstür için: sezon seçilir → **"Ara"** butonuna basılır → grid okunur.
- ⚠️ TFF verisi TFF'nin mülkiyetindedir. Ticari kullanım/yeniden yayım için TFF kullanım şartlarına uyun.
