import { Link } from 'react-router-dom'
import { MessageCircle, Star, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

const ModelCard = ({ model }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-darkGray border border-neonPurple/20 rounded-xl overflow-hidden hover:border-neonPurple/50 transition-all hover:shadow-neon group"
    >
      {/* Imagem */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={model.coverPhoto} 
          alt={model.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Status Online */}
        {model.isOnline && (
          <div className="absolute top-3 right-3 flex items-center space-x-1 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold">Online</span>
          </div>
        )}

        {/* Overlay com botão */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Link 
            to={`/chat/${model.userIdString || model.userId?._id || model.userId}`}
            className="px-6 py-3 bg-gradient-to-r from-neonPurple to-accent rounded-lg font-semibold flex items-center space-x-2 hover:shadow-neon transition-all btn-glow"
          >
            <MessageCircle size={20} />
            <span>Iniciar Chat</span>
          </Link>
        </div>
      </div>

      {/* Informações */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold text-lightText mb-1">{model.name}</h3>
            <p className="text-sm text-lightText/60">{model.age} anos</p>
          </div>
          
          {/* Rating */}
          <div className="flex items-center space-x-1 bg-neonPurple/20 px-2 py-1 rounded-lg">
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold">{model.rating}</span>
          </div>
        </div>

        {/* Bio */}
        {model.bio && (
          <p className="text-sm text-lightText/70 mb-3 line-clamp-2">
            {model.bio}
          </p>
        )}

        {/* Tags */}
        {model.tags && model.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {model.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-1 bg-neonPurple/10 border border-neonPurple/30 rounded-full text-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-neonPurple/20">
          <div className="flex items-center space-x-1 text-lightText/60 text-sm">
            <Clock size={16} />
            <span>{model.totalChats} chats</span>
          </div>
          <div className="text-accent font-semibold">
            {model.pricePerMessage} créditos/msg
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ModelCard

