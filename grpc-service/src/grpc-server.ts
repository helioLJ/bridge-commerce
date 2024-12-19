import { Empty, ProductList, Product, ToggleRequest } from '../../shared/product';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.resolve(__dirname, '../../shared/product.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;

const products: Product[] = [
  { id: 1, name: 'Product 1', price: 100, featured: false },
  { id: 2, name: 'Product 2', price: 200, featured: false }
];

const server = new grpc.Server();

server.addService((protoDescriptor.product.ProductService as grpc.ServiceClientConstructor).service, {
  GetProducts: (call: grpc.ServerUnaryCall<Empty, ProductList>, callback: grpc.sendUnaryData<ProductList>) => {
    console.log('[gRPC] Received GetProducts request');
    callback(null, { products });
    console.log('[gRPC] Sent products response');
  },
  ToggleProductFeatured: (call: grpc.ServerUnaryCall<ToggleRequest, Product>, callback: grpc.sendUnaryData<Product>) => {
    const { id } = call.request;
    console.log('[gRPC] Toggling featured status for product:', id);
    
    const product = products.find(p => p.id === id);
    if (product) {
      product.featured = !product.featured;
      callback(null, product);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        message: 'Product not found'
      });
    }
  }
});

const PORT = process.env.PORT || 50051;
server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error('Failed to bind server:', err);
      return;
    }
    console.log(`gRPC Server running on port ${port}`);
  }
);

