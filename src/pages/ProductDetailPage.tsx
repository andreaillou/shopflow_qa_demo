import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById } from '../api/products';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import type { Product } from '../types';
import { formatCurrency } from '../utils/formatters';

const ProductDetailPage = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch {
        navigate('/error?type=404');
      } finally {
        setLoading(false);
      }
    };

    load().catch(() => undefined);
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!product) {
      return;
    }
    try {
      await addItem(product.id, quantity);
      navigate('/cart');
    } catch {
      setError('Unable to add item to cart.');
    }
  };

  return (
    <PageWrapper>
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : product ? (
        <div className="grid gap-8 rounded-lg border border-slate-200 bg-white p-6 md:grid-cols-2">
          <img src={product.image_url} alt={product.name} className="h-full min-h-80 w-full rounded-lg object-cover" />
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold text-slate-900">{product.name}</h1>
            <p className="text-slate-600">{product.description}</p>
            <p className="text-xl font-semibold text-blue-700">{formatCurrency(product.price)}</p>
            <p className="text-sm text-slate-500">Category: {product.category}</p>
            <p className="text-sm text-slate-500">Stock: {product.stock}</p>

            <div className="w-28 space-y-1">
              <label htmlFor="quantity" className="text-sm font-medium text-slate-700">
                Quantity
              </label>
              <input
                id="quantity"
                data-testid="quantity-input"
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
                className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button type="button" onClick={handleAddToCart}>
              Add to Cart
            </Button>
            {error ? <ErrorMessage message={error} /> : null}
          </div>
        </div>
      ) : (
        <ErrorMessage message="Product not found." />
      )}
    </PageWrapper>
  );
};

export default ProductDetailPage;
