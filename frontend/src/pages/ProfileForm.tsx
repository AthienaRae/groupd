import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getUser, updateUser } from '../api/users'
import FileUpload from '../components/FileUpload'

const SKILLS = ['React', 'Python', 'Flask', 'Node.js', 'ML/AI', 'UI/UX', 'Azure', 'MongoDB', 'Docker', 'Java', 'Kotlin', 'SQL']

export default function ProfileForm() {
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [availability, setAvailability] = useState('Flexible')
  const [about, setAbout] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [resumeUrl, setResumeUrl] = useState('')

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    if (!currentUser.id) { nav('/login'); return }
    setLoading(true)
    getUser(currentUser.id)
      .then(u => {
        setName(u.name || '')
        setEmail(u.email || '')
        setDepartment(u.department || '')
        setAvailability(u.availability || 'Flexible')
        setAbout(u.about || '')
        setSelected(u.skills || [])
        //setSelected(u.skills || [])
        setAvatarUrl((u as any).avatar_url || '')
        setResumeUrl((u as any).resume_url || '')
      })
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false))
  }, [nav])

  const toggle = (s: string) => setSelected(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])

  const handleSave = async () => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      await updateUser(currentUser.id, { name, department, availability, about, skills: selected, avatar_url: avatarUrl, resume_url: resumeUrl })
      localStorage.setItem('user', JSON.stringify({ ...currentUser, name }))
      setSuccess(true)
      setTimeout(() => nav('/dashboard'), 1200)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <div style={{ padding: '48px 32px' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Loading your profile...</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '56px 32px' }}>
        <p style={{ fontSize: 11, fontWeight: 500, color: '#F2C4CD', letterSpacing: 1, textTransform: 'uppercase', opacity: 0.65, marginBottom: 12 }}>Your profile</p>
        <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: -1, marginBottom: 8 }}>Tell us about yourself</h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 40, lineHeight: 1.6 }}>This builds your semantic profile for AI-powered matching.</p>

        {error && (
          <div style={{ background: 'rgba(242,196,205,0.1)', border: '0.5px solid rgba(242,196,205,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 20, color: '#F2C4CD', fontSize: 13 }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: 'rgba(29,158,117,0.1)', border: '0.5px solid rgba(29,158,117,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 20, color: '#5DCAA5', fontSize: 13 }}>
            Profile saved! Redirecting...
          </div>
        )}

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Full name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Athiena Rae"
            style={{ width: '100%', background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Email</label>
          <input value={email} readOnly
            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(242,196,205,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: 'rgba(255,255,255,0.4)', outline: 'none', boxSizing: 'border-box', cursor: 'default' }} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Department</label>
          <input value={department} onChange={e => setDepartment(e.target.value)} placeholder="Computer Science"
            style={{ width: '100%', background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Availability</label>
          <select value={availability} onChange={e => setAvailability(e.target.value)} style={{ width: '100%', background: '#051F45', border: '0.5px solid rgba(242,196,205,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none' }}>
            <option>Weekends only</option>
            <option>Weekday evenings</option>
            <option>Full-time</option>
            <option>Flexible</option>
          </select>
        </div>
        <div style={{ marginBottom: 24 }}>
  <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Profile Picture</label>
  <FileUpload
    uploadType="avatar"
    userId={JSON.parse(localStorage.getItem('user') || '{}').id || 'anonymous'}
    hint="PNG, JPG, WEBP · Max 10MB"
    onUploadSuccess={(url) => setAvatarUrl(url)}
    onUploadError={(err) => setError(err)}
  />
  {avatarUrl && (
    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>✓ Avatar uploaded</p>
  )}
</div>

<div style={{ marginBottom: 24 }}>
  <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Resume / CV</label>
  <FileUpload
    uploadType="resume"
    userId={JSON.parse(localStorage.getItem('user') || '{}').id || 'anonymous'}
    hint="PDF, DOC, DOCX · Max 10MB"
    onUploadSuccess={(url) => setResumeUrl(url)}
    onUploadError={(err) => setError(err)}
  />
  {resumeUrl && (
    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>✓ Resume uploaded</p>
  )}
</div>

        <div style={{ marginBottom: 32 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>Skills</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SKILLS.map(s => (
              <button key={s} onClick={() => toggle(s)} style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
                background: selected.includes(s) ? '#F2C4CD' : 'rgba(242,196,205,0.07)',
                color: selected.includes(s) ? '#051F45' : 'rgba(255,255,255,0.6)',
                border: "0.5px solid " + (selected.includes(s) ? '#F2C4CD' : 'rgba(242,196,205,0.2)'),
                fontWeight: selected.includes(s) ? 500 : 400
              }}>{s}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>About you</label>
          <textarea rows={4} value={about} onChange={e => setAbout(e.target.value)}
            placeholder="What kind of projects are you interested in? What are your goals?"
            style={{ width: '100%', background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
        </div>

        <button onClick={handleSave} disabled={saving} style={{
          width: '100%', background: saving ? 'rgba(242,196,205,0.5)' : '#F2C4CD', color: '#051F45',
          border: 'none', padding: '12px', borderRadius: 8, fontSize: 15, fontWeight: 500,
          cursor: saving ? 'not-allowed' : 'pointer'
        }}>
          {saving ? 'Saving...' : 'Save profile'}
        </button>
      </div>
    </div>
  )
}