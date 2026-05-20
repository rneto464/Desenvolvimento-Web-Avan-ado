-- Tabelas
CREATE TABLE IF NOT EXISTS regions (
  id TEXT PRIMARY KEY,
  name TEXT,
  uf TEXT
);

CREATE TABLE IF NOT EXISTS socio_data (
  region_id TEXT PRIMARY KEY,
  population INTEGER,
  hdi REAL,
  average_income REAL,
  pib TEXT
);

CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  region_id TEXT,
  category TEXT,
  title TEXT,
  source TEXT,
  "timeAgo" TEXT,
  summary TEXT,
  url TEXT,
  "imageUrl" TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  related_sources TEXT[] DEFAULT '{}',
  related_urls TEXT[] DEFAULT '{}'
);

-- Seed Data (Executar apenas uma vez)
INSERT INTO regions (id, name, uf) VALUES 
('1', 'São Luís', 'MA'),
('2', 'Raposa', 'MA'),
('3', 'Paço do Lumiar', 'MA'),
('4', 'São José de Ribamar', 'MA'),
('all', 'Ilha de São Luís', 'MA') ON CONFLICT DO NOTHING;

INSERT INTO socio_data (region_id, population, hdi, average_income, pib) VALUES 
('all', 1450000, 0.745, 1750.00, '38.5 Bilhões'),
('1', 1037775, 0.768, 2200.00, '34.2 Bilhões'),
('2', 31548, 0.613, 900.00, '0.3 Bilhões'),
('3', 145643, 0.724, 1100.00, '1.8 Bilhões'),
('4', 180345, 0.708, 1350.00, '2.2 Bilhões') ON CONFLICT DO NOTHING;

-- Comando para apagar todas as notícias da tabela
TRUNCATE TABLE news RESTART IDENTITY;
