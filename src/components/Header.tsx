import { useState } from 'react'
import { ArrowRight, Menu, PawPrint, X } from 'lucide-react'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Bevo’s Pack home">
        <span className="brand-mark"><PawPrint size={19} /></span>
        <span>Bevo’s <b>Pack</b></span>
      </a>
      <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
        <a href="#services" onClick={closeMenu}>Services</a>
        <a href="#rates" onClick={closeMenu}>Rates</a>
        <a href="#about" onClick={closeMenu}>About</a>
        <a href="#reviews" onClick={closeMenu}>Reviews</a>
        <a className="nav-cta" href="#availability" onClick={closeMenu}>Book a walk <ArrowRight size={15} /></a>
      </nav>
    </header>
  )
}

export default Header