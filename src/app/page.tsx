import HeroSlider from '@/components/home/HeroSlider'
import NewsHeroGrid from '@/components/home/NewsHeroGrid'
import FixturePreview from '@/components/home/FixturePreview'
import SquadPreview from '@/components/home/SquadPreview'
import SponsorsSection from '@/components/home/SponsorsSection'

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <NewsHeroGrid />
      <FixturePreview />
      <SquadPreview />
      <SponsorsSection />
    </>
  )
}
