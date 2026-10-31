
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API = 'http://127.0.0.1:5000/api/admin/properties'

const emptyForm = {
  title: '',
  description: '',
  location: 'Abu Dhabi',
  community: '',
  price: '',
  bedrooms: 1,
  bathrooms: 1,
  property_type: 'Apartment',
  area_sqft: '',
  listing_type: 'Sale',
  image_url: ''
}

function AdminDashboard() {
  const [properties, setProperties] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const loadProperties = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/properties')
      if (!response.ok) throw new Error('Could not load properties')
      setProperties(await response.json())
    } catch {
      setMessage('Unable to load properties. Check Flask.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProperties()
  }, [])

  const updateForm = (event) => {
    const { name, value } = event.target
    setForm(previous => ({ ...previous, [name]: value }))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const saveProperty = async (event) => {
    event.preventDefault()
    setMessage('')

    try {
      const response = await fetch(
        editingId ? `${API}/${editingId}` : API,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
            bedrooms: Number(form.bedrooms),
            bathrooms: Number(form.bathrooms),
            area_sqft: Number(form.area_sqft)
          })
        }
      )

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not save property')

      setMessage(data.message)
      resetForm()
      await loadProperties()
    } catch (error) {
      setMessage(error.message)
    }
  }

  const editProperty = (property) => {
    setEditingId(property.id)
    setForm({
      ...property,
      price: String(property.price),
      bedrooms: String(property.bedrooms),
      bathrooms: String(property.bathrooms),
      area_sqft: String(property.area_sqft || '')
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return
    }

    try {
      const response = await fetch(`${API}/${id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not delete property')

      setMessage(data.message)
      await loadProperties()
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <main className="admin-page">
      <Link to="/" className="back-link">← Back to website</Link>

      <header className="admin-heading">
        <div>
          <p className="eyebrow">PROPNEXA MANAGEMENT</p>
          <h1>Admin Dashboard</h1>
          <p>Manage your property listings.</p>
        </div>
        <div className="admin-stat">
          <span>Total properties</span>
          <strong>{properties.length}</strong>
        </div>
      </header>

      {message && <p className="admin-message">{message}</p>}

      <section className="admin-form-section">
        <h2>{editingId ? 'Edit Property' : 'Add New Property'}</h2>

        <form className="admin-form" onSubmit={saveProperty}>
          <label>
            Property title
            <input name="title" value={form.title}
              onChange={updateForm} required />
          </label>

          <label>
            City
            <select name="location" value={form.location}
              onChange={updateForm}>
              <option>Abu Dhabi</option>
              <option>Dubai</option>
              <option>Sharjah</option>
            </select>
          </label>

          <label>
            Community
            <input name="community" value={form.community}
              onChange={updateForm} />
          </label>

          <label>
            Price (AED)
            <input name="price" type="number" min="1"
              value={form.price} onChange={updateForm} required />
          </label>

          <label>
            Property type
            <select name="property_type" value={form.property_type}
              onChange={updateForm}>
              <option>Apartment</option>
              <option>Villa</option>
              <option>Townhouse</option>
            </select>
          </label>

          <label>
            Listing type
            <select name="listing_type" value={form.listing_type}
              onChange={updateForm}>
              <option value="Sale">Sale</option>
              <option value="Rent">Rent</option>
            </select>
          </label>

          <label>
            Bedrooms
            <input name="bedrooms" type="number" min="0"
              value={form.bedrooms} onChange={updateForm} />
          </label>

          <label>
            Bathrooms
            <input name="bathrooms" type="number" min="0"
              value={form.bathrooms} onChange={updateForm} />
          </label>

          <label>
            Area (sqft)
            <input name="area_sqft" type="number" min="0"
              value={form.area_sqft} onChange={updateForm} />
          </label>

          <label>
            Property image URL
            <input name="image_url" type="url"
              value={form.image_url} onChange={updateForm} />
          </label>

          <label className="admin-description">
            Description
            <textarea name="description" rows="4"
              value={form.description} onChange={updateForm} />
          </label>

          <div className="admin-form-actions">
            <button type="submit" className="admin-save-btn">
              {editingId ? 'Update Property' : 'Add Property'}
            </button>

            {editingId && (
              <button type="button" className="admin-cancel-btn"
                onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-list-section">
        <h2>Manage Listings</h2>

        {loading ? <p>Loading listings...</p> : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Location</th>
                  <th>Price (AED)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(property => (
                  <tr key={property.id}>
                    <td>{property.title}</td>
                    <td>{property.location}</td>
                    <td>{Number(property.price).toLocaleString('en-AE')}</td>
                    <td>
                      <button onClick={() => editProperty(property)}>
                        Edit
                      </button>
                      <button onClick={() => deleteProperty(property.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

export default AdminDashboard
