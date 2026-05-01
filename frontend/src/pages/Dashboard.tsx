import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { getTeams } from '../api/teams'

const BASE_URL = process.env.REACT_APP_API_URL || 'https://groupdbackend.mangocoast-8ddfce7d.southeastasia.azurecontainerapps.io'
const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function Initials({ name }: { name: string }) {
  const init = name.split(' ').map((p: string) => p[0]).join('').slice(0, 2)
  return (
    <div style={{
      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
      background: 'rgba(242,196,205,0.12)', border: '0.5px solid rgba(242,196,205,0.25)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, fontWeight: 500, color: '#F2C4CD'
    }}>{init}</div>
  )
}

export default function Dashboard() {
  const nav = useNavigate()
  const [matches, setMatches] = useState<any[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [connections, setConnections] = useState<any[]>([])
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) { nav('/login'); return }
    setUserName(user.name || '')

    axios.get(`${BASE_URL}/api/match`, { headers: getAuthHeader() })
      .then(res => setMatches(res.data.slice(0, 3)))
      .catch(() => {})

    getTeams()
      .then(data => setTeams(data.slice(0, 2)))
      .catch(() => {})

    axios.get(`${BASE_URL}/api/connections`, { headers: getAuthHeader() })
      .then(res => setConnections(res.data.connected || []))
      .catch(() => {})
  }, [nav])

  return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <div style={{ padding: '48px 32px' }}>

        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#F2C4CD', letterSpacing: 1, textTransform: 'uppercase', opacity: 0.65, marginBottom: 10 }}>Welcome back</p>
          <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: -1 }}>{userName || 'Your dashboard'}</h2>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 40 }}>
          {[
            { label: 'Total matches', value: matches.length || '—' },
            { label: 'Open teams', value: teams.length || '—' },
            { label: 'Connections', value: connections.length || '—' },
            { label: 'Profile', value: 'Active' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.13)',
              borderRadius: 12, padding: '20px 24px'
            }}>
              <div style={{ fontSize: 28, fontWeight: 500, color: '#F2C4CD', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

          {/* Recent matches */}
          <div style={{
            background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.13)',
            borderRadius: 12, padding: 24
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 500 }}>Recent matches</h3>
              <button onClick={() => nav('/match')} style={{
                background: 'transparent', color: '#F2C4CD', border: 'none',
                fontSize: 13, cursor: 'pointer', opacity: 0.7
              }}>View all →</button>
            </div>
            {matches.length === 0 ? (
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>No matches yet. Complete your profile!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {matches.map(m => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Initials name={m.name} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{m.name}</span>
                        <span style={{ fontSize: 13, color: '#F2C4CD', fontWeight: 500 }}>{m.match}%</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{m.department}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Teams + Quick actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.13)',
              borderRadius: 12, padding: 24
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 500 }}>Open teams</h3>
                <button onClick={() => nav('/teams')} style={{
                  background: 'transparent', color: '#F2C4CD', border: 'none',
                  fontSize: 13, cursor: 'pointer', opacity: 0.7
                }}>View all →</button>
              </div>
              {teams.length === 0 ? (
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>No teams yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {teams.map(t => (
                    <div key={t.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 14px', background: 'rgba(242,196,205,0.05)',
                      border: '0.5px solid rgba(242,196,205,0.1)', borderRadius: 8
                    }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{t.name}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{t.type}</div>
                      </div>
                      <span style={{
                        fontSize: 12, padding: '3px 10px', borderRadius: 20,
                        background: 'rgba(242,196,205,0.1)', color: '#F2C4CD',
                        border: '0.5px solid rgba(242,196,205,0.2)'
                      }}>{t.slots} open</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div style={{
              background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.13)',
              borderRadius: 12, padding: 24
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 16 }}>Quick actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Update my profile', path: '/profile' },
                  { label: 'Browse all teams', path: '/teams' },
                  { label: 'See my matches', path: '/match' },
                  { label: 'Post a new team', path: '/teams/create' },
                ].map(a => (
                  <button key={a.label} onClick={() => nav(a.path)} style={{
                    background: 'transparent', color: 'rgba(255,255,255,0.65)',
                    border: '0.5px solid rgba(242,196,205,0.15)', borderRadius: 8,
                    padding: '9px 14px', fontSize: 13, cursor: 'pointer', textAlign: 'left'
                  }}>{a.label} →</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
