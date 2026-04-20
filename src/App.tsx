import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Competitions from './pages/Competitions'
import CompetitionDetail from './pages/CompetitionDetail'
import Registration from './pages/Registration'
import Login from './pages/Login'

function App() {
  return (
    <BrowserRouter basename="/competition-hub-v2/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/competitions" element={<Competitions />} />
        <Route path="/competitions/:id" element={<CompetitionDetail />} />
        <Route path="/registration/:competitionId" element={<Registration />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
