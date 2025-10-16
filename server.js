import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4800';

console.log('🔧 Ambiente:', process.env.NODE_ENV);
console.log('🔧 Arquivo .env:', envFile);
console.log('🔧 BACKEND_URL:', BACKEND_URL);

// Proxy para API do backend
app.use('/api', createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
  logLevel: 'debug',
  onError: (err, req, res) => {
    console.error('❌ Erro no proxy:', err);
    res.status(500).json({ error: 'Erro ao conectar com o backend' });
  }
}));

// Servir arquivos estáticos da pasta dist
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback - todas as rotas retornam index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Frontend servindo em http://0.0.0.0:${PORT}`);
  console.log(`🔗 Proxy da API: ${BACKEND_URL}`);
});

