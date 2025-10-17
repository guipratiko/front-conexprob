import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import socketService from '../services/socket'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  // Verificar autenticação ao carregar
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token')
      
      if (storedToken) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
          const response = await api.get('/auth/me')
          console.log('🔍 AuthContext - Resposta completa:', response.data)
          console.log('🔍 AuthContext - User encontrado:', response.data.data?.user)
          setUser(response.data.data.user)
          setToken(storedToken)
          
          // Conectar ao Socket.io
          socketService.connect(storedToken)
        } catch (error) {
          console.error('Erro ao verificar autenticação:', error)
          localStorage.removeItem('token')
          delete api.defaults.headers.common['Authorization']
          socketService.disconnect()
        }
      }
      
      setLoading(false)
    }

    checkAuth()
  }, [])

  // Login
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { user, token } = response.data.data

      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser(user)
      setToken(token)
      
      // Conectar ao Socket.io
      socketService.connect(token)
      
      toast.success('Login realizado com sucesso!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao fazer login'
      toast.error(message)
      return { success: false, message }
    }
  }

  // Registro
  const register = async (name, email, cpf, phone, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, cpf, phone, password })
      const { user, token } = response.data.data

      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser(user)
      setToken(token)
      
      // Conectar ao Socket.io
      socketService.connect(token)
      
      toast.success('Cadastro realizado com sucesso!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao criar conta'
      toast.error(message)
      return { success: false, message }
    }
  }

  // Logout
  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    socketService.disconnect()
    setUser(null)
    setToken(null)
    toast.success('Logout realizado com sucesso!')
  }

  // Atualizar usuário
  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }))
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

