document.addEventListener('DOMContentLoaded', () => {
  const regionNav = document.getElementById('region-nav');
  const newsGrid = document.getElementById('news-grid');
  const currentRegionTitle = document.getElementById('current-region-title');

  async function fetchRegions() {
    try {
      const response = await fetch('/api/regions');
      const regions = await response.json();

      createNavButton('all', 'Todas', true);

      regions.forEach(region => {
        createNavButton(region.id, region.name);
      });

      fetchNews('all', 'Todas');
    } catch (error) {
      console.error('Erro ao buscar regiões:', error);
      regionNav.innerHTML = '<p>Erro ao carregar menu.</p>';
    }
  }

  function createNavButton(id, name, isDefault = false) {
    const btn = document.createElement('button');
    btn.className = `nav-btn ${isDefault ? 'active' : ''}`;
    btn.textContent = name;
    btn.onclick = () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      fetchNews(id, name);
    };
    regionNav.appendChild(btn);
  }

  async function fetchNews(regionId, regionName) {
    newsGrid.innerHTML = '<div class="loader">Carregando notícias...</div>';
    currentRegionTitle.textContent = regionId === 'all' ? 'Últimas Notícias' : `Notícias - ${regionName}`;

    try {
      const response = await fetch(`/api/regions/${regionId}/news`);

      if (!response.ok) {
        throw new Error('Sem notícias para esta região');
      }

      const data = await response.json();
      const articles = data.articles || [];

      if (articles.length === 0) {
        newsGrid.innerHTML = '';
        return;
      }

      renderNews(articles);
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      newsGrid.innerHTML = '';
    }
  }

  function renderNews(articles) {
    newsGrid.innerHTML = '';
    articles.forEach((article, index) => {
      const card = document.createElement('div');
      card.className = 'news-card';

      const cleanSummary = article.summary ? article.summary.replace(/[*_~`]/g, '') : 'Resumo indisponível';

      card.innerHTML = `
        <div class="card-header">
          <span class="category-badge">${article.category || 'GERAL'}</span>
          <span class="time-ago">${article.timeAgo || 'Recente'}</span>
        </div>
        <h3>${article.title}</h3>
        <p>${cleanSummary}</p>
        <div class="card-footer">
          <span class="source">${article.source || 'Portal UPAON'}</span>
          <a href="#" class="read-more" data-index="${index}">Ler mais ➔</a>
        </div>
      `;
      newsGrid.appendChild(card);
    });

    document.querySelectorAll('.read-more').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const articleIndex = e.target.getAttribute('data-index');
        const selectedArticle = articles[articleIndex];
        window.location.href = `/article.html?id=${selectedArticle.id}`;
      });
    });
  }

  fetchRegions();
});
