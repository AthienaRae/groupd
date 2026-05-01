import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import axios from 'axios'

const BASE_URL = process.env.REACT_APP_API_URL || 'https://groupdbackend.mangocoast-8ddfce7d.southeastasia.azurecontainerapps.io'
const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const TYPE_ICONS: Record<string, string> = {
  match: '★',
  connect: '＋',
  connection_request: '＋',
  connection_accepted: '✓',
  team_invite: '◈',
  join_request: '◈',
  message: '✉',
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function Notifications() {
  const nav = useNavigate()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/notifications`, { headers: getAuthHeader() })
      setNotifications(res.data)
    } catch {} finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) { nav('/login'); return }
    fetchNotifications()
  }, [nav])

  const markAllRead = async () => {
    try {
      await axios.patch(`${BASE_URL}/api/notifications/read-all`, {}, { headers: getAuthHeader() })
      setNotifications(p => p.map(n => ({ ...n, read: true })))
    } catch {}
  }

  const handleClick = async (n: any) => {
    if (!n.read) {
      try {
        await axios.patch(`${BASE_URL}/api/notifications/${n.id}/read`, {}, { headers: getAuthHeader() })
        setNotifications(p => p.map(x => x.id === n.id ? { ...x, read: true } : x))
      } catch {}
    }
    if (n.type === 'connection_request' || n.type === 'connection_accepted') nav('/connections')
    else if (n.type === 'team_invite' || n.type === 'join_request') nav(`/teams/${n.refId}`)
    else if (n.type === 'message') nav(`/chat/${n.refId}`)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '48px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, color: '#F2C4CD', letterSpacing: 1, textTransform: 'uppercase', opacity: 0.65, marginBottom: 10 }}>Updates</p>
            <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: -1 }}>Notifications</h2>
          </div>
          <button onClick={markAllRead} style={{ background: 'transparent', color: 'rgba(255,255,255,0.4)', border: '0.5px solid rgba(242,196,205,0.15)', padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>
            Mark all read
          </button>
        </div>

        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No notifications yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {notifications.map(n => (
              <div key={n.id} onClick={() => handleClick(n)} style={{
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
                }}>{TYPE_ICONS[n.type] || '•'}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, color: n.read ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{n.body}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>{timeAgo(n.timestamp)}</p>
                </div>
                {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F2C4CD', flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
