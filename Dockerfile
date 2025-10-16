FROM node:18-alpine

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar todas as dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Fazer build
RUN npm run build

# Expor porta
EXPOSE 3150

# Usar vite preview para servir build
CMD ["npm", "run", "serve"]

