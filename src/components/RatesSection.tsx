import { ArrowRight } from 'lucide-react'

function RatesSection() {
  return (
    <section className="rates-section" id="rates" aria-labelledby="rates-title">
      <div className="rates-photo" role="img" aria-label="Dogs taking a walk together in a sunlit field" />
      <div className="rates-copy">
        <p className="eyebrow"><span /> Simple, happy pricing</p>
        <h2 id="rates-title">Good walks,<br /><em>great rates.</em></h2>
        <div className="rate-group">
          <div className="rate-heading"><h3>One-off walks</h3><span>Per walk</span></div>
          <div className="rate-row"><span>30 minutes</span><strong>$35</strong></div>
          <div className="rate-row"><span>60 minutes</span><strong>$60</strong></div>
          <div className="rate-row"><span>Each additional dog <small>30 min</small></span><strong>+$25</strong></div>
          <div className="rate-row"><span>Each additional dog <small>60 min</small></span><strong>+$40</strong></div>
        </div>
        <div className="rate-group recurring">
          <div className="rate-heading"><h3>Month up front</h3><span>Per walk</span></div>
          <div className="rate-row"><span>30 minutes</span><span className="rate-prices"><del>$35</del><strong>$30</strong></span></div>
          <div className="rate-row"><span>60 minutes</span><span className="rate-prices"><del>$60</del><strong>$55</strong></span></div>
        </div>
        <a className="text-link" href="#availability">Find your walk time <ArrowRight size={16} /></a>
      </div>
    </section>
  )
}

export default RatesSection