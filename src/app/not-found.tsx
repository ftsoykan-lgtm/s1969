import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f5f9f6] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-1 mb-8">
          <span className="block w-8 h-8 rounded-sm bg-[#1b5e44]" />
          <span className="block w-8 h-8 rounded-sm bg-[#f5c400]" />
          <span className="block w-8 h-8 rounded-sm bg-white border border-[#ddeae2]" />
        </div>
        <h1 className="text-8xl font-black text-[#103f2e] leading-none mb-4">404</h1>
        <p className="text-xl font-black text-[#154836] mb-2">Sayfa Bulunamadı</p>
        <p className="text-sm text-[#356152] mb-8">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
        <Link href="/"
          className="inline-flex items-center gap-2 bg-[#1b5e44] hover:bg-[#103f2e] text-white font-black px-6 py-3 rounded-xl transition-colors text-sm">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}
