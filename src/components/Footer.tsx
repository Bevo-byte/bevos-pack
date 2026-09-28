import { ArrowDown, PawPrint } from 'lucide-react'

function Footer() {
  return (
    <footer className="site-footer">
      <a className="wordmark" href="#top"><span className="brand-mark"><PawPrint size={19} /></span><span>Bevo’s <b>Pack</b></span></a>
      <p>Walks, Wags, &amp; Best Mates</p>
      <a className="back-to-top" href="#top">Back to top <ArrowDown size={15} /></a>
      <small>© {new Date().getFullYear()} Bevo’s Pack. Made for the love of dogs.</small>
    </footer>
  )
}

export default Footer