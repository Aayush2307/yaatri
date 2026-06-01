import type { Metadata } from 'next'
import HeroSection from '@/components/HeroSection'
import HowMeeraGuides from '@/components/HowMeeraGuides'
import SacredJourneys from '@/components/SacredJourneys'
import MeeraFAB from '@/components/MeeraFAB'
import { buildHomeJsonLd } from '@/lib/seo/jsonld'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yaatri.vercel.app'

export const metadata: Metadata = {
  title: 'Home | Yaatri',
  description: 'Plan your sacred journey with Meera.',
  alternates: { canonical: '/home' },
  openGraph: {
    title: 'Home | Yaatri',
    description: 'Plan your sacred journey with Meera.',
    url: `${baseUrl}/home`,
    siteName: 'Yaatri',
    type: 'website',
  },
}

export default function HomePage() {
  const jsonLd = buildHomeJsonLd(baseUrl)

  return (
    /*
     * Fixed viewport wrapper at z-60 covers the (app) layout's ChatWidget (z-50)
     * and breaks out of the layout's max-width container. overflow-y:auto makes
     * the whole page scrollable as one continuous surface.
     */
    <main
      className="meera-page-bg z-modal"
      style={{
        position: 'fixed',
        inset: 0,
        overflowY: 'auto',
      }}
    >
      {jsonLd.map((entry, index) => (
        <script
          key={`home-jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}
      <HeroSection />
      <HowMeeraGuides />
      <SacredJourneys />
      <MeeraFAB />
    </main>
  )
}
