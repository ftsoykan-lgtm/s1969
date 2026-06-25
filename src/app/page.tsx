import HeroVideo, { type HeroItem } from '@/components/home/HeroVideo'
import NewsStories, { type StoryItem } from '@/components/home/NewsStories'
import NewsHeroGrid from '@/components/home/NewsHeroGrid'
import FixturePreview from '@/components/home/FixturePreview'
import SquadPreview from '@/components/home/SquadPreview'
import { getNews, getFeaturedNews, getCategories, getStories } from '@/lib/supabase/news-server'
import { getClubInfo } from '@/lib/supabase/club-server'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [news, featured, stories, cats, club] = await Promise.all([
    getNews(), getFeaturedNews(), getStories(), getCategories(), getClubInfo(),
  ])
  const catName = (slug: string) => cats.find((c) => c.slug === slug)?.name ?? slug

  const heroItems: HeroItem[] = featured.slice(0, 5).map((n) => ({
    title: n.title,
    excerpt: n.excerpt,
    imageUrl: n.imageUrl,
    href: `/haberler/${n.slug}`,
    category: catName(n.category),
  }))

  const storyItems: StoryItem[] = stories.map((n) => ({
    title: n.title,
    category: catName(n.category),
    imageUrl: n.imageUrl,
    slug: n.slug,
    excerpt: n.excerpt,
  }))

  return (
    <>
      <NewsStories items={storyItems} />
      <HeroVideo club={club} src={club.heroVideo} items={heroItems} />
      <FixturePreview />
      <NewsHeroGrid news={news} catName={catName} />
      <SquadPreview />
    </>
  )
}
