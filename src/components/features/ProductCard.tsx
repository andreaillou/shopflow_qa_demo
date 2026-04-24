import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <article
      data-testid="product-card"
      className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
    >
      <img src={product.image_url} alt={product.name} className="h-44 w-full object-cover" />
      <div className="space-y-3 p-4">
        <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-slate-600">{product.description}</p>
        <p className="font-semibold text-blue-700">{formatCurrency(product.price)}</p>
        <Link
          to={`/products/${product.id}`}
          className="inline-flex min-h-11 min-w-[44px] items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          View details
        </Link>
      </div>
    </article>
  );
};

export default ProductCard;
