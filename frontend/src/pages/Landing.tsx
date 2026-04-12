import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function Landing() {
  const nav = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <div style={{ padding: '72px 32px 0' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(242,196,205,0.08)', border: '0.5px solid rgba(242,196,205,0.2)',
          borderRadius: 20, padding: '4px 14px', fontSize: 12, color: '#F2C4CD', marginBottom: 28
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F2C4CD', display: 'inline-block' }} />
          AI-powered campus matching
        </div>
        <h1 style={{ fontSize: 46, fontWeight: 500, lineHeight: 1.12, letterSpacing: -1.5, marginBottom: 18, maxWidth: 580 }}>
          Find your team.<br />
          Build something <span style={{ color: '#F2C4CD' }}>great.</span>
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
          Groupd uses semantic AI to match you with teammates whose skills complement yours — less time searching, more time building.
        </p>
        <div style={{ display: 'flex', gap: 12, marginBottom: 56 }}>
          <button onClick={() => nav('/profile')} style={{
            background: '#F2C4CD', color: '#051F45', border: 'none',
            padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer'
          }}>Create your profile</button>
          <button onClick={() => nav('/teams')} style={{
            background: 'transparent', color: 'rgba(255,255,255,0.7)',
            border: '0.5px solid rgba(242,196,205,0.3)',
            padding: '10px 24px', borderRadius: 8, fontSize: 14, cursor: 'pointer'
          }}>Browse teams</button>
        </div>
        <div style={{ display: 'flex', gap: 40, padding: '32px 0', borderTop: '0.5px solid rgba(242,196,205,0.1)' }}>
          {[['240+', 'Students matched'], ['80+', 'Teams formed'], ['94%', 'Match satisfaction']].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontSize: 28, fontWeight: 500, color: '#F2C4CD' }}>{n}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '48px 32px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#F2C4CD', letterSpacing: 1, textTransform: 'uppercase', opacity: 0.65, marginBottom: 16 }}>
          What Groupd does
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {[
            { title: 'Semantic matching', desc: 'Azure OpenAI embeds your profile and finds teammates with complementary skills, not just keyword matches.' },
            { title: 'Team listings', desc: 'Browse open teams by project type, tech stack, or availability. Post your own and let members find you.' },
            { title: 'Smart profiles', desc: 'Add your skills and interests. Groupd builds a semantic profile that improves your match quality over time.' },
          ].map(f => (
            <div key={f.title} style={{
              background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.13)',
              borderRadius: 12, padding: 20
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(242,196,205,0.1)', marginBottom: 14 }} />
              <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.42)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}