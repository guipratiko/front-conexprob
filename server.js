import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3150;

// Middleware para servir arquivos estáticos
app.use(express.static(join(__dirname, 'public')));

// Proxy para API
app.use('/api', createProxyMiddleware({
  target: process.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4600',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api'
  }
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Todas as outras rotas retornam o index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Frontend server rodando na porta ${PORT}`);
  console.log(`🌍 Acesse: http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
