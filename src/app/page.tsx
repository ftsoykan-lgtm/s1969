import HeroSlider, { type HeroItem } from '@/components/home/HeroSlider'
import NewsHeroGrid from '@/components/home/NewsHeroGrid'
import FixturePreview from '@/components/home/FixturePreview'
import SquadPreview from '@/components/home/SquadPreview'
import { getNews, getFeaturedNews, getCategories } from '@/lib/supabase/news-server'

export const revalidate = 60

export default async function HomePage() {
  const [news, featured, cats] = await Promise.all([
    getNews(), getFeaturedNews(), getCategories(),
  ])
  const catName = (slug: string) => cats.find((c) => c.slug === slug)?.name ?? slug

  // Hero slider: YALNIZ admin'de "Hero'da (slider) göster" işaretli görselli haberler.
  // Hiçbiri işaretli değilse heroItems boş kalır ve HeroSlider render edilmez (alan gizlenir).
  const heroItems: HeroItem[] = featured
    .filter((n) => n.imageUrl)
    .slice(0, 6)
    .map((n) => ({
      title: n.title,
      excerpt: n.excerpt,
      imageUrl: n.imageUrl,
      href: `/haberler/${n.slug}`,
      category: catName(n.category),
    }))

  return (
    <>
      <HeroSlider items={heroItems} />
      <FixturePreview />
      <NewsHeroGrid news={news} catName={catName} />
      <SquadPreview />
    </>
  )
}
