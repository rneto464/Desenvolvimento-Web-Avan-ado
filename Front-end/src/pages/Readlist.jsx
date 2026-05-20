import { Link } from 'react-router-dom';
import { Bookmark, Trash2, ChevronUp, ChevronDown, ArrowLeft, Clock, Tag } from 'lucide-react';
import { useReadlistContext } from '../context/ReadlistContext';

export default function Readlist() {
  const { readlist, remove, moveUp, moveDown } = useReadlistContext();

  return (
    <div className="min-h-screen bg-news-surface pt-14 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-news-muted hover:text-news-red transition-colors group w-fit mb-8"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Voltar para Notícias
        </Link>

        {/* Cabeçalho */}
        <div className="mb-8 pb-4 border-b border-news-rule">
          <p className="text-[11px] font-bold uppercase tracking-widest text-news-red mb-1">Lista de leitura</p>
          <h1 className="text-2xl font-black text-news-ink">Ler Depois</h1>
          <p className="text-sm text-news-muted mt-1">
            {readlist.length === 0
              ? 'Nenhuma notícia salva'
              : `${readlist.length} notícia${readlist.length > 1 ? 's' : ''} salva${readlist.length > 1 ? 's' : ''}`}
          </p>
        </div>

        {readlist.length === 0 ? (
          <div className="bg-white border border-news-rule p-12 text-center">
            <Bookmark className="w-10 h-10 text-news-rule mx-auto mb-4" />
            <p className="text-news-graphite font-semibold">Sua lista está vazia</p>
            <p className="text-news-muted text-sm mt-1">
              Clique em salvar em qualquer notícia para adicioná-la aqui.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 mt-6 bg-news-red text-white px-5 py-2.5 text-sm font-semibold uppercase tracking-wide hover:bg-news-red-dark transition-colors"
            >
              Explorar notícias
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-news-rule border border-news-rule bg-white">
            {readlist.map((news, index) => (
              <li
                key={news.id}
                className="flex items-center gap-3 p-4 hover:bg-news-surface transition-colors"
              >
                {/* Controles de ordem */}
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1 text-news-subtle hover:text-news-graphite disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    title="Mover para cima"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === readlist.length - 1}
                    className="p-1 text-news-subtle hover:text-news-graphite disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
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
                    className="w-16 h-16 object-cover shrink-0 border border-news-rule"
                  />
                ) : (
                  <div className="w-16 h-16 bg-news-ink flex items-center justify-center shrink-0">
                    <div className="w-0.5 h-5 bg-news-red" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/noticias/${news.id}`}
                    className="text-sm font-semibold text-news-ink hover:text-news-red transition-colors line-clamp-2 leading-snug"
                  >
                    {news.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-1.5">
                    {news.category && (
                      <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-news-red">
                        <Tag className="w-3 h-3" />
                        {news.category}
                      </span>
                    )}
                    {news.timeAgo && (
                      <span className="flex items-center gap-1 text-[11px] text-news-subtle">
                        <Clock className="w-3 h-3" />
                        {news.timeAgo}
                      </span>
                    )}
                  </div>
                </div>

                {/* Remover */}
                <button
                  onClick={() => remove(news.id)}
                  className="shrink-0 p-2 text-news-subtle hover:text-red-500 transition-colors"
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
