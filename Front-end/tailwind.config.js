/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        news: {
          red:     '#C41230',
          'red-dark':  '#9B0F27',
          'red-light': '#FFF5F5',
          ink:     '#0F0F0F',
          charcoal:'#1A1A1A',
          graphite:'#333333',
          muted:   '#777777',
          subtle:  '#AAAAAA',
          rule:    '#E0E0E0',
          surface: '#F5F5F5',
        },
        // mantido para não quebrar referências antigas ainda presentes
        'sao-luis': {
          'purple':       '#C41230',
          'purple-dark':  '#9B0F27',
          'purple-light': '#FFF5F5',
          'tropical':     '#0EA5E9',
          'sky':          '#E0F7FF',
          'coral':        '#F97316',
          'coral-light':  '#FECACA',
          'gold':         '#FBBF24',
          'teal':         '#14B8A6',
          'cream':        '#FFFBF0',
        },
      },
      backgroundImage: {
        'gradient-news':   'linear-gradient(135deg, #C41230 0%, #9B0F27 100%)',
        'gradient-dark':   'linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)',
        // mantidos por compatibilidade
        'gradient-purple': 'linear-gradient(135deg, #C41230 0%, #9B0F27 100%)',
        'gradient-sao-luis': 'linear-gradient(135deg, #C41230 0%, #9B0F27 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
