import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const STACK = [
  { name: 'React', desc: 'Frontend UI', category: 'Frontend' },
  { name: 'TypeScript', desc: 'Type-safe code', category: 'Frontend' },
  { name: 'Azure Static Web Apps', desc: 'Frontend hosting', category: 'Azure' },
  { name: 'Python / Flask', desc: 'REST API backend', category: 'Backend' },
  { name: 'Docker', desc: 'Containerization', category: 'Backend' },
  { name: 'Azure Container Apps', desc: 'Backend hosting', category: 'Azure' },
  { name: 'Azure Cosmos DB', desc: 'NoSQL database', category: 'Azure' },
  { name: 'Azure Container Registry', desc: 'Docker image storage', category: 'Azure' },
  { name: 'Azure OpenAI', desc: 'Profile embeddings', category: 'AI' },
  { name: 'Azure AI Search', desc: 'Vector similarity search', category: 'AI' },
  { name: 'GitHub Actions', desc: 'CI/CD pipeline', category: 'DevOps' },
]

const STEPS = [
  { num: '01', title: 'Create your profile', desc: 'Add your skills, availability, and project interests. Groupd builds a semantic profile from your input.' },
  { num: '02', title: 'Get embedded', desc: 'Azure OpenAI generates a vector embedding of your profile, capturing meaning beyond just keywords.' },
  { num: '03', title: 'Semantic matching', desc: 'Azure AI Search compares your embedding against all other profiles and returns the closest matches.' },
  { num: '04', title: 'Connect and build', desc: 'Review your matches, connect with teammates, and start building your project together.' },
]

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: 'rgba(242,196,205,0.15)',
  Backend: 'rgba(5,31,69,0.8)',
  Azure: 'rgba(242,196,205,0.08)',
  AI: 'rgba(242,196,205,0.2)',
  DevOps: 'rgba(242,196,205,0.06)',
}

export default function About() {
  const nav = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '56px 32px' }}>

        <div style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#F2C4CD', letterSpacing: 1, textTransform: 'uppercase', opacity: 0.65, marginBottom: 12 }}>About Groupd</p>
          <h2 style={{ fontSize: 40, fontWeight: 500, letterSpacing: -1.5, marginBottom: 16, lineHeight: 1.15 }}>
            AI-powered team matching<br />for college students
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: 580 }}>
            Groupd is a cloud computing academic project built on Microsoft Azure. It uses semantic AI to help students find the right teammates for hackathons, course projects, and research — based on complementary skills and shared goals, not just keyword matches.
          </p>
        </div>

        <div style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#F2C4CD', letterSpacing: 1, textTransform: 'uppercase', opacity: 0.65, marginBottom: 24 }}>How it works</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            {STEPS.map(s => (
              <div key={s.num} style={{ background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.13)', borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 28, fontWeight: 500, color: 'rgba(242,196,205,0.25)', marginBottom: 12, letterSpacing: -1 }}>{s.num}</div>
                <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#F2C4CD', letterSpacing: 1, textTransform: 'uppercase', opacity: 0.65, marginBottom: 24 }}>Tech stack</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {STACK.map(t => (
              <div key={t.name} style={{ background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.13)', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{t.desc}</div>
                </div>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: CATEGORY_COLORS[t.category], color: '#F2C4CD', border: '0.5px solid rgba(242,196,205,0.2)', whiteSpace: 'nowrap' }}>{t.category}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.13)', borderRadius: 12, padding: 28, marginBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>Built by</h3>
            <p style={{ fontSize: 14, color: '#F2C4CD', marginBottom: 8, fontWeight: 500 }}>
              Athiena Rachel · Athira DR · Nithya Shree M
            </p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
              Cloud Computing academic project · Rajalakshmi Institution<br />
              Built on Microsoft Azure · 2026
            </p>
          </div>
          <button onClick={() => nav('/')} style={{ background: '#F2C4CD', color: '#051F45', border: 'none', padding: '9px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Try Groupd</button>
        </div>

      </div>
    </div>
  )
}