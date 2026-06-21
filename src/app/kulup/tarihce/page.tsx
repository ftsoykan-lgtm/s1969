import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kulüp Tarihçesi',
  description: 'Şanlıurfaspor FK\'nın kuruluşundan günümüze uzanan köklü tarihi.',
}

const milestones = [
  { year: '1953', title: 'Kuruluş', desc: 'Şanlıurfaspor Futbol Kulübü, Şanlıurfa\'nın önde gelen sporseverleri tarafından kuruldu.' },
  { year: '1972', title: 'İlk Profesyonel Sezon', desc: 'Kulübümüz profesyonel futbola adım attı ve Bölgesel Amatör Lig\'den Süper Amatör Lig\'e yükseldi.' },
  { year: '1989', title: '2. Lig\'e Yükseliş', desc: 'Tarihi bir başarıyla 2. Futbol Ligi\'ne yükselen kulübümüz büyük coşkuya vesile oldu.' },
  { year: '2004', title: 'GAP Arena\'nın Açılışı', desc: 'Modern tesisler içeren GAP Arena stadyumumuz açıldı ve taraftarlarımıza modern bir ev sahipliği sunulmaya başlandı.' },
  { year: '2015', title: 'Süper Lig Çıkışı', desc: 'Kulübümüz tarihinin en büyük başarısına imza atarak Türkiye Süper Ligi\'nde yer almaya hak kazandı.' },
  { year: '2023', title: 'Şampiyonluk Kupası', desc: 'Bölgesel kategoride şampiyonluk elde eden kulübümüz, milli sahnede büyük ses getirdi.' },
  { year: '2026', title: 'Yeni Bir Dönem', desc: 'Yeni yönetim, modern kadro ve büyüyen altyapı akademisiyle kulübümüz daha parlak bir geleceğe yelken açıyor.' },
]

export default function TarihcePage() {
  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      <div className="bg-[#0f4a28] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-8 h-0.5 bg-[#FFD100]" />
            <p className="text-xs font-black tracking-widest uppercase text-[#FFD100]/60">1953'ten Bugüne</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Kulüp <span className="text-[#FFD100]">Tarihçesi</span>
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 pb-20">
        <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-8 mb-12">
          <p className="text-[#3d6b52] text-lg leading-relaxed">
            <span className="text-[#1A6B3C] font-bold">Şanlıurfaspor Futbol Kulübü</span>, 1953 yılında Harran ovasının kalbinde, Güneydoğu Anadolu'nun en köklü spor kulübü olarak kuruldu. 70 yılı aşkın tarihiyle bölgenin en büyük futbol tutkusunu temsil eden kulübümüz, her dönemde şehrimizin gururu olmaya devam etmektedir.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#1A6B3C] via-[#FFD100]/40 to-[#ddeae2]" />

          <div className="space-y-6">
            {milestones.map((m, i) => (
              <div key={m.year} className="relative pl-16">
                <div className={`absolute left-[18px] -translate-x-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  i % 2 === 0 ? 'border-[#1A6B3C] bg-[#edf7f2]' : 'border-[#FFD100] bg-[#FFD100]/15'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-[#1A6B3C]' : 'bg-[#FFD100]'}`} />
                </div>

                <div className="bg-white rounded-xl border border-[#ddeae2] p-5 hover:border-[#1A6B3C]/30 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-sm font-black ${i % 2 === 0 ? 'text-[#1A6B3C]' : 'text-[#d4ad00]'}`}>{m.year}</span>
                    <h2 className="text-[#092d18] font-bold">{m.title}</h2>
                  </div>
                  <p className="text-[#3d6b52] text-sm leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
