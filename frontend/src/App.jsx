
import { useEffect, useState } from 'react'
import './index.css'

function App() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/properties')
      .then(response => {
        if (!response.ok) {
          throw new Error('Unable to load properties')
        }
        return response.json()
      })
      .then(data => {
        setProperties(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not connect to the property database.')
        setLoading(false)
      })
  }, [])

  const formatPrice = (price, listingType) => {
    const formatted = new Intl.NumberFormat('en-AE').format(price)
    return `AED ${formatted}${listingType === 'Rent' ? ' / year' : ''}`
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">Prop<span>Nexa</span></div>
        <nav>
          <a href="#home">Home</a>
          <a href="#properties">Properties</a>
          <a href="#about">About</a>
        </nav>
        <button className="contact-btn">Contact Us</button>
      </header>

      <section className="hero" id="home">
        <div className="hero-content">
          <p className="eyebrow">YOUR UAE PROPERTY PARTNER</p>
          <h1>Find a place<br />you'll love to call home.</h1>
          <p>
            Discover apartments, villas and townhouses
            across the UAE.
          </p>
          <a href="#properties" className="hero-btn">
            Explore Properties
          </a>
        </div>
      </section>

      <main className="properties-section" id="properties">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EXPLORE YOUR OPTIONS</p>
            <h2>Featured Properties</h2>
            <p>Discover homes across the UAE.</p>
          </div>
          <span className="listing-count">
            {properties.length} Listings
          </span>
        </div>

        {loading && <p className="message">Loading properties...</p>}

        {error && <p className="error">{error}</p>}

        {!loading && !error && properties.length === 0 && (
          <p className="message">No properties available yet.</p>
        )}

        <div className="property-grid">
          {properties.map(property => (
            <article className="property-card" key={property.id}>
              <div className="image-wrapper">
                <img
                  src={property.image_url}
                  alt={property.title}
                  onError={event => {
                    event.currentTarget.src =
                      'https://placehold.co/600x400?text=Property+Image'
                  }}
                />
                <span className="listing-badge">
                  For {property.listing_type}
                </span>
              </div>

              <div className="property-info">
                <p className="location">
                  {property.community}, {property.location}
                </p>

                <h3>{property.title}</h3>

                <p className="price">
                  {formatPrice(property.price, property.listing_type)}
                </p>

                <div className="property-features">
                  <span>🛏 {property.bedrooms} Beds</span>
                  <span>🛁 {property.bathrooms} Baths</span>
                  <span>📐 {property.area_sqft} sqft</span>
                </div>

                <button className="details-btn">
                  View Details
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer id="about">
        <h2>PropNexa</h2>
        <p>Find Smarter. Live Better.</p>
        <p>Smart Property Discovery Platform – UAE</p>
      </footer>
    </div>
  )
}

export default App
