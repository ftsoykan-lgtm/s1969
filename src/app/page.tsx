import HeroVideo from '@/components/home/HeroVideo'
import NewsHeroGrid from '@/components/home/NewsHeroGrid'
import FixturePreview from '@/components/home/FixturePreview'
import SquadPreview from '@/components/home/SquadPreview'
import { getNews, getCategories } from '@/lib/supabase/news-server'
import { getClubInfo } from '@/lib/supabase/club-server'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [news, cats, club] = await Promise.all([getNews(), getCategories(), getClubInfo()])
  const catName = (slug: string) => cats.find((c) => c.slug === slug)?.name ?? slug

  return (
    <>
      <HeroVideo club={club} src={club.heroVideo} />
      <FixturePreview />
      <NewsHeroGrid news={news} catName={catName} />
      <SquadPreview />
    </>
  )
}
