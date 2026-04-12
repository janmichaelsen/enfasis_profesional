FROM node:20-alpine

# Instalamos libc6-compat porque es necesaria para que Prisma y otras librerías funcionen en Alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Solo copiamos los archivos de dependencias para aprovechar la caché de Docker
COPY package*.json ./
COPY prisma ./prisma/

# Instalamos todo
RUN npm install

# Generamos el cliente de Prisma (fundamental para que no de errores de tipos)
RUN npx prisma generate

# Copiamos el resto del código
COPY . .

# En desarrollo no hacemos "npm run build" aquí. 
# Dejamos que el comando venga desde el docker-compose.yaml

EXPOSE 3000

# El comando por defecto (aunque el docker-compose lo sobrescribirá)
CMD ["npm", "run", "dev"]