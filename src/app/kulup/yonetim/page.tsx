import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Yönetim Kurulu' }

const board = [
  { role: 'Başkan', name: 'Ahmet Yılmaz', since: '2021', image: 'https://placehold.co/200x200/0f4a28/FFD100?text=AY' },
  { role: 'Başkan Yardımcısı', name: 'Mehmet Kaya', since: '2021', image: 'https://placehold.co/200x200/1A6B3C/ffffff?text=MK' },
  { role: 'Genel Sekreter', name: 'Fatma Demir', since: '2023', image: 'https://placehold.co/200x200/0f4a28/FFD100?text=FD' },
  { role: 'Mali İşler', name: 'Ali Çelik', since: '2021', image: 'https://placehold.co/200x200/1A6B3C/ffffff?text=AÇ' },
  { role: 'Teknik Direktör', name: 'Hasan Öztürk', since: '2024', image: 'https://placehold.co/200x200/0f4a28/FFD100?text=HÖ' },
  { role: 'Sportif Direktör', name: 'Kemal Arslan', since: '2022', image: 'https://placehold.co/200x200/1A6B3C/ffffff?text=KA' },
]

export default function YonetimPage() {
  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      <div className="bg-[#0f4a28] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-8 h-0.5 bg-[#FFD100]" />
            <p className="text-xs font-black tracking-widest uppercase text-[#FFD100]/60">Kulüp Yönetimi</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Yönetim <span className="text-[#FFD100]">Kurulu</span>
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {board.map((member, i) => (
            <div key={member.name} className={`bg-white rounded-2xl border shadow-sm p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 duration-300 ${
              i === 0 ? 'border-[#FFD100]/60 sm:col-span-3' : 'border-[#ddeae2]'
            }`}>
              {i === 0 ? (
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden shrink-0">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <span className="inline-block bg-[#FFD100] text-[#092d18] text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wide mb-2">{member.role}</span>
                    <h2 className="text-2xl font-black text-[#092d18]">{member.name}</h2>
                    <p className="text-sm text-[#3d6b52] mt-1">{member.since} yılından bu yana görevde</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-xl overflow-hidden mx-auto mb-4">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="inline-block bg-[#edf7f2] text-[#1A6B3C] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide mb-2">{member.role}</span>
                  <h2 className="text-base font-black text-[#092d18]">{member.name}</h2>
                  <p className="text-xs text-[#7aab8e] mt-1">{member.since}'dan beri</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
