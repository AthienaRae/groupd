import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'

const TEAMS: Record<string, any> = {
  '1': { id: '1', name: 'AI Health Monitor', desc: 'Building a wearable health tracking app with ML anomaly detection.', skills: ['Python', 'ML/AI', 'React'], slots: 2, type: 'Hackathon', lead: 'Arun Krishnan', leadId: 'user-1', dept: 'Computer Science', members: ['Arun Krishnan', 'Priya Selvam'], about: 'We plan to build a wearable device integration with Azure IoT and use ML models to detect anomalies in vitals.' },
  '2': { id: '2', name: 'Campus Food Finder', desc: 'A real-time app to track canteen menus and crowd levels across campus.', skills: ['React', 'Node.js', 'MongoDB'], slots: 1, type: 'Course Project', lead: 'Karthik Raja', leadId: 'user-2', dept: 'IT', members: ['Karthik Raja', 'Divya Nair', 'Sneha Raj'], about: 'Using real-time data feeds and crowd-sourced updates to help students plan their meals better.' },
  '3': { id: '3', name: 'Smart Attendance', desc: 'Face recognition based attendance system using Azure CV and mobile app.', skills: ['Kotlin', 'Azure', 'Python'], slots: 3, type: 'Research', lead: 'Meera Pillai', leadId: 'user-3', dept: 'ECE', members: ['Meera Pillai'], about: 'Integrating Azure Computer Vision with an Android app to automate classroom attendance.' },
}

export default function TeamDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const team = TEAMS[id || '1']

  if (!team) return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <div style={{ padding: '48px 32px' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Team not found.</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 32px' }}>
        <button onClick={() => nav('/teams')} style={{ background: 'transparent', color: 'rgba(255,255,255,0.4)', border: 'none', fontSize: 13, cursor: 'pointer', marginBottom: 32, padding: 0 }}>← Back to teams</button>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'rgba(242,196,205,0.15)', color: '#F2C4CD', border: '0.5px solid rgba(242,196,205,0.2)', marginBottom: 12, display: 'inline-block' }}>{team.type}</span>
            <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: -1, marginBottom: 4 }}>{team.name}</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Led by <span onClick={() => nav(`/profile/${team.leadId}`)} style={{ color: '#F2C4CD', cursor: 'pointer' }}>{team.lead}</span> · {team.dept}</p>
          </div>
          <span style={{ fontSize: 13, padding: '6px 14px', borderRadius: 20, background: 'rgba(242,196,205,0.08)', color: '#F2C4CD', border: '0.5px solid rgba(242,196,205,0.2)' }}>{team.slots} slot{team.slots > 1 ? 's' : ''} open</span>
        </div>
        <div style={{ background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.13)', borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 10, color: '#F2C4CD' }}>About the project</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{team.about}</p>
        </div>
        <div style={{ background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.13)', borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 14, color: '#F2C4CD' }}>Skills needed</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {team.skills.map((s: string) => (
              <span key={s} style={{ fontSize: 13, padding: '5px 14px', borderRadius: 20, background: 'rgba(242,196,205,0.08)', color: 'rgba(255,255,255,0.7)', border: '0.5px solid rgba(242,196,205,0.15)' }}>{s}</span>
            ))}
          </div>
        </div>
        <div style={{ background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.13)', borderRadius: 12, padding: 24, marginBottom: 32 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 14, color: '#F2C4CD' }}>Current members</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {team.members.map((m: string) => (
              <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(242,196,205,0.12)', border: '0.5px solid rgba(242,196,205,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 500, color: '#F2C4CD' }}>{m.split(' ').map((p: string) => p[0]).join('')}</div>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{m}</span>
              </div>
            ))}
          </div>
        </div>
        <button style={{ width: '100%', background: '#F2C4CD', color: '#051F45', border: 'none', borderRadius: 8, padding: '12px', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>Apply to join</button>
      </div>
    </div>
  )
}
