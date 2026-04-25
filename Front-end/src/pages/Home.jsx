import { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import SkeletonLoader from '../components/SkeletonLoader';
import { newsService } from '../services/api';
import { useFetch } from '../hooks/useFetch';

export default function Home() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const newsPerPage = 12;

  const { data: categories, loading: categoriesLoading } = useFetch(
    () => newsService.getCategories()
  );

  useEffect(() => {
    loadNews();
  }, [selectedCategory]);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);
      let data;

      if (selectedCategory) {
        data = await newsService.getNewsByCategory(selectedCategory);
      } else {
        data = await newsService.getAllNews();
      }

      setNews(data.noticias || data || []);
      setCurrentPage(1);
    } catch (err) {
      setError('Erro ao carregar notícias. Tente novamente mais tarde.');
      console.error(err);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = news;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.titulo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.resumo?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNews(filtered);
    setCurrentPage(1);
  }, [searchQuery, news]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const totalPages = Math.ceil(filteredNews.length / newsPerPage);
  const startIndex = (currentPage - 1) * newsPerPage;
  const displayedNews = filteredNews.slice(startIndex, startIndex + newsPerPage);

  return (
    <div className="min-h-screen bg-white pt-16 pb-16">
      {/* Hero Banner com Busca */}
      <div className="relative h-96 md:h-[500px] overflow-hidden" style={{backgroundImage: 'linear-gradient(rgba(30, 10, 60, 0.65), rgba(30, 10, 60, 0.65)), url("https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&h=600&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          {/* Logo/Título */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
              Agência de Notícias
            </h1>
            <p className="text-lg md:text-xl text-purple-100 drop-shadow-md">
              São Luís - Maranhão
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-2xl mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Pesquise notícias..."
                className="w-full px-6 py-4 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-sao-luis-purple shadow-lg text-base"
              />
              <button
                onClick={() => {}}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-purple text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all"
              >
                Buscar
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-4 flex-wrap justify-center">
            <button className="px-6 py-2 bg-white text-sao-luis-purple font-semibold rounded-full hover:shadow-lg transition-all">
              ● Notícias
            </button>
            <button className="px-6 py-2 bg-white bg-opacity-80 text-gray-700 font-semibold rounded-full hover:shadow-lg transition-all">
              ● Fotos
            </button>
            <button className="px-6 py-2 bg-white bg-opacity-80 text-gray-700 font-semibold rounded-full hover:shadow-lg transition-all">
              ● Vídeos
            </button>
          </div>
        </div>
      </div>

      {/* Filtros e Notícias */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 mb-12 mt-12">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              loading={categoriesLoading}
            />
            {filteredNews.length > 0 && (
              <div className="text-sm text-gray-600 bg-sao-luis-purple-light px-4 py-2 rounded-lg shadow-md">
                Mostrando <span className="font-semibold">{startIndex + 1}</span> a{' '}
                <span className="font-semibold">
                  {Math.min(startIndex + newsPerPage, filteredNews.length)}
                </span>{' '}
                de <span className="font-semibold">{filteredNews.length}</span> notícias
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 text-red-700 mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <SkeletonLoader count={newsPerPage} />
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg shadow-md">
            <div className="text-6xl mb-4">📰</div>
            <p className="text-gray-500 text-lg mb-2">Nenhuma notícia encontrada</p>
            <p className="text-gray-400 text-sm">
              Tente ajustar seus filtros ou termo de busca
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {displayedNews.map((item) => (
                <NewsCard
                  key={item.id}
                  id={item.id}
                  title={item.titulo}
                  summary={item.resumo}
                  image={item.imagem}
                  date={item.data}
                  category={item.categoria}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border-2 border-sao-luis-purple rounded-lg text-sao-luis-purple hover:bg-sao-luis-purple-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold shadow-md hover:shadow-lg"
                >
                  ← Anterior
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors shadow-md ${
                      currentPage === i + 1
                        ? 'bg-gradient-purple text-white'
                        : 'border-2 border-sao-luis-purple text-sao-luis-purple hover:bg-sao-luis-purple-light'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border-2 border-sao-luis-purple rounded-lg text-sao-luis-purple hover:bg-sao-luis-purple-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold shadow-md hover:shadow-lg"
                >
                  Próximo →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
