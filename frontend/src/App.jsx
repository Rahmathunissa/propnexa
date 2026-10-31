
import { useEffect, useState } from 'react'

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...')
  const [apiMessage, setApiMessage] = useState('')

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/health')
      .then(response => {
        if (!response.ok) {
          throw new Error('Backend request failed')
        }
        return response.json()
      })
      .then(data => {
        setBackendStatus('Connected')
        setApiMessage(data.message)
      })
      .catch(() => {
        setBackendStatus('Disconnected')
        setApiMessage('Could not connect to Flask backend.')
      })
  }, [])

  return (
    <main className="app">
      <h1>PropNexa</h1>
      <h2>Find Smarter. Live Better.</h2>

      <p>Smart Property Discovery Platform – UAE</p>

      <section className="status-card">
        <h3>Backend Connection</h3>
        <p>
          Status: <strong>{backendStatus}</strong>
        </p>
        <p>{apiMessage}</p>
      </section>
    </main>
  )
}

export default App
