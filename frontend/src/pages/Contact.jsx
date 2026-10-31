
import { useState } from 'react'
import './Contact.css'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Property enquiry',
    message: ''
  })

  const [submitted, setSubmitted] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    setSubmitted(false)
  }

  function handleSubmit(event) {
    event.preventDefault()

    // Frontend demonstration only: no email is sent yet.
    setSubmitted(true)

    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'Property enquiry',
      message: ''
    })
  }

  return (
    <main className="contact-page">

      <section className="contact-hero">
        <div>
          <span className="contact-eyebrow">WE'RE HERE TO HELP</span>
          <h1>Let's find your place in the world.</h1>
          <p>
            Have a question about a property, need help finding your
            next home, or want to work with us? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="contact-content">

        <div className="contact-form-section">
          <span className="contact-eyebrow">GET IN TOUCH</span>
          <h2>Send us a message</h2>
          <p className="contact-description">
            Fill in the form and tell us how we can help.
          </p>

          {submitted && (
            <div className="contact-success" role="status">
              Thank you! Your message has been recorded in this demo.
              Email delivery will be added later.
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">

            <div className="contact-field">
              <label htmlFor="contact-name">Full name</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="contact-field">
              <label htmlFor="contact-email">Email address</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="contact-field">
              <label htmlFor="contact-phone">Phone number</label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                placeholder="+971 ..."
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="contact-field">
              <label htmlFor="contact-subject">Subject</label>
              <select
                id="contact-subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              >
                <option>Property enquiry</option>
                <option>Buying a property</option>
                <option>Renting a property</option>
                <option>Selling a property</option>
                <option>Partnership enquiry</option>
                <option>General question</option>
              </select>
            </div>

            <div className="contact-field">
              <label htmlFor="contact-message">Your message</label>
              <textarea
                id="contact-message"
                name="message"
                rows="5"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="contact-submit">
              Send message <span>→</span>
            </button>

          </form>
        </div>

        <aside className="contact-info-section">
          <span className="contact-eyebrow">CONTACT DETAILS</span>
          <h2>We're just a message away.</h2>
          <p>
            Connect with the PropNexa team for property enquiries
            and assistance.
          </p>

          <div className="contact-info-item">
            <div className="contact-info-icon">✉</div>
            <div>
              <h3>Email</h3>
              <p>Replace with your official email</p>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-info-icon">☎</div>
            <div>
              <h3>Phone</h3>
              <p>Replace with your official phone number</p>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-info-icon">⌖</div>
            <div>
              <h3>Location</h3>
              <p>United Arab Emirates</p>
            </div>
          </div>

          <div className="contact-hours">
            <h3>Working hours</h3>
            <p>Monday – Friday</p>
            <p>Office hours to be confirmed</p>
          </div>
        </aside>

      </section>

      <section className="contact-map-section">
        <div className="contact-map-heading">
          <div>
            <span className="contact-eyebrow">OUR LOCATION</span>
            <h2>Explore the UAE with PropNexa</h2>
          </div>
          <p>Discover property opportunities across the Emirates.</p>
        </div>

        <div className="contact-map">
          <iframe
            title="Map of the United Arab Emirates"
            src="https://www.google.com/maps?q=United%20Arab%20Emirates&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>

    </main>
  )
}

export default Contact
