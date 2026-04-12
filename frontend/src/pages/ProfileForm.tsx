import Navbar from '../components/Navbar'
import { useState } from 'react'

const SKILLS = ['React', 'Python', 'Flask', 'Node.js', 'ML/AI', 'UI/UX', 'Azure', 'MongoDB', 'Docker', 'Java', 'Kotlin', 'SQL']

export default function ProfileForm() {
  const [selected, setSelected] = useState<string[]>([])
  const toggle = (s: string) => setSelected(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])

  return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '56px 32px' }}>
        <p style={{ fontSize: 11, fontWeight: 500, color: '#F2C4CD', letterSpacing: 1, textTransform: 'uppercase', opacity: 0.65, marginBottom: 12 }}>Your profile</p>
        <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: -1, marginBottom: 8 }}>Tell us about yourself</h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 40, lineHeight: 1.6 }}>This builds your semantic profile for AI-powered matching.</p>

        {[{ label: 'Full name', placeholder: 'Athiena Rae' }, { label: 'Email', placeholder: 'you@college.edu' }, { label: 'Department', placeholder: 'Computer Science' }].map(f => (
          <div key={f.label} style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>{f.label}</label>
            <input placeholder={f.placeholder} style={{
              width: '100%', background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.2)',
              borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none'
            }} />
          </div>
        ))}

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Availability</label>
          <select style={{
            width: '100%', background: '#051F45', border: '0.5px solid rgba(242,196,205,0.2)',
            borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none'
          }}>
            <option>Weekends only</option>
            <option>Weekday evenings</option>
            <option>Full-time</option>
            <option>Flexible</option>
          </select>
        </div>

        <div style={{ marginBottom: 32 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>Skills</label>
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
          <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>About you</label>
          <textarea rows={4} placeholder="What kind of projects are you interested in? What are your goals?" style={{
            width: '100%', background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.2)',
            borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none', resize: 'vertical'
          }} />
        </div>

        <button style={{
          width: '100%', background: '#F2C4CD', color: '#051F45', border: 'none',
          padding: '12px', borderRadius: 8, fontSize: 15, fontWeight: 500, cursor: 'pointer'
        }}>Save profile</button>
      </div>
    </div>
  )
}