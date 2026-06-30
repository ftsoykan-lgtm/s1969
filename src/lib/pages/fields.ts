/**
 * Şema-güdümlü sayfa CMS — alan tanımları.
 * Her sayfa tipi bir alan listesi bildirir; tek admin editörü bu listeye göre
 * uygun form girdilerini üretir. Şablonlar aynı veriyi okuyup özel düzende basar.
 */

export type FieldType = 'text' | 'textarea' | 'image' | 'color'

/** Liste öğesi içindeki basit alan */
export interface SubField {
  key: string
  label: string
  type: FieldType
  placeholder?: string
}

/** Üst düzey alan: basit alan veya tekrarlanabilir liste */
export type Field =
  | { key: string; label: string; type: FieldType; placeholder?: string }
  | { key: string; label: string; type: 'list'; item: SubField[]; addLabel?: string; itemLabel?: string }

export type TemplateKey =
  | 'timeline'
  | 'board'
  | 'presidents'
  | 'brand'
  | 'legal'
  | 'stadium'
  | 'facility'
  | 'academy'
  | 'museum'
  | 'press'
  | 'sponsorship'
  | 'careers'
  | 'default'

export interface PageSpec {
  template: TemplateKey
  /** Yapılandırılmış (data jsonb) alanları — admin editörü bunları render eder */
  fields: Field[]
  /** Kod-içi varsayılan içerik (DB boşsa bile sayfa dolu görünür) */
  defaults: Record<string, unknown>
}
