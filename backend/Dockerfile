FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY public ./public
COPY public/assets/logo.png ./static-assets/logo.png
RUN test -f public/assets/logo.png && test -f static-assets/logo.png
COPY scripts ./scripts
COPY .env.example ./.env

EXPOSE 3000

CMD ["node", "src/server.js"]
