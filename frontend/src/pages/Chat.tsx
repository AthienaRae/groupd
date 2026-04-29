import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getConversation, sendMessage } from '../api/messages'
import { getUser } from '../api/users'

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  read: boolean
}

interface OtherUser {
  userId: string
  name: string
  department: string
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

function formatTime(ts: string): string {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function Chat() {
  const { userId } = useParams<{ userId: string }>()
  const nav = useNavigate()
  const myId = JSON.parse(localStorage.getItem('user') || '{}').id || ''

  const [otherUser, setOtherUser] = useState<OtherUser | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!userId) return
    Promise.all([
      getUser(userId),
      getConversation(userId)
    ])
      .then(([userRes, msgRes]) => {
        setOtherUser({
          userId: userRes.userId,
          name: userRes.name,
          department: userRes.department
        })
        setMessages(msgRes)
      })
      .catch(() => setError('Failed to load conversation'))
      .finally(() => setLoading(false))
  }, [userId])

  useEffect(() => {
    if (!userId) return
    const interval = setInterval(() => {
      getConversation(userId)
        .then(res => setMessages(res))
        .catch(() => {})
    }, 5000)
    return () => clearInterval(interval)
  }, [userId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || !userId || sending) return
    setSending(true)
    const content = input.trim()
    setInput('')
    try {
      const res = await sendMessage(userId, content)
      setMessages(prev => [...prev, res])
    } catch {
      setError('Failed to send message')
      setInput(content)
    } finally {
      setSending(false)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '48px 0' }}>Loading...</p>
    </div>
  )

  if (error || !otherUser) return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <div style={{ padding: '48px 32px' }}>
        <p style={{ color: '#F2C4CD' }}>{error || 'User not found.'}</p>
        <button onClick={() => nav('/messages')} style={{ marginTop: 16, background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '0.5px solid rgba(242,196,205,0.2)', padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>
          ← Back to Messages
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#051F45', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '16px 32px',
        borderBottom: '0.5px solid rgba(242,196,205,0.15)'
      }}>
        <button onClick={() => nav('/messages')} style={{
          background: 'transparent', color: 'rgba(255,255,255,0.4)', border: 'none',
          fontSize: 13, cursor: 'pointer', padding: 0
        }}>←</button>
        <Initials name={otherUser.name} />
        <div>
          <div style={{ fontSize: 15, fontWeight: 500 }}>{otherUser.name}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{otherUser.department}</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button onClick={() => nav(`/profile/${otherUser.userId}`)} style={{
            background: 'transparent', color: 'rgba(255,255,255,0.5)',
            border: '0.5px solid rgba(242,196,205,0.2)',
            padding: '6px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer'
          }}>View profile</button>
        </div>
      </div>

      <div style={{
        flex: 1, overflowY: 'auto', padding: '24px 32px',
        display: 'flex', flexDirection: 'column', gap: 12,
        maxWidth: 720, width: '100%', margin: '0 auto'
      }}>
        {messages.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', paddingTop: 48 }}>
            No messages yet. Say hi! 👋
          </p>
        )}
        {messages.map(m => {
          const isMe = m.senderId === myId
          return (
            <div key={m.id} style={{
              display: 'flex', flexDirection: 'column',
              alignItems: isMe ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                maxWidth: '70%', padding: '10px 14px', borderRadius: 12,
                background: isMe ? '#F2C4CD' : 'rgba(242,196,205,0.08)',
                color: isMe ? '#051F45' : 'rgba(255,255,255,0.85)',
                border: isMe ? 'none' : '0.5px solid rgba(242,196,205,0.15)',
                fontSize: 14, lineHeight: 1.5
              }}>{m.content}</div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>
                {formatTime(m.timestamp)}
              </span>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <div style={{
        padding: '16px 32px', borderTop: '0.5px solid rgba(242,196,205,0.15)',
        display: 'flex', gap: 10, maxWidth: 720, width: '100%', margin: '0 auto'
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Type a message..."
          disabled={sending}
          style={{
            flex: 1, background: 'rgba(242,196,205,0.05)',
            border: '0.5px solid rgba(242,196,205,0.2)',
            borderRadius: 8, padding: '10px 14px', fontSize: 14,
            color: '#fff', outline: 'none',
            opacity: sending ? 0.6 : 1
          }}
        />
        <button
          onClick={send}
          disabled={sending}
          style={{
            background: '#F2C4CD', color: '#051F45', border: 'none',
            padding: '10px 20px', borderRadius: 8, fontSize: 14,
            fontWeight: 500, cursor: sending ? 'not-allowed' : 'pointer',
            opacity: sending ? 0.6 : 1
          }}
        >
          {sending ? '...' : 'Send'}
        </button>
      </div>
    </div>
  )
}