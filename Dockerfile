# Usar Node.js 18 como imagen base
FROM node:18-alpine as build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Etapa de producción
FROM node:18-alpine as production

# Instalar serve globalmente
RUN npm install -g serve

# Crear directorio de trabajo
WORKDIR /app

# Copiar los archivos construidos desde la etapa de build
COPY --from=build /app/build ./build

# Exponer el puerto que usará Railway
EXPOSE $PORT

# Comando para ejecutar la aplicación
CMD ["sh", "-c", "serve -s build -l $PORT"]