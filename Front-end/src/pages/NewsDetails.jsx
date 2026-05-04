import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Tag, Share2, ExternalLink, Newspaper, Bookmark, BookmarkCheck } from 'lucide-react';
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
        await navigator.share({
          title: news?.title,
          text: news?.summary,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sao-luis-purple hover:text-sao-luis-purple-dark mb-8 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-80 bg-gray-200 animate-pulse" />
            <div className="p-8 space-y-4">
              <div className="h-7 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3" />
              <div className="space-y-3 pt-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sao-luis-purple hover:text-sao-luis-purple-dark mb-8 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-8 text-center">
            <p className="text-red-700 text-lg">{error || 'Notícia não encontrada'}</p>
          </div>
        </div>
      </div>
    );
  }

  const regionName = REGION_NAMES[news.region_id];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Voltar */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sao-luis-purple hover:text-sao-luis-purple-dark mb-8 font-medium transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Voltar para Notícias
        </button>

        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* Imagem de capa */}
          {news.imageUrl ? (
            <div className="relative h-72 sm:h-[420px] overflow-hidden">
              <img
                src={news.imageUrl}
                alt={news.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Badges sobre a imagem */}
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                {news.category && (
                  <span className="flex items-center gap-1.5 bg-gradient-purple text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                    <Tag className="w-3.5 h-3.5" />
                    {news.category}
                  </span>
                )}
                {regionName && (
                  <span className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
                    📍 {regionName}
                  </span>
                )}
              </div>
            </div>
          ) : (
            /* Placeholder quando não há imagem */
            <div className="h-40 bg-gradient-to-br from-sao-luis-purple to-indigo-500 flex items-center justify-center">
              <Newspaper className="w-16 h-16 text-white/40" />
            </div>
          )}

          <div className="p-6 sm:p-10">

            {/* Categoria + região (quando não há imagem) */}
            {!news.imageUrl && (
              <div className="flex flex-wrap gap-2 mb-4">
                {news.category && (
                  <span className="flex items-center gap-1.5 bg-gradient-purple text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    {news.category}
                  </span>
                )}
                {regionName && (
                  <span className="border-2 border-sao-luis-purple text-sao-luis-purple px-3 py-1.5 rounded-full text-sm font-medium">
                    📍 {regionName}
                  </span>
                )}
              </div>
            )}

            {/* Título */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-6">
              {news.title}
            </h1>

            {/* Meta: fonte + tempo + compartilhar */}
            <div className="flex flex-wrap items-center gap-4 pb-6 mb-6 border-b border-gray-100">
              {news.source && (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Newspaper className="w-4 h-4 text-sao-luis-purple" />
                  <span className="font-medium text-sao-luis-purple">{news.source}</span>
                </div>
              )}
              {news.timeAgo && (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{news.timeAgo}</span>
                </div>
              )}
              <div className="ml-auto flex items-center gap-3">
                <button
                  onClick={() =>
                    isAdded(news.id)
                      ? remove(news.id)
                      : add({ id: news.id, title: news.title, summary: news.summary, imageUrl: news.imageUrl, category: news.category, timeAgo: news.timeAgo })
                  }
                  className={`flex items-center gap-2 font-medium text-sm transition-colors ${
                    isAdded(news.id)
                      ? 'text-sao-luis-purple'
                      : 'text-gray-500 hover:text-sao-luis-purple'
                  }`}
                >
                  {isAdded(news.id)
                    ? <><BookmarkCheck className="w-4 h-4" /> Salvo</>
                    : <><Bookmark className="w-4 h-4" /> Ler depois</>}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-sao-luis-purple hover:text-sao-luis-purple-dark font-medium text-sm transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </button>
              </div>
            </div>

            {/* Resumo em destaque */}
            {news.summary && (
              <div className="bg-sao-luis-purple-light border-l-4 border-sao-luis-purple rounded-r-lg p-5 mb-8">
                <p className="text-gray-700 leading-relaxed text-base font-medium">
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
                className="inline-flex items-center gap-2 bg-gradient-purple text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <ExternalLink className="w-4 h-4" />
                Ler matéria completa
              </a>
            )}
          </div>
        </article>

        {/* Rodapé de navegação */}
        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-500 hover:text-sao-luis-purple font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Todas as notícias
          </button>
        </div>
      </div>
    </div>
  );
}
