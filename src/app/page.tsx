import HeroSlider, { type HeroItem } from '@/components/home/HeroSlider'
import NewsHeroGrid from '@/components/home/NewsHeroGrid'
import FixturePreview from '@/components/home/FixturePreview'
import SquadPreview from '@/components/home/SquadPreview'
import { getNews, getFeaturedNews, getCategories } from '@/lib/supabase/news-server'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [news, featured, cats] = await Promise.all([
    getNews(), getFeaturedNews(), getCategories(),
  ])
  const catName = (slug: string) => cats.find((c) => c.slug === slug)?.name ?? slug

  // Hero slider: öne çıkanlar önce, ardından en son eklenen haberler (görselli, tekrarsız)
  const heroItems: HeroItem[] = [...featured, ...news]
    .filter((n, i, a) => a.findIndex((x) => x.slug === n.slug) === i)
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
