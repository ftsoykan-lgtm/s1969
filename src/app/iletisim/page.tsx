import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import type { Metadata } from 'next'
import { getClubInfo } from '@/lib/supabase/club-server'

export const metadata: Metadata = { title: 'İletişim' }

export default async function IletisimPage() {
  const clubInfo = await getClubInfo()
  const contacts = [
    { icon: MapPin, label: 'Adres', value: clubInfo.address, color: 'bg-[#edf7f2] text-[#1A6B3C]' },
    { icon: Phone, label: 'Telefon', value: clubInfo.phone, color: 'bg-[#FFD100]/15 text-[#d4ad00]' },
    { icon: Mail, label: 'E-posta', value: clubInfo.email, color: 'bg-[#edf7f2] text-[#1A6B3C]' },
    { icon: Clock, label: 'Çalışma Saatleri', value: clubInfo.workHours, color: 'bg-[#FFD100]/15 text-[#d4ad00]' },
  ]
  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      <div className="bg-[#1A6B3C] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-8 h-0.5 bg-[#FFD100]" />
            <p className="text-xs font-black tracking-widest uppercase text-[#FFD100]/60">Bize Ulaşın</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            <span className="text-[#FFD100]">İletişim</span>
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h2 className="text-xl font-black text-[#15532f] mb-6">İletişim Bilgileri</h2>
            {contacts.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-start gap-4 bg-white rounded-xl border border-[#ddeae2] shadow-sm p-5 hover:shadow-md hover:border-[#1A6B3C]/30 transition-all">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-xs font-black tracking-widest uppercase text-[#7aab8e] mb-0.5">{label}</p>
                  <p className="text-[#15532f] text-sm font-bold">{value}</p>
                </div>
              </div>
            ))}
            <div className="mt-4 rounded-2xl overflow-hidden border border-[#ddeae2] h-52 bg-[#edf7f2] flex items-center justify-center">
              <div className="text-center">
                <MapPin size={28} className="text-[#1A6B3C] mx-auto mb-2" />
                <p className="text-sm font-bold text-[#15532f]">{clubInfo.stadium}, {clubInfo.city}</p>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
                  className="text-xs text-[#1A6B3C] hover:underline mt-1 inline-block font-semibold">
                  Google Haritalar'da Aç →
                </a>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#15532f] mb-6">Bize Yazın</h2>
            <form className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Ad Soyad', type: 'text', placeholder: 'Adınız Soyadınız' },
                  { label: 'E-posta', type: 'email', placeholder: 'ornek@email.com' },
                ].map(({ label, type, placeholder }) => (
                  <div key={label}>
                    <label className="block text-xs font-black text-[#3d6b52] mb-1.5 uppercase tracking-wide">{label}</label>
                    <input type={type} placeholder={placeholder}
                      className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-2.5 text-sm text-[#15532f] placeholder-[#7aab8e] focus:outline-none focus:border-[#1A6B3C] focus:bg-white transition-all" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-black text-[#3d6b52] mb-1.5 uppercase tracking-wide">Konu</label>
                <select className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-2.5 text-sm text-[#15532f] focus:outline-none focus:border-[#1A6B3C] transition-all">
                  <option value="">Konu seçin</option>
                  <option>Genel Bilgi</option>
                  <option>Basın ve Medya</option>
                  <option>Sponsorluk</option>
                  <option>Bilet ve Üyelik</option>
                  <option>Şikayet / Öneri</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-[#3d6b52] mb-1.5 uppercase tracking-wide">Mesaj</label>
                <textarea rows={5} placeholder="Mesajınızı buraya yazın..."
                  className="w-full bg-[#f5f9f6] border border-[#ddeae2] rounded-xl px-4 py-2.5 text-sm text-[#15532f] placeholder-[#7aab8e] focus:outline-none focus:border-[#1A6B3C] transition-all resize-none" />
              </div>
              <button type="submit"
                className="w-full bg-[#1A6B3C] hover:bg-[#0f4a28] text-white font-black py-3 rounded-xl transition-colors text-sm shadow-sm">
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
