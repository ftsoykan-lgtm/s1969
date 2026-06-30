import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
