/** Sayfa slug → URL ve grup etiketleri (server + client ortak). */

/** Bazı sayfaların kendi özel route'u var; gerisi /sayfa/[slug] altında. */
const SPECIAL_HREF: Record<string, string> = {
  tarihce: '/kulup/tarihce',
  'yonetim-kurulu': '/kulup/yonetim',
}

export const pageHref = (slug: string): string => SPECIAL_HREF[slug] ?? `/sayfa/${slug}`

export const GROUP_LABEL: Record<string, string> = {
  kulup: 'Kulüp',
  tesisler: 'Tesisler',
  kurumsal: 'Kurumsal',
  taraftar: 'Taraftar',
  yasal: 'Yasal',
}

export const groupLabel = (group: string): string => GROUP_LABEL[group] ?? 'Şanlıurfaspor'
