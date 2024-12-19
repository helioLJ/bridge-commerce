import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_STATS = gql`
  query GetStats {
    products {
      id
      price
    }
    orders {
      id
      total
      status
    }
  }
`;

const DashboardStats = () => {
  const { loading, error, data } = useQuery(GET_STATS);

  if (loading) return <div className="animate-pulse bg-white p-6 rounded-lg shadow">Loading stats...</div>;
  if (error) return <div className="text-red-500">Error loading stats</div>;

  const totalProducts = data?.products?.length || 0;
  const totalOrders = data?.orders?.length || 0;
  const totalRevenue = data?.orders?.reduce((sum: number, order: any) => sum + order.total, 0) || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">{totalProducts}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">{totalOrders}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">${totalRevenue}</p>
      </div>
    </div>
  );
};

export default DashboardStats; 