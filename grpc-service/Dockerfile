FROM node:20-slim
WORKDIR /app

# Copy root package files
COPY package*.json ./

# Copy service package files
COPY grpc-service/package*.json ./grpc-service/
COPY shared/package*.json ./shared/

# Install dependencies
RUN npm install && \
    cd shared && npm install && \
    cd ../grpc-service && npm install

# Copy source code
COPY shared/ ./shared/
COPY grpc-service/src/ ./grpc-service/src/
COPY grpc-service/tsconfig.json ./grpc-service/tsconfig.json

EXPOSE 50051
CMD ["npm", "run", "--prefix", "grpc-service", "start"]