import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Lock, Eye, EyeOff, Phone, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;

    // Máscara para CPF
    if (name === 'cpf') {
      value = value.replace(/\D/g, ''); // Remove tudo que não é número
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      value = value.substring(0, 14); // Limita a 14 caracteres (XXX.XXX.XXX-XX)
    }

    // Máscara para telefone
    if (name === 'phone') {
      value = value.replace(/\D/g, ''); // Remove tudo que não é número
      if (value.length <= 11) {
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
      }
    }

    setFormData({
      ...formData,
      [name]: value
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

    // Validar CPF
    const cpfNumbers = formData.cpf.replace(/\D/g, '');
    if (cpfNumbers.length !== 11) {
      setError('CPF deve ter 11 dígitos');
      return;
    }

    // Validar telefone
    const phoneNumbers = formData.phone.replace(/\D/g, '');
    if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
      setError('Telefone inválido');
      return;
    }

    setLoading(true)

    const result = await register(
      formData.name, 
      formData.email, 
      formData.cpf,
      formData.phone,
      formData.password
    )
    
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
            <h1 className="text-3xl font-bold mb-2 neon-text">Criar Conta</h1>
            <p className="text-lightText/70">Cadastre-se e comece a conversar com modelos online!</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium mb-2 text-lightText">
                Nome
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neonPurple" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-black/50 border border-neonPurple/30 rounded-lg focus:outline-none focus:border-neonPurple text-lightText"
                  placeholder="Seu nome"
                />
              </div>
            </div>

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

            {/* CPF */}
            <div>
              <label className="block text-sm font-medium mb-2 text-lightText">
                CPF
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neonPurple" size={20} />
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-black/50 border border-neonPurple/30 rounded-lg focus:outline-none focus:border-neonPurple text-lightText"
                  placeholder="XXX.XXX.XXX-XX"
                  maxLength={14}
                />
              </div>
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-medium mb-2 text-lightText">
                Telefone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neonPurple" size={20} />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-black/50 border border-neonPurple/30 rounded-lg focus:outline-none focus:border-neonPurple text-lightText"
                  placeholder="(XX) XXXXX-XXXX"
                  maxLength={15}
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
                  placeholder="••••••••"
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
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-lightText/70">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-accent font-semibold hover:underline">
              Entrar
            </Link>
          </div>
        </div>

        {/* Aviso */}
        <p className="mt-6 text-center text-xs text-lightText/50">
          🔞 Ao criar uma conta, você confirma ser maior de 18 anos
        </p>
      </motion.div>
    </div>
  )
}

export default Register

