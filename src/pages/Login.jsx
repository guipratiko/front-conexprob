import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, Sparkles, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await login(formData.email, formData.password)
    
    setLoading(false)

    if (result.success) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-darkGray border border-neonPurple/30 rounded-2xl p-8 shadow-neon">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Sparkles className="text-neonPurple animate-pulse" size={48} />
            </div>
            <h1 className="text-3xl font-bold mb-2 neon-text">Bem-vindo de Volta</h1>
            <p className="text-lightText/70">Entre para continuar suas conversas</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-lightText">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neonPurple" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-black/50 border border-neonPurple/30 rounded-lg focus:outline-none focus:border-neonPurple text-lightText"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium mb-2 text-lightText">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neonPurple" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-12 py-3 bg-black/50 border border-neonPurple/30 rounded-lg focus:outline-none focus:border-neonPurple text-lightText"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lightText/60 hover:text-neonPurple transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-neonPurple to-accent rounded-lg font-bold hover:shadow-neon transition-all btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-lightText/70">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-accent font-semibold hover:underline">
              Cadastre-se
            </Link>
          </div>
        </div>

        {/* Aviso */}
        <p className="mt-6 text-center text-xs text-lightText/50">
          🔞 Ao entrar, você confirma ser maior de 18 anos
        </p>
      </motion.div>
    </div>
  )
}

export default Login

