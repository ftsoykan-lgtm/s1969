/* ════════════════════════════════════════════════════════════════
   AKILLI KULÜP İSİM HARİTASI
   ----------------------------------------------------------------
   TFF ham adı → sitede gösterilecek kısa / bilinen ad.

   Anahtar: sponsor öneki çıkarılmış ham adın normalize hali
     (küçük harf · Türkçe→ascii · yalnız harf-rakam).
   Değer:   gösterilecek ad.

   Haritada OLMAYAN kulüpler için `temizTakimAdi` algoritması
   (sponsor + A.Ş./Kulübü/S.K. temizleme, "Futbol Kulübü"→"FK")
   otomatik devreye girer. Yeni bir kulüp/rakip gelince, doğru adı
   buraya tek satır eklemek yeterli — tüm site birden güncellenir.
   ════════════════════════════════════════════════════════════════ */
export const TEAM_ALIASES: Record<string, string> = {
  // Güncel 2. Lig Beyaz Grup + arşiv rakipleri (sponsor önekleri hariç anahtar)
  '68aksaraybelediyespor': '68 Aksaray Belediyespor',
  adana01futbolkulubusk: 'Adana 01 FK',
  adanademirsporas: 'Adana Demirspor',
  aliagafutbolas: 'Aliağaspor',
  altinordu: 'Altınordu',
  '24erzincanspor': '24Erzincanspor',
  ankaraspor: 'Ankaraspor',
  arnavutkoybelediyesifutbolsk: 'Arnavutköy Belediyespor',
  batmanpetrolsporas: 'Batman Petrolspor',
  beykozanadolusporas: 'Beykoz Anadolu',
  beyogluyenicarsisporfaaliyetlerias: 'Beyoğlu Yeni Çarşı',
  bucaspor1928: 'Bucaspor 1928',
  corluspor1947: 'Çorluspor 1947',
  dersimspor: 'Dersimspor',
  elazigspor: 'Elazığspor',
  kastamonuspor: 'Kastamonuspor',
  guzidegebzesporkulubu: 'Gebzespor',
  hatayspor: 'Hatayspor',
  isparta32sporkulubu: 'Isparta 32 Spor',
  inegolkafkassporkulubu: 'İnegöl Kafkasspor',
  iskenderunsporas: 'İskenderunspor',
  karacabeybelediyesporas: 'Karacabey Belediyespor',
  karamanfutbolkulubu: 'Karaman FK',
  kepezsporfutbolas: 'Kepezspor',
  kurtalanspor: 'Kurtalanspor',
  menemenfutbolkulubu: 'Menemen FK',
  erbaaspor: 'Erbaaspor',
  ankaragucu: 'Ankaragücü',
  muglasporkulubu: 'Muğlaspor',
  mussporkulubu: 'Muşspor',
  sebatgenclikspor: 'Sebat Gençlikspor',
  somaspor: 'Somaspor',
  inegolspor: 'İnegölspor',
}
