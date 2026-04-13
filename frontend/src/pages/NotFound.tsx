import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function NotFound() {
  const nav = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '120px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 72, fontWeight: 500, color: 'rgba(242,196,205,0.2)', letterSpacing: -4, marginBottom: 16 }}>404</div>
        <h2 style={{ fontSize: 24, fontWeight: 500, marginBottom: 12 }}>Page not found</h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 32 }}>The page you're looking for doesn't exist or has been moved.</p>
        <button onClick={() => nav('/')} style={{ background: '#F2C4CD', color: '#051F45', border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Back to home</button>
      </div>
    </div>
  )
}
