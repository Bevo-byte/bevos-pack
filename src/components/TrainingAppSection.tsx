import { ArrowRight, Check } from 'lucide-react'
import lessonScreen from '../assets/training-app-lesson.webp'
import fearFreeScreen from '../assets/training-app-fear-free.webp'

export const trainingAppUrl = 'https://train.bevospack.com/'

const highlights = [
  'Sit and Down lessons are free',
  'Short, illustrated steps you can follow at your own pace',
  'Works on your phone and can be added to your home screen',
]

function TrainingAppSection() {
  return (
    <section className="training-app-section" id="training" aria-labelledby="training-title">
      <div className="training-app-copy">
        <p className="eyebrow"><span /> Train at home</p>
        <h2 id="training-title">Fear-free training,<br /><em>in your pocket.</em></h2>
        <p>Step-by-step lessons for you and your dog, built on kindness and patience, with no scolding or punishment. Start with the free lessons, then unlock more courses whenever you’re ready.</p>
        <ul>
          {highlights.map((item) => <li key={item}><Check size={18} aria-hidden="true" /> {item}</li>)}
        </ul>
        <a className="button button-amber" href={trainingAppUrl}>Try the free lessons <ArrowRight size={17} /></a>
      </div>
      <div className="training-app-screens">
        <img src={fearFreeScreen} width="600" height="1200" alt="The training app’s welcome screen explaining its fear-free approach: reward what your dog gets right, never punish or scold." loading="lazy" />
        <img src={lessonScreen} width="600" height="1200" alt="Step 1 of the free Sit lesson, with four illustrated frames showing how to guide a dog into a sit with a treat." loading="lazy" />
      </div>
    </section>
  )
}

export default TrainingAppSection
