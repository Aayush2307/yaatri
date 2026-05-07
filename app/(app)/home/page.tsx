import HeroSection from '@/components/HeroSection'
import HowMeeraGuides from '@/components/HowMeeraGuides'
import SacredJourneys from '@/components/SacredJourneys'
import MeeraFAB from '@/components/MeeraFAB'

export default function HomePage() {
  return (
    /*
     * Fixed viewport wrapper at z-60 covers the (app) layout's ChatWidget (z-50)
     * and breaks out of the layout's max-width container. overflow-y:auto makes
     * the whole page scrollable as one continuous surface.
     */
    <main
      className="meera-page-bg"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        overflowY: 'auto',
      }}
    >
      <HeroSection />
      <HowMeeraGuides />
      <SacredJourneys />
      <MeeraFAB />
    </main>
  )
}
