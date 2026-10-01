import { useState } from 'react'
import AboutSection from './components/AboutSection'
import AvailabilitySection from './components/AvailabilitySection'
import CancellationPolicySection from './components/CancellationPolicySection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import GallerySection from './components/GallerySection'
import Header from './components/Header'
import Hero from './components/Hero'
import IntroBand from './components/IntroBand'
import RatesSection from './components/RatesSection'
import ReviewsSection from './components/ReviewsSection'
import ServicesSection from './components/ServicesSection'
import type { WalkRequest } from './types'
import './App.css'

function Site() {
  const [walkRequest, setWalkRequest] = useState<WalkRequest | null>(null)

  function handleWalkRequest(request: WalkRequest) {
    setWalkRequest(request)
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <IntroBand />
        <ServicesSection />
        <RatesSection />
        <CancellationPolicySection />
        <AboutSection />
        <AvailabilitySection onRequest={handleWalkRequest} />
        <GallerySection />
        <ReviewsSection />
        <ContactSection walkRequest={walkRequest} />
      </main>
      <Footer />
    </>
  )
}

export default Site
