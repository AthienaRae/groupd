import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import ProfileForm from './pages/ProfileForm'
import Teams from './pages/Teams'
import CreateTeam from './pages/CreateTeam'
import Match from './pages/Match'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfileForm />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/create" element={<CreateTeam />} />
        <Route path="/match" element={<Match />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App