/**
 * Sayfa CMS — her slug için şablon + alan şeması + varsayılan içerik.
 * İçerikler buraya yazıldı; admin paneli bunları `data` (jsonb) olarak override eder.
 * DB boşsa varsayılanlar gösterilir → sayfa hiçbir zaman boş kalmaz.
 *
 * İçerik dili: Trabzonspor / Fenerbahçe / Samsunspor kurumsal sayfalarından
 * ilham alınarak premium-kurumsal tonda yazıldı (kopya değil, özgün).
 */
import type { PageSpec } from './fields'

export const PAGE_SPECS: Record<string, PageSpec> = {
  /* ═══════════════ KULÜP ═══════════════ */

  tarihce: {
    template: 'timeline',
    fields: [
      { key: 'intro', label: 'Giriş paragrafı', type: 'textarea' },
      {
        key: 'milestones', label: 'Zaman çizelgesi', type: 'list', addLabel: 'Dönem ekle', itemLabel: 'Dönem',
        item: [
          { key: 'year', label: 'Yıl / Dönem', type: 'text', placeholder: '1969' },
          { key: 'title', label: 'Başlık', type: 'text', placeholder: 'Kuruluş' },
          { key: 'text', label: 'Açıklama', type: 'textarea' },
        ],
      },
    ],
    defaults: {
      intro:
        'Şanlıurfa’nın futbol sevdası, medeniyetlerin beşiği bu kadim şehir kadar köklüdür. Şanlıurfaspor 1969’da bu sevdayı tek bir sarı-yeşil bayrak altında topladı ve yarım asrı aşkın süredir "Ceylanlar" lakabıyla şehrin gururu oldu. Bu, yalnızca bir kulübün değil; bir şehrin hikâyesidir.',
      milestones: [
        { year: '1969', title: 'Kuruluş', text: 'Şanlıurfa’nın dört bir yanından gelen futbol tutkusu Şanlıurfaspor çatısı altında birleşti. Sarı ve yeşil, o günden bu yana şehrin kimliği oldu.' },
        { year: '1980’ler', title: 'Köklenme', text: 'Bölgesel rekabette adını duyuran kulüp, Şanlıurfa’nın spor kimliğinin merkezine yerleşti ve taraftarıyla kopmaz bir bağ kurdu.' },
        { year: '2013', title: 'Zirveye Yolculuk', text: 'Kulüp tarihinin en parlak dönemlerinden birinde üst liglerde mücadele eden Ceylanlar, Şanlıurfa’yı Türkiye’nin futbol haritasında üst sıralara taşıdı.' },
        { year: 'Evimiz', title: 'Kalemiz: 11 Nisan Stadyumu', text: 'Şanlıurfa 11 Nisan Stadyumu, Ceylanlar’ın taraftarıyla buluştuğu evi; sarı-yeşil tribünlerin coşkusuyla rakiplere geçit vermeyen kalesi oldu.' },
        { year: 'Bugün', title: 'Geleceğe Doğru', text: 'TFF 2. Lig Beyaz Grup’ta mücadele eden Şanlıurfaspor, köklü geçmişinden aldığı güçle yeniden yükselişin ve şehrini en üst seviyede temsil etmenin peşinde.' },
      ],
    },
  },

  'yonetim-kurulu': {
    template: 'board',
    fields: [
      { key: 'intro', label: 'Giriş paragrafı', type: 'textarea' },
      {
        key: 'members', label: 'Yönetim üyeleri', type: 'list', addLabel: 'Üye ekle', itemLabel: 'Üye',
        item: [
          { key: 'name', label: 'Ad Soyad', type: 'text' },
          { key: 'role', label: 'Görev / Sorumluluk alanı', type: 'text', placeholder: 'Başkan' },
          { key: 'photo', label: 'Fotoğraf', type: 'image' },
        ],
      },
    ],
    defaults: {
      intro:
        'Şanlıurfaspor Yönetim Kurulu; kulübün idari, sportif ve mali tüm süreçlerini şeffaflık, hesap verebilirlik ve sürdürülebilirlik ilkeleriyle yürütür. Her üyemiz, kulübümüzü geleceğe taşıma sorumluluğunu belirli bir görev alanında üstlenir.',
      members: [
        { name: 'Belirtilecek', role: 'Başkan', photo: '' },
        { name: 'Belirtilecek', role: 'Başkan Vekili', photo: '' },
        { name: 'Belirtilecek', role: 'Mali İşlerden Sorumlu Başkan Yardımcısı', photo: '' },
        { name: 'Belirtilecek', role: 'Sportif İşlerden Sorumlu Başkan Yardımcısı', photo: '' },
        { name: 'Belirtilecek', role: 'Genel Sekreter', photo: '' },
        { name: 'Belirtilecek', role: 'Altyapıdan Sorumlu Üye', photo: '' },
        { name: 'Belirtilecek', role: 'Medya ve İletişimden Sorumlu Üye', photo: '' },
        { name: 'Belirtilecek', role: 'Tesisler ve Yatırımdan Sorumlu Üye', photo: '' },
      ],
    },
  },

  baskanlarimiz: {
    template: 'presidents',
    fields: [
      { key: 'intro', label: 'Giriş paragrafı', type: 'textarea' },
      {
        key: 'presidents', label: 'Başkanlar', type: 'list', addLabel: 'Başkan ekle', itemLabel: 'Başkan',
        item: [
          { key: 'name', label: 'Ad Soyad', type: 'text' },
          { key: 'term', label: 'Görev dönemi', type: 'text', placeholder: '2020 – 2023' },
          { key: 'note', label: 'Miras / kısa not', type: 'text' },
        ],
      },
    ],
    defaults: {
      intro:
        'Kuruluşundan bugüne Şanlıurfaspor’a başkanlık eden her isim, sarı-yeşil bayrağı bir adım daha ileriye taşıdı. Kulübümüzün kurumsal hafızası bu liderlerin emeği üzerine inşa edildi; kendilerini şükranla anıyoruz.',
      presidents: [
        { name: 'Belirtilecek', term: 'Güncel Dönem', note: 'Mevcut başkan' },
        { name: 'Belirtilecek', term: 'Önceki Dönem', note: 'Kulübe katkılarıyla anılıyor' },
        { name: 'Belirtilecek', term: 'Önceki Dönem', note: 'Kulübe katkılarıyla anılıyor' },
      ],
    },
  },

  'kurumsal-kimlik': {
    template: 'brand',
    fields: [
      { key: 'intro', label: 'Giriş paragrafı (amblem hikâyesi)', type: 'textarea' },
      {
        key: 'colors', label: 'Renkler', type: 'list', addLabel: 'Renk ekle', itemLabel: 'Renk',
        item: [
          { key: 'name', label: 'Renk adı', type: 'text', placeholder: 'Sarı' },
          { key: 'hex', label: 'Renk kodu', type: 'color' },
          { key: 'note', label: 'Anlamı', type: 'text' },
        ],
      },
      {
        key: 'values', label: 'Değerler', type: 'list', addLabel: 'Değer ekle', itemLabel: 'Değer',
        item: [
          { key: 'title', label: 'Başlık', type: 'text' },
          { key: 'text', label: 'Açıklama', type: 'textarea' },
        ],
      },
      { key: 'logoNote', label: 'Logo / marka kullanım kuralı', type: 'textarea' },
    ],
    defaults: {
      intro:
        'Şanlıurfaspor’un kurumsal kimliği; sarı ve yeşil renkleri, kulüp armamız ve şehrimizle özdeşleşen "Ceylanlar" sembolü üzerine kuruludur. Armamız; kulübün köklü geçmişini, mücadeleci ruhunu ve Şanlıurfa’ya olan bağlılığını tek bir simgede buluşturur. Markamız, taraftarımızdan sponsorlarımıza kadar tüm paydaşlarımızla kurduğumuz güçlü bağın görsel ifadesidir.',
      colors: [
        { name: 'Yeşil', hex: '#1b5e44', note: 'Bereket, umut ve Harran ovasının verimli topraklarının rengi' },
        { name: 'Sarı', hex: '#f5c400', note: 'Şehrimizin güneşi; enerji, coşku ve mücadele azmi' },
        { name: 'Koyu Yeşil', hex: '#0c2e22', note: 'Köklülük, kurumsal duruş ve yarım asırlık geçmiş' },
      ],
      values: [
        { title: 'Tutku', text: 'Sahada ve tribünde aynı yürekle, son ana kadar mücadele ederiz.' },
        { title: 'Aidiyet', text: 'Şanlıurfa’nın takımı olmanın sorumluluğunu ve gururunu taşırız.' },
        { title: 'Kurumsallık', text: 'Şeffaf, hesap verebilir ve sürdürülebilir bir yönetim anlayışını benimseriz.' },
        { title: 'Gelecek', text: 'Altyapımızdan yetişen gençlerle yarınları bugünden kurarız.' },
      ],
      logoNote:
        'Kulüp logomuz markamızın resmî temsilidir; en-boy oranı korunmalı, renkleri değiştirilmemeli ve izinsiz olarak ticari amaçla kullanılmamalıdır. Logo varyasyonları, renk kodları ve kullanım kurallarını içeren marka kılavuzu için kulüp ile iletişime geçebilirsiniz.',
    },
  },

  tuzuk: {
    template: 'legal',
    fields: [
      { key: 'intro', label: 'Giriş paragrafı', type: 'textarea' },
      {
        key: 'articles', label: 'Maddeler', type: 'list', addLabel: 'Madde ekle', itemLabel: 'Madde',
        item: [
          { key: 'no', label: 'No', type: 'text', placeholder: 'Madde 1' },
          { key: 'title', label: 'Başlık', type: 'text' },
          { key: 'text', label: 'Metin', type: 'textarea' },
        ],
      },
    ],
    defaults: {
      intro:
        'Şanlıurfaspor’un işleyişi, organları, üyelik koşulları ve mali hükümleri kulüp tüzüğü ile düzenlenir. Tüzüğümüz; kulübün şeffaf, hesap verebilir ve sürdürülebilir bir yapıda yönetilmesini güvence altına alır. Kulübümüz tüm faaliyetlerini bu tüzük ve ilgili mevzuat çerçevesinde yürütür.',
      articles: [
        { no: 'Madde 1', title: 'Kulübün Adı, Merkezi ve Renkleri', text: 'Kulübün adı Şanlıurfaspor Futbol Kulübü’dür. Merkezi Şanlıurfa’dadır. Kulübün renkleri sarı ve yeşildir; amblemi ve renkleri tüm resmî mecralarda tutarlı biçimde kullanılır.' },
        { no: 'Madde 2', title: 'Kulübün Amacı', text: 'Kulübün amacı; başta futbol olmak üzere spor faaliyetlerini desteklemek, gençleri spora yönlendirmek, altyapıdan sporcu yetiştirmek ve Şanlıurfa’yı ulusal ve uluslararası alanda en iyi şekilde temsil etmektir.' },
        { no: 'Madde 3', title: 'Organlar', text: 'Kulübün organları; Genel Kurul, Yönetim Kurulu, Denetim Kurulu ve Disiplin Kurulu’ndan oluşur. Her organın görev, yetki ve sorumlulukları tüzükte ayrıntılı olarak belirtilir.' },
        { no: 'Madde 4', title: 'Üyelik', text: 'Üyelik koşulları, üyelerin hak ve yükümlülükleri, aidat esasları ile üyelikten çıkma ve çıkarılma hâlleri tüzük hükümlerine göre düzenlenir.' },
        { no: 'Madde 5', title: 'Mali Hükümler', text: 'Kulübün gelirleri, giderleri, bütçe ve mali denetim esasları şeffaflık ilkesi gözetilerek düzenlenir; mali tablolar Genel Kurul’un denetimine sunulur.' },
        { no: 'Madde 6', title: 'Tüzük Değişikliği', text: 'Tüzük, Genel Kurul’un yetkili çoğunluğunun kararıyla değiştirilebilir. Güncel tüzük metni bu sayfada yayımlanır.' },
      ],
    },
  },

  /* ═══════════════ TESİSLER ═══════════════ */

  'gap-arena': {
    template: 'stadium',
    fields: [
      { key: 'intro', label: 'Giriş paragrafı (stadyum hikâyesi)', type: 'textarea' },
      { key: 'capacity', label: 'Kapasite (büyük rakam)', type: 'text', placeholder: '28.965' },
      { key: 'location', label: 'Konum', type: 'text' },
      {
        key: 'stats', label: 'Künye satırları', type: 'list', addLabel: 'Satır ekle', itemLabel: 'Bilgi',
        item: [
          { key: 'label', label: 'Etiket', type: 'text', placeholder: 'Açılış' },
          { key: 'value', label: 'Değer', type: 'text', placeholder: '2014' },
        ],
      },
      {
        key: 'features', label: 'Özellikler', type: 'list', addLabel: 'Özellik ekle', itemLabel: 'Özellik',
        item: [
          { key: 'title', label: 'Başlık', type: 'text' },
          { key: 'text', label: 'Açıklama', type: 'textarea' },
        ],
      },
    ],
    defaults: {
      intro:
        'Şanlıurfa 11 Nisan Stadyumu, Ceylanlar’ın taraftarıyla buluştuğu evidir. Maç günlerinde binlerce taraftarın doldurduğu tribünler sarı-yeşil bir bayrak denizine dönüşür ve takımımıza 12. oyuncu gücünü verir.',
      capacity: '28.965',
      location: 'Şanlıurfa',
      stats: [
        { label: 'Kapasite', value: '28.965' },
        { label: 'Zemin', value: 'Doğal çim' },
        { label: 'Konum', value: 'Şanlıurfa' },
        { label: 'Ev Sahibi', value: 'Şanlıurfaspor' },
      ],
      features: [
        { title: 'Modern Tribünler', text: 'Geniş ve konforlu tribünler, VIP/protokol locaları ve basın tribünü ile binlerce taraftarı güvenle ağırlar.' },
        { title: 'Profesyonel Saha', text: 'FIFA ve UEFA standartlarında, üst düzey müsabakalara uygun bakımlı doğal çim zemin.' },
        { title: 'Kolay Ulaşım', text: 'Şehir merkezine yakın konumu ve geniş otoparkıyla maç günü kolay ve güvenli erişim.' },
      ],
    },
  },

  'antrenman-tesisi': {
    template: 'facility',
    fields: [
      { key: 'intro', label: 'Giriş paragrafı', type: 'textarea' },
      {
        key: 'features', label: 'Tesis olanakları', type: 'list', addLabel: 'Olanak ekle', itemLabel: 'Olanak',
        item: [
          { key: 'title', label: 'Başlık', type: 'text' },
          { key: 'text', label: 'Açıklama', type: 'textarea' },
        ],
      },
    ],
    defaults: {
      intro:
        'Profesyonel takımımız günlük antrenmanlarını, performans ve toparlanma süreçlerini en üst düzeyde destekleyen modern tesisimizde sürdürür. Tesisimiz; teknik ekibimizin ve sporcularımızın ihtiyaçlarına göre tasarlanmış, sürekli geliştirilen bir hazırlık merkezidir.',
      features: [
        { title: 'Profesyonel Çim Sahalar', text: 'Antrenmanlar için bakımlı, müsabaka standardında doğal ve sentetik sahalar.' },
        { title: 'Fitness & Kondisyon', text: 'Modern ekipmanlı güç ve kondisyon salonu ile performans gelişimi.' },
        { title: 'Fizyoterapi & Sağlık', text: 'Sakatlık önleme ve toparlanma için donanımlı sağlık ve fizyoterapi birimi.' },
        { title: 'Soyunma & Analiz Odaları', text: 'Takım için konforlu soyunma alanları ve maç analizi için toplantı odaları.' },
      ],
    },
  },

  'altyapi-akademisi': {
    template: 'academy',
    fields: [
      { key: 'intro', label: 'Giriş paragrafı (felsefe)', type: 'textarea' },
      {
        key: 'categories', label: 'Yaş kategorileri', type: 'list', addLabel: 'Kategori ekle', itemLabel: 'Kategori',
        item: [
          { key: 'name', label: 'Kategori', type: 'text', placeholder: 'U19' },
          { key: 'age', label: 'Yaş aralığı', type: 'text', placeholder: '17-19 yaş' },
        ],
      },
      {
        key: 'pathway', label: 'Gelişim yolu', type: 'list', addLabel: 'Adım ekle', itemLabel: 'Adım',
        item: [
          { key: 'title', label: 'Başlık', type: 'text' },
          { key: 'text', label: 'Açıklama', type: 'textarea' },
        ],
      },
    ],
    defaults: {
      intro:
        'Şanlıurfaspor Altyapı Akademisi, sahanın içinde ve dışında güçlü bireyler yetiştirir. Hedefimiz yalnızca futbolcu değil; disiplinli, özgüvenli ve değerlerine bağlı gençler yetiştirmek ve altyapımızdan A takımımıza sürekli oyuncu kazandırmaktır. Şehrimizin ve bölgemizin yeteneklerini geleceğin yıldızlarına dönüştürürüz.',
      categories: [
        { name: 'U12', age: '11-12 yaş' },
        { name: 'U14', age: '13-14 yaş' },
        { name: 'U16', age: '15-16 yaş' },
        { name: 'U19', age: '17-19 yaş' },
      ],
      pathway: [
        { title: 'Keşif', text: 'Bölgedeki yetenekli gençleri seçmelerle keşfeder ve akademiye kazandırırız.' },
        { title: 'Gelişim', text: 'Sportif, fiziksel, zihinsel ve kişisel gelişimi birlikte yürüten planlı bir eğitim programı uygularız.' },
        { title: 'A Takım', text: 'Hazır olan oyuncularımızı profesyonel kadromuza taşır, sarı-yeşil formayı emanet ederiz.' },
      ],
    },
  },

  muze: {
    template: 'museum',
    fields: [
      { key: 'intro', label: 'Giriş paragrafı', type: 'textarea' },
      {
        key: 'stats', label: 'Sayısal vitrin', type: 'list', addLabel: 'Sayı ekle', itemLabel: 'Sayı',
        item: [
          { key: 'value', label: 'Değer', type: 'text', placeholder: '1969' },
          { key: 'label', label: 'Etiket', type: 'text', placeholder: 'Kuruluş Yılı' },
        ],
      },
      {
        key: 'exhibits', label: 'Sergi öğeleri', type: 'list', addLabel: 'Öğe ekle', itemLabel: 'Öğe',
        item: [
          { key: 'title', label: 'Başlık', type: 'text' },
          { key: 'text', label: 'Açıklama', type: 'textarea' },
          { key: 'image', label: 'Görsel', type: 'image' },
        ],
      },
    ],
    defaults: {
      intro:
        'Kulüp müzemiz; Şanlıurfaspor’un yarım asrı aşkın tarihini, unutulmaz maçlarını, kupalarını ve efsane oyuncularını gelecek nesillere taşır. Formalar, fotoğraflar ve hatıralarla burası, sarı-yeşil hafızanın yaşadığı yerdir.',
      stats: [
        { value: '1969', label: 'Kuruluş Yılı' },
        { value: '50+', label: 'Yıllık Miras' },
        { value: 'Sarı-Yeşil', label: 'Renklerimiz' },
        { value: 'Ceylanlar', label: 'Lakabımız' },
      ],
      exhibits: [
        { title: 'Tarihî Formalar', text: 'Yıllar içinde giyilen efsane sarı-yeşil formalar ve giyim evrimi.', image: '' },
        { title: 'Kupalar & Madalyalar', text: 'Kulübün gurur tablosu; başarı ve emek hatıraları.', image: '' },
        { title: 'Fotoğraf Arşivi', text: 'Kuruluştan bugüne unutulmaz kareler ve tarihî anlar.', image: '' },
      ],
    },
  },

  /* ═══════════════ KURUMSAL ═══════════════ */

  'basin-medya': {
    template: 'press',
    fields: [
      { key: 'intro', label: 'Giriş paragrafı', type: 'textarea' },
      {
        key: 'steps', label: 'Akreditasyon adımları', type: 'list', addLabel: 'Adım ekle', itemLabel: 'Adım',
        item: [
          { key: 'title', label: 'Başlık', type: 'text' },
          { key: 'text', label: 'Açıklama', type: 'textarea' },
        ],
      },
      { key: 'contactEmail', label: 'Basın e-posta', type: 'text' },
      { key: 'contactPhone', label: 'Basın telefon', type: 'text' },
    ],
    defaults: {
      intro:
        'Şanlıurfaspor Basın ve Medya birimi; resmî açıklamalar, basın bültenleri ve medya akreditasyon süreçlerini yürütür. Maç günü akreditasyon, röportaj talepleri ve görsel-işitsel materyal istekleri için basın birimimizle iletişime geçebilirsiniz. Resmî açıklamalarımız web sitemiz ve sosyal medya hesaplarımız üzerinden duyurulur.',
      steps: [
        { title: 'Başvuru', text: 'Maç akreditasyonu için kurumunuz adına, künye bilgilerinizle birlikte başvurunuzu basın birimimize iletin.' },
        { title: 'Değerlendirme & Onay', text: 'Başvurunuz basın birimimizce değerlendirilir ve uygun bulunması hâlinde onaylanır.' },
        { title: 'Kart Teslimi', text: 'Onaylanan akreditasyon kartınız maç günü, stadyum basın girişinde teslim edilir.' },
      ],
      contactEmail: 'basin@sanliurfaspor.org',
      contactPhone: '+90 (414) 000 00 00',
    },
  },

  sponsorluk: {
    template: 'sponsorship',
    fields: [
      { key: 'intro', label: 'Giriş paragrafı', type: 'textarea' },
      {
        key: 'tiers', label: 'Sponsorluk paketleri', type: 'list', addLabel: 'Paket ekle', itemLabel: 'Paket',
        item: [
          { key: 'name', label: 'Paket adı', type: 'text', placeholder: 'Ana Sponsor' },
          { key: 'items', label: 'Avantajlar (her satır bir madde)', type: 'textarea' },
          { key: 'featured', label: 'Öne çıkan? (evet/hayır)', type: 'text', placeholder: 'evet' },
        ],
      },
    ],
    defaults: {
      intro:
        'Şanlıurfaspor; markanızı, Güneydoğu’nun en tutkulu taraftar kitlesi ve bölgenin en köklü spor kulübüyle buluşturur. Sponsorluk iş birliklerimiz; karşılıklı değer yaratma, geniş erişim ve uzun vadeli ortaklık ilkesine dayanır. Birlikte hem sahada hem de toplumda fark yaratalım.',
      tiers: [
        { name: 'Ana Sponsor', items: 'Forma göğüs logosu\nTüm dijital mecralarda öncelikli görünürlük\nStadyum reklam alanları (saha kenarı + tribün)\nÖzel etkinlik ve içerik iş birlikleri\nKurumsal misafir/loca ayrıcalıkları', featured: 'evet' },
        { name: 'Resmî Sponsor', items: 'Forma kol/sırt logosu\nStadyum reklam alanları\nSosyal medya görünürlüğü\nMaç günü tanıtım imkânları', featured: 'hayır' },
        { name: 'Resmî Tedarikçi', items: 'Stadyum pano reklamı\nWeb sitesi sponsor duvarında yer\n"Resmî Tedarikçi" kullanım hakkı', featured: 'hayır' },
      ],
    },
  },

  'insan-kaynaklari': {
    template: 'careers',
    fields: [
      { key: 'intro', label: 'Giriş paragrafı (işveren markası)', type: 'textarea' },
      {
        key: 'positions', label: 'Açık pozisyonlar', type: 'list', addLabel: 'Pozisyon ekle', itemLabel: 'Pozisyon',
        item: [
          { key: 'title', label: 'Pozisyon', type: 'text' },
          { key: 'type', label: 'Çalışma şekli', type: 'text', placeholder: 'Tam zamanlı' },
          { key: 'location', label: 'Lokasyon', type: 'text', placeholder: 'Şanlıurfa' },
          { key: 'text', label: 'Açıklama', type: 'textarea' },
        ],
      },
      {
        key: 'values', label: 'Neden bizimle?', type: 'list', addLabel: 'Değer ekle', itemLabel: 'Değer',
        item: [
          { key: 'title', label: 'Başlık', type: 'text' },
          { key: 'text', label: 'Açıklama', type: 'textarea' },
        ],
      },
    ],
    defaults: {
      intro:
        'Şanlıurfaspor ailesi, tutkusunu işine yansıtan insanlarla büyür. İnsan kaynakları yaklaşımımız; adalet, sürekli gelişim ve takım ruhu üzerine kuruludur. Sportif ve idari birimlerimizde, kulübümüzün geleceğini birlikte inşa edecek yetenekleri ailemize katmaktan mutluluk duyarız.',
      positions: [
        { title: 'Şu an açık pozisyon bulunmuyor', type: '', location: '', text: 'Yeni ilanlarımız bu sayfada yayınlanacaktır. Dilerseniz özgeçmişinizi kulüp iletişim kanallarımız üzerinden iletebilir, açık pozisyon havuzumuza katılabilirsiniz.' },
      ],
      values: [
        { title: 'Adalet', text: 'Her başvuruya ve çalışana eşit, şeffaf ve saygılı yaklaşırız.' },
        { title: 'Gelişim', text: 'Çalışanlarımızın mesleki ve kişisel gelişimini sürekli destekleriz.' },
        { title: 'Takım Ruhu', text: 'Sahada olduğu gibi ofiste de birlikte başarmaya inanırız.' },
      ],
    },
  },
}

export const getSpec = (slug: string): PageSpec | null => PAGE_SPECS[slug] ?? null
