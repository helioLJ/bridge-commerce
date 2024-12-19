# Frontend Service

React-based dashboard that displays products and orders from our microservices architecture.

## Features
- Interactive product management with featured status toggle
- Real-time order status display
- Dashboard statistics overview
- Built with React, TypeScript, and Tailwind CSS

## Development
```bash
npm install
npm start
```

## Environment Variables
- `REACT_APP_GATEWAY_URL` - GraphQL Gateway URL (default: http://localhost:3000/graphql)

## Architecture
- Uses Apollo Client for GraphQL communication
- Tailwind CSS for styling
- TypeScript for type safety
