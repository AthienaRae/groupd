import Navbar from '../components/Navbar'

const MATCHES = [
  {
    id: '1', name: 'Arun Krishnan', dept: 'Computer Science', match: 94,
    skills: ['Python', 'ML/AI', 'Flask'], about: 'Interested in AI healthcare projects. Looking for a frontend dev to collaborate with.',
    availability: 'Weekends'
  },
  {
    id: '2', name: 'Priya Selvam', dept: 'Information Technology', match: 89,
    skills: ['React', 'UI/UX', 'MongoDB'], about: 'Final year student working on smart campus projects. Strong in design systems.',
    availability: 'Flexible'
  },
  {
    id: '3', name: 'Karthik Raja', dept: 'ECE', match: 82,
    skills: ['Kotlin', 'Java', 'Azure'], about: 'Android developer with IoT experience. Looking for ML teammates for a wearable project.',
    availability: 'Weekday evenings'
  },
  {
    id: '4', name: 'Divya Nair', dept: 'Computer Science', match: 78,
    skills: ['Docker', 'Azure', 'SQL'], about: 'Cloud and DevOps focused. Wants to build scalable backend systems for real-world problems.',
    availability: 'Weekends'
  },
]

function MatchBar({ score }: { score: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 4, borderRadius: 4, background: 'rgba(242,196,205,0.1)' }}>
        <div style={{ width: `${score}%`, height: '100%', borderRadius: 4, background: '#F2C4CD' }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 500, color: '#F2C4CD', minWidth: 32 }}>{score}%</span>
    </div>
  )
}

function Initials({ name }: { name: string }) {
  const parts = name.split(' ')
  const init = parts.map(p => p[0]).join('').slice(0, 2)
  return (
    <div style={{
      width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
      background: 'rgba(242,196,205,0.12)', border: '0.5px solid rgba(242,196,205,0.25)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 14, fontWeight: 500, color: '#F2C4CD'
    }}>{init}</div>
  )
}

export default function Match() {
  return (
    <div style={{ minHeight: '100vh', background: '#051F45' }}>
      <Navbar />
      <div style={{ padding: '48px 32px' }}>
        <p style={{ fontSize: 11, fontWeight: 500, color: '#F2C4CD', letterSpacing: 1, textTransform: 'uppercase', opacity: 0.65, marginBottom: 10 }}>AI matching</p>
        <h2 style={{ fontSize: 32, fontWeight: 500, letterSpacing: -1, marginBottom: 8 }}>Your matches</h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 40, lineHeight: 1.6 }}>
          Ranked by semantic similarity to your profile using Azure OpenAI embeddings.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720 }}>
          {MATCHES.map((m, i) => (
            <div key={m.id} style={{
              background: 'rgba(242,196,205,0.05)', border: '0.5px solid rgba(242,196,205,0.13)',
              borderRadius: 12, padding: 24
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
                <Initials name={m.name} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 500 }}>{m.name}</h3>
                      {i === 0 && (
                        <span style={{
                          fontSize: 11, padding: '2px 8px', borderRadius: 20,
                          background: 'rgba(242,196,205,0.15)', color: '#F2C4CD',
                          border: '0.5px solid rgba(242,196,205,0.3)'
                        }}>Best match</span>
                      )}
                    </div>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{m.availability}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>{m.dept}</p>
                  <MatchBar score={m.match} />
                </div>
              </div>

              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 14 }}>{m.about}</p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {m.skills.map(s => (
                    <span key={s} style={{
                      fontSize: 12, padding: '3px 10px', borderRadius: 20,
                      background: 'rgba(242,196,205,0.08)', color: 'rgba(255,255,255,0.6)',
                      border: '0.5px solid rgba(242,196,205,0.15)'
                    }}>{s}</span>
                  ))}
                </div>
                <button style={{
                  background: '#F2C4CD', color: '#051F45', border: 'none',
                  padding: '7px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer'
                }}>Connect</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}