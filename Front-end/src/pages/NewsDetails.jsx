import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Share2, ExternalLink, Bookmark, BookmarkCheck, MapPin, Tag } from 'lucide-react';
import { newsService } from '../services/api';
import { useReadlistContext } from '../context/ReadlistContext';

const REGION_NAMES = {
  '1': 'São Luís',
  '2': 'Raposa',
  '3': 'Paço do Lumiar',
  '4': 'São José de Ribamar',
};

export default function NewsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add, remove, isAdded } = useReadlistContext();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadNewsDetails();
  }, [id]);

  const loadNewsDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await newsService.getById(id);
      setNews(data);
    } catch (err) {
      setError('Erro ao carregar a notícia. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: news?.title, text: news?.summary, url: window.location.href });
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  const BackButton = () => (
    <button
      onClick={() => navigate('/')}
      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-news-muted hover:text-news-red transition-colors group"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
      Voltar para Notícias
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-news-surface pt-14 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <BackButton />
          <div className="mt-8 bg-white border border-news-rule">
            <div className="h-72 bg-news-surface animate-pulse" />
            <div className="p-8 space-y-4">
              <div className="h-3 bg-news-surface rounded animate-pulse w-1/4" />
              <div className="h-7 bg-news-surface rounded animate-pulse w-5/6" />
              <div className="h-6 bg-news-surface rounded animate-pulse w-3/4" />
              <div className="space-y-3 pt-4">
                <div className="h-4 bg-news-surface rounded animate-pulse" />
                <div className="h-4 bg-news-surface rounded animate-pulse" />
                <div className="h-4 bg-news-surface rounded animate-pulse w-4/5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-news-surface pt-14 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <BackButton />
          <div className="mt-8 border-l-4 border-red-500 bg-red-50 p-6">
            <p className="text-red-700 text-sm">{error || 'Notícia não encontrada'}</p>
          </div>
        </div>
      </div>
    );
  }

  const regionName = REGION_NAMES[news.region_id];
  const saved = isAdded(news.id);

  return (
    <div className="min-h-screen bg-news-surface pt-14 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        <BackButton />

        <article className="mt-6 bg-white border border-news-rule">

          {/* Imagem de capa */}
          {news.imageUrl ? (
            <div className="relative overflow-hidden" style={{ paddingTop: '52%' }}>
              <img
                src={news.imageUrl}
                alt={news.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          ) : (
            <div className="h-32 bg-news-ink flex items-center justify-center">
              <div className="w-0.5 h-8 bg-news-red mr-3" />
              <span className="text-sm font-black tracking-widest text-white uppercase">Agência de Notícias</span>
            </div>
          )}

          <div className="p-6 sm:p-10">

            {/* Categoria + Região */}
            <div className="flex items-center gap-4 mb-4">
              {news.category && (
                <span className="text-[11px] font-bold uppercase tracking-widest text-news-red flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {news.category}
                </span>
              )}
              {regionName && (
                <span className="text-[11px] font-medium text-news-muted flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {regionName}
                </span>
              )}
            </div>

            {/* Título */}
            <h1 className="text-2xl sm:text-3xl font-black text-news-ink leading-tight mb-6">
              {news.title}
            </h1>

            {/* Meta bar */}
            <div className="flex flex-wrap items-center gap-4 py-4 mb-6 border-t border-b border-news-rule">
              {news.source && (
                <span className="text-xs font-semibold text-news-graphite uppercase tracking-wide">
                  {news.source}
                </span>
              )}
              {news.timeAgo && (
                <span className="flex items-center gap-1.5 text-xs text-news-muted">
                  <Clock className="w-3.5 h-3.5" />
                  {news.timeAgo}
                </span>
              )}
              <div className="ml-auto flex items-center gap-4">
                <button
                  onClick={() => saved ? remove(news.id) : add({ id: news.id, title: news.title, summary: news.summary, imageUrl: news.imageUrl, category: news.category, timeAgo: news.timeAgo })}
                  className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    saved ? 'text-news-red' : 'text-news-muted hover:text-news-red'
                  }`}
                >
                  {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  {saved ? 'Salvo' : 'Salvar'}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-news-muted hover:text-news-red transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </button>
              </div>
            </div>

            {/* Resumo em destaque */}
            {news.summary && (
              <div className="border-l-2 border-news-red pl-5 mb-8">
                <p className="text-base text-news-graphite leading-relaxed font-medium">
                  {news.summary}
                </p>
              </div>
            )}

            {/* Link para matéria original */}
            {news.url && (
              <a
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-news-red text-white px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-news-red-dark transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Ler matéria completa
              </a>
            )}
          </div>
        </article>

        <div className="mt-8 pt-6 border-t border-news-rule">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-news-muted hover:text-news-red transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Todas as notícias
          </button>
        </div>
      </div>
    </div>
  );
}
