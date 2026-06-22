import HeroSlider, { type HeroItem } from '@/components/home/HeroSlider'
import NewsHeroGrid from '@/components/home/NewsHeroGrid'
import FixturePreview from '@/components/home/FixturePreview'
import SquadPreview from '@/components/home/SquadPreview'
import { getNews, getFeaturedNews, getCategories } from '@/lib/supabase/news-server'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [featured, news, cats] = await Promise.all([getFeaturedNews(), getNews(), getCategories()])
  const catName = (slug: string) => cats.find((c) => c.slug === slug)?.name ?? slug

  const heroItems: HeroItem[] = featured.slice(0, 5).map((n) => ({
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
