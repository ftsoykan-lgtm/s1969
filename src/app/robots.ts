import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Admin paneli ve API uçları aramaya kapalı
        disallow: ['/admin', '/admin/'],
      },
    ],
  }
}
