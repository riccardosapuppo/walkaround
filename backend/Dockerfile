FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY src ./src
COPY public ./public
COPY public ./public-seed
RUN test -f public/assets/logo.png && test -f public-seed/assets/logo.png
COPY scripts ./scripts
COPY .env.example ./.env

EXPOSE 3000

CMD ["node", "src/server.js"]
