import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f5f9f6] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-1 mb-8">
          <span className="block w-8 h-8 rounded-sm bg-[#1A6B3C]" />
          <span className="block w-8 h-8 rounded-sm bg-[#FFD100]" />
          <span className="block w-8 h-8 rounded-sm bg-white border border-[#ddeae2]" />
        </div>
        <h1 className="text-8xl font-black text-[#0f4a28] leading-none mb-4">404</h1>
        <p className="text-xl font-black text-[#15532f] mb-2">Sayfa Bulunamadı</p>
        <p className="text-sm text-[#3d6b52] mb-8">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
        <Link href="/"
          className="inline-flex items-center gap-2 bg-[#1A6B3C] hover:bg-[#0f4a28] text-white font-black px-6 py-3 rounded-xl transition-colors text-sm">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}
