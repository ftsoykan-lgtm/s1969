-- ════════════════════════════════════════════════════════════════
-- 010 — Kulüp kategorisi sayfalarının içerikleri
-- Tüm bilgi sayfalarına varsayılan içerik yazar (admin'den düzenlenebilir).
-- Mevcut satırları da günceller (on conflict do update).
-- Tarihçe ve Yönetim Kurulu da CMS'e dahil edilir.
-- ════════════════════════════════════════════════════════════════

insert into site_pages (slug, title, subtitle, nav_group, sort, body) values

('tarihce', 'Tarihçe', 'Köklü bir geçmiş, sarı-yeşil bir tutku', 'kulup', 0,
'Şanlıurfaspor, 1969 yılında Şanlıurfa''da kuruldu ve kısa sürede şehrin en büyük spor tutkusu hâline geldi. "Ceylanlar" lakabıyla anılan kulübümüz, sarı-yeşil renkleriyle Güneydoğu Anadolu''nun en köklü futbol kulüplerinden biridir.

Kurulduğu günden bu yana Şanlıurfa''nın sporla anılan ismi olan kulübümüz, profesyonel liglerde mücadele etmiş, şehrin ve bölgenin futbol kültürüne önemli katkılar sağlamıştır.

Maçlarımızı, 28.965 seyirci kapasiteli Şanlıurfa GAP Stadyumu''nda (11 Nisan Stadyumu) oynuyoruz. Tribünlerimizi dolduran taraftarlarımız, takımımızın 12. oyuncusu olarak her zaman yanımızdadır.

Bugün TFF 2. Lig Beyaz Grup''ta mücadele eden Şanlıurfaspor, hem sahada hem de tribünde Şanlıurfa''nın gururu olmaya, geleceğe daha güçlü adımlarla yürümeye devam etmektedir.

(Bu metin yönetim tarafından güncellenebilir.)'),

('yonetim-kurulu', 'Yönetim Kurulu', 'Kulübümüzü yöneten kadro', 'kulup', 1,
'Şanlıurfaspor Yönetim Kurulu, kulübün tüm idari, sportif ve mali işlerini yürüten, kulübü resmî olarak temsil eden organdır.

Yönetim kurulumuz; başkan, başkan yardımcıları, genel sekreter, sayman ve üyelerden oluşur. Kurulumuz, kulübün uzun vadeli hedefleri doğrultusunda şeffaf ve sürdürülebilir bir yönetim anlayışını benimser.

Güncel yönetim kurulu üyelerimizin isimleri ve görev dağılımı bu sayfada yayınlanacaktır.

(Üye listesi yönetim tarafından eklenecektir.)'),

('baskanlarimiz', 'Başkanlarımız', 'Kulübümüze hizmet eden başkanlar', 'kulup', 2,
'Kuruluşundan bugüne Şanlıurfaspor''a başkanlık yapan, kulübü gönülden sahiplenen ve emek veren tüm başkanlarımıza şükranlarımızı sunarız.

Her dönemin başkanı, kulübün gelişimine ve şehrin spor hayatına katkı sağlamıştır. Geçmiş dönem başkanlarımızın listesi ve görev süreleri bu sayfada yer alacaktır.

(İçerik yönetim tarafından güncellenecektir.)'),

('kurumsal-kimlik', 'Kurumsal Kimlik', 'Logo, renkler ve marka kullanımı', 'kulup', 3,
'Şanlıurfaspor''un kurumsal kimliği; sarı ve yeşil renkleri, kulüp arması ve "Ceylanlar" sembolü üzerine kuruludur.

Renklerimiz:
Sarı — enerji, coşku ve şehrimizin güneşi
Yeşil — bereket, umut ve Harran ovasının verimli toprakları

Kulüp logomuz, markamızın resmî temsilidir ve izinsiz, değiştirilerek veya ticari amaçla kullanılamaz. Marka kullanım talepleriniz için kulüp ile iletişime geçebilirsiniz.

(Marka kılavuzu yönetim tarafından eklenecektir.)'),

('tuzuk', 'Tüzük', 'Kulüp tüzüğü', 'kulup', 4,
'Şanlıurfaspor''un işleyişi, organları, üyelik koşulları ve mali hükümleri kulüp tüzüğü ile düzenlenir.

Tüzüğümüz; genel kurul, yönetim kurulu, denetim kurulu ve disiplin kurulu gibi organların görev ve yetkilerini belirler. Kulübümüz tüm faaliyetlerini bu tüzük ve ilgili mevzuat çerçevesinde yürütür.

Tüzüğün tam metnine bu sayfadan ulaşabilirsiniz.

(Resmî tüzük belgesi yönetim tarafından eklenecektir.)'),

('gap-arena', 'GAP Stadyumu', 'Evimiz · 11 Nisan Stadyumu', 'tesisler', 1,
'Şanlıurfa GAP Stadyumu (11 Nisan Stadyumu), Şanlıurfaspor''un iç saha maçlarını oynadığı modern stadyumdur.

Kapasite: 28.965 seyirci
Konum: Karaköprü, Şanlıurfa

Geniş tribünleri ve modern altyapısıyla stadyumumuz, taraftarlarımıza keyifli ve güvenli bir maç deneyimi sunar. Sarı-yeşil bayraklarla dolan tribünlerimiz, takımımıza en büyük gücü verir.

(Detaylı bilgi ve görseller yönetim tarafından eklenecektir.)'),

('antrenman-tesisi', 'Antrenman Tesisi', 'Takımımızın hazırlandığı tesis', 'tesisler', 2,
'Profesyonel takımımızın günlük antrenmanlarını gerçekleştirdiği antrenman tesisimiz; çim sahaları, soyunma odaları, fitness ve fizyoterapi alanlarıyla oyuncularımıza en iyi hazırlık ortamını sağlar.

Modern tesisimiz, takımımızın performansını en üst düzeye çıkarmak için sürekli geliştirilmektedir.

(Detaylı bilgi yönetim tarafından eklenecektir.)'),

('altyapi-akademisi', 'Altyapı Akademisi', 'Geleceğin yıldızları', 'tesisler', 3,
'Şanlıurfaspor Altyapı Akademisi, şehrimizin ve bölgemizin yetenekli genç futbolcularını keşfedip yetiştirmeyi amaçlar.

Farklı yaş kategorilerindeki takımlarımızda, genç sporcularımız hem futbol hem de kişisel gelişim açısından desteklenir. Hedefimiz, altyapımızdan profesyonel takımımıza oyuncular kazandırmaktır.

(Kategoriler ve başvuru bilgileri yönetim tarafından eklenecektir.)'),

('muze', 'Müze', 'Kulüp tarihimiz', 'tesisler', 4,
'Şanlıurfaspor''un köklü tarihini, unutulmaz maçlarını, kupalarını ve efsane oyuncularını gelecek nesillere aktarmak için kulüp müzemiz hazırlanmaktadır.

Kulübümüze ait tarihi formalar, fotoğraflar ve hatıralar bu sayfada ve müzemizde sergilenecektir.

(İçerik yönetim tarafından eklenecektir.)'),

('basin-medya', 'Basın & Medya', 'Basın bültenleri ve akreditasyon', 'kurumsal', 1,
'Şanlıurfaspor Basın ve Medya birimi; resmî açıklamalar, basın bültenleri ve medya akreditasyon işlemlerini yürütür.

Maç akreditasyonu, röportaj talepleri ve basın bilgilendirmeleri için kulüp medya birimi ile iletişime geçebilirsiniz. Resmî açıklamalarımız web sitemiz ve sosyal medya hesaplarımız üzerinden duyurulur.

(İletişim bilgileri yönetim tarafından eklenecektir.)'),

('sponsorluk', 'Sponsorluk', 'Birlikte daha güçlü', 'kurumsal', 2,
'Şanlıurfaspor; markaları, şehrin tutkulu taraftar kitlesi ve bölgenin en büyük spor kulübüyle buluşturan güçlü bir sponsorluk fırsatı sunar.

Forma sponsorluğu, stadyum reklamları, dijital iş birlikleri ve özel projeler için markanızı sarı-yeşil ailenin bir parçası yapabilirsiniz. Birlikte hem sahada hem de toplumda fark yaratalım.

Sponsorluk teklifleri için kulüp ile iletişime geçiniz.'),

('insan-kaynaklari', 'İnsan Kaynakları', 'Sarı-yeşil ailenin parçası ol', 'kurumsal', 3,
'Şanlıurfaspor; sporun ve kulübün gelişimine katkı sağlamak isteyen, alanında yetkin ve takım ruhuna sahip çalışanları ailesine katmaktan mutluluk duyar.

Açık pozisyonlar, staj imkânları ve gönüllülük başvuruları bu sayfada yayınlanacaktır. Başvurularınızı kulüp iletişim kanalları üzerinden iletebilirsiniz.

(Açık pozisyonlar yönetim tarafından eklenecektir.)')

on conflict (slug) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  nav_group = excluded.nav_group,
  body = case when site_pages.body is null or site_pages.body = '' or site_pages.body like 'İçerik yakında%' then excluded.body else site_pages.body end,
  updated_at = now();
