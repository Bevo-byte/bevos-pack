function CancellationPolicySection() {
  return (
    <section className="cancellation-section section" aria-labelledby="cancellation-title">
      <div className="cancellation-heading">
        <p className="eyebrow"><span /> Plans can change</p>
        <h2 id="cancellation-title">Cancellation<br /><em>policy.</em></h2>
      </div>
      <div className="cancellation-terms">
        <div className="cancellation-term">
          <span>More than 24 hours before your walk</span>
          <strong>Full refund</strong>
        </div>
        <div className="cancellation-term">
          <span>24 hours or less before your walk</span>
          <strong>50% cancellation fee</strong>
        </div>
      </div>
    </section>
  )
}

export default CancellationPolicySection