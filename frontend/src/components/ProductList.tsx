import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCTS, TOGGLE_PRODUCT_FEATURED } from '../queries/products';
import { Product } from '../types';

interface ProductListProps {
  compact?: boolean;
}

const ProductList = ({ compact = false }: ProductListProps) => {
  const { loading, error, data } = useQuery(GET_PRODUCTS);
  const [toggleFeatured] = useMutation(TOGGLE_PRODUCT_FEATURED, {
    refetchQueries: [{ query: GET_PRODUCTS }],
  });

  const handleToggleFeatured = async (id: number) => {
    try {
      await toggleFeatured({ variables: { id } });
    } catch (err) {
      console.error('Error toggling featured status:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div className={`bg-white rounded-lg shadow ${compact ? 'p-4' : 'p-6'}`}>
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <ul className="space-y-4">
        {data?.products.map((product: Product) => (
          <li
            key={product.id}
            className={`p-4 border rounded-md shadow-sm transition-all ${
              product.featured ? 'bg-blue-50 border-blue-200' : 'bg-white'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-gray-600">${product.price}</p>
              </div>
              <button
                onClick={() => handleToggleFeatured(product.id)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  product.featured
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {product.featured ? 'Featured' : 'Make Featured'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
