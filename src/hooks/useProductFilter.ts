import { useMemo, useState } from 'react';
import type { Product } from '../types';

type SortOption = 'price_asc' | 'price_desc' | 'name_asc';

export const useProductFilter = (products: Product[]) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<SortOption>('name_asc');

  const filtered = useMemo(() => {
    let next = [...products];

    if (search.trim()) {
      const query = search.toLowerCase();
      next = next.filter(
        (product) =>
          product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query)
      );
    }

    if (category) {
      next = next.filter((product) => product.category === category);
    }

    if (sort === 'price_asc') {
      next.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      next.sort((a, b) => b.price - a.price);
    } else {
      next.sort((a, b) => a.name.localeCompare(b.name));
    }

    return next;
  }, [products, search, category, sort]);

  return {
    search,
    category,
    sort,
    setSearch,
    setCategory,
    setSort,
    filtered,
  };
};
