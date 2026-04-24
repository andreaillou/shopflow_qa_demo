import { useEffect, useMemo, useState } from 'react';
import { getProducts } from '../api/products';
import ProductCard from '../components/features/ProductCard';
import ProductFilter from '../components/features/ProductFilter';
import PageWrapper from '../components/layout/PageWrapper';
import ErrorMessage from '../components/ui/ErrorMessage';
import Spinner from '../components/ui/Spinner';
import { useProductFilter } from '../hooks/useProductFilter';
import type { Product } from '../types';

const ProductListingPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { search, category, sort, setSearch, setCategory, setSort, filtered } = useProductFilter(products);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getProducts({
          search: search || undefined,
          category: category || undefined,
          sort,
          limit: 100,
        });
        setProducts(data);
      } catch {
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    load().catch(() => undefined);
  }, [category, search, sort]);

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))).sort(),
    [products]
  );

  return (
    <PageWrapper>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
        <ProductFilter
          search={search}
          category={category}
          sort={sort}
          categories={categories}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onSortChange={setSort}
        />

        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : null}

        {error ? <ErrorMessage message={error} /> : null}

        {!loading && !error ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}
      </div>
    </PageWrapper>
  );
};

export default ProductListingPage;
