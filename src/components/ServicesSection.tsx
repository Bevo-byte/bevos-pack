import { ArrowRight, Bone, House, PawPrint } from 'lucide-react'

const services = [
  { title: 'Neighborhood walks', href: '#rates', label: 'See dog walking rates', description: 'We will set out on a leisurely walk through your neighborhood, ensuring your dog gets plenty of exercise and fresh air. Want a more vigorous experience? Happy to accommodate your dog’s energy level and preferences with a run!', icon: PawPrint, iconClass: '' },
  { title: 'Drop in visits in your home', href: '#contact', label: 'Ask about in-home dog sitting', description: 'Work long shifts? I can come by to check on your dog and provide some love and attention. We can also help with feeding and other daily routines to ensure your dog feels comfortable and cared for.', icon: House, iconClass: 'sage' },
  { title: 'Dog training', href: '#training', label: 'Learn about the training app', description: 'We offer on walk training sessions to help your dog learn new commands and improve behavior. Prefer to learn at your own pace? Try our fear-free training app, with free lessons to start.', icon: Bone, iconClass: 'clay' },
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