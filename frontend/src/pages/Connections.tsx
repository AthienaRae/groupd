import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import axios from 'axios'

const BASE_URL = process.env.REACT_APP_API_URL || 'https://groupdbackend.mangocoast-8ddfce7d.southeastasia.azurecontainerapps.io'

const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function Initials({ name }: { name: string }) {
  const init = name.split(' ').map((p: string) => p[0]).join('')
  return (
    <div style={{
      width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
      background: 'rgba(242,196,205,0.12)', border: '0.5px solid rgba(242,196,205,0.25)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 14, fontWeight: 500, color: '#F2C4CD'
    }}>{init}</div>
  )
}

export default function Connections() {
  const nav = useNavigate()
  const [connected, setConnected] = useState<any[]>([])
  const [pending, setPending] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchConnections = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/connections`, { headers: getAuthHeader() })
      setConnected(res.data.connected || [])
      setPending(res.data.pending || [])
    } catch {
      setError('Failed to load connections.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) { nav('/login'); return }
    fetchConnections()
  }, [nav])

  const handleAccept = async (userId: string) => {
    try {
      await axios.post(`${BASE_URL}/api/connections/${userId}/accept`, {}, { headers: getAuthHeader() })
      fetchConnections()
    } catch {
      setError('Failed to accept connection.')
    }
  }

  const handleDecline = async (userId: string) => {
    try {
      await axios.post(`${BASE_URL}/api/connections/${userId}/decline`, {}, { headers: getAuthHeader() })
      fetchConnections()
    } catch {
      setError('Failed to decline connection.')
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <div style={{ padding: '48px 32px' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Loading connections...</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 32px' }}>

        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#F2C4CD', letterSpacing: 1, textTransform: 'uppercase', opacity: 0.65, marginBottom: 10 }}>Network</p>
          <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: -1 }}>Your connections</h2>
        </div>

        {error && (
          <div style={{ background: 'rgba(242,196,205,0.1)', border: '0.5px solid rgba(242,196,205,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 20, color: '#F2C4CD', fontSize: 13 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 40 }}>
          {[
            { label: 'Connected', value: connected.length },
            { label: 'Pending', value: pending.length },
            { label: 'Matches', value: '—' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.13)',
              borderRadius: 12, padding: '16px 20px'
            }}>
              <div style={{ fontSize: 24, fontWeight: 500, color: '#F2C4CD', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {pending.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 16, letterSpacing: 0.5 }}>Pending requests</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pending.map(c => (
                <div key={c.id} style={{
                  background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.2)',
                  borderRadius: 12, padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: 14
                }}>
                  <Initials name={c.name} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 3 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{c.department}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => handleDecline(c.id)} style={{
                      background: 'transparent', color: 'rgba(255,255,255,0.5)',
                      border: '0.5px solid rgba(242,196,205,0.2)',
                      padding: '6px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer'
                    }}>Decline</button>
                    <button onClick={() => handleAccept(c.id)} style={{
                      background: '#F2C4CD', color: '#051F45', border: 'none',
                      padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer'
                    }}>Accept</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 16, letterSpacing: 0.5 }}>Connected</p>
          {connected.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No connections yet. Start matching to connect with people!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {connected.map(c => (
                <div key={c.id} style={{
                  background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.13)',
                  borderRadius: 12, padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: 14
                }}>
                  <Initials name={c.name} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 3 }}>{c.name}</div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                      {(c.skills || []).map((s: string) => (
                        <span key={s} style={{
                          fontSize: 11, padding: '2px 8px', borderRadius: 20,
                          background: 'rgba(242,196,205,0.08)', color: 'rgba(255,255,255,0.5)',
                          border: '0.5px solid rgba(242,196,205,0.12)'
                        }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => nav(`/chat/${c.id}`)} style={{
                      background: 'transparent', color: '#F2C4CD',
                      border: '0.5px solid rgba(242,196,205,0.3)',
                      padding: '6px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer'
                    }}>Message</button>
                    <button onClick={() => nav(`/profile/${c.id}`)} style={{
                      background: 'transparent', color: 'rgba(255,255,255,0.5)',
                      border: '0.5px solid rgba(242,196,205,0.15)',
                      padding: '6px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer'
                    }}>Profile</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
