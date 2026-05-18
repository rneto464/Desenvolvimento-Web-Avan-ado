import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-news-ink border-t border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-0.5 h-7 bg-news-red shrink-0" />
              <div className="leading-none">
                <p className="text-[10px] font-bold tracking-[0.2em] text-news-red uppercase">São Luís</p>
                <p className="text-sm font-black tracking-widest text-white uppercase">Notícias</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Portal de notícias de São Luís, Maranhão. Acompanhe as principais notícias da cidade em tempo real.
            </p>
          </div>

          {/* Navegação */}
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-4">Navegação</p>
            <ul className="space-y-2">
              {['Início', 'Sobre', 'Contato'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Redes sociais */}
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-4">Redes Sociais</p>
            <div className="flex gap-4">
              {[
                { Icon: Facebook, label: 'Facebook' },
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Mail, label: 'Email' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-600">
            © {currentYear} Agência de Notícias SL. Todos os direitos reservados.
          </p>
          <div className="flex gap-5 text-xs text-gray-600">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
