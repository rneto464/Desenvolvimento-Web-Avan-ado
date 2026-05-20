import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { useReadlistContext } from '../context/ReadlistContext';

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { readlist } = useReadlistContext();

  const linkClass = (path) =>
    `text-sm font-medium tracking-wide transition-colors duration-150 ${
      location.pathname === path
        ? 'text-white border-b border-news-red pb-0.5'
        : 'text-gray-400 hover:text-white'
    }`;

  return (
    <nav className="fixed top-0 w-full bg-news-ink z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">

          {/* Logo editorial */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-0.5 h-7 bg-news-red shrink-0" />
            <div className="leading-none">
              <p className="text-[10px] font-bold tracking-[0.2em] text-news-red uppercase">
                São Luís
              </p>
              <p className="text-sm font-black tracking-widest text-white uppercase">
                Notícias
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={linkClass('/')}>Início</Link>
            <a href="#sobre" className="text-sm font-medium tracking-wide text-gray-400 hover:text-white transition-colors">
              Sobre
            </a>
            <a href="#contato" className="text-sm font-medium tracking-wide text-gray-400 hover:text-white transition-colors">
              Contato
            </a>
            <Link to="/readlist" className={`relative flex items-center gap-1.5 ${linkClass('/readlist')}`}>
              <Bookmark className="w-3.5 h-3.5" />
              Ler depois
              {readlist.length > 0 && (
                <span className="absolute -top-2 -right-4 bg-news-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                  {readlist.length > 9 ? '9+' : readlist.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-400 hover:text-white transition-colors"
            aria-label="Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-800 pt-3 space-y-1">
            <Link
              to="/"
              className="block py-2 text-sm text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Início
            </Link>
            <a
              href="#sobre"
              className="block py-2 text-sm text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Sobre
            </a>
            <a
              href="#contato"
              className="block py-2 text-sm text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contato
            </a>
            <Link
              to="/readlist"
              className="flex items-center gap-2 py-2 text-sm text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Bookmark className="w-4 h-4" />
              Ler depois
              {readlist.length > 0 && (
                <span className="bg-news-red text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                  {readlist.length > 9 ? '9+' : readlist.length}
                </span>
              )}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
