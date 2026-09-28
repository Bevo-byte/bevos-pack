import { ArrowRight, PawPrint, ShieldCheck } from 'lucide-react'
import jasonAndFlynn from '../assets/jasonFlynn.jpg'

function AboutSection() {
  return (
    <section className="about-section section" id="about" aria-labelledby="about-title">
      <div className="about-photo-wrap">
        <div className="about-photo-frame">
          <img src={jasonAndFlynn} alt="Jason and Flynn lying in the grass together" loading="lazy" />
          <div className="photo-caption"><PawPrint size={17} /><span>My best mate<br />and I</span></div>
        </div>
        <p className="about-insured"><ShieldCheck size={20} aria-hidden="true" /><strong>Insured</strong></p>
        <div className="about-training" aria-labelledby="about-training-title">
          <h3 id="about-training-title">Completed training</h3>
          <ul>
            <li><strong>Fear Free Shelter Programs Core Modules</strong><span>Fear Free Shelters</span></li>
            <li><strong>Maddie’s Fund, Customer Service in the Shelter</strong><span>Maddie’s University</span></li>
          </ul>
        </div>
      </div>
      <div className="about-copy">
        <p className="eyebrow"><span /> A familiar face</p>
        <h2 id="about-title">Hi, I’m <em>Jason (Bevo).</em></h2>
        <p>I grew up on a farm in Australia and I'm a lifelong dog lover with a rescue dog of my own. I have shelter volunteer experience in which I've been trained to handle a variety of dog breeds and temperaments. I currently volunteer with large sea mammals (water dogs!).  It would be my pleasure to take care of your dog as I would my own.</p>
        <a className="text-link" href="#contact">Let’s meet <ArrowRight size={16} /></a>
      </div>
    </section>
  )
}

export default AboutSection