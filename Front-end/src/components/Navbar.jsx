import { Link, useLocation } from 'react-router-dom';
import { Newspaper, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-purple rounded-lg">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-sao-luis-purple-dark">SÃO LUÍS</p>
              <p className="text-sm font-bold text-sao-luis-purple">NOTÍCIAS</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors ${
                location.pathname === '/'
                  ? 'text-sao-luis-purple border-b-2 border-sao-luis-purple pb-2'
                  : 'text-gray-600 hover:text-sao-luis-purple'
              }`}
            >
              Início
            </Link>
            <a
              href="#sobre"
              className="text-sm font-semibold text-gray-600 hover:text-sao-luis-purple transition-colors"
            >
              Sobre
            </a>
            <a
              href="#contato"
              className="text-sm font-semibold text-gray-600 hover:text-sao-luis-purple transition-colors"
            >
              Contato
            </a>
          </div>

          {/* Social Icons */}
          <div className="hidden md:flex items-center gap-3">
            <a href="#" className="text-gray-600 hover:text-sao-luis-purple transition-colors" title="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5c-.563-.074-2.313-.231-4.38-.231-4.281 0-7.237 2.626-7.237 7.451v1.78z" />
              </svg>
            </a>
            <a href="#" className="text-gray-600 hover:text-sao-luis-purple transition-colors" title="Twitter">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
              </svg>
            </a>
            <a href="#" className="text-gray-600 hover:text-sao-luis-purple transition-colors" title="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="currentColor" strokeWidth="2"/>
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
              </svg>
            </a>
            <a href="#" className="text-gray-600 hover:text-sao-luis-purple transition-colors" title="YouTube">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-600 hover:text-sao-luis-purple"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <Link
              to="/"
              className="block py-2 text-sm font-semibold text-gray-600 hover:text-sao-luis-purple"
              onClick={() => setIsOpen(false)}
            >
              Início
            </Link>
            <a
              href="#sobre"
              className="block py-2 text-sm font-semibold text-gray-600 hover:text-sao-luis-purple"
              onClick={() => setIsOpen(false)}
            >
              Sobre
            </a>
            <a
              href="#contato"
              className="block py-2 text-sm font-semibold text-gray-600 hover:text-sao-luis-purple"
              onClick={() => setIsOpen(false)}
            >
              Contato
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
