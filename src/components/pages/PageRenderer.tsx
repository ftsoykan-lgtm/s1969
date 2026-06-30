import type { SitePage } from '@/lib/supabase/pages-server'
import { getSpec } from '@/lib/pages/specs'
import type { TemplateKey } from '@/lib/pages/fields'

import PremiumPage from './PremiumPage'
import TimelinePage from './templates/TimelinePage'
import BoardPage from './templates/BoardPage'
import PresidentsPage from './templates/PresidentsPage'
import BrandPage from './templates/BrandPage'
import LegalPage from './templates/LegalPage'
import StadiumPage from './templates/StadiumPage'
import FacilityPage from './templates/FacilityPage'
import AcademyPage from './templates/AcademyPage'
import MuseumPage from './templates/MuseumPage'
import PressPage from './templates/PressPage'
import SponsorshipPage from './templates/SponsorshipPage'
import CareersPage from './templates/CareersPage'

type TemplateComponent = (props: { page: SitePage; related?: { slug: string; title: string }[] }) => React.JSX.Element

const TEMPLATES: Record<TemplateKey, TemplateComponent> = {
  timeline: TimelinePage,
  board: BoardPage,
  presidents: PresidentsPage,
  brand: BrandPage,
  legal: LegalPage,
  stadium: StadiumPage,
  facility: FacilityPage,
  academy: AcademyPage,
  museum: MuseumPage,
  press: PressPage,
  sponsorship: SponsorshipPage,
  careers: CareersPage,
  default: PremiumPage,
}

/** Slug'a uygun özel şablonu seçer; tanımlı değilse genel premium düzene düşer. */
export default function PageRenderer({ page, related }: { page: SitePage; related?: { slug: string; title: string }[] }) {
  const spec = getSpec(page.slug)
  const Template = TEMPLATES[spec?.template ?? 'default'] ?? PremiumPage
  return <Template page={page} related={related} />
}
