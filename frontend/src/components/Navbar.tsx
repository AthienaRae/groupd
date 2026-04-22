import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 32px', borderBottom: '0.5px solid rgba(242,196,205,0.15)'
    }}>
      <Link to="/" style={{ fontSize: 22, fontWeight: 500, color: '#fff', textDecoration: 'none', letterSpacing: -0.5 }}>
        group<span style={{ color: '#F2C4CD' }}>d</span>
      </Link>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <Link to="/search" style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Search</Link>
        <Link to="/teams" style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Teams</Link>
        <Link to="/match" style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Match</Link>
        <Link to="/messages" style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Messages</Link>
        <Link to="/about" style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>About</Link>
        <Link to="/notifications" style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2a5 5 0 0 0-5 5v3l-1.5 2h13L14 10V7a5 5 0 0 0-5-5Z" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
              <path d="M7 14a2 2 0 0 0 4 0" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
            </svg>
            <div style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, borderRadius: '50%', background: '#F2C4CD' }} />
          </div>
        </Link>

        {token ? (
          <>
            <Link to="/dashboard" style={{
              background: '#F2C4CD', color: '#051F45', border: 'none',
              padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none'
            }}>Dashboard</Link>
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '0.5px solid rgba(242,196,205,0.3)',
                color: 'rgba(255,255,255,0.5)',
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 14,
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{
              background: '#F2C4CD', color: '#051F45', border: 'none',
              padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none'
            }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
