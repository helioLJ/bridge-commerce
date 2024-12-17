interface OrderListProps {
    orders: { id: number; status: string; total: number }[];
  }
  
  export default function OrderList({ orders }: OrderListProps) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Pedidos</h2>
        <ul className="space-y-2">
          {orders.map((order) => (
            <li
              key={order.id}
              className="p-2 border rounded-md shadow-md bg-white"
            >
              Pedido {order.id}: {order.status} - ${order.total}
            </li>
          ))}
        </ul>
      </div>
    );
}
