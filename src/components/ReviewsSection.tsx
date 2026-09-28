const reviews = [
  {
    title: 'A thoughtful, flexible fit',
    description: 'Jason has a great vibe and has been super calm and thoughtful (and flexible) with my cooky complicated dog. Highly recommend',
    name: 'Leah K',
    serviceType: 'Dog walking',
  },
  {
    title: 'A kind word about dog sitting',
    description: 'Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Donec sed odio dui.',
    name: 'Client name',
    serviceType: 'Dog sitting',
  },
]

function ReviewsSection() {
  return (
    <section className="reviews-section" id="reviews" aria-labelledby="reviews-title">
      <div className="reviews-title">
        <p className="eyebrow"><span /> Notes from the pack</p>
        <h2 id="reviews-title">Kind words,<br /><em>happy tails.</em></h2>
      </div>
      {reviews.map(({ title, description, name, serviceType }, index) => (
        <article className={index === 0 ? 'review-quote' : 'review-quote second-quote'} key={title}>
          <h3 className="review-card-title">{title}</h3>
          <blockquote>“{description}”</blockquote>
          <p><span className={index === 0 ? 'quote-avatar' : 'quote-avatar clay-avatar'} aria-hidden="true">0{index + 1}</span><span><strong>{name}</strong><small>{serviceType}</small></span></p>
        </article>
      ))}
    </section>
  )
}

export default ReviewsSection