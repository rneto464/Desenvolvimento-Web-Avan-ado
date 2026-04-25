/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cores de São Luís
        'sao-luis': {
          'tropical': '#0EA5E9',    // Azul tropical
          'sky': '#E0F7FF',         // Azul céu claro
          'coral': '#F97316',       // Rosa dos casarões
          'coral-light': '#FECACA', // Rosa claro
          'gold': '#FBBF24',        // Amarelo ouro
          'teal': '#14B8A6',        // Verde tropical
          'cream': '#FFFBF0',       // Creme marfim
          // Cores roxo/violeta (novo estilo)
          'purple': '#7C3AED',      // Roxo vibrante
          'purple-dark': '#5B21B6', // Roxo escuro
          'purple-light': '#EDE9FE', // Roxo claro
        }
      },
      backgroundImage: {
        'gradient-sao-luis': 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
        'gradient-purple': 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)',
        // Imagens de fundo de São Luís
        'beach-sao-luis': 'linear-gradient(rgba(14, 165, 233, 0.7), rgba(15, 23, 42, 0.7)), url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop")',
        'ocean-waves': 'linear-gradient(rgba(6, 182, 212, 0.6), rgba(14, 165, 233, 0.6)), url("https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&h=600&fit=crop")',
        'tropical-sunset': 'linear-gradient(135deg, rgba(249, 115, 22, 0.7) 0%, rgba(251, 146, 60, 0.7) 100%), url("https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1200&h=600&fit=crop")',
        'colonial-houses': 'linear-gradient(rgba(54, 18, 124, 0.6), rgba(30, 10, 60, 0.7)), url("https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&h=600&fit=crop")',
      }
    },
  },
  plugins: [],
};
