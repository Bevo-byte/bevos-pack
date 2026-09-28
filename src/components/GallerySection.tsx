import beachWalk from '../assets/IMG_7845.jpg'
import shelterDogWalk from '../assets/IMG_5410.jpg'
import happyDog from '../assets/IMG_5432.jpg'
import curiousDog from '../assets/IMG_5434.jpg'

const photos = [
  { src: beachWalk, alt: 'A happy dog enjoying the beach view', caption: 'Exploring new beaches with one of my favs!' },
  { src: shelterDogWalk, alt: 'A husky rolling on its back', caption: 'Shelter dog walks' },
  { src: happyDog, alt: 'A happy dog looking toward the camera with bright eyes', caption: 'Shelter dog walks' },
  { src: curiousDog, alt: 'A curious dog with floppy ears', caption: 'Shelter dog walks' },
]

function GallerySection() {
  return (
    <section className="gallery-section" aria-labelledby="gallery-title">
      <div className="gallery-heading">
        <div><p className="eyebrow"><span /> The pack, out and about</p><h2 id="gallery-title">A few <em>buddy moments.</em></h2></div>
      </div>
      <div className="gallery-grid">
        {photos.map((photo, index) => (
          <figure className={`gallery-photo photo-${index + 1}`} key={photo.src}>
            <img src={photo.src} alt={photo.alt} loading="lazy" />
            <figcaption>{photo.caption || "Out for a little adventure"}<span>0{index + 1}</span></figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export default GallerySection