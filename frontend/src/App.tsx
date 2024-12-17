import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { useQuery, gql } from "@apollo/client";
import ProductList from "./components/ProductList";
import OrderList from "./components/OrderList";

// Create Apollo Client instance
const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

const GET_DATA = gql`
  query {
    products {
      id
      name
      price
    }
    orders {
      id
      status
      total
    }
  }
`;

function Dashboard() {
  const { loading, error, data } = useQuery(GET_DATA);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error.message}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProductList products={data.products} />
          <OrderList orders={data.orders} />
        </div>
      </div>
    </div>
  );
}

// Wrap the app with ApolloProvider
export default function App() {
  return (
    <ApolloProvider client={client}>
      <Dashboard />
    </ApolloProvider>
  );
}
