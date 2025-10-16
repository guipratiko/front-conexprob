FROM node:18-alpine

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependências (incluindo serve)
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Expor porta
EXPOSE 3150

# Usar serve para servir os arquivos estáticos (melhor para produção)
CMD ["npm", "run", "serve"]

