import { ShoppingCart, Star } from 'lucide-react'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Mağaza' }

const products = [
  { id: 1, name: 'İç Saha Forması 2026-27', price: 699, oldPrice: 899, category: 'Forma', rating: 4.8, image: 'https://placehold.co/400x480/1A6B3C/FFD100?text=Forma', isNew: true },
  { id: 2, name: 'Deplasman Forması 2026-27', price: 699, oldPrice: null, category: 'Forma', rating: 4.7, image: 'https://placehold.co/400x480/FFD100/1A6B3C?text=Deplasman', isNew: true },
  { id: 3, name: 'Kapüşonlu Sweatshirt', price: 399, oldPrice: 499, category: 'Giyim', rating: 4.5, image: 'https://placehold.co/400x480/0f4a28/ffffff?text=Hoodie', isNew: false },
  { id: 4, name: 'Kulüp Şapkası', price: 149, oldPrice: null, category: 'Aksesuar', rating: 4.6, image: 'https://placehold.co/400x480/092d18/FFD100?text=Şapka', isNew: false },
  { id: 5, name: 'Antrenman Seti', price: 549, oldPrice: 649, category: 'Giyim', rating: 4.4, image: 'https://placehold.co/400x480/1A6B3C/ffffff?text=Antrenman', isNew: false },
  { id: 6, name: 'Kulüp Eşarpı', price: 99, oldPrice: null, category: 'Aksesuar', rating: 4.9, image: 'https://placehold.co/400x480/FFD100/0f4a28?text=Eşarp', isNew: false },
]

export default function MagazaPage() {
  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      <div className="bg-ugreen py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-8 h-0.5 bg-ugold" />
            <p className="text-xs font-black tracking-widest uppercase text-ugold/60">Resmi Ürünler</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Kulüp <span className="text-ugold">Mağazası</span>
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <div key={p.id} className="group bg-white rounded-2xl border border-[#ddeae2] shadow-sm overflow-hidden hover:shadow-lg hover:border-ugreen/30 transition-all hover:-translate-y-1 duration-300">
              <div className="relative h-52 overflow-hidden bg-[#edf7f2]">
                <Image src={p.image} alt={p.name} fill sizes="25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                {p.isNew && (
                  <span className="absolute top-3 left-3 bg-ugold text-ugreenm text-[10px] font-black px-2 py-0.5 rounded-full">YENİ</span>
                )}
                {p.oldPrice && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    %{Math.round((1 - p.price / p.oldPrice) * 100)} İNDİRİM
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-[10px] text-[#7aab8e] font-black uppercase tracking-wide mb-1">{p.category}</p>
                <p className="text-sm font-bold text-ugreenm leading-tight mb-2">{p.name}</p>
                <div className="flex items-center gap-1 mb-3">
                  <Star size={10} fill="#f5c400" className="text-ugold" />
                  <span className="text-[11px] text-utxt2">{p.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black text-ugreenm">₺{p.price}</span>
                    {p.oldPrice && <span className="text-xs text-[#7aab8e] line-through ml-1">₺{p.oldPrice}</span>}
                  </div>
                  <button className="flex items-center gap-1.5 bg-ugreen hover:bg-ugreend text-white text-[11px] font-black px-3 py-2 rounded-xl transition-colors">
                    <ShoppingCart size={12} /> Ekle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
