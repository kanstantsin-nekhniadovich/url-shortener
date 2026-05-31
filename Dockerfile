FROM node:24.11.0

WORKDIR /app

COPY package*.json .

RUN npm ci --no-audit --no-fund

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
