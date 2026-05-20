# Central de Noticias São Luís

Plataforma de gerenciamento de notícias regionais para a Ilha de São Luís, Maranhão. O sistema coleta automaticamente notícias do G1 Maranhão via web scraping e as exibe em uma interface moderna e responsiva.

Municípios cobertos: **São Luís**, **Raposa**, **Paço do Lumiar** e **São José de Ribamar**.

---

## Tecnologias

### Backend (`/api`)

| Tecnologia | Versão | Uso |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express | 5.2.1 | Framework HTTP |
| Supabase | — | Banco de dados PostgreSQL |
| Puppeteer | 22.0.0 | Web scraping (headless Chrome) |
| Cheerio | 1.2.0 | Parsing de HTML |
| Axios | 1.15.2 | Cliente HTTP |
| node-cron | 4.2.1 | Agendamento de tarefas |
| Swagger UI | — | Documentação interativa da API |

### Frontend (`/Front-end`)

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 18.3.1 | Framework de UI |
| TypeScript | 5.5.3 | Tipagem estática |
| Vite | 5.4.2 | Build tool |
| React Router DOM | 7.14.1 | Roteamento |
| Tailwind CSS | 3.4.1 | Estilização |
| Axios | 1.15.0 | Requisições HTTP |
| Supabase JS | 2.57.4 | Cliente do banco de dados |
| Lucide React | 0.344.0 | Ícones |

---

## Estrutura do Projeto

```
/
├── package.json              # Scripts monorepo (install:api, install:front, dev:api, dev:front)
├── api/                      # Backend — API Express
│   ├── index.js              # Entry point: configuração do Express, CORS, Swagger
│   └── src/
│       ├── controllers/      # Handlers HTTP (news, region, ibge)
│       ├── services/         # Regras de negócio
│       ├── routes/           # Definição das rotas Express
│       ├── integrations/     # Scraping G1, RSS, IBGE, cliente HTTP
│       ├── middlewares/      # Auth, logging, tratamento de erros, validação
│       ├── database/         # Inicialização do cliente Supabase
│       ├── docs/             # Configuração do Swagger
│       ├── utils/            # Sanitização de HTML/URLs
│       └── workers/          # Worker de scraping em background
└── Front-end/                # Frontend — SPA React
    └── src/
        ├── pages/            # Home, NewsDetails, Readlist
        ├── components/       # Navbar, NewsCard, Footer, SearchBar, etc.
        ├── services/         # Wrappers Axios para a API
        ├── context/          # ReadlistContext (lista de leitura)
        └── hooks/            # useReadlist, useFetch, useDebounce
```

---

## Configuração do Ambiente

### Backend — `api/.env`

```env
SUPABASE_URL=https://<seu-projeto>.supabase.co
SUPABASE_ANON_KEY=<chave-anonima>
SUPABASE_SERVICE_ROLE_KEY=<chave-service-role>
PORT=3000
API_SECRET_KEY=<token-bearer-para-rotas-protegidas>
```

### Frontend — `Front-end/.env`

Copie o arquivo de exemplo e preencha com os seus valores:

```bash
cp Front-end/.env.example Front-end/.env
```

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://<seu-projeto>.supabase.co
VITE_SUPABASE_ANON_KEY=<chave-anonima>
```

---

## Instalação e Execução

### Pré-requisitos

- Node.js 18+
- npm

### Instalação

```bash
# Instalar dependências do backend
npm run install:api

# Instalar dependências do frontend
npm run install:front
```

### Desenvolvimento

Execute em dois terminais separados:

```bash
# Terminal 1 — Backend (porta 3000)
npm run dev:api

# Terminal 2 — Frontend Vite (porta 5173)
npm run dev:front
```

### Build de Produção

```bash
cd Front-end && npm run build
# Saída gerada em Front-end/dist/
```

---

## API

A documentação interativa completa está disponível em `http://localhost:3000/api-docs` (Swagger UI).

