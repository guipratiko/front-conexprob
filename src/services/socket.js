import { io } from 'socket.io-client';

// Em produção, Socket.io estará na mesma origem
const SOCKET_URL = import.meta.env.MODE === 'production' 
  ? window.location.origin 
  : (import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4800');

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket.io conectado');
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket.io desconectado');
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Erro na conexão Socket.io:', error.message);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket não conectado. Tentando reconectar...');
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  sendMessage(recipientId, content, type = 'text') {
    this.emit('send-message', {
      recipientId,
      content,
      type
    });
  }

  markAsRead(modelId) {
    this.emit('mark-read', { modelId });
  }

  typing(recipientId, isTyping) {
    this.emit('typing', {
      recipientId,
      isTyping
    });
  }

  isConnected() {
    return this.connected && this.socket?.connected;
  }
}

// Exportar instância única
const socketService = new SocketService();
export default socketService;

