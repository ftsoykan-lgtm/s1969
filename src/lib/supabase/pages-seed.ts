'use server'

import { createClient } from './server'

export interface PageSeedResult {
  ok: boolean
  created: number
  skipped: number
  createdSlugs: string[]
  error?: string
}

interface SeedPage {
  slug: string
  title: string
  subtitle: string
  nav_group: string
  sort: number
  body: string
}

/* Menüdeki bilgi sayfaları için başlangıç içerikleri (admin panelden düzenlenir). */
const SEED_PAGES: SeedPage[] = [
  {
    slug: 'baskanlarimiz', title: 'Başkanlarımız', subtitle: 'Kulübümüze gönül veren başkanlar',
    nav_group: 'kulup', sort: 30,
    body: `Şanlıurfaspor'un 1969'daki kuruluşundan bugüne, kulübe gönül veren birçok başkan görev yaptı. Başkanlarımız, sportif hedeflerin yanı sıra kulübün kurumsallaşması ve şehirle bağının güçlenmesi için emek verdiler.

Yeşil-sarı formanın temsil ettiği değerleri korumak ve Şanlıurfaspor'u daha ileriye taşımak, her dönemin ortak amacı oldu.

Geçmiş dönem başkanlarımıza kulübümüze yaptıkları katkılar için şükranlarımızı sunarız.`,
  },
  {
    slug: 'kurumsal-kimlik', title: 'Kurumsal Kimlik', subtitle: 'Renklerimiz, armamız ve değerlerimiz',
    nav_group: 'kulup', sort: 40,
    body: `Şanlıurfaspor'un kurumsal kimliği; yeşil ve sarı renkleri, arması ve 1969'dan gelen köklü geçmişiyle şekillenir. Renklerimiz şehrimizin ve kulübümüzün karakterini yansıtır.

Armamız; kulübümüzün tarihini, mücadeleci ruhunu ve Şanlıurfa'ya olan bağlılığını simgeler. Logomuz ve renklerimiz tüm resmi mecralarda tutarlı biçimde kullanılır.

Kurumsal kimliğimiz; taraftarımız, sponsorlarımız ve paydaşlarımızla kurduğumuz güçlü bağın görsel ifadesidir.`,
  },
  {
    slug: 'tuzuk', title: 'Tüzük', subtitle: 'Kulüp tüzüğümüz',
    nav_group: 'kulup', sort: 50,
    body: `Şanlıurfaspor Kulübü tüzüğü; kulübün amaçlarını, organlarını, üyelik koşullarını ve işleyiş esaslarını belirler.

Tüzüğümüz, kulübün şeffaf, hesap verebilir ve sürdürülebilir bir yapıda yönetilmesini güvence altına alır.

Güncel tüzük metni bu sayfada yayımlanır.`,
  },
  {
    slug: 'gap-arena', title: '11 Nisan Stadyumu', subtitle: 'Evimiz, stadyumumuz',
    nav_group: 'tesisler', sort: 10,
    body: `Takımımızın iç saha müsabakalarını oynadığı stadyumumuz, taraftarımızla buluştuğumuz evimizdir. Modern altyapısı ve coşkulu tribünleriyle Şanlıurfaspor'a yakışır bir atmosfer sunar.

Stadyumumuz maç günlerinde binlerce taraftarı ağırlar; güvenli ve keyifli bir deneyim için gerekli imkânlara sahiptir.

Bilet ve maç günü bilgileri için Bilet sayfamızı ziyaret edebilirsiniz.`,
  },
  {
    slug: 'antrenman-tesisi', title: 'Antrenman Tesisi', subtitle: 'A takım hazırlık merkezi',
    nav_group: 'tesisler', sort: 20,
    body: `A takımımız hazırlıklarını modern antrenman tesisimizde sürdürür. Tesis, oyuncularımızın en iyi koşullarda çalışmasını sağlayacak sahalar ve donanımlarla hizmet verir.

Teknik ekibimizin ve sporcularımızın ihtiyaçlarına göre tasarlanan tesis, performans ve toparlanma süreçlerini destekler.`,
  },
  {
    slug: 'altyapi-akademisi', title: 'Altyapı Akademisi', subtitle: 'Geleceğin yıldızları',
    nav_group: 'tesisler', sort: 30,
    body: `Altyapı akademimiz, Şanlıurfa'nın yetenekli gençlerini geleceğin profesyonel futbolcuları olarak yetiştirmeyi hedefler. Sportif gelişimin yanında eğitim ve karakter gelişimine de önem veririz.

Akademimizde farklı yaş gruplarındaki sporcularımız, deneyimli eğitmenler eşliğinde planlı bir gelişim programıyla çalışır.

Hedefimiz; altyapımızdan A takımımıza sürekli oyuncu kazandırmak ve kulübümüzün geleceğini güvence altına almaktır.`,
  },
  {
    slug: 'muze', title: 'Müze', subtitle: 'Kulüp tarihimizin hatıraları',
    nav_group: 'tesisler', sort: 40,
    body: `Kulüp müzemiz; Şanlıurfaspor'un köklü tarihini, unutulmaz maçlarını ve kupalarını gelecek nesillere taşır. Formalar, fotoğraflar ve hatıralar burada sergilenir.

Müzemiz, taraftarımızın kulüp tarihiyle bağ kurabileceği, geçmişten bugüne bir yolculuk yapabileceği bir mekândır.`,
  },
  {
    slug: 'basin-medya', title: 'Basın & Medya', subtitle: 'Basın mensupları için',
    nav_group: 'kurumsal', sort: 10,
    body: `Basın & Medya birimimiz; kulübümüzle ilgili güncel duyuruları, basın bültenlerini ve medya akreditasyon süreçlerini yürütür.

Maç günü akreditasyon, röportaj talepleri ve görsel-işitsel materyal istekleri için basın birimimizle iletişime geçebilirsiniz.

İletişim bilgilerimize İletişim sayfamızdan ulaşabilirsiniz.`,
  },
  {
    slug: 'sponsorluk', title: 'Sponsorluk', subtitle: 'İş birliği fırsatları',
    nav_group: 'kurumsal', sort: 20,
    body: `Şanlıurfaspor olarak markaları geniş bir taraftar kitlesiyle buluşturan güçlü sponsorluk fırsatları sunuyoruz. İş birliklerimiz karşılıklı değer yaratma ilkesine dayanır.

Forma sponsorluğu, stadyum ve dijital mecra reklamları, etkinlik iş birlikleri gibi farklı paketlerle markanızı kulübümüzün enerjisiyle birleştirebilirsiniz.

Detaylı sponsorluk teklifleri ve görüşme için kulübümüzle iletişime geçebilirsiniz.`,
  },
  {
    slug: 'insan-kaynaklari', title: 'İnsan Kaynakları', subtitle: 'Kariyer ve başvurular',
    nav_group: 'kurumsal', sort: 30,
    body: `Şanlıurfaspor ailesi tutkulu ve yetenekli insanlarla büyür. İnsan kaynakları yaklaşımımız; adalet, gelişim ve takım ruhu üzerine kuruludur.

Açık pozisyonlar ve staj imkânları için başvurularınızı kulübümüze iletebilirsiniz. Sportif ve idari birimlerimizde kariyer fırsatları sunuyoruz.`,
  },
]

