FROM node:18-alpine

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Expor porta
EXPOSE 3150

# Usar vite preview para servir os arquivos
CMD ["npm", "run", "preview", "--", "--port", "3150", "--host"]

