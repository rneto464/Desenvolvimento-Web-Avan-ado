import { Link } from 'react-router-dom';
import { Clock, Tag } from 'lucide-react';

export default function NewsCard({ id, title, summary, image, date, category }) {
  const formattedDate = date ? new Date(date).toLocaleDateString('pt-BR') : '';

  return (
    <Link to={`/noticias/${id}`}>
      <article className="h-full bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group border-l-4 border-sao-luis-purple">
        <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-sao-luis-purple-light to-purple-200">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sao-luis-purple to-indigo-400">
              <span className="text-white text-4xl">📰</span>
            </div>
          )}
          {category && (
            <div className="absolute top-3 right-3 bg-gradient-purple text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
              <Tag className="w-3 h-3" />
              {category}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5 flex flex-col h-40">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-sao-luis-purple transition-colors">
            {title}
          </h3>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
            {summary}
          </p>

          {formattedDate && (
            <div className="flex items-center gap-2 text-xs text-sao-luis-purple font-semibold border-t border-sao-luis-purple-light pt-3">
              <Clock className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
