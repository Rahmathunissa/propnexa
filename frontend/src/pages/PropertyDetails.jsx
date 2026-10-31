
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

function PropertyDetails() {
  const { id } = useParams()

  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/properties/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Property not found')
        }
        return response.json()
      })
      .then(data => setProperty(data))
      .catch(() => setError('Unable to find this property.'))
      .finally(() => setLoading(false))
  }, [id])

  const formatPrice = (price, listingType) => {
    const amount = new Intl.NumberFormat('en-AE').format(price)
    return `AED ${amount}${listingType === 'Rent' ? ' / year' : ''}`
  }

  if (loading) {
    return <p className="details-message">Loading property...</p>
  }

  if (error || !property) {
    return (
      <main className="details-container">
        <p className="error">{error || 'Property not found.'}</p>
        <Link to="/" className="back-link">Back to properties</Link>
      </main>
    )
  }

  return (
    <main className="details-container">
      <Link to="/" className="back-link">
        ← Back to properties
      </Link>

      <div className="details-image">
        <img src={property.image_url} alt={property.title}
          onError={event => {
            event.currentTarget.src =
              'https://placehold.co/1200x700?text=Property+Image'
          }}
        />
      </div>

      <section className="details-content">
        <div className="details-main">
          <p className="location">
            {property.community}, {property.location}
          </p>

          <h1>{property.title}</h1>

          <p className="details-price">
            {formatPrice(property.price, property.listing_type)}
          </p>

          <div className="details-features">
            <div><strong>{property.bedrooms}</strong><span>Bedrooms</span></div>
            <div><strong>{property.bathrooms}</strong><span>Bathrooms</span></div>
            <div><strong>{property.area_sqft?.toLocaleString()}</strong><span>Sq. Ft.</span></div>
            <div><strong>{property.property_type}</strong><span>Property type</span></div>
          </div>

          <h2>About this property</h2>
          <p className="description">
            {property.description || 'No description is available.'}
          </p>
        </div>

        <aside className="enquiry-card">
          <h2>Interested in this property?</h2>
          <p>Contact our property team to learn more.</p>
          <a
            className="details-contact"
            href={`mailto:hello@propnexa.com?subject=${encodeURIComponent(
              `Enquiry about ${property.title}`
            )}`}
          >
            Send an enquiry
          </a>
          <p className="enquiry-note">
            Demo enquiry link — configure your own contact email before launch.
          </p>
        </aside>
      </section>
    </main>
  )
}

export default PropertyDetails
