import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f5f9f6] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-1 mb-8">
          <span className="block w-8 h-8 rounded-sm bg-ugreen" />
          <span className="block w-8 h-8 rounded-sm bg-ugold" />
          <span className="block w-8 h-8 rounded-sm bg-white border border-[#ddeae2]" />
        </div>
        <h1 className="text-8xl font-extrabold text-ugreend leading-none mb-4">404</h1>
        <p className="text-xl font-extrabold text-ugreenm mb-2">Sayfa Bulunamadı</p>
        <p className="text-sm text-utxt2 mb-8">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
        <Link href="/"
          className="inline-flex items-center gap-2 bg-ugreen hover:bg-ugreend text-white font-extrabold px-6 py-3 rounded-xl transition-colors text-sm">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}
