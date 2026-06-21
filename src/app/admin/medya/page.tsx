import { Image as ImageIcon, Upload } from 'lucide-react'

export default function AdminMedyaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-[#092d18]">Medya</h1>

      <div className="bg-white rounded-2xl border-2 border-dashed border-[#ddeae2] p-12 flex flex-col items-center justify-center text-center hover:border-[#1A6B3C]/40 transition-colors cursor-pointer group">
        <div className="h-16 w-16 rounded-2xl bg-[#edf7f2] flex items-center justify-center mb-4 group-hover:bg-[#1A6B3C]/10 transition-colors">
          <Upload size={24} className="text-[#1A6B3C]" />
        </div>
        <p className="font-black text-[#092d18] mb-1">Görsel Yükle</p>
        <p className="text-sm text-[#7aab8e]">PNG, JPG, WEBP — Maks. 5 MB</p>
        <p className="text-xs text-[#3d6b52] mt-3">Supabase Storage entegrasyonu ile görseller burada görünecek.</p>
      </div>

      <div className="bg-[#edf7f2] border border-[#1A6B3C]/20 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <ImageIcon size={16} className="text-[#1A6B3C] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-black text-[#1A6B3C] mb-1">Supabase Storage</p>
            <p className="text-sm text-[#3d6b52]">Medya yükleme özelliği için Supabase Dashboard'dan bir Storage bucket oluşturun. Bucket adı: <code className="bg-white px-1.5 py-0.5 rounded text-xs font-mono text-[#092d18]">media</code></p>
          </div>
        </div>
      </div>
    </div>
  )
}
