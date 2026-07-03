'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, AlertCircle, Check } from 'lucide-react'
import { clubInfo } from '@/data/club'
import type { ClubInfo, FooterConfig } from '@/data/club'
import { getSettings, saveSettings } from '@/lib/supabase/settings'
import LogoUpload from '@/components/admin/LogoUpload'

const tabs = ['Kulüp Bilgileri', 'Sosyal Medya', 'İletişim', 'SEO', 'Footer'] as const
type Tab = typeof tabs[number]

const SocialIcon = ({ name }: { name: string }) => {
  const icons: Record<string, string> = {
    Facebook: 'f', X: 'X', Instagram: 'ig', YouTube: '▶', TikTok: '♪'
  }
  return <span className="w-7 h-7 rounded-lg bg-ugreend text-ugold text-[11px] font-extrabold flex items-center justify-center shrink-0">{icons[name] ?? name[0]}</span>
}

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-extrabold text-utxt2 mb-1.5 uppercase tracking-wide">{label}</label>
    {children}
    {hint && <p className="text-[11px] text-[#7aab8e] mt-1">{hint}</p>}
  </div>
)

const Input = (p: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...p} className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-2.5 text-sm text-ugreenm placeholder-[#7aab8e] focus:outline-none focus:border-ugreen transition-colors" />
)
const Textarea = (p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...p} className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-2.5 text-sm text-ugreenm placeholder-[#7aab8e] focus:outline-none focus:border-ugreen transition-colors resize-none" />
)

