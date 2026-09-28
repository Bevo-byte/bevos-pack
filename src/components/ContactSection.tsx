import { useState, type SubmitEvent } from 'react'
import { ArrowRight, CalendarDays, Check, PawPrint } from 'lucide-react'
import type { WalkRequest } from '../types'

type ContactSectionProps = {
  walkRequest: WalkRequest | null
}

function ContactSection({ walkRequest }: ContactSectionProps) {
  const [submissionState, setSubmissionState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [communicationPreference, setCommunicationPreference] = useState('Email')
  const [submittedPreference, setSubmittedPreference] = useState('Email')

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    const form = event.currentTarget as HTMLFormElement
    const formData = new FormData(form)
    const communicationPreference = String(formData.get('communication_preference') || 'Email')
    formData.append('access_key', 'f4ddb806-994c-493a-8946-44483ca460f6')
    formData.append(
      'requested_walks',
      walkRequest?.days.map(({ dateLabel, time, durationMinutes }) => `${dateLabel} at ${time} for ${durationMinutes} minutes`).join('; ') || 'No dates selected',
    )

    setSubmissionState('submitting')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })
      const data: { success?: boolean } = await response.json()

      if (!response.ok || !data.success) {
        setSubmissionState('error')
        return
      }

      setSubmittedPreference(communicationPreference)
      form.reset()
      setSubmissionState('success')
    } catch {
      setSubmissionState('error')
    }
  }

  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-side">
        <p className="eyebrow"><span /> Your dog’s next best mate</p>
        <h2 id="contact-title">Let’s go<br /><em>for a walk.</em></h2>
        <p>Tell me a little about your dog and the routine you’re looking for. I’ll be in touch to plan a free meet-and-greet.</p>
        <p className="service-area"><strong>Serving:</strong> Larkspur, Tiburon, Mill Valley, San Rafael, Fairfax, San Anselmo, Kentfield, and Corte Madera.</p>
        <a className="contact-line" href="mailto:bevospack@gmail.com"><PawPrint size={17} /><span>bevospack@gmail.com</span></a>
        {/** <a className="contact-line" href="#top"><Instagram size={17} /><span>@YOUR_INSTAGRAM</span></a> */}
      </div>
      {submissionState === 'success' ? (
          <div className="form-feedback" role="status"><span><Check size={22} /></span><div><h3>Your inquiry is on its way.</h3><p>Thanks for reaching out. I’ll contact you within 48 hours via your preferred method: {submittedPreference}.</p></div></div>
        ) : 
        <>
          {submissionState === 'error' && <div className="form-feedback form-feedback-error" role="alert"><strong>We couldn’t send your inquiry.</strong><p>Your details are still here. Please try again in a moment.</p></div>}
        </>
      }
      {['idle', 'submitting'].includes(submissionState) && (
        <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-heading"><span>Contact Form</span><span>* Required</span></div>
            {walkRequest && <div className="selected-booking" aria-label="Requested walks">
              <div className="selected-booking-heading"><CalendarDays size={16} /><strong>Requested walks</strong></div>
              <ul>{walkRequest.days.map(({ dateLabel, time, durationMinutes }) => <li key={dateLabel}><span>{dateLabel}</span><span>{time} · {durationMinutes} min</span></li>)}</ul>
            </div>}
            <label><span className="field-label">Your name <span className="required-marker" aria-hidden="true">*</span></span><input name="name" type="text" autoComplete="name" placeholder="Name" required /></label>
            <label><span className="field-label">Email address <span className="required-marker" aria-hidden="true">*</span></span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
            <label><span className="field-label">Phone number <span className="optional-label">{communicationPreference === 'Email' ? '(optional)' : '(required for calls or texts)'}</span></span><input name="phone" type="tel" autoComplete="tel" placeholder="(555) 555-5555" required={communicationPreference !== 'Email'} /></label>
            <fieldset className="communication-preference">
              <legend>Preferred communication method <span className="required-marker" aria-hidden="true">*</span></legend>
              <div className="communication-options">
                <label><input type="radio" name="communication_preference" value="Email" checked={communicationPreference === 'Email'} onChange={(event) => setCommunicationPreference(event.currentTarget.value)} required />Email</label>
                <label><input type="radio" name="communication_preference" value="Phone call" checked={communicationPreference === 'Phone call'} onChange={(event) => setCommunicationPreference(event.currentTarget.value)} required />Phone call</label>
                <label><input type="radio" name="communication_preference" value="Text message" checked={communicationPreference === 'Text message'} onChange={(event) => setCommunicationPreference(event.currentTarget.value)} required />Text message</label>
              </div>
            </fieldset>
            <label><span className="field-label">Tell me about your dog <span className="required-marker" aria-hidden="true">*</span></span><textarea name="message" rows={3} placeholder="Their name, routine, and anything else I should know…" required /></label>
            <button className="button button-pine" type="submit" disabled={submissionState === 'submitting'}>{submissionState === 'submitting' ? 'Sending…' : 'Send an inquiry'} <ArrowRight size={17} /></button>
            <p className="form-note">Requested dates and times are preferences; all walks are confirmed personally.</p>
        </form>
       )}
    </section>
  )
}

export default ContactSection