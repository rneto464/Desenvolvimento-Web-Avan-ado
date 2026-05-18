import { Link } from 'react-router-dom';
import { Clock, Bookmark, BookmarkCheck } from 'lucide-react';
import { useReadlistContext } from '../context/ReadlistContext';

export default function NewsCard({ id, title, summary, image, date, category, timeAgo }) {
  const formattedDate = date ? new Date(date).toLocaleDateString('pt-BR') : '';
  const { add, remove, isAdded } = useReadlistContext();
  const saved = isAdded(id);

  function handleReadlist(e) {
    e.preventDefault();
    saved
      ? remove(id)
      : add({ id, title, summary, imageUrl: image, category, timeAgo });
  }

  return (
    <Link to={`/noticias/${id}`}>
      <article className="h-full bg-white border border-news-rule hover:border-news-subtle hover:shadow-editorial transition-all duration-200 cursor-pointer group">

        {/* Imagem */}
        <div className="relative overflow-hidden bg-news-surface" style={{ paddingTop: '60%' }}>
          {image ? (
            <img
              src={image}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-news-surface">
              <svg className="w-10 h-10 text-news-rule" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          )}

          {/* Bookmark */}
          <button
            onClick={handleReadlist}
            title={saved ? 'Remover da lista' : 'Ler depois'}
            className={`absolute top-2 right-2 p-1.5 transition-colors ${
              saved
                ? 'bg-news-red text-white'
                : 'bg-white/90 text-news-muted hover:text-news-red'
            }`}
          >
            {saved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-4 flex flex-col gap-2">

          {/* Categoria */}
          {category && (
            <span className="text-[11px] font-bold uppercase tracking-widest text-news-red">
              {category}
            </span>
          )}

          {/* Título */}
          <h3 className="text-sm font-bold text-news-ink leading-snug line-clamp-3 group-hover:text-news-red transition-colors duration-150">
            {title}
          </h3>

          {/* Sumário */}
          {summary && (
            <p className="text-xs text-news-muted leading-relaxed line-clamp-2">
              {summary}
            </p>
          )}

          {/* Data */}
          {formattedDate && (
            <div className="flex items-center gap-1.5 text-[11px] text-news-subtle pt-1 border-t border-news-rule mt-1">
              <Clock className="w-3 h-3" />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
