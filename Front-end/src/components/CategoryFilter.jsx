import { ChevronDown } from 'lucide-react';

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange, loading }) {
  return (
    <div className="w-full max-w-xs">
      <div className="relative">
        <select
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(e.target.value || null)}
          disabled={loading}
          className="w-full px-4 py-3 pr-10 rounded-lg border-2 border-sao-luis-purple bg-white focus:border-sao-luis-purple-dark focus:outline-none transition-colors appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base shadow-md focus:shadow-lg"
        >
          <option value="">Todas as Categorias</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nome}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sao-luis-purple pointer-events-none" />
      </div>
    </div>
  );
}
