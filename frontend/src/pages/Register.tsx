import {useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await register({ name, email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/profile')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.06)',
    border: '0.5px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: '11px 14px',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s'
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#051F45',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'inherit',
      padding: '24px'
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link to="/" style={{ fontSize: 28, fontWeight: 500, color: '#fff', textDecoration: 'none', letterSpacing: -0.5 }}>
            group<span style={{ color: '#F2C4CD' }}>d</span>
          </Link>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 }}>
            Create your account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '0.5px solid rgba(242,196,205,0.15)',
          borderRadius: 16,
          padding: '36px 32px'
        }}>
          {error && (
            <div style={{
              background: 'rgba(242,196,205,0.1)',
              border: '0.5px solid rgba(242,196,205,0.3)',
              borderRadius: 8,
              padding: '10px 14px',
              marginBottom: 20,
              color: '#F2C4CD',
              fontSize: 13
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Your name"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(242,196,205,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(242,196,205,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(242,196,205,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? 'rgba(242,196,205,0.5)' : '#F2C4CD',
                color: '#051F45',
                border: 'none',
                borderRadius: 8,
                padding: '12px',
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s'
              }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#F2C4CD', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
