import { ArrowRight, Bone, House, PawPrint } from 'lucide-react'

const services = [
  { title: 'Neighborhood walks', href: '#rates', label: 'See dog walking rates', description: 'We will set out on a leisurely walk through your neighborhood, ensuring your dog gets plenty of exercise and fresh air. Want a more vigorous walk? Happy to accommodate your dog’s energy level and preferences with a run!', icon: PawPrint, iconClass: '' },
  { title: 'Drop in visits in your home', href: '#contact', label: 'Ask about in-home dog sitting', description: 'Work long shifts? I can come by to check on your dog and provide some love and attention.', icon: House, iconClass: 'sage' },
  { title: 'Dog training', href: '#contact', label: 'Ask about dog training', description: 'Details coming soon...', icon: Bone, iconClass: 'clay' },
]

function ServicesSection() {
  return (
    <section className="section services-section" id="services" aria-labelledby="services-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Walks and more</p>
          <h2 id="services-title">Wags, walks &amp; training.<br /><em>Cozy care at home.</em></h2>
        </div>
      </div>
      <div className="service-list">
        {services.map(({ title, href, label, description, icon: Icon, iconClass }, index) => (
          <article className="service-item" key={title}>
            <span className="service-number">0{index + 1}</span>
            <span className={`service-icon ${iconClass}`}><Icon size={21} /></span>
            <div><h3>{title}</h3><p>{description}</p></div>
            <a href={href} aria-label={label}><ArrowRight size={19} /></a>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ServicesSection