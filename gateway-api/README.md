# Gateway API Service

GraphQL API Gateway that consolidates data from gRPC and REST services.

## Features
- GraphQL endpoint for frontend communication
- Integration with gRPC Product service
- Integration with Legacy REST API
- Query and Mutation support

## Development
```bash
npm install
npm start
```

## Environment Variables
- `PORT` - Server port (default: 3000)
- `GRPC_SERVICE_URL` - gRPC service URL
- `LEGACY_API_URL` - Legacy API URL

## Architecture
- Apollo Server for GraphQL
- Express.js backend
- TypeScript implementation 