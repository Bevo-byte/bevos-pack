import { ArrowDown, ArrowRight, MapPin } from 'lucide-react'

function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-photo" role="img" aria-label="A dog enjoying a sunny afternoon outdoors" />
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="eyebrow hero-eyebrow"><span /> A little fresh air goes a long way</p>
        <h1 id="hero-title">Bevo’s<em> Pack</em></h1>
        <p className="hero-tagline">Walks, Wags, &amp; Best Mates</p>
        <a className="button button-amber" href="#availability">Book a walk <ArrowRight size={17} /></a>
        <p className="hero-note"><MapPin size={14} /> Marin based, built for outdoor adventures</p>
      </div>
      <a className="hero-scroll" href="#services">Get to know us <ArrowDown size={15} /></a>
    </section>
  )
}

export default Hero