# Estágio 1: Dependências e Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copia arquivos de configuração de pacotes
COPY package.json package-lock.json ./

# Instala todas as dependências (incluindo dev para o build)
RUN npm install

# Copia o restante do código
COPY . .

# Gera o client do Prisma (necessário para o build, mesmo usando better-sqlite3)
RUN npx prisma generate

# Build da aplicação Next.js
RUN npm run build

# Estágio 2: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copia apenas o necessário do builder
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dev.db ./dev.db

# Expõe a porta do Next.js
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
