import HeroVideo, { type HeroItem } from '@/components/home/HeroVideo'
import NewsHeroGrid from '@/components/home/NewsHeroGrid'
import FixturePreview from '@/components/home/FixturePreview'
import SquadPreview from '@/components/home/SquadPreview'
import { getNews, getFeaturedNews, getCategories } from '@/lib/supabase/news-server'
import { getClubInfo } from '@/lib/supabase/club-server'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [news, featured, cats, club] = await Promise.all([
    getNews(), getFeaturedNews(), getCategories(), getClubInfo(),
  ])
  const catName = (slug: string) => cats.find((c) => c.slug === slug)?.name ?? slug

  const heroItems: HeroItem[] = featured.slice(0, 5).map((n) => ({
    title: n.title,
    excerpt: n.excerpt,
    href: `/haberler/${n.slug}`,
    category: catName(n.category),
  }))

  return (
    <>
      <HeroVideo club={club} src={club.heroVideo} items={heroItems} />
      <FixturePreview />
      <NewsHeroGrid news={news} catName={catName} />
      <SquadPreview />
    </>
  )
}
