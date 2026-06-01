export type JsonLd = Record<string, unknown>

export function buildHomeJsonLd(baseUrl: string): JsonLd[] {
  const websiteUrl = `${baseUrl}/home`

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Yaatri',
      description: 'Yatra begins within.',
      url: websiteUrl,
      inLanguage: 'en-IN',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Yaatri',
      url: baseUrl,
    },
  ]
}
