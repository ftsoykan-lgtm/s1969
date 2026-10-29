import { clubInfo } from '@/data/club'

/** Sitenin mutlak kök adresi (sitemap, paylaşım linkleri). Sonda "/" yok. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || clubInfo.website || 'https://www.sanliurfaspor.org').replace(/\/+$/, '')
