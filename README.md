# Frontend - ConexaoProibida

## 🚀 Comandos

### Desenvolvimento Local
```bash
# Criar .env.local (não está no git)
cp .env .env.local
# Edite e coloque: VITE_API_URL=http://localhost:4800/api

# Instalar dependências
npm install

# Rodar em modo dev (SEM usar, rode direto no EasyPanel)
vite
```

### Produção (EasyPanel)
```bash
# Build
npm run build

# Servir
npm run serve
```

## ⚙️ Variáveis de Ambiente

### .env (Produção - commitado no git)
```env
VITE_API_URL=https://api.conexaoproibida.com.br/api
PORT=3150
```

### .env.local (Local - NÃO commitado)
```env
VITE_API_URL=http://localhost:4800/api
PORT=3150
```

## 📋 EasyPanel Config

```
Build Command: npm run build
Start Command: npm run serve
Port: 3150
```

## 🎯 Arquitetura

- **Build:** Vite (apenas para compilar)
- **Runtime:** Express (serve dist/)
- **Sem Vite** em produção = mais simples


