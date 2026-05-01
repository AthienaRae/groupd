import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getTeams, joinTeam, Team } from '../api/teams'

const TYPE_COLORS: Record<string, string> = {
  'Hackathon': 'rgba(242,196,205,0.15)',
  'Course Project': 'rgba(5,31,69,0.6)',
  'Research': 'rgba(242,196,205,0.08)',
  'Startup': 'rgba(242,196,205,0.1)',
  'Open Source': 'rgba(242,196,205,0.06)',
}

export default function Teams() {
  const nav = useNavigate()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [joining, setJoining] = useState<string | null>(null)
  const [joined, setJoined] = useState<string[]>([])

  useEffect(() => {
    getTeams()
      .then(data => setTeams(data))
      .catch(() => setError('Failed to load teams.'))
      .finally(() => setLoading(false))
  }, [])

  const handleJoin = async (teamId: string) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) { nav('/login'); return }
    setJoining(teamId)
    try {
      await joinTeam(teamId)
      setJoined(p => [...p, teamId])
      setTeams(p => p.map(t => t.id === teamId ? { ...t, slots: t.slots - 1 } : t))
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to join team.')
    } finally {
      setJoining(null)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <div style={{ padding: '48px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: '#F2C4CD', letterSpacing: 1, textTransform: 'uppercase', opacity: 0.65, marginBottom: 10 }}>Open teams</p>
            <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: -1 }}>Find your project</h2>
          </div>
          <button onClick={() => nav('/teams/create')} style={{
            background: '#F2C4CD', color: '#051F45', border: 'none',
            padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer'
          }}>+ Post a team</button>
        </div>

        {error && (
          <div style={{ background: 'rgba(242,196,205,0.1)', border: '0.5px solid rgba(242,196,205,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 20, color: '#F2C4CD', fontSize: 13 }}>
            {error}
          </div>
        )}

        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Loading teams...</p>
        ) : teams.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 15, marginBottom: 16 }}>No teams posted yet.</p>
            <button onClick={() => nav('/teams/create')} style={{
              background: '#F2C4CD', color: '#051F45', border: 'none',
              padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer'
            }}>Be the first to post</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {teams.map(t => {
              const isJoined = joined.includes(t.id)
              const isLeader = t.leadId === JSON.parse(localStorage.getItem('user') || '{}').id
              return (
                <div key={t.id} style={{
                  background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.13)',
                  borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 14
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontSize: 11, padding: '3px 10px', borderRadius: 20,
                      background: TYPE_COLORS[t.type] || 'rgba(242,196,205,0.08)', color: '#F2C4CD',
                      border: '0.5px solid rgba(242,196,205,0.2)'
                    }}>{t.type}</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                      {t.slots} slot{t.slots !== 1 ? 's' : ''} open
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>{t.name}</h3>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{t.description}</p>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(t.skills || []).map(s => (
                      <span key={s} style={{
                        fontSize: 12, padding: '3px 10px', borderRadius: 20,
                        background: 'rgba(242,196,205,0.08)', color: 'rgba(255,255,255,0.6)',
                        border: '0.5px solid rgba(242,196,205,0.15)'
                      }}>{s}</span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                    <button onClick={() => nav(`/teams/${t.id}`)} style={{
                      flex: 1, background: 'transparent', color: '#F2C4CD',
                      border: '0.5px solid rgba(242,196,205,0.3)', borderRadius: 8,
                      padding: '8px', fontSize: 13, cursor: 'pointer'
                    }}>View →</button>
                    {!isLeader && (
                      <button
                        onClick={() => handleJoin(t.id)}
                        disabled={isJoined || t.slots <= 0 || joining === t.id}
                        style={{
                          flex: 1, borderRadius: 8, padding: '8px', fontSize: 13, fontWeight: 500,
                          cursor: isJoined || t.slots <= 0 ? 'not-allowed' : 'pointer',
                          background: isJoined ? 'rgba(29,158,117,0.2)' : t.slots <= 0 ? 'rgba(255,255,255,0.05)' : '#F2C4CD',
                          color: isJoined ? '#5DCAA5' : t.slots <= 0 ? 'rgba(255,255,255,0.3)' : '#051F45',
                          border: isJoined ? '0.5px solid rgba(29,158,117,0.3)' : 'none'
                        }}
                      >
                        {joining === t.id ? 'Joining...' : isJoined ? 'Joined ✓' : t.slots <= 0 ? 'Full' : 'Join'}
                      </button>
                    )}
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
