import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const ALL_USERS = [
  { id: 'user-1', name: 'Arun Krishnan', dept: 'Computer Science', skills: ['Python', 'ML/AI', 'Flask'], availability: 'Weekends' },
  { id: 'user-2', name: 'Karthik Raja', dept: 'ECE', skills: ['Kotlin', 'Java', 'Azure'], availability: 'Weekday evenings' },
  { id: 'user-3', name: 'Meera Pillai', dept: 'ECE', skills: ['Python', 'Azure', 'Computer Vision'], availability: 'Flexible' },
  { id: 'user-4', name: 'Divya Nair', dept: 'Computer Science', skills: ['Docker', 'Azure', 'SQL'], availability: 'Weekends' },
  { id: 'user-5', name: 'Priya Selvam', dept: 'Information Technology', skills: ['React', 'UI/UX', 'MongoDB'], availability: 'Flexible' },
]

const ALL_TEAMS = [
  { id: '1', name: 'AI Health Monitor', type: 'Hackathon', skills: ['Python', 'ML/AI', 'React'], slots: 2 },
  { id: '2', name: 'Campus Food Finder', type: 'Course Project', skills: ['React', 'Node.js', 'MongoDB'], slots: 1 },
  { id: '3', name: 'Smart Attendance', type: 'Research', skills: ['Kotlin', 'Azure', 'Python'], slots: 3 },
]

export default function Search() {
  const nav = useNavigate()
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'people' | 'teams'>('people')

  const filteredUsers = ALL_USERS.filter(u =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.dept.toLowerCase().includes(query.toLowerCase()) ||
    u.skills.some(s => s.toLowerCase().includes(query.toLowerCase()))
  )

  const filteredTeams = ALL_TEAMS.filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.type.toLowerCase().includes(query.toLowerCase()) ||
    t.skills.some(s => s.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 32px' }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#F2C4CD', letterSpacing: 1, textTransform: 'uppercase', opacity: 0.65, marginBottom: 10 }}>Search</p>
          <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: -1, marginBottom: 24 }}>Find people and teams</h2>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, skill, or department..."
            style={{ width: '100%', background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.2)', borderRadius: 8, padding: '12px 16px', fontSize: 15, color: '#fff', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {(['people', 'teams'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '7px 18px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
              background: tab === t ? '#F2C4CD' : 'transparent',
              color: tab === t ? '#051F45' : 'rgba(255,255,255,0.5)',
              border: `0.5px solid ${tab === t ? '#F2C4CD' : 'rgba(242,196,205,0.2)'}`,
              fontWeight: tab === t ? 500 : 400, textTransform: 'capitalize'
            }}>{t}</button>
          ))}
        </div>

        {tab === 'people' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredUsers.map(u => (
              <div key={u.id} onClick={() => nav(`/profile/${u.id}`)} style={{ background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.13)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(242,196,205,0.12)', border: '0.5px solid rgba(242,196,205,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500, color: '#F2C4CD', flexShrink: 0 }}>
                  {u.name.split(' ').map(p => p[0]).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{u.name}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {u.skills.map(s => (
                      <span key={s} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(242,196,205,0.08)', color: 'rgba(255,255,255,0.5)', border: '0.5px solid rgba(242,196,205,0.12)' }}>{s}</span>
                    ))}
                  </div>
                </div>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{u.dept}</span>
              </div>
            ))}
            {filteredUsers.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, textAlign: 'center', padding: '32px 0' }}>No people found</p>}
          </div>
        )}

        {tab === 'teams' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredTeams.map(t => (
              <div key={t.id} onClick={() => nav(`/teams/${t.id}`)} style={{ background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.13)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>{t.name}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {t.skills.map(s => (
                      <span key={s} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(242,196,205,0.08)', color: 'rgba(255,255,255,0.5)', border: '0.5px solid rgba(242,196,205,0.12)' }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: '#F2C4CD', marginBottom: 4 }}>{t.type}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{t.slots} slots open</div>
                </div>
              </div>
            ))}
            {filteredTeams.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, textAlign: 'center', padding: '32px 0' }}>No teams found</p>}
          </div>
        )}
      </div>
    </div>
  )
}
