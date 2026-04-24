import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/products';
import ProductCard from '../components/features/ProductCard';
import PageWrapper from '../components/layout/PageWrapper';
import Spinner from '../components/ui/Spinner';
import type { Product } from '../types';

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      setLoading(true);
      try {
        const all = await getProducts();
        setProducts(all.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

    loadFeatured().catch(() => undefined);
  }, []);

  return (
    <PageWrapper>
      <section className="rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-bold text-slate-900">ShopFlow</h1>
        <p className="mt-3 text-slate-600">A clean, testable shopping experience for QA automation demos.</p>
        <Link
          to="/products"
          className="mt-5 inline-flex min-h-11 min-w-[44px] items-center justify-center rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Shop Now
        </Link>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Featured Products</h2>
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </PageWrapper>
  );
};

export default HomePage;
