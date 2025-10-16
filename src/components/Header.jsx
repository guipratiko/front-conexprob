import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, LogOut, CreditCard } from 'lucide-react'
import { useState } from 'react'

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  return (
    <header className="absolute top-0 left-0 right-0 bg-transparent border-b border-neonPurple/20 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src="/img/logo.png" 
              alt="ConexaoProibida" 
              className="h-12 md:h-16 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/models" 
                  className="text-lightText hover:text-accent transition-colors"
                >
                  Modelos
                </Link>
                <Link 
                  to="/dashboard" 
                  className="text-lightText hover:text-accent transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/credits" 
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-neonPurple to-accent rounded-lg hover:shadow-neon transition-all"
                >
                  <CreditCard size={18} />
                  <span className="font-semibold">{user?.credits || 0} Créditos</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-lightText hover:text-red-400 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-lightText hover:text-accent transition-colors"
                >
                  Entrar
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2 bg-gradient-to-r from-neonPurple to-accent rounded-lg font-semibold hover:shadow-neon transition-all btn-glow"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-lightText hover:text-accent transition-colors"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 animate-fadeIn bg-black/95 backdrop-blur-md rounded-xl p-4 border border-neonPurple/30">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/models" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lightText hover:text-accent transition-colors py-3 px-2 hover:bg-neonPurple/10 rounded-lg"
                >
                  Modelos
                </Link>
                <Link 
                  to="/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lightText hover:text-accent transition-colors py-3 px-2 hover:bg-neonPurple/10 rounded-lg"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/credits" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-neonPurple to-accent rounded-lg hover:shadow-neon transition-all w-fit"
                >
                  <CreditCard size={18} />
                  <span className="font-semibold">{user?.credits || 0} Créditos</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-lightText hover:text-red-400 transition-colors py-2"
                >
                  <LogOut size={18} />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lightText hover:text-accent transition-colors py-3 px-2 hover:bg-neonPurple/10 rounded-lg"
                >
                  Entrar
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-6 py-2 bg-gradient-to-r from-neonPurple to-accent rounded-lg font-semibold hover:shadow-neon transition-all w-fit"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header

