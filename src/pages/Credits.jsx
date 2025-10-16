import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { CreditCard, Sparkles, Check, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Loading from '../components/Loading'

const Credits = () => {
  const { user, updateUser } = useAuth()
  const [packages, setPackages] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [packagesRes, transactionsRes] = await Promise.all([
        api.get('/credits/packages'),
        api.get('/credits/transactions?limit=10')
      ])

      setPackages(packagesRes.data.data.packages)
      setTransactions(transactionsRes.data.data.transactions)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar informações')
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (packageIndex) => {
    setPurchasing(true)

    try {
      const response = await api.post('/credits/purchase', {
        packageIndex,
        paymentMethod: 'pix' // Mock
      })

      toast.success('Compra realizada com sucesso! Aguardando confirmação...')
      
      // Simular atualização de créditos após 2 segundos
      setTimeout(() => {
        const pkg = packages[packageIndex]
        const newCredits = user.credits + pkg.credits + pkg.bonus
        updateUser({ credits: newCredits })
        toast.success(`${pkg.credits + pkg.bonus} créditos adicionados!`)
        fetchData() // Recarregar transações
      }, 2000)

    } catch (error) {
      console.error('Erro ao comprar créditos:', error)
      toast.error('Erro ao processar compra')
    } finally {
      setPurchasing(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-400'
      case 'pending':
        return 'text-yellow-400'
      case 'failed':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  if (loading) {
    return <Loading message="Carregando pacotes..." />
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
          Comprar Créditos
        </h1>
        <p className="text-lightText/70 text-lg mb-6">
          Escolha o melhor pacote para você
        </p>
        
        {/* Saldo Atual */}
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-neonPurple/20 to-accent/20 border border-neonPurple/30 rounded-full px-8 py-4">
          <CreditCard className="text-accent" size={28} />
          <div className="text-left">
            <p className="text-sm text-lightText/70">Seu Saldo</p>
            <p className="text-2xl font-bold">{user?.credits || 0} Créditos</p>
          </div>
        </div>
      </motion.div>

      {/* Pacotes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {packages.map((pkg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative bg-darkGray border rounded-2xl p-6 hover:shadow-neon transition-all ${
              pkg.bonus > 0 
                ? 'border-accent shadow-neon-pink' 
                : 'border-neonPurple/30'
            }`}
          >
            {/* Badge de Bônus */}
            {pkg.bonus > 0 && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-neonPurple to-accent px-4 py-1 rounded-full flex items-center space-x-1">
                  <Sparkles size={14} />
                  <span className="text-xs font-bold">+{pkg.bonus} BÔNUS</span>
                </div>
              </div>
            )}

            {/* Conteúdo */}
            <div className="text-center mb-6 mt-2">
              <div className="text-5xl font-black mb-2 bg-gradient-to-r from-neonPurple to-accent bg-clip-text text-transparent">
                {pkg.credits}
              </div>
              <p className="text-lightText/70">créditos</p>
              {pkg.bonus > 0 && (
                <p className="text-accent font-semibold text-sm mt-1">
                  Total: {pkg.credits + pkg.bonus}
                </p>
              )}
            </div>

            {/* Preço */}
            <div className="text-center mb-6">
              <span className="text-3xl font-bold">R$ {pkg.price.toFixed(2)}</span>
            </div>

            {/* Botão */}
            <button
              onClick={() => handlePurchase(index)}
              disabled={purchasing}
              className="w-full py-3 bg-gradient-to-r from-neonPurple to-accent rounded-lg font-bold hover:shadow-neon transition-all btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {purchasing ? 'Processando...' : 'Comprar'}
            </button>

            {/* Features */}
            <ul className="mt-6 space-y-2 text-sm text-lightText/70">
              <li className="flex items-center space-x-2">
                <Check size={16} className="text-green-400" />
                <span>Crédito instantâneo</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check size={16} className="text-green-400" />
                <span>Pagamento seguro</span>
              </li>
              {pkg.bonus > 0 && (
                <li className="flex items-center space-x-2">
                  <Sparkles size={16} className="text-accent" />
                  <span className="text-accent font-semibold">Créditos bônus</span>
                </li>
              )}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Histórico de Transações */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-darkGray border border-neonPurple/20 rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold mb-6">Histórico de Compras</h2>
        
        {transactions.length === 0 ? (
          <p className="text-lightText/60 text-center py-8">
            Nenhuma transação ainda
          </p>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-neonPurple/10"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    transaction.status === 'completed' 
                      ? 'bg-green-500/20' 
                      : 'bg-yellow-500/20'
                  }`}>
                    {transaction.status === 'completed' ? (
                      <Check className="text-green-400" size={20} />
                    ) : (
                      <Clock className="text-yellow-400" size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {transaction.description || 'Compra de créditos'}
                    </p>
                    <p className="text-sm text-lightText/60">
                      {new Date(transaction.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-accent text-lg">
                    +{transaction.credits}
                  </p>
                  <p className={`text-sm ${getStatusColor(transaction.status)}`}>
                    {transaction.status === 'completed' ? 'Concluído' : 
                     transaction.status === 'pending' ? 'Pendente' : 'Falhou'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Credits

