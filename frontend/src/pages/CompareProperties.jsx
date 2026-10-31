import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function CompareProperties({ compareIds, toggleCompare }) {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/properties')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load properties')
        return response.json()
      })
      .then(setProperties)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const selected = properties.filter(property =>
    compareIds.includes(property.id)
  )

  if (loading) return <p>Loading comparison...</p>

  return (
    <main className="compare-page">
      <Link to="/" className="back-link">
        ← Back to properties
      </Link>

      <h1>Compare Properties</h1>
      <p>Compare your selected UAE properties side by side.</p>

      {selected.length === 0 ? (
        <div className="empty-favourites">
          <h2>No properties selected</h2>
          <p>Choose properties from the homepage to compare them.</p>
          <Link to="/" className="details-btn">
            Explore Properties
          </Link>
        </div>
      ) : (
        <>
          <div className="comparison-grid">
            {selected.map(property => (
              <article className="comparison-card" key={property.id}>
                <img
                  src={property.image_url}
                  alt={property.title}
                />

                <h3>{property.title}</h3>

                <button
                  className="remove-favourite"
                  onClick={() => toggleCompare(property.id)}
                >
                  Remove
                </button>
              </article>
            ))}
          </div>

          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <tbody>
                {[
                  ['Price', p => `AED ${Number(p.price).toLocaleString('en-AE')}`],
                  ['Location', p => p.location],
                  ['Community', p => p.community || 'N/A'],
                  ['Property type', p => p.property_type],
                  ['Listing type', p => p.listing_type],
                  ['Bedrooms', p => p.bedrooms],
                  ['Bathrooms', p => p.bathrooms],
                  ['Area', p => `${p.area_sqft} sqft`]
                ].map(([label, getValue]) => (
                  <tr key={label}>
                    <th>{label}</th>
                    {selected.map(property => (
                      <td key={property.id}>
                        {getValue(property)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  )
}

export default CompareProperties