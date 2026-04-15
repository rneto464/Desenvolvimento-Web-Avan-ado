import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-16 relative overflow-hidden">
      {/* Imagem de fundo com overlay */}
      <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=400&fit=crop")', backgroundAttachment: 'fixed', backgroundPosition: 'center'}}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">🌴 Agência de Notícias</h3>
            <p className="text-sm text-gray-400">
              Seu portal de notícias de São Luís, Maranhão. Acompanhe as 
              principais notícias da cidade em tempo real.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-sao-luis-purple transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-sao-luis-purple transition-colors">
                  Sobre
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-sao-luis-purple transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Redes Sociais
            </h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-sao-luis-purple rounded-full flex items-center justify-center hover:bg-sao-luis-purple-dark transition-colors shadow-lg"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-sao-luis-purple rounded-full flex items-center justify-center hover:bg-sao-luis-purple-dark transition-colors shadow-lg"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-sao-luis-purple rounded-full flex items-center justify-center hover:bg-sao-luis-purple-dark transition-colors shadow-lg"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-sao-luis-purple rounded-full flex items-center justify-center hover:bg-sao-luis-purple-dark transition-colors shadow-lg"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {currentYear} Agência de Notícias SL. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#" className="hover:text-sao-luis-purple transition-colors">
              Privacidade
            </a>
            <a href="#" className="hover:text-sao-luis-purple transition-colors">
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
