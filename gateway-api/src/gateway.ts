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

const grpcHost = process.env.GRPC_SERVICE_HOST || 'localhost';
const grpcPort = process.env.GRPC_SERVICE_PORT || '50051';
const legacyApiHost = process.env.LEGACY_API_HOST || 'localhost';
const legacyApiPort = process.env.LEGACY_API_PORT || '3001';

const grpcClient = new protoDescriptor.product.ProductService(
  `${grpcHost}:${grpcPort}`,
  grpc.credentials.createInsecure()
);

// GraphQL type definitions
const typeDefs = `#graphql
  type Product {
    id: Int!
    name: String!
    price: Float!
    featured: Boolean!
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

  type Mutation {
    toggleProductFeatured(id: Int!): Product!
  }
`;

// GraphQL resolvers
const resolvers = {
  Query: {
    products: () => {
      console.log('[Gateway] Requesting products from gRPC service');
      return new Promise((resolve, reject) => {
        grpcClient.GetProducts({}, (error: any, response: any) => {
          if (error) {
            console.error('[Gateway] gRPC error:', error);
            reject(error);
            return;
          }
          console.log('[Gateway] Received products:', response.products);
          resolve(response.products);
        });
      });
    },
    orders: async () => {
      console.log('[Gateway] Requesting orders from Legacy API');
      try {
        const response = await axios.get(`http://${legacyApiHost}:${legacyApiPort}/api/orders`);
        console.log('[Gateway] Received orders response from Legacy API');
        return response.data;
      } catch (error) {
        console.error('[Gateway] Legacy API error:', error);
        throw error;
      }
    },
  },
  Mutation: {
    toggleProductFeatured: (_: any, { id }: { id: number }) => {
      console.log('[Gateway] Toggling featured status for product:', id);
      return new Promise((resolve, reject) => {
        grpcClient.ToggleProductFeatured({ id }, (error: any, response: any) => {
          if (error) {
            console.error('[Gateway] gRPC error:', error);
            reject(error);
            return;
          }
          console.log('[Gateway] Product updated:', response);
          resolve(response);
        });
      });
    },
  },
};

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);

  app.use(cors({
    origin: '*',
    credentials: true
  }));

  // Add logging for requests
  app.use((req, res, next) => {
    console.log(`[Gateway] ${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/graphql',
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
