import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.skingcosmetics.com'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/admin/',
                '/checkout/',
                '/cart/',
                '/profile/',
                '/api/',
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