/**
 * Menüdeki bilgi sayfalarını başlangıç içerikleriyle oluşturur.
 * Idempotent: zaten var olan slug'lara DOKUNMAZ (admin düzenlemeleri korunur).
 * Yalnız giriş yapmış admin çalıştırabilir.
 */
export async function seedSitePages(): Promise<PageSeedResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, created: 0, skipped: 0, createdSlugs: [], error: 'Yetkisiz' }

  try {
    const { data: existing } = await supabase.from('site_pages').select('slug')
    const have = new Set((existing ?? []).map((r: { slug: string }) => r.slug))
    const missing = SEED_PAGES.filter((p) => !have.has(p.slug))

    if (missing.length === 0) {
      return { ok: true, created: 0, skipped: SEED_PAGES.length, createdSlugs: [] }
    }

    const now = new Date().toISOString()
    const rows = missing.map((p) => ({
      slug: p.slug, title: p.title, subtitle: p.subtitle, body: p.body,
      nav_group: p.nav_group, sort: p.sort, published: true, updated_at: now,
    }))
    const { error } = await supabase.from('site_pages').insert(rows)
    if (error) return { ok: false, created: 0, skipped: 0, createdSlugs: [], error: error.message }

    return { ok: true, created: missing.length, skipped: SEED_PAGES.length - missing.length, createdSlugs: missing.map((p) => p.slug) }
  } catch (e) {
    return { ok: false, created: 0, skipped: 0, createdSlugs: [], error: (e as Error).message }
  }
}
