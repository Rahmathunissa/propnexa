
import { useEffect, useState } from 'react'
import './index.css'
import { Link, Routes, Route } from 'react-router-dom'
import PropertyDetails from './pages/PropertyDetails.jsx'
import Favourites from './pages/Favourites.jsx'


function Home({ favourites, toggleFavourite }) {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    property_type: '',
    listing_type: '',
    sort: 'default'
  })

  useEffect(() => {
    const controller = new AbortController()

    async function loadProperties() {
      setLoading(true)
      setError('')

      const params = new URLSearchParams()

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'default') {
          params.set(key, value)
        }
      })

      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/properties?${params}`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error('Unable to load properties')
        }

        const data = await response.json()
        setProperties(data)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Could not load properties. Check your backend.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadProperties()

    return () => controller.abort()
  }, [filters])

  const updateFilter = (key, value) => {
    setFilters(previous => ({
      ...previous,
      [key]: value
    }))
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      location: '',
      property_type: '',
      listing_type: '',
      sort: 'default'
    })
  }

  const formatPrice = (price, listingType) => {
    const amount = new Intl.NumberFormat('en-AE').format(price)
    return `AED ${amount}${listingType === 'Rent' ? ' / year' : ''}`
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">Prop<span>Nexa</span></div>

        <nav>
  <a href="#home">Home</a>
  <a href="#properties">Properties</a>
  <Link to="/favourites">
    Favourites ({favourites.length})
  </Link>
  <a href="#about">About</a>
</nav>

        <a href="mailto:hello@propnexa.com" className="contact-btn">
          Contact Us
        </a>
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
            <h2>Find Your Property</h2>
            <p>Search and discover homes across the UAE.</p>
          </div>
        </div>

        <section className="filter-panel">
          <input
            type="search"
            placeholder="Search property or community..."
            value={filters.search}
            onChange={e => updateFilter('search', e.target.value)}
          />

          <select
            value={filters.location}
            onChange={e => updateFilter('location', e.target.value)}
          >
            <option value="">All Cities</option>
            <option value="Dubai">Dubai</option>
            <option value="Abu Dhabi">Abu Dhabi</option>
            <option value="Sharjah">Sharjah</option>
          </select>

          <select
            value={filters.property_type}
            onChange={e => updateFilter('property_type', e.target.value)}
          >
            <option value="">All Property Types</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Townhouse">Townhouse</option>
          </select>

          <select
            value={filters.listing_type}
            onChange={e => updateFilter('listing_type', e.target.value)}
          >
            <option value="">Buy or Rent</option>
            <option value="Sale">Buy</option>
            <option value="Rent">Rent</option>
          </select>

          <select
            value={filters.sort}
            onChange={e => updateFilter('sort', e.target.value)}
          >
            <option value="default">Sort By</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>

          <button className="reset-btn" onClick={resetFilters}>
            Reset
          </button>
        </section>

        <div className="results-heading">
          <h3>Available Properties</h3>
          <span>{properties.length} results</span>
        </div>

        {loading && <p className="message">Finding properties...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && properties.length === 0 && (
          <p className="message">No matching properties found.</p>
        )}

        <div className="property-grid">
          {properties.map(property => (
            <article className="property-card" key={property.id}>
              <div className="image-wrapper">
                <button
  className={`favourite-btn ${
    favourites.includes(property.id) ? 'saved' : ''
  }`}
  onClick={() => toggleFavourite(property.id)}
  aria-label={
    favourites.includes(property.id)
      ? 'Remove from favourites'
      : 'Add to favourites'
  }
>
  {favourites.includes(property.id) ? '♥' : '♡'}
</button>
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

                <Link
  to={`/properties/${property.id}`}
  className="details-btn"
>
  View Details
</Link>
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

function App() {
  const [favourites, setFavourites] = useState(() => {
    return JSON.parse(localStorage.getItem('propnexa-favourites') || '[]')
  })

  useEffect(() => {
    localStorage.setItem(
      'propnexa-favourites',
      JSON.stringify(favourites)
    )
  }, [favourites])

  const toggleFavourite = (propertyId) => {
    setFavourites(previous => {
      if (previous.includes(propertyId)) {
        return previous.filter(id => id !== propertyId)
      }

      return [...previous, propertyId]
    })
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            favourites={favourites}
            toggleFavourite={toggleFavourite}
          />
        }
      />

      <Route
        path="/properties/:id"
        element={<PropertyDetails />}
      />

      <Route
        path="/favourites"
        element={<Favourites favourites={favourites} toggleFavourite={toggleFavourite} />}
      />
    </Routes>
  )
}

export default App

