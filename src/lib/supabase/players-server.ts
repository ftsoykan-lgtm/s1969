import { createClient } from '@/lib/supabase/server'
import { getLiveTff } from '@/lib/supabase/tff-server'

export interface SitePlayer {
  name: string
  slug: string
  tffId: string | null
  photoUrl: string | null
  number: number | null
  position: string | null
  nationality: string | null
  flagCode: string | null
  active: boolean
  sortOrder: number
  manual: boolean
}

function slugifyName(s: string): string {
  return (s || '').toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

type DetailRow = {
  name: string
  tff_id: string | null
  photo_url: string | null
  number: number | null
  position: string | null
  nationality: string | null
  flag_code: string | null
  active: boolean
  sort_order: number | null
  manual: boolean
}

async function getDetailRows(): Promise<DetailRow[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('player_details').select('*')
    if (error || !data) return []
    return data as DetailRow[]
  } catch {
    return []
  }
}

/**
 * TFF kadro isimleri + admin detayları birleştirilir.
 * - TFF'deki her oyuncu listede yer alır (admin detayıyla zenginleşir)
 * - Admin'in elle eklediği (manual) oyuncular da eklenir
 * - Sıralama: numara varsa numaraya, yoksa isme göre
 */
export async function getSitePlayers(): Promise<{ players: SitePlayer[]; season: string | null }> {
  const [{ squad }, detailRows] = await Promise.all([getLiveTff(), getDetailRows()])

  // Detayları HEM tff_id HEM isim ile indeksle (kırılgan eşleşmeye karşı)
  const byTffId = new Map<string, DetailRow>()
  const byName = new Map<string, DetailRow>()
  for (const d of detailRows) {
    if (d.tff_id) byTffId.set(String(d.tff_id), d)
    if (d.name) byName.set(d.name, d)
  }
  const findDetail = (tffId: string | null, name: string): DetailRow | undefined =>
    (tffId ? byTffId.get(String(tffId)) : undefined) ?? byName.get(name)

  const map = new Map<string, SitePlayer>()

  // TFF kadrosu
  for (const p of squad.players) {
    const d = findDetail(p.tffId, p.name)
    map.set(p.name, {
      name: p.name,
      slug: slugifyName(p.name),
      tffId: p.tffId,
      photoUrl: d?.photo_url ?? null,
      number: d?.number ?? null,
      position: d?.position ?? null,
      nationality: d?.nationality ?? null,
      flagCode: d?.flag_code ?? null,
      active: d?.active ?? true,
      sortOrder: d?.sort_order ?? 0,
      manual: false,
    })
  }

  // Elle eklenen (TFF'de olmayan) oyuncular
  for (const d of detailRows) {
    if (d.manual && !map.has(d.name)) {
      map.set(d.name, {
        name: d.name,
        slug: slugifyName(d.name),
        tffId: d.tff_id ?? null,
        photoUrl: d.photo_url ?? null,
        number: d.number ?? null,
        position: d.position ?? null,
        nationality: d.nationality ?? null,
        flagCode: d.flag_code ?? null,
        active: d.active ?? true,
        sortOrder: d.sort_order ?? 0,
        manual: true,
      })
    }
  }

  const players = Array.from(map.values())
    .filter((p) => p.active)
    .sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder
      if (a.number && b.number) return a.number - b.number
      if (a.number) return -1
      if (b.number) return 1
      return a.name.localeCompare(b.name, 'tr')
    })

  return { players, season: squad.season }
}
