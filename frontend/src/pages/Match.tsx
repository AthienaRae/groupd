import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import axios from 'axios'

const BASE_URL = process.env.REACT_APP_API_URL || 'https://groupdbackend.mangocoast-8ddfce7d.southeastasia.azurecontainerapps.io'
const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function MatchBar({ score }: { score: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 4, borderRadius: 4, background: 'rgba(242,196,205,0.1)' }}>
        <div style={{ width: `${score}%`, height: '100%', borderRadius: 4, background: '#F2C4CD' }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 500, color: '#F2C4CD', minWidth: 32 }}>{score}%</span>
    </div>
  )
}

function Initials({ name }: { name: string }) {
  const init = name.split(' ').map((p: string) => p[0]).join('').slice(0, 2)
  return (
    <div style={{
      width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
      background: 'rgba(242,196,205,0.12)', border: '0.5px solid rgba(242,196,205,0.25)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 14, fontWeight: 500, color: '#F2C4CD'
    }}>{init}</div>
  )
}

export default function Match() {
  const nav = useNavigate()
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [connecting, setConnecting] = useState<string | null>(null)
  const [connected, setConnected] = useState<string[]>([])

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) { nav('/login'); return }
    axios.get(`${BASE_URL}/api/match`, { headers: getAuthHeader() })
      .then(res => setMatches(res.data))
      .catch(() => setError('Failed to load matches.'))
      .finally(() => setLoading(false))
  }, [nav])

  const handleConnect = async (userId: string) => {
    setConnecting(userId)
    try {
      await axios.post(`${BASE_URL}/api/connections/${userId}`, {}, { headers: getAuthHeader() })
      setConnected(p => [...p, userId])
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send connection.')
    } finally {
      setConnecting(null)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <div style={{ padding: '48px 32px' }}>
        <p style={{ fontSize: 11, fontWeight: 500, color: '#F2C4CD', letterSpacing: 1, textTransform: 'uppercase', opacity: 0.65, marginBottom: 10 }}>AI matching</p>
        <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: -1, marginBottom: 8 }}>Your matches</h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 40, lineHeight: 1.6 }}>
          Ranked by skill and profile similarity to you.
        </p>

        {error && (
          <div style={{ background: 'rgba(242,196,205,0.1)', border: '0.5px solid rgba(242,196,205,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 20, color: '#F2C4CD', fontSize: 13 }}>
            {error}
          </div>
        )}

        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Finding your matches...</p>
        ) : matches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 15, marginBottom: 16 }}>No matches yet. Complete your profile to get matched!</p>
            <button onClick={() => nav('/profile')} style={{
              background: '#F2C4CD', color: '#051F45', border: 'none',
              padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer'
            }}>Update profile</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720 }}>
            {matches.map((m, i) => {
              const isConnected = connected.includes(m.id)
              return (
                <div key={m.id} style={{
                  background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.13)',
                  borderRadius: 12, padding: 24
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
                    <Initials name={m.name} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <h3 style={{ fontSize: 16, fontWeight: 500 }}>{m.name}</h3>
                          {i === 0 && (
                            <span style={{
                              fontSize: 11, padding: '2px 8px', borderRadius: 20,
                              background: 'rgba(242,196,205,0.15)', color: '#F2C4CD',
                              border: '0.5px solid rgba(242,196,205,0.3)'
                            }}>Best match</span>
                          )}
                        </div>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{m.availability}</span>
                      </div>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>{m.department}</p>
                      <MatchBar score={m.match} />
                    </div>
                  </div>

                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 14 }}>{m.about}</p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {(m.skills || []).map((s: string) => (
                        <span key={s} style={{
                          fontSize: 12, padding: '3px 10px', borderRadius: 20,
                          background: 'rgba(242,196,205,0.08)', color: 'rgba(255,255,255,0.6)',
                          border: '0.5px solid rgba(242,196,205,0.15)'
                        }}>{s}</span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleConnect(m.id)}
                      disabled={isConnected || connecting === m.id}
                      style={{
                        background: isConnected ? 'rgba(29,158,117,0.2)' : '#F2C4CD',
                        color: isConnected ? '#5DCAA5' : '#051F45',
                        border: isConnected ? '0.5px solid rgba(29,158,117,0.3)' : 'none',
                        padding: '7px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                        cursor: isConnected ? 'not-allowed' : 'pointer', marginLeft: 12, flexShrink: 0
                      }}
                    >
                      {connecting === m.id ? 'Sending...' : isConnected ? 'Requested ✓' : 'Connect'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