### Endpoints Públicos

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/health` | Verificação de saúde do servidor |
| `GET` | `/api/news` | Listar notícias com paginação e filtros |
| `GET` | `/api/news/:id` | Buscar notícia por ID |
| `GET` | `/api/regions` | Listar todas as regiões |
| `GET` | `/api/regions/:id/data` | Dados socioeconômicos de uma região |
| `GET` | `/api/regions/:id/news` | Notícias de uma região específica |
| `GET` | `/api/ibge/news` | Notícias da Agência IBGE de Notícias |

### Endpoints Protegidos (requer `Authorization: Bearer <API_SECRET_KEY>`)

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/news` | Criar notícia manualmente |
| `PUT` | `/api/news/:id` | Atualizar notícia |
| `DELETE` | `/api/news/:id` | Excluir notícia |
| `POST` | `/api/news/external/g1/sync` | Disparar scraping manual do G1 |

### Parâmetros de Paginação e Filtro (`GET /api/news`)

| Parâmetro | Padrão | Máximo | Descrição |
|---|---|---|---|
| `page` | `1` | — | Número da página |
| `limit` | `12` | `50` | Itens por página |
| `region_id` | — | — | ID da região (1–4) |
| `category` | — | — | Filtro por categoria (texto parcial) |

---

## Banco de Dados

### Tabela `news`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | serial PK | Identificador único |
| `region_id` | string | ID da região (`'1'`–`'4'`) |
| `title` | text | Título da notícia |
| `content` | text | Conteúdo completo |
| `summary` | text | Resumo |
| `category` | text | Categoria |
| `source` | text | Fonte (ex.: "G1 - JMTV 1ª Edição") |
| `url` | text (único) | URL original (evita duplicatas) |
| `imageUrl` | text | URL da imagem de capa |
| `timeAgo` | text | Tempo relativo (ex.: "Há 2 horas") |
| `created_at` | timestamp | Data de criação |

### Tabela `regions`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | string PK | `'1'` a `'4'` e `'all'` |
| `name` | text | Nome do município |
| `uf` | text | `'MA'` |

### Tabela `socio_data`

| Coluna | Tipo | Descrição |
|---|---|---|
| `region_id` | string FK | Referência para `regions` |
| `population` | integer | População |
| `idh` | numeric | Índice de Desenvolvimento Humano |
| `average_income` | numeric | Renda média |
| `pib` | numeric | PIB |

---

## Funcionalidades

### Scraping Automático (G1 Maranhão)

- Coleta notícias do G1 Maranhão via Puppeteer (headless Chrome) + Cheerio
- Detecta automaticamente a região a partir de palavras-chave no título/resumo/URL
- Auto-scroll para carregar conteúdo lazy-loaded
- Deduplicação por URL para evitar reinserção
- Executa **a cada hora** via cron (`0 * * * *`) e também na inicialização do servidor

### Frontend — Páginas

**Home (`/`)**
— Listagem de notícias com filtro por região, busca por título/resumo, paginação e esqueletos de carregamento.

**NewsDetails (`/noticias/:id`)**
— Visualização completa da notícia com botão de salvar para leitura posterior e compartilhamento via Web Share API.

**Readlist (`/readlist`)**
— Lista de artigos salvos, persistida no `localStorage`, com opções de reordenar e remover.

### Segurança

- Autenticação via Bearer token com comparação timing-safe (`crypto.timingSafeEqual`)
- Headers de segurança: CSP, `X-Content-Type-Options`, `X-Frame-Options`
- Sanitização de HTML e validação de URLs para dados vindos do scraping

---

## Desenvolvimento

```bash
# Linting (frontend)
cd Front-end && npm run lint

# Type checking (frontend)
cd Front-end && npm run typecheck
```

A documentação completa da API é gerada automaticamente a partir de comentários JSDoc nas rotas. Para adicionar ou atualizar endpoints, edite os comentários Swagger em `api/src/routes/`.
