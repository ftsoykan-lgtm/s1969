import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import type { Metadata } from 'next'
import { getClubInfo } from '@/lib/supabase/club-server'

export const metadata: Metadata = { title: 'İletişim' }

export default async function IletisimPage() {
  const clubInfo = await getClubInfo()
  const contacts = [
    { icon: MapPin, label: 'Adres', value: clubInfo.address, color: 'bg-[#edf7f2] text-ugreen' },
    { icon: Phone, label: 'Telefon', value: clubInfo.phone, color: 'bg-ugold/15 text-ugoldd' },
    { icon: Mail, label: 'E-posta', value: clubInfo.email, color: 'bg-[#edf7f2] text-ugreen' },
    { icon: Clock, label: 'Çalışma Saatleri', value: clubInfo.workHours, color: 'bg-ugold/15 text-ugoldd' },
  ]
  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      <div className="page-hero py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-[-0.03em] leading-[0.95]">
            <span className="text-ugold">İletişim</span>
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-ugreenm mb-6">İletişim Bilgileri</h2>
            {contacts.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-start gap-4 bg-white rounded-xl border border-[#ddeae2] shadow-sm p-5 hover:shadow-md hover:border-ugreen/30 transition-all">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-xs font-extrabold tracking-widest uppercase text-[#7aab8e] mb-0.5">{label}</p>
                  <p className="text-ugreenm text-sm font-bold">{value}</p>
                </div>
              </div>
            ))}
            <div className="mt-4 rounded-2xl overflow-hidden border border-[#ddeae2] h-52 bg-[#edf7f2] flex items-center justify-center">
              <div className="text-center">
                <MapPin size={28} className="text-ugreen mx-auto mb-2" />
                <p className="text-sm font-bold text-ugreenm">{clubInfo.stadium}, {clubInfo.city}</p>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
                  className="text-xs text-ugreen hover:underline mt-1 inline-block font-semibold">
                  Google Haritalar'da Aç →
                </a>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-ugreenm mb-6">Bize Yazın</h2>
            <form className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Ad Soyad', type: 'text', placeholder: 'Adınız Soyadınız' },
                  { label: 'E-posta', type: 'email', placeholder: 'ornek@email.com' },
                ].map(({ label, type, placeholder }) => (
                  <div key={label}>
                    <label className="block text-xs font-extrabold text-utxt2 mb-1.5 uppercase tracking-wide">{label}</label>
                    <input type={type} placeholder={placeholder}
                      className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-2.5 text-sm text-ugreenm placeholder-[#7aab8e] focus:outline-none focus:border-ugreen focus:bg-white transition-all" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-extrabold text-utxt2 mb-1.5 uppercase tracking-wide">Konu</label>
                <select className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-2.5 text-sm text-ugreenm focus:outline-none focus:border-ugreen transition-all">
                  <option value="">Konu seçin</option>
                  <option>Genel Bilgi</option>
                  <option>Basın ve Medya</option>
                  <option>Sponsorluk</option>
                  <option>Bilet ve Üyelik</option>
                  <option>Şikayet / Öneri</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-extrabold text-utxt2 mb-1.5 uppercase tracking-wide">Mesaj</label>
                <textarea rows={5} placeholder="Mesajınızı buraya yazın..."
                  className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-2.5 text-sm text-ugreenm placeholder-[#7aab8e] focus:outline-none focus:border-ugreen transition-all resize-none" />
              </div>
              <button type="submit"
                className="w-full bg-ugreen hover:bg-ugreend text-white font-extrabold py-3 rounded-xl transition-colors text-sm shadow-sm">
                Gönder
              </button>
              <p className="text-[11px] text-[#7aab8e] text-center">En geç 2 iş günü içinde yanıtlanır.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
