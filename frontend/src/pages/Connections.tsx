import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const CONNECTIONS = [
  { id: 'user-1', name: 'Arun Krishnan', dept: 'Computer Science', skills: ['Python', 'ML/AI', 'Flask'], status: 'connected', lastActive: '2h ago' },
  { id: 'user-2', name: 'Karthik Raja', dept: 'ECE', skills: ['Kotlin', 'Java', 'Azure'], status: 'connected', lastActive: '1d ago' },
  { id: 'user-3', name: 'Meera Pillai', dept: 'ECE', skills: ['Python', 'Azure', 'Computer Vision'], status: 'pending', lastActive: '3h ago' },
  { id: 'user-4', name: 'Divya Nair', dept: 'Computer Science', skills: ['Docker', 'Azure', 'SQL'], status: 'pending', lastActive: '5h ago' },
]

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
  const connected = CONNECTIONS.filter(c => c.status === 'connected')
  const pending = CONNECTIONS.filter(c => c.status === 'pending')

  return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 32px' }}>

        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#F2C4CD', letterSpacing: 1, textTransform: 'uppercase', opacity: 0.65, marginBottom: 10 }}>Network</p>
          <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: -1 }}>Your connections</h2>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 40 }}>
          {[
            { label: 'Connected', value: connected.length },
            { label: 'Pending', value: pending.length },
            { label: 'Matches', value: 4 },
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

        {/* Pending requests */}
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
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{c.dept}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{
                      background: 'transparent', color: 'rgba(255,255,255,0.5)',
                      border: '0.5px solid rgba(242,196,205,0.2)',
                      padding: '6px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer'
                    }}>Decline</button>
                    <button style={{
                      background: '#F2C4CD', color: '#051F45', border: 'none',
                      padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer'
                    }}>Accept</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connected */}
        <div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 16, letterSpacing: 0.5 }}>Connected</p>
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
                    {c.skills.map(s => (
                      <span key={s} style={{
                        fontSize: 11, padding: '2px 8px', borderRadius: 20,
                        background: 'rgba(242,196,205,0.08)', color: 'rgba(255,255,255,0.5)',
                        border: '0.5px solid rgba(242,196,205,0.12)'
                      }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{c.lastActive}</span>
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
        </div>

      </div>
    </div>
  )
}