FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY legacy-api.js ./
EXPOSE 3001
CMD ["node", "legacy-api.js"]