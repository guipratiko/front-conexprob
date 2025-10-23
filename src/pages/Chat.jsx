import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import socketService from '../services/socket'
import { Send, ArrowLeft, Circle, CreditCard } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Loading from '../components/Loading'

const Chat = () => {
  const params = useParams()
  const modelId = params.modelId || params['*'] // Garantir que pegue o ID como string
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const messagesEndRef = useRef(null)
  
  // Debug: verificar user
  console.log('🔍 Chat - User atual:', user)
  console.log('🔍 Chat - User ID:', user?._id)

  const [model, setModel] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showCreditModal, setShowCreditModal] = useState(false)
  const [creditError, setCreditError] = useState(null)

  console.log('🔑 ModelId recebido:', modelId, typeof modelId)

  useEffect(() => {
    fetchModelData()
    loadConversation()
    
    // Configurar listeners do Socket.io
    socketService.on('receive-message', handleReceiveMessage)
    socketService.on('message-sent', handleMessageSent)
    socketService.on('message-error', handleMessageError)
    socketService.on('user-typing', handleUserTyping)

    // Marcar mensagens como lidas ao entrar no chat
    socketService.markAsRead(modelId)

    // Cleanup
    return () => {
      socketService.off('receive-message', handleReceiveMessage)
      socketService.off('message-sent', handleMessageSent)
      socketService.off('message-error', handleMessageError)
      socketService.off('user-typing', handleUserTyping)
    }
  }, [modelId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchModelData = async () => {
    try {
      if (!modelId || typeof modelId !== 'string') {
        console.error('❌ modelId inválido:', modelId)
        toast.error('ID da modelo inválido')
        navigate('/models')
        return
      }

      // modelId é na verdade o userId da modelo
      console.log('🔍 Buscando modelo com userId:', modelId, 'tipo:', typeof modelId)
      
      // Buscar o perfil Model pelo userId
      const response = await api.get(`/models?userId=${encodeURIComponent(modelId)}`)
      const modelProfile = response.data.data.models[0]
      
      console.log('📊 Modelo encontrada:', modelProfile ? 'Sim' : 'Não')
      
      if (!modelProfile) {
        toast.error('Modelo não encontrada. Por favor, selecione outra modelo.')
        navigate('/models')
        return
      }
      
      setModel({
        ...modelProfile,
        userId: modelId
      })
    } catch (error) {
      console.error('❌ Erro ao carregar modelo:', error)
      toast.error('Erro ao carregar informações da modelo')
      navigate('/models')
    } finally {
      setLoading(false)
    }
  }

  const loadConversation = async () => {
    try {
      const response = await api.get(`/chat/conversation/${modelId}`)
      setMessages(response.data.data.messages || [])
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
    }
  }

  const handleReceiveMessage = (data) => {
    console.log('📨 Mensagem recebida:', data)
    const { message, senderId } = data
    if (senderId === modelId || senderId?.toString() === modelId) {
      setMessages(prev => [...prev, message])
      // Marcar como lida automaticamente
      socketService.markAsRead(modelId)
    }
  }

  const handleMessageSent = (data) => {
    console.log('✅ Mensagem enviada:', data)
    const { message } = data
    setMessages(prev => [...prev, message])
    setSending(false)
    setNewMessage('')
    toast.success('Mensagem enviada!')
  }

  const handleMessageError = (data) => {
    console.error('❌ Erro ao enviar:', data)
    
    // Verificar se é erro de créditos insuficientes
    if (data.insufficientCredits) {
      // Mostrar modal centralizado
      setCreditError(data)
      setShowCreditModal(true)
    } else {
      toast.error(data.message || 'Erro ao enviar mensagem')
    }
    
    setSending(false)
    setNewMessage('') // Limpar campo mesmo com erro
  }

  const handleUserTyping = (data) => {
    if (data.userId === modelId) {
      setIsTyping(data.isTyping)
      if (data.isTyping) {
        setTimeout(() => setIsTyping(false), 3000)
      }
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    setSending(true)

    console.log('📤 Enviando mensagem para:', modelId)
    console.log('💬 Conteúdo:', newMessage.trim())

    // Enviar via Socket.io (sem verificar créditos)
    socketService.sendMessage(modelId, newMessage.trim(), 'text')
  }

  const handleTyping = () => {
    socketService.typing(modelId, true)
    
    // Parar de indicar digitação após 2 segundos
    clearTimeout(handleTyping.timeout)
    handleTyping.timeout = setTimeout(() => {
      socketService.typing(modelId, false)
    }, 2000)
  }

  if (loading) {
    return <Loading message="Carregando chat..." />
  }

  if (!model) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lightText/70">Modelo não encontrada</p>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col pt-20">
      {/* Header do Chat */}
      <div className="bg-darkGray border-b border-neonPurple/20 px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/models')}
              className="text-lightText hover:text-accent transition-colors"
            >
              <ArrowLeft size={24} />
            </button>

            <img
              src={model.coverPhoto}
              alt={model.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-neonPurple"
            />

            <div>
              <h2 className="font-bold text-lg">{model.name}</h2>
              <div className="flex items-center space-x-2 text-sm">
                {model.isOnline ? (
                  <>
                    <Circle className="fill-green-500 text-green-500" size={8} />
                    <span className="text-green-400">Online</span>
                  </>
                ) : (
                  <>
                    <Circle className="fill-gray-500 text-gray-500" size={8} />
                    <span className="text-lightText/60">Offline</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Créditos */}
          <div className="flex items-center space-x-2 bg-neonPurple/20 px-4 py-2 rounded-lg">
            <CreditCard className="text-accent" size={20} />
            <span className="font-bold">{user?.credits || 0}</span>
          </div>
        </div>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto bg-black/30 px-4 py-6">
        <div className="container mx-auto max-w-4xl space-y-4">
          {messages.map((message) => {
            // Debug: verificar IDs
            console.log('🔍 Debug mensagem:', {
              messageId: message._id,
              senderId: message.senderId,
              senderIdString: message.senderId?.toString(),
              userId: user?._id,
              userIdString: user?._id?.toString(),
              isEqual: message.senderId?.toString() === user?._id?.toString()
            })
            
            const isFromUser = message.senderId?.toString() === user?._id?.toString()
            
            return (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isFromUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                    isFromUser
                      ? 'bg-gradient-to-r from-neonPurple to-accent text-white'
                      : 'bg-darkGray border border-neonPurple/20 text-lightText'
                  }`}
                >
                  <p className={isFromUser ? 'text-white' : 'text-lightText'}>{message.content}</p>
                  <p className={`text-xs mt-1 ${isFromUser ? 'text-white/70' : 'text-lightText/50'}`}>
                    {new Date(message.createdAt).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </motion.div>
            )
          })}
          
          {/* Indicador de digitação */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-darkGray border border-neonPurple/20 px-4 py-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-neonPurple rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-neonPurple rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-neonPurple rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input de Mensagem */}
      <div className="bg-darkGray border-t border-neonPurple/20 px-4 py-4">
        <div className="container mx-auto max-w-4xl">
          <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
            <div className="flex-1 bg-black/50 border border-neonPurple/30 rounded-2xl px-4 py-3 focus-within:border-neonPurple transition-colors">
              <textarea
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value)
                  handleTyping()
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(e)
                  }
                }}
                placeholder="Digite sua mensagem..."
                rows={1}
                className="w-full bg-transparent text-lightText focus:outline-none resize-none"
                style={{ maxHeight: '120px' }}
              />
            </div>

            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-6 py-3 bg-gradient-to-r from-neonPurple to-accent rounded-xl font-bold hover:shadow-neon transition-all btn-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send size={20} />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </form>

          {/* Info */}
          <p className="text-xs text-lightText/50 mt-2 text-center">
            Mensagens são cobradas externamente
          </p>
        </div>
      </div>

      {/* Modal de Créditos Insuficientes */}
      {showCreditModal && creditError && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-darkGray border-2 border-accent rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
          >
            {/* Ícone */}
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                <CreditCard className="text-red-400" size={40} />
              </div>
            </div>

            {/* Título */}
            <h2 className="text-3xl font-bold mb-4 text-red-400">
              Créditos Insuficientes!
            </h2>

            {/* Mensagem */}
            <div className="space-y-3 mb-8">
              <p className="text-lightText/90">
                Você tem <span className="font-bold text-accent">{creditError.currentCredits}</span> créditos
              </p>
              <p className="text-lightText/90">
                Precisa de <span className="font-bold text-accent">{creditError.requiredCredits}</span> créditos para enviar mensagem para{' '}
                <span className="font-bold text-neonPurple">{creditError.modelName}</span>
              </p>
            </div>

            {/* Botões */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowCreditModal(false)
                  navigate('/credits')
                }}
                className="w-full py-3 bg-gradient-to-r from-neonPurple to-accent rounded-lg font-bold hover:shadow-neon transition-all btn-glow"
              >
                Comprar Créditos
              </button>
              <button
                onClick={() => setShowCreditModal(false)}
                className="w-full py-3 bg-darkGray border border-neonPurple/30 rounded-lg font-semibold hover:border-neonPurple transition-all text-lightText"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Chat

