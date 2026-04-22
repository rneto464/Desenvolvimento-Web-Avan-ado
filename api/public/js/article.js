document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');

  const loader = document.getElementById('article-loader');
  const articleContainer = document.getElementById('article-content');
  const elCategory = document.getElementById('article-category');
  const elTime = document.getElementById('article-time');
  const elTitle = document.getElementById('article-title');
  const elSource = document.getElementById('article-source');
  const elBody = document.getElementById('article-body');

  if (!articleId) {
    loader.textContent = 'Erro: ID da notícia não fornecido.';
    return;
  }

  async function fetchArticle() {
    try {
      const response = await fetch(`/api/news/${articleId}`);
      if (!response.ok) {
        throw new Error('Notícia não encontrada.');
      }
      const article = await response.json();

      elCategory.textContent = article.category || 'GERAL';
      elTime.textContent = article.timeAgo || 'Recente';
      elTitle.textContent = article.title;
      elSource.textContent = article.source || 'Portal UPAON';

      // Simples conversão de markdown/texto para HTML
      let contentHtml = article.content || 'Conteúdo não disponível.';
      contentHtml = contentHtml.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      elBody.innerHTML = contentHtml;

      loader.style.display = 'none';
      articleContainer.style.display = 'block';
    } catch (error) {
      console.error(error);
      loader.textContent = 'Erro ao carregar a notícia.';
    }
  }

  fetchArticle();
});
