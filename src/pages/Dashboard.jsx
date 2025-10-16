import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { CreditCard, TrendingUp, Plus, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import Loading from '../components/Loading'

const Dashboard = () => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSpent: 0
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [transactionsRes, conversationsRes] = await Promise.all([
        api.get('/credits/transactions'),
        api.get('/chat/conversations').catch(() => ({ data: { data: { conversations: [] } } }))
      ])

      const allTransactions = transactionsRes.data.data.transactions

      setTransactions(allTransactions.slice(0, 5)) // Mostrar apenas as 5 mais recentes
      setConversations(conversationsRes.data.data.conversations?.slice(0, 3) || [])

      // Calcular estatísticas reais
      const totalSpent = allTransactions
        .filter(t => t.type === 'spend' && t.status === 'completed')
        .reduce((sum, t) => sum + t.credits, 0)

      setStats({
        totalSpent
      })
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/10 border-green-500/30'
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
      case 'failed':
        return 'text-red-400 bg-red-500/10 border-red-500/30'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Concluído'
      case 'pending':
        return 'Pendente'
      case 'failed':
        return 'Falhou'
      default:
        return status
    }
  }

  if (loading) {
    return <Loading message="Carregando dashboard..." />
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 neon-text">
          Olá, {user?.name}! 👋
        </h1>
        <p className="text-lightText/70">Bem-vindo ao seu dashboard</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Créditos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-neonPurple/20 to-accent/20 border border-neonPurple/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <CreditCard className="text-accent" size={32} />
            <Link
              to="/credits"
              className="text-sm text-accent hover:underline flex items-center space-x-1"
            >
              <Plus size={16} />
              <span>Adicionar</span>
            </Link>
          </div>
          <h3 className="text-3xl font-bold mb-1">{user?.credits || 0}</h3>
          <p className="text-lightText/70 text-sm">Créditos Disponíveis</p>
        </motion.div>

        {/* Gasto Total */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-darkGray border border-neonPurple/20 rounded-xl p-6"
        >
          <TrendingUp className="text-green-400 mb-4" size={32} />
          <h3 className="text-3xl font-bold mb-1">{stats.totalSpent}</h3>
          <p className="text-lightText/70 text-sm">Créditos Gastos</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Transações Recentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-darkGray border border-neonPurple/20 rounded-xl p-6"
        >
          <h2 className="text-2xl font-bold mb-6">Transações Recentes</h2>
          
          {transactions.length === 0 ? (
            <p className="text-lightText/60 text-center py-8">
              Nenhuma transação ainda
            </p>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-neonPurple/10 hover:border-neonPurple/30 transition-colors"
                >
                  <div>
                    <p className="font-semibold mb-1">
                      {transaction.description || 'Compra de créditos'}
                    </p>
                    <p className="text-sm text-lightText/60">
                      {new Date(transaction.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-accent mb-1">
                      +{transaction.credits} créditos
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(transaction.status)}`}>
                      {getStatusText(transaction.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link
            to="/credits"
            className="block mt-6 text-center text-accent hover:underline"
          >
            Ver todas as transações →
          </Link>
        </motion.div>

        {/* Conversas Recentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-darkGray border border-neonPurple/20 rounded-xl p-6"
        >
          <h2 className="text-2xl font-bold mb-6">Conversas Recentes</h2>
          
          {conversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="mx-auto mb-3 text-neonPurple/50" size={48} />
              <p className="text-lightText/60 mb-4">Nenhuma conversa ainda</p>
              <Link
                to="/models"
                className="inline-block px-6 py-2 bg-gradient-to-r from-neonPurple to-accent rounded-lg font-semibold hover:shadow-neon transition-all"
              >
                Ver Modelos
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {conversations.map((conv) => (
                <Link
                  key={conv.modelId._id}
                  to={`/chat/${conv.modelId._id}`}
                  className="flex items-center space-x-4 p-4 bg-black/30 rounded-lg border border-neonPurple/10 hover:border-neonPurple/30 transition-all group"
                >
                  <img
                    src={conv.modelId.avatar || 'https://via.placeholder.com/48'}
                    alt={conv.modelId.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lightText group-hover:text-accent transition-colors">
                      {conv.modelId.name}
                    </h3>
                    <p className="text-sm text-lightText/60 truncate">
                      {conv.lastMessagePreview || 'Iniciar conversa'}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="bg-accent text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {conv.unreadCount}
                    </div>
                  )}
                </Link>
              ))}
              <Link
                to="/models"
                className="block text-center text-accent hover:underline pt-2"
              >
                Ver todos os modelos →
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard

