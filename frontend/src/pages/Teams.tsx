import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const TEAMS = [
  { id: '1', name: 'AI Health Monitor', desc: 'Building a wearable health tracking app with ML anomaly detection.', skills: ['Python', 'ML/AI', 'React'], slots: 2, type: 'Hackathon' },
  { id: '2', name: 'Campus Food Finder', desc: 'A real-time app to track canteen menus and crowd levels across campus.', skills: ['React', 'Node.js', 'MongoDB'], slots: 1, type: 'Course Project' },
  { id: '3', name: 'Smart Attendance', desc: 'Face recognition based attendance system using Azure CV and mobile app.', skills: ['Kotlin', 'Azure', 'Python'], slots: 3, type: 'Research' },
  { id: '4', name: 'EcoTrack', desc: 'Carbon footprint tracker for college students with gamification elements.', skills: ['React', 'Flask', 'SQL'], slots: 2, type: 'Hackathon' },
  { id: '5', name: 'Peer Tutor Platform', desc: 'Connecting students who need help with those who can teach — with scheduling.', skills: ['React', 'Node.js', 'Docker'], slots: 2, type: 'Course Project' },
  { id: '6', name: 'AR Campus Tour', desc: 'Augmented reality guided tour of the college campus for new students.', skills: ['Unity', 'UI/UX', 'Java'], slots: 1, type: 'Research' },
]

const TYPE_COLORS: Record<string, string> = {
  'Hackathon': 'rgba(242,196,205,0.15)',
  'Course Project': 'rgba(5,31,69,0.6)',
  'Research': 'rgba(242,196,205,0.08)',
}

export default function Teams() {
  const nav = useNavigate()

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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {TEAMS.map(t => (
            <div key={t.id} style={{
              background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.13)',
              borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 14
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: 11, padding: '3px 10px', borderRadius: 20,
                  background: TYPE_COLORS[t.type], color: '#F2C4CD',
                  border: '0.5px solid rgba(242,196,205,0.2)'
                }}>{t.type}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{t.slots} slot{t.slots > 1 ? 's' : ''} open</span>
              </div>

              <div>
                <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>{t.name}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{t.desc}</p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {t.skills.map(s => (
                  <span key={s} style={{
                    fontSize: 12, padding: '3px 10px', borderRadius: 20,
                    background: 'rgba(242,196,205,0.08)', color: 'rgba(255,255,255,0.6)',
                    border: '0.5px solid rgba(242,196,205,0.15)'
                  }}>{s}</span>
                ))}
              </div>

              <button onClick={() => nav(`/teams/${t.id}`)} style={{
                marginTop: 'auto', background: 'transparent', color: '#F2C4CD',
                border: '0.5px solid rgba(242,196,205,0.3)', borderRadius: 8,
                padding: '8px', fontSize: 13, cursor: 'pointer'
              }}>View team →</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}