import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'

const USERS: Record<string, any> = {
  'user-1': { id: 'user-1', name: 'Arun Krishnan', dept: 'Computer Science' },
  'user-2': { id: 'user-2', name: 'Karthik Raja', dept: 'ECE' },
  'user-3': { id: 'user-3', name: 'Meera Pillai', dept: 'ECE' },
}

const INITIAL_MESSAGES: Record<string, any[]> = {
  'user-1': [
    { id: 1, from: 'them', text: 'Hey! I saw your profile on Groupd.', time: '10:30 AM' },
    { id: 2, from: 'them', text: 'Are you interested in joining the AI Health Monitor project?', time: '10:31 AM' },
    { id: 3, from: 'me', text: 'Hi! Yes, I saw the listing. It looks really interesting.', time: '10:45 AM' },
    { id: 4, from: 'me', text: 'What kind of work would I be doing?', time: '10:45 AM' },
    { id: 5, from: 'them', text: 'Mainly the React frontend and Azure integration. Your profile is a great match!', time: '10:50 AM' },
  ],
  'user-2': [
    { id: 1, from: 'them', text: 'Sure, let me know when you want to meet up and discuss.', time: 'Yesterday' },
  ],
  'user-3': [
    { id: 1, from: 'them', text: 'I checked your profile, your Azure skills would be perfect for our team!', time: '2 days ago' },
  ],
}

function Initials({ name }: { name: string }) {
  const init = name.split(' ').map((p: string) => p[0]).join('')
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
      background: 'rgba(242,196,205,0.12)', border: '0.5px solid rgba(242,196,205,0.25)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 12, fontWeight: 500, color: '#F2C4CD'
    }}>{init}</div>
  )
}

export default function Chat() {
  const { userId } = useParams()
  const nav = useNavigate()
  const user = USERS[userId || '']
  const [messages, setMessages] = useState(INITIAL_MESSAGES[userId || ''] || [])
  const [input, setInput] = useState('')

  const send = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, {
      id: prev.length + 1, from: 'me', text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }])
    setInput('')
  }

  if (!user) return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <div style={{ padding: '48px 32px' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>User not found.</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#051F45', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Chat header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '16px 32px',
        borderBottom: '0.5px solid rgba(242,196,205,0.15)'
      }}>
        <button onClick={() => nav('/messages')} style={{
          background: 'transparent', color: 'rgba(255,255,255,0.4)', border: 'none',
          fontSize: 13, cursor: 'pointer', padding: 0
        }}>←</button>
        <Initials name={user.name} />
        <div>
          <div style={{ fontSize: 15, fontWeight: 500 }}>{user.name}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{user.dept}</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={() => nav(`/profile/${user.id}`)} style={{
            background: 'transparent', color: 'rgba(255,255,255,0.5)',
            border: '0.5px solid rgba(242,196,205,0.2)',
            padding: '6px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer'
          }}>View profile</button>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '24px 32px',
        display: 'flex', flexDirection: 'column', gap: 12,
        maxWidth: 720, width: '100%', margin: '0 auto'
      }}>
        {messages.map(m => (
          <div key={m.id} style={{
            display: 'flex', flexDirection: 'column',
            alignItems: m.from === 'me' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              maxWidth: '70%', padding: '10px 14px', borderRadius: 12,
              background: m.from === 'me' ? '#F2C4CD' : 'rgba(242,196,205,0.08)',
              color: m.from === 'me' ? '#051F45' : 'rgba(255,255,255,0.85)',
              border: m.from === 'me' ? 'none' : '0.5px solid rgba(242,196,205,0.15)',
              fontSize: 14, lineHeight: 1.5
            }}>{m.text}</div>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>{m.time}</span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: '16px 32px', borderTop: '0.5px solid rgba(242,196,205,0.15)',
        display: 'flex', gap: 10, maxWidth: 720, width: '100%', margin: '0 auto'
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Type a message..."
          style={{
            flex: 1, background: 'rgba(242,196,205,0.05)',
            border: '0.5px solid rgba(242,196,205,0.2)',
            borderRadius: 8, padding: '10px 14px', fontSize: 14,
            color: '#fff', outline: 'none'
          }}
        />
        <button onClick={send} style={{
          background: '#F2C4CD', color: '#051F45', border: 'none',
          padding: '10px 20px', borderRadius: 8, fontSize: 14,
          fontWeight: 500, cursor: 'pointer'
        }}>Send</button>
      </div>
    </div>
  )
}