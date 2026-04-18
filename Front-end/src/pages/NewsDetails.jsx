import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Tag, Share2 } from 'lucide-react';
import { newsService } from '../services/api';

export default function NewsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNewsDetails();
  }, [id]);

  const loadNewsDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await newsService.getNewsById(id);
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
          title: news?.titulo,
          text: news?.resumo,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sao-luis-purple hover:text-sao-luis-purple-dark mb-8 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-4 border-l-4 border-sao-luis-purple">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-96 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-white pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sao-luis-purple hover:text-sao-luis-purple-dark mb-8 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-8 text-center">
            <p className="text-red-700 text-lg">{error || 'Notícia não encontrada'}</p>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = news.data
    ? new Date(news.data).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sao-luis-purple hover:text-sao-luis-purple-dark mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para Notícias
        </button>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-sao-luis-purple">
          {news.imagem && (
            <div className="relative h-96 sm:h-[500px] overflow-hidden bg-gradient-to-br from-sao-luis-purple to-indigo-400">
              <img
                src={news.imagem}
                alt={news.titulo}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {news.categoria && (
                <div className="absolute top-4 right-4 bg-gradient-purple text-white px-4 py-2 rounded-full flex items-center gap-2 font-semibold shadow-lg">
                  <Tag className="w-4 h-4" />
                  {news.categoria}
                </div>
              )}
            </div>
          )}

          <div className="p-6 sm:p-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {news.titulo}
            </h1>

            <div className="flex flex-wrap gap-6 text-gray-600 mb-8 pb-8 border-b border-sao-luis-purple-light">
              {formattedDate && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-sao-luis-purple font-semibold" />
                  <span className="text-sao-luis-purple font-semibold">{formattedDate}</span>
                </div>
              )}

              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-sao-luis-purple hover:text-sao-luis-purple-dark font-medium transition-colors"
              >
                <Share2 className="w-5 h-5" />
                Compartilhar
              </button>
            </div>

            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {news.conteudo || news.resumo}
              </p>
            </div>

            <div className="bg-sao-luis-purple-light border-l-4 border-sao-luis-purple p-4 rounded">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-sao-luis-purple">Resumo:</span> {news.resumo}
              </p>
            </div>
          </div>
        </article>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Outras notícias</h2>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 bg-gradient-purple text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Ver todas as notícias
          </button>
        </div>
      </div>
    </div>
  );
}
