import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    // Turbopack'in dev DISK önbelleğini kapat (varsayılan açık, Next 16).
    // Bu makinede proje OneDrive-senkronlu Desktop'ta ve yolda Türkçe İ + boşluk var;
    // OneDrive/AV, çalışan .next/dev/cache/turbopack/*.sst dosyalarını taşıyıp
    // "Unable to write/open SST file (os error 3)" ile Turbopack'i çökertiyordu.
    // Bellek-içi önbelleğe geçince korupsiyon biter (üretimi/build'i etkilemez).
    turbopackFileSystemCacheForDev: false,
  },
  images: {
    // Optimize edilen görseller uzun süre cache'lensin (logolar/haberler nadiren değişir)
    minimumCacheTTL: 2678400, // 31 gün
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'crawieljtcqetvqywjjx.supabase.co' },
      { protocol: 'https', hostname: 'fys.tff.org' },
    ],
  },
}

export default nextConfig
