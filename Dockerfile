FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx expo export --platform web

FROM node:18-alpine AS production

RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/dist ./
EXPOSE 8080
CMD ["serve", "-s", ".", "-l", "8080"]
