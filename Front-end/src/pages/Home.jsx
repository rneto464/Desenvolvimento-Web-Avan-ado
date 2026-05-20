import { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { newsService } from '../services/api';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const REGIONS = [
  { id: '', label: 'Todas as regiões' },
  { id: '1', label: 'São Luís' },
  { id: '2', label: 'Raposa' },
  { id: '3', label: 'Paço do Lumiar' },
  { id: '4', label: 'São José de Ribamar' },
];

const NEWS_PER_PAGE = 12;

export default function Home() {
  const [news, setNews] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNews(1);
    setCurrentPage(1);
  }, [selectedRegion]);

  useEffect(() => {
    loadNews(currentPage);
  }, [currentPage]);

  const loadNews = async (page) => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, limit: NEWS_PER_PAGE };
      if (selectedRegion) params.region_id = selectedRegion;
      const result = await newsService.getAll(params);
      setNews(result.data || []);
      setTotalPages(result.totalPages || 1);
      setTotal(result.total || 0);
    } catch (err) {
      setError('Erro ao carregar notícias. Tente novamente mais tarde.');
      console.error(err);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const displayedNews = searchQuery.trim()
    ? news.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.summary?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : news;

  const startIndex = (currentPage - 1) * NEWS_PER_PAGE;

  return (
    <div className="min-h-screen bg-news-surface pt-14 pb-16">

      {/* Masthead editorial */}
      <div className="bg-news-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-[11px] font-bold tracking-[0.25em] text-news-red uppercase mb-3">
            São Luís — Maranhão
          </p>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-none tracking-tight mb-4">
            Agência de Notícias
          </h1>
          <div className="w-12 h-0.5 bg-news-red mb-8" />

          {/* Search */}
          <div className="flex max-w-xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar notícias..."
              className="flex-1 px-4 py-3 bg-news-charcoal border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-news-red transition-colors"
            />
            <button className="px-5 py-3 bg-news-red text-white text-sm font-semibold hover:bg-news-red-dark transition-colors flex items-center gap-2">
              <Search className="w-4 h-4" />
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Barra de filtros */}
      <div className="bg-white border-b border-news-rule">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-news-muted">Região</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="text-sm text-news-graphite border border-news-rule bg-white px-3 py-1.5 focus:outline-none focus:border-news-red transition-colors cursor-pointer appearance-none pr-8"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath d=\'M1 1l5 5 5-5\' stroke=\'%23777\' stroke-width=\'1.5\' fill=\'none\' stroke-linecap=\'round\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
            >
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>

          {total > 0 && !loading && (
            <p className="text-xs text-news-muted">
              Exibindo{' '}
              <span className="font-semibold text-news-graphite">{startIndex + 1}–{Math.min(startIndex + NEWS_PER_PAGE, total)}</span>
              {' '}de{' '}
              <span className="font-semibold text-news-graphite">{total}</span>
              {' '}notícias
            </p>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Rótulo de seção */}
        <div className="flex items-center gap-3 mb-6">
          <span className="section-label">Últimas Notícias</span>
          <div className="flex-1 border-t border-news-rule" />
        </div>

        {error && (
          <div className="border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-700 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <SkeletonLoader count={NEWS_PER_PAGE} />
        ) : displayedNews.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-12 h-12 text-news-rule mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p className="text-news-muted font-medium">Nenhuma notícia encontrada</p>
            <p className="text-news-subtle text-sm mt-1">Ajuste o filtro ou o termo de busca</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-news-rule border border-news-rule mb-8">
              {displayedNews.map((item) => (
                <div key={item.id} className="bg-news-surface">
                  <NewsCard
                    id={item.id}
                    title={item.title}
                    summary={item.summary}
                    image={item.imageUrl}
                    date={item.created_at}
                    category={item.category}
                  />
                </div>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 pt-4 border-t border-news-rule">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-news-muted border border-news-rule hover:border-news-graphite hover:text-news-graphite disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>

                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    const isActive = currentPage === page;
                    const showPage = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                    const showEllipsis = !showPage && (page === 2 || page === totalPages - 1);

                    if (showEllipsis) return (
                      <span key={page} className="px-1 text-news-subtle text-sm">…</span>
                    );
                    if (!showPage) return null;

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-news-red text-white'
                            : 'text-news-muted border border-news-rule hover:border-news-graphite hover:text-news-graphite'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-news-muted border border-news-rule hover:border-news-graphite hover:text-news-graphite disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Próximo
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
