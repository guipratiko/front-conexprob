import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import api from '../services/api'

const CompleteRegistration = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [verifyingToken, setVerifyingToken] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  // Verificar token ao carregar a página
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('Token não fornecido.')
        setVerifyingToken(false)
        setTokenValid(false)
        return
      }

      try {
        const response = await api.get(`/auth/verify-token/${token}`)
        if (response.data.success) {
          setTokenValid(true)
          setUserData(response.data.data)
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Token inválido ou expirado.')
        setTokenValid(false)
      } finally {
        setVerifyingToken(false)
      }
    }

    verifyToken()
  }, [token])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validar senhas
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres')
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/auth/complete-registration', {
        token,
        password: formData.password
      })

      if (response.data.success) {
        // Salvar token no localStorage e fazer login automaticamente
        localStorage.setItem('token', response.data.data.token)
        
        // Aguardar um pouco para mostrar mensagem de sucesso
        setTimeout(() => {
          navigate('/dashboard')
        }, 1500)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao completar cadastro.')
      setLoading(false)
    }
  }

  // Tela de loading enquanto verifica o token
  if (verifyingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <Sparkles className="text-neonPurple animate-pulse mx-auto mb-4" size={48} />
          <p className="text-lightText">Verificando seu link...</p>
        </div>
      </div>
    )
  }

  // Tela de erro se o token for inválido
  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-darkGray border border-red-500/30 rounded-2xl p-8 shadow-neon text-center">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={64} />
            <h1 className="text-2xl font-bold mb-4 text-lightText">Link Inválido</h1>
            <p className="text-lightText/70 mb-6">
              {error || 'Este link de cadastro é inválido ou expirou.'}
            </p>
            <button
              onClick={() => navigate('/register')}
              className="w-full py-3 bg-gradient-to-r from-neonPurple to-accent rounded-lg font-bold hover:shadow-neon transition-all"
            >
              Criar Nova Conta
            </button>
          </div>
        </motion.div>
      </div>
    )
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
              <CheckCircle className="text-green-500" size={48} />
            </div>
            <h1 className="text-3xl font-bold mb-2 neon-text">Completar Cadastro</h1>
            <p className="text-lightText/70 mb-4">
              Olá, <span className="text-accent font-semibold">{userData?.name}</span>!
            </p>
            <p className="text-lightText/70">
              Sua compra foi aprovada com sucesso! 🎉
            </p>
            <div className="bg-neonPurple/10 border border-neonPurple/30 rounded-lg p-4 mt-4">
              <p className="text-sm text-lightText/90">
                Você ganhou <span className="text-accent font-bold text-xl">{userData?.credits}</span> créditos!
              </p>
            </div>
            <p className="text-lightText/70 mt-4 text-sm">
              Crie uma senha para acessar sua conta e começar a conversar com as modelos.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Senha */}
            <div>
              <label className="block text-sm font-medium mb-2 text-lightText">
                Criar Senha
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
                  placeholder="Mínimo 6 caracteres"
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

            {/* Confirmar Senha */}
            <div>
              <label className="block text-sm font-medium mb-2 text-lightText">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neonPurple" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-12 py-3 bg-black/50 border border-neonPurple/30 rounded-lg focus:outline-none focus:border-neonPurple text-lightText"
                  placeholder="Confirme sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lightText/60 hover:text-neonPurple transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/30 rounded-lg py-2">
                {error}
              </div>
            )}

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-neonPurple to-accent rounded-lg font-bold hover:shadow-neon transition-all btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando senha...' : 'Completar Cadastro'}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 text-center text-xs text-lightText/50">
            <p>Seus créditos já estão disponíveis na sua conta! 🎁</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default CompleteRegistration

