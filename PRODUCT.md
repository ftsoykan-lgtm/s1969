# Product

## Register

brand

## Users

Birincil kitle Şanlıurfaspor taraftarları: maç sonuçlarını, fikstürü, kadroyu ve kulüp haberlerini takip etmek için siteye masaüstü ve mobil cihazlardan giren, çoğunlukla mobil ağırlıklı, geniş yaş aralığında bir topluluk. Kullanıcı bağlamı genelde hızlı bilgi arayışıdır: "bir sonraki maç ne zaman", "son skor kaç oldu", "yeni transfer/haber var mı". İkincil kitle kulüp yönetimi/medya ekibi olup admin panel üzerinden içerik (haber, kadro, fikstür, sponsor, ayarlar) yönetir — ancak tasarım kaydının birincil yüzeyi halka açık kulüp sitesidir.

## Product Purpose

Şanlıurfaspor Futbol Kulübü'nün (TFF 2. Lig Beyaz Grup) resmî dijital vitrini. Amaç, kulübün kurumsal ve köklü kimliğini premium bir çevrimiçi deneyimle yansıtmak; taraftara maç merkezi, haberler, kadro, takvim ve kulüp bilgilerini net, hızlı ve güven veren biçimde sunmak. Başarı: taraftarın aradığı bilgiye zahmetsizce ulaşması, sitenin "gerçek bir profesyonel kulübün resmî sitesi" hissi vermesi ve içeriğin admin panelden kolayca güncel tutulabilmesi.

## Brand Personality

Üç kelime: **Premium · Kurumsal · Güçlü**. Ses tonu kendinden emin, ağırbaşlı ve profesyonel; abartıya ve amatörlüğe kaçmadan taraftar gururunu taşıyan bir otorite duruşu. Yeşil-altın kulüp kimliği disiplinli ve prestijli kullanılır; coşku, renk cümbüşüyle değil güçlü tipografi, net hiyerarşi ve ölçülü aksanlarla verilir. Arayüz güven ("resmî kaynak burası"), prestij ve aidiyet duygusu uyandırmalı.

## Anti-references

- **Jenerik şablon / AI görünümü**: aynı boyutta tekrarlanan kart ızgaraları, her bölümün üstünde tracked uppercase "eyebrow", cansız gri-beyaz düzenler, kişiliksiz stok hero blokları. Site kategorisinden (futbol kulübü) tahmin edilebilecek refleks tasarımlardan kaçınılır.
- **Ucuz / amatör kulüp sitesi**: bozuk hizalama, çakışan renkler, düşük çözünürlüklü görseller, dağınık tipografi, tutarsız boşluk. "Premium" iddiasını çürüten her detay reddedilir.
- (Not: Anti-referans sorusunda kullanıcı "Something else" seçti fakat özel metin girmedi; yukarıdakiler premium/kurumsal yönle tutarlı varsayılan anti-referanslardır ve kullanıcı netleştirdikçe güncellenmelidir.)

## Design Principles

1. **Resmî kaynak güveni**: her ekran "bu kulübün gerçek, yetkili sitesi" hissini pekiştirmeli; tutarlılık ve rafine detay güvenilirliği taşır.
2. **Bilgi önce gelir**: taraftarın ilk aradığı şey (sonraki maç, son skor, yeni haber) en az tıkla, en net biçimde erişilir olmalı; süsleme okunabilirliğin önüne geçmez.
3. **Kimlik disiplinle taşınır**: yeşil-altın kulüp rengi karakteri ölçülü aksan, güçlü tipografi ve hiyerarşiyle verir — dekoratif renk cümbüşüyle değil.
4. **Statik güç, ölçülü hareket**: etki büyük tipografi, kalın aksan ve net kompozisyondan gelir; hareket amaca hizmet eder ve `prefers-reduced-motion` altında içeriği asla gizlemez.
5. **Premium ayrıntı standardı**: hizalama, boşluk ritmi, görsel kalitesi ve durum tasarımı (hover/focus/boş/hata) amatörlükten ayıran farktır; hiçbiri sonradan düşünülmez.

## Accessibility & Inclusion

- Hedef: **WCAG 2.1 AA**. Gövde metni arka planına karşı ≥4.5:1, büyük/kalın metin ≥3:1 kontrast; yeşil zemin üzerine gri metin gibi soluk kombinasyonlardan kaçınılır.
- **Reduced motion zorunlu**: her animasyonun `prefers-reduced-motion: reduce` alternatifi vardır (crossfade veya anında geçiş); içerik görünürlüğü sınıf tetikli geçişe bağlanmaz — reveal'lar zaten görünür bir varsayılanı güçlendirir.
- Klavye erişilebilirliği ve görünür focus durumları; anlamlı `alt` metinleri (oyuncu/haber görselleri); semantik HTML (`header`/`nav`/`main`/`footer`) tercih edilir.
- Renk tek başına anlam taşımaz (ör. galibiyet/beraberlik/mağlubiyet skor renkleri metin/etiketle desteklenir), renk körlüğü gözetilir.
