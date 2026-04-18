FROM node:20-alpine

# Instalamos dependencias de sistema esenciales para Prisma y compilación
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copiamos solo archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalación ignorando el conflicto de versiones de NextAuth v5
RUN npm install --legacy-peer-deps

# Copiamos el resto del código
COPY . .

# Generamos el cliente de Prisma para Linux
RUN npx prisma generate

EXPOSE 3000
EXPOSE 5555

# El comando de inicio automatizado (Sincroniza DB, abre Studio y corre la App)
CMD sh -c "npx prisma db push && (npx prisma studio --port 5555 &) && npm run dev"