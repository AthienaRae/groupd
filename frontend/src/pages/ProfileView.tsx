import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'

const USERS: Record<string, any> = {
  'user-1': { id: 'user-1', name: 'Arun Krishnan', dept: 'Computer Science', year: '3rd Year', availability: 'Weekends', skills: ['Python', 'ML/AI', 'Flask', 'Azure'], about: 'Passionate about AI and healthcare tech. Looking for frontend and mobile developers to build impactful products.', match: 94, projects: ['AI Health Monitor'], connections: 12 },
  'user-2': { id: 'user-2', name: 'Karthik Raja', dept: 'ECE', year: '4th Year', availability: 'Weekday evenings', skills: ['Kotlin', 'Java', 'Azure', 'IoT'], about: 'Android developer with IoT experience. Interested in smart campus and wearable projects.', match: 82, projects: ['Smart Attendance'], connections: 8 },
  'user-3': { id: 'user-3', name: 'Meera Pillai', dept: 'ECE', year: '3rd Year', availability: 'Flexible', skills: ['Python', 'Azure', 'Computer Vision'], about: 'Working on computer vision projects using Azure CV. Looking for mobile developers.', match: 76, projects: ['Smart Attendance'], connections: 5 },
}

export default function ProfileView() {
  const { id } = useParams()
  const nav = useNavigate()
  const user = USERS[id || '']

  if (!user) return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <div style={{ padding: '48px 32px' }}><p style={{ color: 'rgba(255,255,255,0.5)' }}>User not found.</p></div>
    </div>
  )

  const initials = user.name.split(' ').map((p: string) => p[0]).join('')

  return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 32px' }}>
        <button onClick={() => nav(-1)} style={{ background: 'transparent', color: 'rgba(255,255,255,0.4)', border: 'none', fontSize: 13, cursor: 'pointer', marginBottom: 32, padding: 0 }}>← Back</button>
        <div style={{ background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.13)', borderRadius: 12, padding: 24, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', flexShrink: 0, background: 'rgba(242,196,205,0.12)', border: '0.5px solid rgba(242,196,205,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 500, color: '#F2C4CD' }}>{initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h2 style={{ fontSize: 24, fontWeight: 500, letterSpacing: -0.5 }}>{user.name}</h2>
              <span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 20, background: 'rgba(242,196,205,0.15)', color: '#F2C4CD', border: '0.5px solid rgba(242,196,205,0.2)' }}>{user.match}% match</span>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>{user.dept} · {user.year}</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => nav(`/chat/${user.id}`)} style={{ background: 'transparent', color: '#F2C4CD', border: '0.5px solid rgba(242,196,205,0.3)', padding: '8px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>Message</button>
            <button style={{ background: '#F2C4CD', color: '#051F45', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Connect</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 16 }}>
          {[{ label: 'Availability', value: user.availability }, { label: 'Connections', value: user.connections }, { label: 'Projects', value: user.projects.length }].map(s => (
            <div key={s.label} style={{ background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.13)', borderRadius: 12, padding: '16px 20px' }}>
              <div style={{ fontSize: 18, fontWeight: 500, color: '#F2C4CD', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.13)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: '#F2C4CD', marginBottom: 10 }}>About</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{user.about}</p>
        </div>
        <div style={{ background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.13)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: '#F2C4CD', marginBottom: 14 }}>Skills</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {user.skills.map((s: string) => (
              <span key={s} style={{ fontSize: 13, padding: '5px 14px', borderRadius: 20, background: 'rgba(242,196,205,0.08)', color: 'rgba(255,255,255,0.7)', border: '0.5px solid rgba(242,196,205,0.15)' }}>{s}</span>
            ))}
          </div>
        </div>
        <div style={{ background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.13)', borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: '#F2C4CD', marginBottom: 14 }}>Projects</h3>
          {user.projects.map((p: string) => (
            <div key={p} style={{ fontSize: 14, padding: '10px 14px', background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.7)' }}>{p}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
