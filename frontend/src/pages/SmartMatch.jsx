import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function SmartMatch() {
  const [properties, setProperties] = useState([])
  const [matches, setMatches] = useState([])
  const [searched, setSearched] = useState(false)

  const [preferences, setPreferences] = useState({
    location: '',
    budget: '',
    property_type: '',
    bedrooms: '',
    listing_type: ''
  })

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/properties')
      .then(response => {
        if (!response.ok) throw new Error('Could not load properties')
        return response.json()
      })
      .then(setProperties)
      .catch(error => console.error(error))
  }, [])

  const updatePreference = (key, value) => {
    setPreferences(previous => ({
      ...previous,
      [key]: value
    }))
  }

  const findMatches = (event) => {
    event.preventDefault()

    const results = properties.map(property => {
      let score = 0
      let total = 0

      const checks = [
        {
          selected: preferences.location,
          matches: property.location === preferences.location,
          weight: 25
        },
        {
          selected: preferences.property_type,
          matches: property.property_type === preferences.property_type,
          weight: 20
        },
        {
          selected: preferences.listing_type,
          matches: property.listing_type === preferences.listing_type,
          weight: 20
        },
        {
          selected: preferences.bedrooms,
          matches: property.bedrooms >= Number(preferences.bedrooms),
          weight: 15
        },
        {
          selected: preferences.budget,
          matches: property.price <= Number(preferences.budget),
          weight: 20
        }
      ]

      checks.forEach(check => {
        if (check.selected) {
          total += check.weight
          if (check.matches) score += check.weight
        }
      })

      return {
        ...property,
        matchScore: total ? Math.round((score / total) * 100) : 0
      }
    })

    setMatches(
      results
        .filter(property => property.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
    )

    setSearched(true)
  }

  return (
    <main className="smart-match-page">
      <Link to="/" className="back-link">
        ← Back to properties
      </Link>

      <div className="smart-match-heading">
        <p className="eyebrow">PERSONALISED PROPERTY DISCOVERY</p>
        <h1>Find Your Perfect Match</h1>
        <p>Tell us what you're looking for. We'll find suitable properties.</p>
      </div>

      <form className="match-form" onSubmit={findMatches}>
        <label>
          Preferred city
          <select
            value={preferences.location}
            onChange={e => updatePreference('location', e.target.value)}
          >
            <option value="">Any city</option>
            <option value="Dubai">Dubai</option>
            <option value="Abu Dhabi">Abu Dhabi</option>
            <option value="Sharjah">Sharjah</option>
          </select>
        </label>

        <label>
          Maximum budget (AED)
          <input
            type="number"
            min="1"
            placeholder="e.g. 1500000"
            value={preferences.budget}
            onChange={e => updatePreference('budget', e.target.value)}
          />
        </label>

        <label>
          Property type
          <select
            value={preferences.property_type}
            onChange={e => updatePreference('property_type', e.target.value)}
          >
            <option value="">Any type</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Townhouse">Townhouse</option>
          </select>
        </label>

        <label>
          Minimum bedrooms
          <select
            value={preferences.bedrooms}
            onChange={e => updatePreference('bedrooms', e.target.value)}
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </label>

        <label>
          Listing preference
          <select
            value={preferences.listing_type}
            onChange={e => updatePreference('listing_type', e.target.value)}
          >
            <option value="">Buy or Rent</option>
            <option value="Sale">Buy</option>
            <option value="Rent">Rent</option>
          </select>
        </label>

        <button type="submit" className="match-submit">
          Find My Matches
        </button>
      </form>

      {searched && (
        <section className="match-results">
          <h2>Your Property Matches</h2>

          {matches.length === 0 ? (
            <p>No matching properties found. Try adjusting your preferences.</p>
          ) : (
            <div className="property-grid">
              {matches.map(property => (
                <article className="property-card" key={property.id}>
                  <div className="image-wrapper">
                    <img src={property.image_url} alt={property.title} />
                    <span className="listing-badge">
                      {property.matchScore}% Match
                    </span>
                  </div>

                  <div className="property-info">
                    <p className="location">
                      {property.community}, {property.location}
                    </p>
                    <h3>{property.title}</h3>
                    <p className="price">
                      AED {Number(property.price).toLocaleString('en-AE')}
                    </p>
                    <p>
                      {property.bedrooms} Beds · {property.bathrooms} Baths
                    </p>
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
          )}
        </section>
      )}
    </main>
  )
}

export default SmartMatch