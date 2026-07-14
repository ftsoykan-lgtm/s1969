import Image from 'next/image'

/**
 * Kulüp logosu — HER boyutta net.
 * Sorun: yüksek çözünürlüklü PNG düz <img> ile küçük gösterilince (ör. 500px → 36px)
 * tarayıcının CSS küçültmesi yumuşama/aliasing yapar. Çözüm: next/image, gösterim
 * boyutuna yakın (2×/retina) yüksek kaliteli sürüm üretip WebP/AVIF sunar → keskin.
 *
 * - `size`    : gösterim boyutu (px, kare). Animasyonlu yerlerde değişebilir.
 * - `optSize` : optimizasyon (kaynak) boyutu. Animasyonlu logoda SABİT ver ki
 *               kaydırmada yeni istek/titreme olmasın; verilmezse size×2 kullanılır.
 * - SVG kaynak: vektör, sonsuz net → doğrudan sunulur (optimizasyona gerek yok).
 */
export default function ClubLogo({
  src, size, optSize, className = '', alt = '', priority = false,
}: {
  src: string
  size: number
  optSize?: number
  className?: string
  alt?: string
  priority?: boolean   // üstteki (above-fold) header/splash logosu için true
}) {
  const style = { width: size, height: size }
  if (/\.svg(\?|$)/i.test(src)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} style={style} className={className} />
  }
  const px = Math.max(64, Math.round(optSize ?? size * 2))
  return (
    <Image src={src} alt={alt} width={px} height={px} style={style} className={className} quality={92} priority={priority} />
  )
}
