import { useState, useEffect } from 'react'
import api from '../services/api'
import ModelCard from '../components/ModelCard'
import Loading from '../components/Loading'
import { Search, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const Models = () => {
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [onlineOnly, setOnlineOnly] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchModels()
  }, [onlineOnly])

  const fetchModels = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/models?online=${onlineOnly}`)
      const modelsData = response.data.data.models
      
      // Debug: verificar estrutura dos dados
      if (modelsData && modelsData.length > 0) {
        console.log('📊 Primeira modelo:', modelsData[0])
        console.log('   - userId tipo:', typeof modelsData[0].userId)
        console.log('   - userId valor:', modelsData[0].userId)
        console.log('   - userIdString:', modelsData[0].userIdString)
      }
      
      setModels(modelsData)
    } catch (error) {
      console.error('Erro ao carregar modelos:', error)
      toast.error('Erro ao carregar modelos')
    } finally {
      setLoading(false)
    }
  }

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
          Modelos Online
        </h1>
        <p className="text-lightText/70 text-lg">
          Escolha uma modelo e comece a conversar agora mesmo
        </p>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 flex flex-col md:flex-row gap-4"
      >
        {/* Busca */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neonPurple" size={20} />
          <input
            type="text"
            placeholder="Buscar modelos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-darkGray border border-neonPurple/30 rounded-lg focus:outline-none focus:border-neonPurple text-lightText"
          />
        </div>

        {/* Filtro Online */}
        <button
          onClick={() => setOnlineOnly(!onlineOnly)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
            onlineOnly
              ? 'bg-gradient-to-r from-neonPurple to-accent shadow-neon'
              : 'bg-darkGray border border-neonPurple/30 hover:border-neonPurple/50'
          }`}
        >
          <Filter size={20} />
          <span>{onlineOnly ? 'Apenas Online' : 'Todas'}</span>
        </button>
      </motion.div>

      {/* Grid de Modelos */}
      {loading ? (
        <Loading message="Carregando modelos..." />
      ) : filteredModels.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-lightText/60 mb-4">
            {searchTerm ? 'Nenhuma modelo encontrada' : 'Nenhuma modelo disponível no momento'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-accent hover:underline"
            >
              Limpar busca
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredModels.map((model) => (
            <ModelCard key={model._id} model={model} />
          ))}
        </div>
      )}

      {/* Info */}
      {!loading && filteredModels.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-lightText/60"
        >
          <p>Mostrando {filteredModels.length} modelo(s)</p>
        </motion.div>
      )}
    </div>
  )
}

export default Models

