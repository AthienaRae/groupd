import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const CONVERSATIONS = [
  { id: 'user-1', name: 'Arun Krishnan', dept: 'Computer Science', lastMsg: 'Hey, are you interested in joining the AI Health Monitor project?', time: '2h ago', unread: 2 },
  { id: 'user-2', name: 'Karthik Raja', dept: 'ECE', lastMsg: 'Sure, let me know when you want to meet up and discuss.', time: '1d ago', unread: 0 },
  { id: 'user-3', name: 'Meera Pillai', dept: 'ECE', lastMsg: 'I checked your profile, your Azure skills would be perfect for our team!', time: '2d ago', unread: 1 },
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

export default function Messages() {
  const nav = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 32px' }}>

        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#F2C4CD', letterSpacing: 1, textTransform: 'uppercase', opacity: 0.65, marginBottom: 10 }}>Inbox</p>
          <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: -1 }}>Messages</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CONVERSATIONS.map(c => (
            <div key={c.id} onClick={() => nav(`/chat/${c.id}`)} style={{
              background: 'rgba(242,196,205,0.05)', border: `0.5px solid ${c.unread > 0 ? 'rgba(242,196,205,0.3)' : 'rgba(242,196,205,0.13)'}`,
              borderRadius: 12, padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer'
            }}>
              <div style={{ position: 'relative' }}>
                <Initials name={c.name} />
                {c.unread > 0 && (
                  <div style={{
                    position: 'absolute', top: 0, right: 0,
                    width: 16, height: 16, borderRadius: '50%',
                    background: '#F2C4CD', color: '#051F45',
                    fontSize: 10, fontWeight: 500,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>{c.unread}</div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: c.unread > 0 ? 500 : 400 }}>{c.name}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{c.time}</span>
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.lastMsg}</div>
              </div>
            </div>
          ))}
        </div>

        {CONVERSATIONS.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>No messages yet</p>
            <button onClick={() => nav('/match')} style={{
              background: '#F2C4CD', color: '#051F45', border: 'none',
              padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer'
            }}>Find people to connect with</button>
          </div>
        )}

      </div>
    </div>
  )
}