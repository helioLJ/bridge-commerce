FROM node:20-slim
WORKDIR /app
COPY package*.json ./
COPY gateway-api/package*.json ./gateway-api/
COPY shared/package*.json ./shared/
RUN npm install && \
    cd shared && npm install && \
    cd ../gateway-api && npm install
COPY shared/ ./shared/
COPY gateway-api/ ./gateway-api/
WORKDIR /app/gateway-api
EXPOSE 3000
CMD ["npx", "ts-node", "src/gateway.ts"]