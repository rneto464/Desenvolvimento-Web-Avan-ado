const db = require('./db');

const serializeDb = () => {
  db.serialize(() => {
    // Tabela das Regiões
    db.run(`CREATE TABLE IF NOT EXISTS regions (
      id TEXT PRIMARY KEY,
      name TEXT,
      uf TEXT
    )`);

    // Tabela de Dados Socioeconômicos
    db.run(`CREATE TABLE IF NOT EXISTS socio_data (
      region_id TEXT PRIMARY KEY,
      population INTEGER,
      hdi REAL,
      average_income REAL,
      pib TEXT
    )`);

    // Tabela de Notícias
    db.run(`CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      region_id TEXT,
      category TEXT,
      title TEXT,
      source TEXT,
      timeAgo TEXT,
      summary TEXT,
      url TEXT,
      imageUrl TEXT,
      content TEXT
    )`);

    // Verificar se já temos regiões e não popular de novo
    db.get('SELECT COUNT(*) as count FROM regions', (err, row) => {
      if (err) return console.error(err);
      if (row.count === 0) {
        console.log("Populando dados falsos pelo SQLite...");
        seedData();
      } else {
        console.log("Banco já populado.");
      }
    });

  });
};

function seedData() {
  const regions = [
    { id: '1', name: 'São Luís', uf: 'MA' },
    { id: '2', name: 'Raposa', uf: 'MA' },
    { id: '3', name: 'Paço do Lumiar', uf: 'MA' },
    { id: '4', name: 'São José de Ribamar', uf: 'MA' },
    { id: 'all', name: 'Ilha de São Luís', uf: 'MA' } // Region master
  ];

  const stmtRegion = db.prepare('INSERT INTO regions VALUES (?, ?, ?)');
  const stmtSocio = db.prepare('INSERT INTO socio_data VALUES (?, ?, ?, ?, ?)');
  const stmtNews = db.prepare('INSERT INTO news (region_id, category, title, source, timeAgo, summary, url, imageUrl, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  
  // Populando region
  regions.forEach(r => {
    stmtRegion.run(r.id, r.name, r.uf);
  });
  
  // All Socio
  stmtSocio.run('all', 1450000, 0.745, 1750.00, '38.5 Bilhões');
  
  // All News
  const newsAll = [
    { category: 'ECONOMIA', title: 'Novos investimentos chegam à zona portuária da ilha', source: 'Portal Nacional', timeAgo: '10h atrás', summary: 'Terminal do Itaqui visa aumentar em 20% a exportação ainda este ano.', url: '#', imageUrl: 'images/economia.png' },
    { category: 'EDUCAÇÃO', title: 'UEMA divulga novas vagas para o EAD', source: 'Jornal Educação', timeAgo: '1d atrás', summary: 'Cursos técnicos e profissionalizantes estão sendo expandidos para todo o estado.', url: '#', imageUrl: 'images/educacao.png' },
    { category: 'SAÚDE', title: 'Prefeituras da Ilha anunciam mutirão de consultas', source: 'EcoBrasil', timeAgo: '2d atrás', summary: 'Ação em conjunto das prefeituras visa diminuir filas de espera no SUS.', url: '#', imageUrl: 'images/saude.png' }
  ];
  newsAll.forEach(n => {
    stmtNews.run('all', n.category, n.title, n.source, n.timeAgo, n.summary, n.url, n.imageUrl, `A notícia **"${n.title}"** gerou grande repercussão.\n\nLorem ipsum dolor sit amet...`);
  });

  const categories = ['ECONOMIA', 'SAÚDE', 'EDUCAÇÃO', 'SOCIAL', 'INFRAESTRUTURA'];
  const sources = ['O Imparcial', 'Jornal Pequeno', 'G1 MA', 'Mirante AM'];

  regions.filter(r => r.id !== 'all').forEach(region => {
    let pop, hdi, income, pib;
    if (region.name === 'São Luís') { pop = 1037775; hdi = 0.768; income = 2200.00; pib = '34.2 Bilhões'; }
    else if (region.name === 'Raposa') { pop = 31548; hdi = 0.613; income = 900.00; pib = '0.3 Bilhões'; }
    else if (region.name === 'Paço do Lumiar') { pop = 145643; hdi = 0.724; income = 1100.00; pib = '1.8 Bilhões'; }
    else if (region.name === 'São José de Ribamar') { pop = 180345; hdi = 0.708; income = 1350.00; pib = '2.2 Bilhões'; }
    
    stmtSocio.run(region.id, pop, hdi, income, pib);

    const count = Math.floor(Math.random() * 4) + 2; 
    for(let i = 0; i < count; i++) {
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const src = sources[Math.floor(Math.random() * sources.length)];
      let title = `Notícia sobre ${cat} em ${region.name}`;
      let summary = `Resumo da notícia em ${region.name}.`;
      let imgUrl = `images/${cat.toLowerCase()}.png`;

      if(cat === 'ECONOMIA') {
        title = `Fomento local e turismo alavancam negócios em ${region.name}`;
        summary = `A alta temporada já reflete positivamente nos bares.`;
      } else if (cat === 'SAÚDE') {
        title = `Postos de saúde de ${region.name} passam por ampliação`;
        summary = `Cronograma de obras prevê entrega na próxima semana.`;
      } else if (cat === 'EDUCAÇÃO') {
        title = `Escolas de ${region.name} recebem laboratórios`;
        summary = `Alunos com equipamentos modernos.`;
      } else if (cat === 'INFRAESTRUTURA') {
        title = `Obras avançam em ${region.name}`;
        summary = `Melhoria na malha viária reduziu acidentes.`;
      }

      stmtNews.run(region.id, cat, title, src, `${Math.floor(Math.random() * 20)+1}h atrás`, summary, '#', imgUrl, `A notícia **"${title}"** gerou grande repercussão em ${region.name}.\n\nLorem ipsum dolor sit amet...`);
    }
  });

  stmtRegion.finalize();
  stmtSocio.finalize();
  stmtNews.finalize();
}

module.exports = { serializeDb };
