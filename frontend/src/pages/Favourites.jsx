import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Favourites({ favourites, toggleFavourite }) {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/properties')
      .then(response => {
        if (!response.ok) {
          throw new Error('Could not load properties')
        }
        return response.json()
      })
      .then(data => setProperties(data))
      .catch(error => console.error(error))
      .finally(() => setLoading(false))
  }, [])

  const savedProperties = properties.filter(property =>
    favourites.includes(property.id)
  )

  return (
    <main className="favourites-page">
      <Link to="/" className="back-link">
        ← Back to properties
      </Link>

      <h1>My Favourites</h1>
      <p>Your saved properties in one place.</p>

      {loading && <p>Loading your favourites...</p>}

      {!loading && savedProperties.length === 0 && (
        <div className="empty-favourites">
          <h2>No favourites yet</h2>
          <p>Browse properties and tap the heart to save one.</p>
          <Link to="/" className="details-btn">
            Explore Properties
          </Link>
        </div>
      )}

      <div className="property-grid">
        {savedProperties.map(property => (
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
            </div>

            <div className="property-info">
              <p className="location">
                {property.community}, {property.location}
              </p>

              <h3>{property.title}</h3>

              <p className="price">
                AED {new Intl.NumberFormat('en-AE').format(property.price)}
              </p>

              <Link
                to={`/properties/${property.id}`}
                className="details-btn"
              >
                View Details
              </Link>

              <button
                className="remove-favourite"
                onClick={() => toggleFavourite(property.id)}
              >
                Remove from Favourites
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

export default Favourites