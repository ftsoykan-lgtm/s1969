import Image from 'next/image'

/**
 * Kulüp logosu — HER boyutta net.
 * Sorun: yüksek çözünürlüklü PNG küçük gösterilince (ör. 500px → 60px) tarayıcı
 * CSS küçültmesi yumuşama/aliasing yapar.
 * Çözüm: next/image'e GÖSTERİM boyutu verilir → next/image kendi 1×/2× srcset'ini
 * üretir; tarayıcı ekran yoğunluğuna göre tam gereken boyutu (ör. retina'da 2×)
 * yüksek kaliteyle (quality 100 ≈ kayıpsız) çeker. Böylece gereksiz aşırı
 * küçültme olmaz → keskin.
 *
 * - `size`    : gösterim boyutu (px, kare). Animasyonlu yerlerde değişebilir.
 * - `optSize` : next/image intrinsic (kaynak) boyutu; verilmezse `size`.
 *               Animasyonlu logoda SABİT ver ki kaydırmada yeni istek olmasın
 *               (2× DPR'yi next/image kendisi ekler; ör. optSize 64 → 128 sunar).
 * - SVG kaynak: vektör → doğrudan sunulur (optimizasyona gerek yok, sonsuz net).
 */
export default function ClubLogo({
  src, size, optSize, className = '', alt = '', priority = false,
}: {
  src: string
  size: number
  optSize?: number
  className?: string
  alt?: string
  priority?: boolean
}) {
  const style = { width: size, height: size }
  if (/\.svg(\?|$)/i.test(src)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} style={style} className={className} />
  }
  const px = Math.max(48, Math.round(optSize ?? size))
  return (
    <Image src={src} alt={alt} width={px} height={px} style={style} className={className} quality={100} priority={priority} />
  )
}
