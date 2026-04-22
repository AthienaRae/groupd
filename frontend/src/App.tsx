import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import ProfileForm from './pages/ProfileForm'
import Teams from './pages/Teams'
import CreateTeam from './pages/CreateTeam'
import Match from './pages/Match'
import TeamDetail from './pages/TeamDetail'
import ProfileView from './pages/ProfileView'
import About from './pages/About'
import Connections from './pages/Connections'
import Messages from './pages/Messages'
import Chat from './pages/Chat'
import Search from './pages/Search'
import NotFound from './pages/NotFound'
import Notifications from './pages/Notifications'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfileForm />} />
        <Route path="/profile/:id" element={<ProfileView />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/create" element={<CreateTeam />} />
        <Route path="/teams/:id" element={<TeamDetail />} />
        <Route path="/match" element={<Match />} />
        <Route path="/connections" element={<Connections />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/chat/:userId" element={<Chat />} />
        <Route path="/search" element={<Search />} />
        <Route path="/about" element={<About />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
