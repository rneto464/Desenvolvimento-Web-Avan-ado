import { Link } from 'react-router-dom';
import { Bookmark, Trash2, ChevronUp, ChevronDown, ArrowLeft, Clock, Tag } from 'lucide-react';
import { useReadlistContext } from '../context/ReadlistContext';

export default function Readlist() {
  const { readlist, remove, moveUp, moveDown } = useReadlistContext();

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <Link
          to="/"
          className="flex items-center gap-2 text-sao-luis-purple hover:text-sao-luis-purple-dark mb-8 font-medium transition-colors group w-fit"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Voltar para Notícias
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-purple rounded-lg">
            <Bookmark className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ler Depois</h1>
            <p className="text-sm text-gray-500">
              {readlist.length === 0
                ? 'Nenhuma notícia salva'
                : `${readlist.length} notícia${readlist.length > 1 ? 's' : ''} salva${readlist.length > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {readlist.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">Sua lista está vazia</p>
            <p className="text-gray-400 text-sm mt-1">
              Clique em "Ler depois" em qualquer notícia para salvá-la aqui.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 mt-6 bg-gradient-purple text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm"
            >
              Explorar notícias
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {readlist.map((news, index) => (
              <li
                key={news.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 p-4 hover:shadow-md transition-shadow"
              >
                {/* Controles de ordem */}
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-gray-500"
                    title="Mover para cima"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === readlist.length - 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-gray-500"
                    title="Mover para baixo"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Thumbnail */}
                {news.imageUrl ? (
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-sao-luis-purple to-indigo-400 flex items-center justify-center shrink-0">
                    <span className="text-2xl">📰</span>
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/noticias/${news.id}`}
                    className="text-sm font-semibold text-gray-900 hover:text-sao-luis-purple transition-colors line-clamp-2 leading-snug"
                  >
                    {news.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-1.5">
                    {news.category && (
                      <span className="flex items-center gap-1 text-xs text-sao-luis-purple font-medium">
                        <Tag className="w-3 h-3" />
                        {news.category}
                      </span>
                    )}
                    {news.timeAgo && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {news.timeAgo}
                      </span>
                    )}
                  </div>
                </div>

                {/* Remover */}
                <button
                  onClick={() => remove(news.id)}
                  className="shrink-0 p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remover da lista"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
