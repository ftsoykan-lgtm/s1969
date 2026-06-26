'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, AlertCircle } from 'lucide-react'
import { clubInfo } from '@/data/club'
import type { ClubInfo } from '@/data/club'
import { getSettings, saveSettings } from '@/lib/supabase/settings'
import LogoUpload from '@/components/admin/LogoUpload'

const tabs = ['Kulüp Bilgileri', 'Sosyal Medya', 'İletişim', 'SEO'] as const
type Tab = typeof tabs[number]

const SocialIcon = ({ name }: { name: string }) => {
  const icons: Record<string, string> = {
    Facebook: 'f', X: 'X', Instagram: 'ig', YouTube: '▶', TikTok: '♪'
  }
  return <span className="w-7 h-7 rounded-lg bg-[#0f4a28] text-[#FFD100] text-[11px] font-black flex items-center justify-center shrink-0">{icons[name] ?? name[0]}</span>
}

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-black text-[#3d6b52] mb-1.5 uppercase tracking-wide">{label}</label>
    {children}
    {hint && <p className="text-[11px] text-[#7aab8e] mt-1">{hint}</p>}
  </div>
)

const Input = (p: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...p} className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-2.5 text-sm text-[#15532f] placeholder-[#7aab8e] focus:outline-none focus:border-[#1A6B3C] transition-colors" />
)
const Textarea = (p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...p} className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-2.5 text-sm text-[#15532f] placeholder-[#7aab8e] focus:outline-none focus:border-[#1A6B3C] transition-colors resize-none" />
)

export default function AdminAyarlarPage() {
  const [tab, setTab] = useState<Tab>('Kulüp Bilgileri')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  const [club, setClub] = useState({
    name: clubInfo.name, fullName: clubInfo.fullName, founded: clubInfo.founded,
    nickname: clubInfo.nickname, colors: clubInfo.colors,
    stadium: clubInfo.stadium, capacity: clubInfo.stadiumCapacity, city: clubInfo.city,
    president: clubInfo.president, headCoach: clubInfo.headCoach, logoUrl: clubInfo.logoUrl,
    heroVideo: clubInfo.heroVideo,
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

  // Supabase'den mevcut ayarları yükle
  useEffect(() => {
    getSettings().then((s) => {
      setClub({
        name: s.name, fullName: s.fullName, founded: s.founded, nickname: s.nickname, colors: s.colors,
        stadium: s.stadium, capacity: s.stadiumCapacity, city: s.city,
        president: s.president, headCoach: s.headCoach, logoUrl: s.logoUrl,
        heroVideo: s.heroVideo ?? '',
      })
      setSocial({ ...s.social })
      setHashtag(s.hashtag ?? clubInfo.hashtag)
      setContact({ address: s.address, phone: s.phone, email: s.email, workHours: s.workHours, mapUrl: s.mapEmbedUrl })
      setSeo({ metaTitle: s.seoTitle ?? clubInfo.seoTitle, metaDesc: s.seoDescription ?? clubInfo.seoDescription, keywords: s.seoKeywords ?? clubInfo.seoKeywords })
      setFooterText(s.footerText ?? clubInfo.footerText)
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setErr(null)
    const payload: ClubInfo = {
      ...clubInfo,
      name: club.name, fullName: club.fullName, founded: club.founded, nickname: club.nickname,
      colors: club.colors, stadium: club.stadium, stadiumCapacity: club.capacity, city: club.city,
      president: club.president, headCoach: club.headCoach, logoUrl: club.logoUrl,
      heroVideo: club.heroVideo,
      address: contact.address, phone: contact.phone, email: contact.email,
      workHours: contact.workHours, mapEmbedUrl: contact.mapUrl,
      social: { ...social },
      hashtag,
      seoTitle: seo.metaTitle, seoDescription: seo.metaDesc, seoKeywords: seo.keywords,
      footerText,
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
        <h1 className="text-2xl font-black text-[#15532f]">Site Ayarları</h1>
        <button onClick={handleSave} disabled={saving || loading}
          className={`inline-flex items-center gap-2 font-black px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm disabled:opacity-60 ${saved ? 'bg-[#edf7f2] text-[#1A6B3C]' : 'bg-[#1A6B3C] hover:bg-[#0f4a28] text-white'}`}>
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
            className={`flex-1 py-2 px-3 text-xs font-black rounded-lg transition-all ${tab === t ? 'bg-white text-[#15532f] shadow-sm' : 'text-[#7aab8e] hover:text-[#3d6b52]'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6 space-y-4">
        {tab === 'Kulüp Bilgileri' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Kısa Ad"><Input value={club.name} onChange={e => setClub(p => ({ ...p, name: e.target.value }))} /></Field>
              <Field label="Tam Ad"><Input value={club.fullName} onChange={e => setClub(p => ({ ...p, fullName: e.target.value }))} /></Field>
              <Field label="Kuruluş Yılı"><Input value={club.founded} onChange={e => setClub(p => ({ ...p, founded: e.target.value }))} /></Field>
              <Field label="Şehir"><Input value={club.city} onChange={e => setClub(p => ({ ...p, city: e.target.value }))} /></Field>
              <Field label="Lakap"><Input value={club.nickname} onChange={e => setClub(p => ({ ...p, nickname: e.target.value }))} /></Field>
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
            </div>
            <div className="pt-2 border-t border-[#edf7f2]">
              <Field label="Header Videosu (URL)" hint="MP4 video linki. Boş bırakılırsa üst alanda haber slider gösterilir.">
                <Input value={club.heroVideo} onChange={e => setClub(p => ({ ...p, heroVideo: e.target.value }))}
                  placeholder="https://.../header-video.mp4" />
              </Field>
              {club.heroVideo && (
                <video src={club.heroVideo} muted loop autoPlay playsInline
                  className="mt-3 w-full max-w-md rounded-xl border border-[#ddeae2] aspect-video object-cover" />
              )}
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
            <div className="pt-4 border-t border-[#edf7f2]">
              <Field label="Footer Tanıtım Metni" hint="Footer'da logonun altında görünen kısa kulüp tanıtımı.">
                <Textarea rows={3} value={footerText} onChange={e => setFooterText(e.target.value)} maxLength={240} />
                <p className="text-[11px] text-[#7aab8e] mt-1 text-right">{footerText.length}/240</p>
              </Field>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
