interface ProductListProps {
    products: { id: number; name: string; price: number }[];
  }
  
export default function ProductList({ products }: ProductListProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Produtos</h2>
      <ul className="space-y-2">
        {products.map((product) => (
          <li
            key={product.id}
            className="p-2 border rounded-md shadow-md bg-white"
          >
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
