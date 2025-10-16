import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || process.env.VITE_PORT || 3150;

// Middleware para definir MIME types corretos
app.use((req, res, next) => {
  if (req.path.endsWith('.js')) {
    res.type('application/javascript');
  } else if (req.path.endsWith('.css')) {
    res.type('text/css');
  } else if (req.path.endsWith('.json')) {
    res.type('application/json');
  }
  next();
});

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'dist')));

// SPA - Redirecionar todas as rotas para index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Frontend rodando em http://0.0.0.0:${PORT}`);
  console.log(`🌍 Acesse: http://localhost:${PORT}`);
});

