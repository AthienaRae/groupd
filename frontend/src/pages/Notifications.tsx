import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const NOTIFICATIONS = [
  { id: 1, type: 'match', text: 'Arun Krishnan is a 94% match for your profile', time: '2h ago', read: false, link: '/profile/user-1' },
  { id: 2, type: 'connect', text: 'Meera Pillai sent you a connection request', time: '3h ago', read: false, link: '/connections' },
  { id: 3, type: 'team', text: 'Your application to AI Health Monitor was viewed', time: '1d ago', read: true, link: '/teams/1' },
  { id: 4, type: 'message', text: 'Karthik Raja sent you a message', time: '1d ago', read: true, link: '/chat/user-2' },
  { id: 5, type: 'match', text: 'Priya Selvam is an 89% match for your profile', time: '2d ago', read: true, link: '/profile/user-5' },
]

const TYPE_ICONS: Record<string, string> = {
  match: '★',
  connect: '＋',
  team: '◈',
  message: '✉',
}

export default function Notifications() {
  const nav = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '48px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: '#F2C4CD', letterSpacing: 1, textTransform: 'uppercase', opacity: 0.65, marginBottom: 10 }}>Updates</p>
            <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: -1 }}>Notifications</h2>
          </div>
          <button style={{ background: 'transparent', color: 'rgba(255,255,255,0.4)', border: '0.5px solid rgba(242,196,205,0.15)', padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>
            Mark all read
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {NOTIFICATIONS.map(n => (
            <div key={n.id} onClick={() => nav(n.link)} style={{
              background: n.read ? 'rgba(242,196,205,0.03)' : 'rgba(242,196,205,0.07)',
              border: `0.5px solid ${n.read ? 'rgba(242,196,205,0.1)' : 'rgba(242,196,205,0.25)'}`,
              borderRadius: 12, padding: '14px 18px',
              display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer'
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: n.read ? 'rgba(242,196,205,0.06)' : 'rgba(242,196,205,0.15)',
                border: '0.5px solid rgba(242,196,205,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, color: '#F2C4CD'
              }}>{TYPE_ICONS[n.type]}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, color: n.read ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{n.text}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>{n.time}</p>
              </div>
              {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F2C4CD', flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}