export default function AdminAyarlarPage() {
  const [tab, setTab] = useState<Tab>('Kulüp Bilgileri')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  const [club, setClub] = useState({
    name: clubInfo.name, fullName: clubInfo.fullName, founded: clubInfo.founded,
    nickname: clubInfo.nickname, brandTagline: clubInfo.brandTagline, colors: clubInfo.colors,
    stadium: clubInfo.stadium, capacity: clubInfo.stadiumCapacity, city: clubInfo.city,
    president: clubInfo.president, headCoach: clubInfo.headCoach, logoUrl: clubInfo.logoUrl,
    logoSize: clubInfo.logoSize, heroVideo: clubInfo.heroVideo,
  })
  const [social, setSocial] = useState({
    facebook: clubInfo.social.facebook, twitter: clubInfo.social.twitter,
    instagram: clubInfo.social.instagram, youtube: clubInfo.social.youtube, tiktok: clubInfo.social.tiktok,
  })
  const [hashtag, setHashtag] = useState(clubInfo.hashtag)
  const [contact, setContact] = useState({
    address: clubInfo.address, phone: clubInfo.phone, email: clubInfo.email,
    workHours: clubInfo.workHours, mapUrl: clubInfo.mapEmbedUrl,
  })
  const [seo, setSeo] = useState({ metaTitle: clubInfo.seoTitle, metaDesc: clubInfo.seoDescription, keywords: clubInfo.seoKeywords })
  const [footerText, setFooterText] = useState(clubInfo.footerText)
  const [footer, setFooter] = useState<FooterConfig>(clubInfo.footer)
  const [theme, setTheme] = useState<'emerald' | 'classic'>(clubInfo.theme)

  // Supabase'den mevcut ayarları yükle
  useEffect(() => {
    getSettings().then((s) => {
      setClub({
        name: s.name, fullName: s.fullName, founded: s.founded, nickname: s.nickname,
        brandTagline: s.brandTagline ?? clubInfo.brandTagline, colors: s.colors,
        stadium: s.stadium, capacity: s.stadiumCapacity, city: s.city,
        president: s.president, headCoach: s.headCoach, logoUrl: s.logoUrl,
        logoSize: s.logoSize ?? clubInfo.logoSize, heroVideo: s.heroVideo ?? '',
      })
      setSocial({ ...s.social })
      setHashtag(s.hashtag ?? clubInfo.hashtag)
      setContact({ address: s.address, phone: s.phone, email: s.email, workHours: s.workHours, mapUrl: s.mapEmbedUrl })
      setSeo({ metaTitle: s.seoTitle ?? clubInfo.seoTitle, metaDesc: s.seoDescription ?? clubInfo.seoDescription, keywords: s.seoKeywords ?? clubInfo.seoKeywords })
      setFooterText(s.footerText ?? clubInfo.footerText)
      setFooter(s.footer ?? clubInfo.footer)
      setTheme(s.theme === 'classic' ? 'classic' : 'emerald')
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setErr(null)
    const payload: ClubInfo = {
      ...clubInfo,
      name: club.name, fullName: club.fullName, founded: club.founded, nickname: club.nickname,
      brandTagline: club.brandTagline,
      colors: club.colors, stadium: club.stadium, stadiumCapacity: club.capacity, city: club.city,
      president: club.president, headCoach: club.headCoach, logoUrl: club.logoUrl,
      logoSize: club.logoSize, heroVideo: club.heroVideo,
      address: contact.address, phone: contact.phone, email: contact.email,
      workHours: contact.workHours, mapEmbedUrl: contact.mapUrl,
      social: { ...social },
      hashtag,
      seoTitle: seo.metaTitle, seoDescription: seo.metaDesc, seoKeywords: seo.keywords,
      footerText,
      footer,
      theme,
    }
    const res = await saveSettings(payload)
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } else {
      setErr(res.error ?? 'Kaydedilemedi. Supabase tablolarını kurduğunuzdan emin olun.')
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-ugreenm">Site Ayarları</h1>
        <button onClick={handleSave} disabled={saving || loading}
          className={`inline-flex items-center gap-2 font-extrabold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm disabled:opacity-60 ${saved ? 'bg-[#edf7f2] text-ugreen' : 'bg-ugreen hover:bg-ugreend text-white'}`}>
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? 'Kaydediliyor...' : saved ? 'Kaydedildi ✓' : 'Kaydet'}
        </button>
      </div>

      {err && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={15} className="shrink-0" /> {err}
        </div>
      )}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-[#7aab8e]">
          <Loader2 size={14} className="animate-spin" /> Ayarlar yükleniyor...
        </div>
      )}

      {/* Tab bar */}
      <div className="flex gap-1 bg-[#f5f9f6] p-1 rounded-xl border border-[#ddeae2]">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 px-3 text-xs font-extrabold rounded-lg transition-all ${tab === t ? 'bg-white text-ugreenm shadow-sm' : 'text-[#7aab8e] hover:text-utxt2'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6 space-y-4">
        {tab === 'Kulüp Bilgileri' && (
          <>
            {/* Renk teması seçimi */}
            <div className="pb-4 border-b border-[#edf7f2]">
              <label className="block text-xs font-extrabold text-[#356152] mb-2 uppercase tracking-wide">Renk Teması</label>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { key: 'emerald', label: 'Zümrüt (Mevcut)', g: '#1b5e44', gd: '#103f2e', y: '#f5c400' },
                  { key: 'classic', label: 'Klasik (Önceki)', g: '#1A6B3C', gd: '#0f4a28', y: '#FFD100' },
                ] as const).map((t) => (
                  <button key={t.key} type="button" onClick={() => setTheme(t.key)}
                    className={`relative text-left rounded-xl border-2 p-3 transition-all ${theme === t.key ? 'border-[#1b5e44] ring-2 ring-[#1b5e44]/20' : 'border-[#ddeae2] hover:border-[#1b5e44]/40'}`}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="w-7 h-7 rounded-md" style={{ background: t.g }} />
                      <span className="w-7 h-7 rounded-md" style={{ background: t.gd }} />
                      <span className="w-7 h-7 rounded-md" style={{ background: t.y }} />
                    </div>
                    <p className="text-[13px] font-extrabold text-[#154836]">{t.label}</p>
                    {theme === t.key && <span className="absolute top-2 right-2 text-[#1b5e44]"><Check size={16} /></span>}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#7aab8e] mt-2">Kaydedince tüm site seçilen renk paletine geçer.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Kısa Ad"><Input value={club.name} onChange={e => setClub(p => ({ ...p, name: e.target.value }))} /></Field>
              <Field label="Tam Ad"><Input value={club.fullName} onChange={e => setClub(p => ({ ...p, fullName: e.target.value }))} /></Field>
              <Field label="Kuruluş Yılı"><Input value={club.founded} onChange={e => setClub(p => ({ ...p, founded: e.target.value }))} /></Field>
              <Field label="Şehir"><Input value={club.city} onChange={e => setClub(p => ({ ...p, city: e.target.value }))} /></Field>
              <Field label="Lakap"><Input value={club.nickname} onChange={e => setClub(p => ({ ...p, nickname: e.target.value }))} /></Field>
              <Field label="Navbar Alt Başlığı" hint="Kulüp adının altında görünür (örn. Resmi Web Sitesi)"><Input value={club.brandTagline} onChange={e => setClub(p => ({ ...p, brandTagline: e.target.value }))} /></Field>
              <Field label="Renkler"><Input value={club.colors} onChange={e => setClub(p => ({ ...p, colors: e.target.value }))} /></Field>
              <Field label="Stat Adı"><Input value={club.stadium} onChange={e => setClub(p => ({ ...p, stadium: e.target.value }))} /></Field>
              <Field label="Stat Kapasitesi"><Input value={club.capacity} onChange={e => setClub(p => ({ ...p, capacity: e.target.value }))} /></Field>
              <Field label="Başkan" hint="Araştırılıp doğrulanmalı"><Input value={club.president} onChange={e => setClub(p => ({ ...p, president: e.target.value }))} placeholder="Başkan adı" /></Field>
              <Field label="Teknik Direktör" hint="Araştırılıp doğrulanmalı"><Input value={club.headCoach} onChange={e => setClub(p => ({ ...p, headCoach: e.target.value }))} placeholder="Teknik direktör adı" /></Field>
            </div>
            <div className="pt-2 border-t border-[#edf7f2]">
              <LogoUpload
                label="Kulüp Logosu"
                value={club.logoUrl}
                onChange={(url) => setClub(p => ({ ...p, logoUrl: url }))}
                size={256}
                folder="club"
              />

              {/* Logo görünüm boyutu (navbar) */}
              <div className="mt-4">
                <label className="block text-[13px] font-bold text-utxt2 mb-2">
                  Logo Görünüm Boyutu
                  <span className="ml-2 text-[11px] font-semibold text-[#7aab8e]">Navbar&apos;da logonun görüneceği boyut</span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range" min={40} max={150} step={2}
                    value={club.logoSize}
                    onChange={(e) => setClub(p => ({ ...p, logoSize: Number(e.target.value) }))}
                    className="flex-1 accent-ugreen"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <input
                      type="number" min={40} max={150}
                      value={club.logoSize}
                      onChange={(e) => setClub(p => ({ ...p, logoSize: Math.max(40, Math.min(150, Number(e.target.value) || 72)) }))}
                      className="w-16 bg-[#f5f9f6] border border-[#ddeae2] rounded-lg px-2 py-1.5 text-sm text-ugreenm text-center focus:outline-none focus:border-ugreen"
                    />
                    <span className="text-[12px] text-[#7aab8e]">px</span>
                  </div>
                </div>
                {/* Canlı önizleme */}
                <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#f5f9f6] border border-[#e3efe8] p-3">
                  <div className="rounded-full bg-ugreenm p-2 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={club.logoUrl}
                      alt="logo önizleme"
                      style={{ height: club.logoSize, width: club.logoSize }}
                      className="rounded-full object-contain bg-white ring-2 ring-ugold/50"
                    />
                  </div>
                  <p className="text-[12px] text-[#7aab8e]">Önizleme — kaydettikten sonra sitede bu boyutta görünür.</p>
                </div>
              </div>
            </div>
          </>
        )}

        {tab === 'Sosyal Medya' && (
          <div className="space-y-3">
            {[
              { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/sanliurfaspor' },
              { key: 'twitter', label: 'X (Twitter)', placeholder: 'https://x.com/sanliurfaspor' },
              { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/sanliurfaspor' },
              { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@sanliurfaspor' },
              { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@sanliurfaspor' },
            ].map(({ key, label, placeholder }) => (
              <Field key={key} label={label}>
                <div className="flex items-center gap-2">
                  <SocialIcon name={label.split(' ')[0]} />
                  <Input value={social[key as keyof typeof social]} onChange={e => setSocial(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} />
                </div>
              </Field>
            ))}
            <div className="pt-3 border-t border-[#edf7f2]">
              <Field label="Hashtag" hint="Sosyal medya bölümünün altında gösterilir">
                <Input value={hashtag} onChange={e => setHashtag(e.target.value)} placeholder="#Şanlıurfaspor" />
              </Field>
            </div>
          </div>
        )}

        {tab === 'İletişim' && (
          <div className="space-y-4">
            <Field label="Adres"><Textarea rows={2} value={contact.address} onChange={e => setContact(p => ({ ...p, address: e.target.value }))} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Telefon"><Input value={contact.phone} onChange={e => setContact(p => ({ ...p, phone: e.target.value }))} /></Field>
              <Field label="E-posta"><Input value={contact.email} onChange={e => setContact(p => ({ ...p, email: e.target.value }))} /></Field>
            </div>
            <Field label="Çalışma Saatleri"><Input value={contact.workHours} onChange={e => setContact(p => ({ ...p, workHours: e.target.value }))} /></Field>
            <Field label="Google Harita Embed URL" hint="Google Maps → Paylaş → Haritayı göm → URL">
              <Input value={contact.mapUrl} onChange={e => setContact(p => ({ ...p, mapUrl: e.target.value }))} placeholder="https://www.google.com/maps/embed?pb=..." />
            </Field>
          </div>
        )}

        {tab === 'SEO' && (
          <div className="space-y-4">
            <Field label="Meta Başlık" hint="Tarayıcı sekmesinde görünen başlık. Max 60 karakter.">
              <Input value={seo.metaTitle} onChange={e => setSeo(p => ({ ...p, metaTitle: e.target.value }))} maxLength={60} />
              <p className="text-[11px] text-[#7aab8e] mt-1 text-right">{seo.metaTitle.length}/60</p>
            </Field>
            <Field label="Meta Açıklama" hint="Arama motorlarında görünen kısa açıklama. Max 160 karakter.">
              <Textarea rows={3} value={seo.metaDesc} onChange={e => setSeo(p => ({ ...p, metaDesc: e.target.value }))} maxLength={160} />
              <p className="text-[11px] text-[#7aab8e] mt-1 text-right">{seo.metaDesc.length}/160</p>
            </Field>
            <Field label="Anahtar Kelimeler" hint="Virgülle ayırın">
              <Input value={seo.keywords} onChange={e => setSeo(p => ({ ...p, keywords: e.target.value }))} />
            </Field>
          </div>
        )}

        {tab === 'Footer' && (
          <div className="space-y-6">
            {/* Tanıtım metni */}
            <Field label="Tanıtım Metni" hint="Footer'da logonun altında görünen kısa kulüp tanıtımı.">
              <Textarea rows={3} value={footerText} onChange={e => setFooterText(e.target.value)} maxLength={240} />
              <p className="text-[11px] text-[#7aab8e] mt-1 text-right">{footerText.length}/240</p>
            </Field>

            {/* Bülten */}
            <div className="pt-4 border-t border-[#edf7f2] space-y-3">
              <p className="text-xs font-extrabold text-ugreenm uppercase tracking-wide">Bülten Bloğu</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Üst Etiket"><Input value={footer.newsletterKicker} onChange={e => setFooter(p => ({ ...p, newsletterKicker: e.target.value }))} /></Field>
                <Field label="Başlık"><Input value={footer.newsletterTitle} onChange={e => setFooter(p => ({ ...p, newsletterTitle: e.target.value }))} /></Field>
                <Field label="Buton Metni"><Input value={footer.newsletterButton} onChange={e => setFooter(p => ({ ...p, newsletterButton: e.target.value }))} /></Field>
                <Field label="E-posta Placeholder"><Input value={footer.newsletterPlaceholder} onChange={e => setFooter(p => ({ ...p, newsletterPlaceholder: e.target.value }))} /></Field>
              </div>
            </div>

            {/* Link Kolonları */}
            <div className="pt-4 border-t border-[#edf7f2] space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-extrabold text-ugreenm uppercase tracking-wide">Link Kolonları</p>
                <button type="button" onClick={() => setFooter(p => ({ ...p, columns: [...p.columns, { title: 'Yeni Kolon', links: [] }] }))}
                  className="text-[11px] font-extrabold text-ugreen hover:underline">+ Kolon Ekle</button>
              </div>
              {footer.columns.map((col, ci) => (
                <div key={ci} className="bg-[#f5f9f6] border border-[#ddeae2] rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Input value={col.title} placeholder="Kolon başlığı"
                      onChange={e => setFooter(p => { const c = [...p.columns]; c[ci] = { ...c[ci], title: e.target.value }; return { ...p, columns: c } })} />
                    <button type="button" onClick={() => setFooter(p => ({ ...p, columns: p.columns.filter((_, i) => i !== ci) }))}
                      className="shrink-0 text-[11px] font-extrabold text-red-600 hover:underline px-2">Sil</button>
                  </div>
                  {col.links.map((lnk, li) => (
                    <div key={li} className="flex items-center gap-2 pl-3">
                      <Input value={lnk.label} placeholder="Etiket"
                        onChange={e => setFooter(p => { const c = [...p.columns]; const ls = [...c[ci].links]; ls[li] = { ...ls[li], label: e.target.value }; c[ci] = { ...c[ci], links: ls }; return { ...p, columns: c } })} />
                      <Input value={lnk.href} placeholder="/link"
                        onChange={e => setFooter(p => { const c = [...p.columns]; const ls = [...c[ci].links]; ls[li] = { ...ls[li], href: e.target.value }; c[ci] = { ...c[ci], links: ls }; return { ...p, columns: c } })} />
                      <button type="button" onClick={() => setFooter(p => { const c = [...p.columns]; c[ci] = { ...c[ci], links: c[ci].links.filter((_, i) => i !== li) }; return { ...p, columns: c } })}
                        className="shrink-0 text-[#7aab8e] hover:text-red-600 px-1 text-lg leading-none">×</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setFooter(p => { const c = [...p.columns]; c[ci] = { ...c[ci], links: [...c[ci].links, { label: '', href: '' }] }; return { ...p, columns: c } })}
                    className="ml-3 text-[11px] font-bold text-ugreen hover:underline">+ Link ekle</button>
                </div>
              ))}
            </div>

            {/* Yasal Linkler + Telif */}
            <div className="pt-4 border-t border-[#edf7f2] space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-extrabold text-ugreenm uppercase tracking-wide">Alt Bar — Yasal Linkler</p>
                <button type="button" onClick={() => setFooter(p => ({ ...p, legalLinks: [...p.legalLinks, { label: '', href: '' }] }))}
                  className="text-[11px] font-extrabold text-ugreen hover:underline">+ Link Ekle</button>
              </div>
              {footer.legalLinks.map((lnk, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input value={lnk.label} placeholder="Etiket"
                    onChange={e => setFooter(p => { const l = [...p.legalLinks]; l[i] = { ...l[i], label: e.target.value }; return { ...p, legalLinks: l } })} />
                  <Input value={lnk.href} placeholder="/sayfa/gizlilik"
                    onChange={e => setFooter(p => { const l = [...p.legalLinks]; l[i] = { ...l[i], href: e.target.value }; return { ...p, legalLinks: l } })} />
                  <button type="button" onClick={() => setFooter(p => ({ ...p, legalLinks: p.legalLinks.filter((_, x) => x !== i) }))}
                    className="shrink-0 text-[#7aab8e] hover:text-red-600 px-1 text-lg leading-none">×</button>
                </div>
              ))}
              <Field label="Telif Metni" hint="{year} → yıl, {name} → kulüp adı otomatik dolar.">
                <Input value={footer.copyright} onChange={e => setFooter(p => ({ ...p, copyright: e.target.value }))} />
              </Field>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
