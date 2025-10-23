import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Páginas
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CompleteRegistration from './pages/CompleteRegistration'
import Dashboard from './pages/Dashboard'
import Models from './pages/Models'
import Credits from './pages/Credits'
import Chat from './pages/Chat'
import NotFound from './pages/NotFound'

// Componentes
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background gradient-bg relative">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/complete-registration" element={<CompleteRegistration />} />
            
            {/* Rotas protegidas */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/models" element={
              <ProtectedRoute>
                <Models />
              </ProtectedRoute>
            } />
            <Route path="/credits" element={
              <ProtectedRoute>
                <Credits />
              </ProtectedRoute>
            } />
            <Route path="/chat/:modelId" element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

