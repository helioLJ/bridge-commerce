import { useQuery } from '@apollo/client';
import { GET_ORDERS } from '../queries/orders';
import { Order } from '../types';

interface OrderListProps {
  compact?: boolean;
}

const OrderList = ({ compact = false }: OrderListProps) => {
  const { loading, error, data } = useQuery(GET_ORDERS);

  return (
    <div className={`bg-white rounded-lg shadow ${compact ? 'p-4' : 'p-6'}`}>
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      <ul className="space-y-2">
        {data?.orders.map((order: Order) => (
          <li
            key={order.id}
            className="p-2 border rounded-md shadow-md bg-white"
          >
            Order {order.id}: {order.status} - ${order.total}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;
