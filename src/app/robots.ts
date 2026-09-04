import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Yönetim paneli robots.txt'te listelenmez (yolu ifşa etmemek için);
        // panel zaten layout'ta noindex + middleware ile auth korumalı.
      },
    ],
  }
}
