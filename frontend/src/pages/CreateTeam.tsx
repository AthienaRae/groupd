import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { createTeam } from '../api/teams'

const SKILLS = ['React', 'Python', 'Flask', 'Node.js', 'ML/AI', 'UI/UX', 'Azure', 'MongoDB', 'Docker', 'Java', 'Kotlin', 'SQL', 'Unity']

export default function CreateTeam() {
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [type, setType] = useState('Hackathon')
  const [slots, setSlots] = useState(1)
  const [description, setDescription] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const toggle = (s: string) => setSelected(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Project name is required.'); return }
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    if (!currentUser.id) { nav('/login'); return }
    setSaving(true)
    setError('')
    try {
      const teamId = crypto.randomUUID()
      await createTeam({
        teamId,
        name: name.trim(),
        description: description.trim(),
        type,
        skills: selected,
        slots,
        leadId: currentUser.id
      } as any)
      nav('/teams')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create team.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '56px 32px' }}>
        <p style={{ fontSize: 11, fontWeight: 500, color: '#F2C4CD', letterSpacing: 1, textTransform: 'uppercase', opacity: 0.65, marginBottom: 12 }}>New team</p>
        <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: -1, marginBottom: 8 }}>Post your project</h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 40, lineHeight: 1.6 }}>Describe what you're building and who you need.</p>

        {error && (
          <div style={{ background: 'rgba(242,196,205,0.1)', border: '0.5px solid rgba(242,196,205,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 20, color: '#F2C4CD', fontSize: 13 }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Project name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Smart Attendance System"
            style={{ width: '100%', background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Project type</label>
          <select value={type} onChange={e => setType(e.target.value)} style={{ width: '100%', background: '#051F45', border: '0.5px solid rgba(242,196,205,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none' }}>
            <option>Hackathon</option>
            <option>Course Project</option>
            <option>Research</option>
            <option>Startup</option>
            <option>Open Source</option>
          </select>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Open slots</label>
          <select value={slots} onChange={e => setSlots(Number(e.target.value))} style={{ width: '100%', background: '#051F45', border: '0.5px solid rgba(242,196,205,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none' }}>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
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
          <textarea rows={5} value={description} onChange={e => setDescription(e.target.value)}
            placeholder="What are you building? What problem does it solve?"
            style={{ width: '100%', background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => nav('/teams')} style={{
            flex: 1, background: 'transparent', color: 'rgba(255,255,255,0.6)',
            border: '0.5px solid rgba(242,196,205,0.2)', borderRadius: 8,
            padding: '12px', fontSize: 14, cursor: 'pointer'
          }}>Cancel</button>
          <button onClick={handleSubmit} disabled={saving} style={{
            flex: 2, background: saving ? 'rgba(242,196,205,0.5)' : '#F2C4CD', color: '#051F45',
            border: 'none', borderRadius: 8, padding: '12px', fontSize: 15, fontWeight: 500,
            cursor: saving ? 'not-allowed' : 'pointer'
          }}>{saving ? 'Posting...' : 'Post team'}</button>
        </div>
      </div>
    </div>
  )
}
