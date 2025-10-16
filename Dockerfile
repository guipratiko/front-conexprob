FROM node:18-alpine

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Build da aplicação (instalar devDependencies temporariamente)
RUN npm ci && npm run build && npm ci --only=production

# Expor porta
EXPOSE 3150

# Usar servidor Express customizado com MIME types corretos
CMD ["npm", "run", "serve"]

