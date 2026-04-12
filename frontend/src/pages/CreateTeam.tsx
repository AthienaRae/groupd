import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const SKILLS = ['React', 'Python', 'Flask', 'Node.js', 'ML/AI', 'UI/UX', 'Azure', 'MongoDB', 'Docker', 'Java', 'Kotlin', 'SQL', 'Unity']

export default function CreateTeam() {
  const nav = useNavigate()
  const [selected, setSelected] = useState<string[]>([])
  const toggle = (s: string) => setSelected(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])

  return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '56px 32px' }}>
        <p style={{ fontSize: 11, fontWeight: 500, color: '#F2C4CD', letterSpacing: 1, textTransform: 'uppercase', opacity: 0.65, marginBottom: 12 }}>New team</p>
        <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: -1, marginBottom: 8 }}>Post your project</h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 40, lineHeight: 1.6 }}>Describe what you're building and who you need — Groupd will match the right people to you.</p>

        {[
          { label: 'Project name', placeholder: 'e.g. Smart Attendance System' },
          { label: 'Your name', placeholder: 'Team lead name' },
        ].map(f => (
          <div key={f.label} style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>{f.label}</label>
            <input placeholder={f.placeholder} style={{
              width: '100%', background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.2)',
              borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none'
            }} />
          </div>
        ))}

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Project type</label>
          <select style={{
            width: '100%', background: '#051F45', border: '0.5px solid rgba(242,196,205,0.2)',
            borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none'
          }}>
            <option>Hackathon</option>
            <option>Course Project</option>
            <option>Research</option>
            <option>Startup</option>
            <option>Open Source</option>
          </select>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Open slots</label>
          <select style={{
            width: '100%', background: '#051F45', border: '0.5px solid rgba(242,196,205,0.2)',
            borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none'
          }}>
            {[1,2,3,4,5].map(n => <option key={n}>{n}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>Skills needed</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SKILLS.map(s => (
              <button key={s} onClick={() => toggle(s)} style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
                background: selected.includes(s) ? '#F2C4CD' : 'rgba(242,196,205,0.07)',
                color: selected.includes(s) ? '#051F45' : 'rgba(255,255,255,0.6)',
                border: `0.5px solid ${selected.includes(s) ? '#F2C4CD' : 'rgba(242,196,205,0.2)'}`,
                fontWeight: selected.includes(s) ? 500 : 400
              }}>{s}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Project description</label>
          <textarea rows={5} placeholder="What are you building? What problem does it solve? What will teammates be working on?" style={{
            width: '100%', background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.2)',
            borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none', resize: 'vertical'
          }} />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => nav('/teams')} style={{
            flex: 1, background: 'transparent', color: 'rgba(255,255,255,0.6)',
            border: '0.5px solid rgba(242,196,205,0.2)', borderRadius: 8,
            padding: '12px', fontSize: 14, cursor: 'pointer'
          }}>Cancel</button>
          <button style={{
            flex: 2, background: '#F2C4CD', color: '#051F45', border: 'none',
            borderRadius: 8, padding: '12px', fontSize: 15, fontWeight: 500, cursor: 'pointer'
          }}>Post team</button>
        </div>
      </div>
    </div>
  )
}