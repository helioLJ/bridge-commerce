import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import axios from 'axios';
import path from 'path';

// gRPC client setup
const PROTO_PATH = path.resolve(__dirname, '../../shared/product.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;

const grpcClient = new protoDescriptor.product.ProductService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// GraphQL type definitions
const typeDefs = `#graphql
  type Product {
    id: Int!
    name: String!
    price: Float!
  }

  type Order {
    id: Int!
    status: String!
    total: Float!
  }

  type Query {
    products: [Product!]!
    orders: [Order!]!
  }
`;

// GraphQL resolvers
const resolvers = {
  Query: {
    products: () => {
      return new Promise((resolve, reject) => {
        grpcClient.GetProducts({}, (error: any, response: any) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(response.products);
        });
      });
    },
    orders: async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/orders');
        return response.data;
      } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
    },
  },
};

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server) as unknown as express.RequestHandler
  );

  const PORT = process.env.PORT || 3000;
  await new Promise<void>((resolve) => {
    httpServer.listen(PORT, () => {
      console.log(`🚀 Gateway API running at http://localhost:${PORT}/graphql`);
      resolve();
    });
  });
}

startApolloServer().catch((err) => {
  console.error('Failed to start server:', err);
});
