interface ProductFilterProps {
  search: string;
  category: string;
  sort: string;
  categories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: 'price_asc' | 'price_desc' | 'name_asc') => void;
}

const ProductFilter = ({
  search,
  category,
  sort,
  categories,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: ProductFilterProps) => {
  return (
    <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-3">
      <input
        placeholder="Search products..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className="h-11 rounded-md border border-slate-300 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        aria-label="Filter by category"
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
        className="h-11 rounded-md border border-slate-300 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All categories</option>
        {categories.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        aria-label="Sort products"
        value={sort}
        onChange={(event) => onSortChange(event.target.value as 'price_asc' | 'price_desc' | 'name_asc')}
        className="h-11 rounded-md border border-slate-300 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="name_asc">Name (A-Z)</option>
        <option value="price_asc">Price (Low to High)</option>
        <option value="price_desc">Price (High to Low)</option>
      </select>
    </section>
  );
};

export default ProductFilter;
