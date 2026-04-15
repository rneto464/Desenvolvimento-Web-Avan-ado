import { useState } from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

export default function SearchBar({ onSearch }) {
  const [input, setInput] = useState('');
  const debouncedValue = useDebounce(input, 500);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(input);
  };

  const handleClear = () => {
    setInput('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Buscar notícias..."
          className="w-full px-4 sm:px-6 py-3 pr-12 rounded-lg border-2 border-sao-luis-purple focus:border-sao-luis-purple-dark focus:outline-none transition-colors text-sm sm:text-base shadow-md focus:shadow-lg"
        />
        {input && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 top-1/2 -translate-y-1/2 text-sao-luis-purple hover:text-sao-luis-purple-dark transition-colors"
          >
            ✕
          </button>
        )}
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sao-luis-purple hover:text-sao-luis-purple-dark transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
