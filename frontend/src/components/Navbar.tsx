import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const links = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Teams', path: '/teams' },
    { label: 'Match', path: '/match' },
  ]

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 32px', borderBottom: '0.5px solid var(--peach-border)'
    }}>
      <div onClick={() => navigate('/')} style={{
        fontSize: 20, fontWeight: 500, color: 'var(--peach)',
        letterSpacing: -0.5, cursor: 'pointer'
      }}>
        group<span style={{ opacity: 0.4 }}>d</span>
      </div>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        {links.map(l => (
          <span key={l.path} onClick={() => navigate(l.path)} style={{
            fontSize: 14, cursor: 'pointer',
            color: location.pathname === l.path ? 'var(--peach)' : 'var(--text-secondary)'
          }}>{l.label}</span>
        ))}
        <button onClick={() => navigate('/profile')} style={{
          background: 'var(--peach)', color: 'var(--sapphire)',
          border: 'none', padding: '8px 18px', borderRadius: 8,
          fontSize: 14, cursor: 'pointer', fontWeight: 500
        }}>My profile</button>
      </div>
    </nav>
  )
}