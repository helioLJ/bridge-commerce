import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { Empty, ProductList } from '../../shared/product';
import path from 'path';

const PROTO_PATH = path.resolve(__dirname, '../../shared/product.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;

const products = [
  { id: 1, name: "Laptop", price: 1200 },
  { id: 2, name: "Phone", price: 800 },
  { id: 3, name: "Tablet", price: 500 }
];

const server = new grpc.Server();

server.addService((protoDescriptor.product.ProductService as grpc.ServiceClientConstructor).service, {
  GetProducts: (call: grpc.ServerUnaryCall<Empty, ProductList>, callback: grpc.sendUnaryData<ProductList>) => {
    callback(null, { products });
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

