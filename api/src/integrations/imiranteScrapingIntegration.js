import puppeteer from 'puppeteer';
import supabase from '../database/db.js';
import { detectRegion } from '../utils/regionDetector.js';

const IMIRANTE_PAGES = [
  { url: 'https://imirante.com/', source: 'Imirante - Capa' },
  { url: 'https://imirante.com/noticias/sao-luis', source: 'Imirante - São Luís' },
  { url: 'https://imirante.com/noticias', source: 'Imirante - Notícias' },
  { url: 'https://imirante.com/busca?query=s%C3%A3o+jos%C3%A9+de+ribamar', source: 'Imirante - Busca S. J. Ribamar' },
  { url: 'https://imirante.com/busca?query=pa%C3%A7o+do+lumiar', source: 'Imirante - Busca Paço do Lumiar' },
  { url: 'https://imirante.com/busca?query=raposa', source: 'Imirante - Busca Raposa' }
];

// Helper para remover HTML residual
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').trim();
}

function safeUrl(url) {
  if (!url) return null;
  return url.startsWith('http') ? url : `https://imirante.com${url}`;
}

async function scrapePage(page, pageUrl, source) {
  try {
    await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Rolar a página algumas vezes para carregar imagens e itens lazy-load
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        let distance = 500;
        let timer = setInterval(() => {
          let scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight || totalHeight > 3000) {
            clearInterval(timer);
            resolve();
          }
        }, 200);
      });
    });

    return await page.evaluate((src) => {
      const results = [];
      const seen = new Set();

      document.querySelectorAll('.artigoListagem').forEach(article => {
        const linkEl = article.querySelector('a.artigoListagem__link');
        if (!linkEl || !linkEl.href) return;
        
        const url = linkEl.href;
        if (seen.has(url)) return;

        const titleEl = article.querySelector('.artigoListagem__titulo');
        const subtitleEl = article.querySelector('.artigoListagem__subtitulo');
        const imgEl = article.querySelector('img');
        const timeEl = article.querySelector('.artigoListagem__infos');

        const title = titleEl ? titleEl.innerText.trim() : '';
        const summary = subtitleEl ? subtitleEl.innerText.trim() : '';
        const imageUrl = imgEl ? imgEl.src : null;
        const timeAgo = timeEl ? timeEl.innerText.trim() : 'Recente';

        if (title && title.length > 10) {
          seen.add(url);
          results.push({
            title,
            url,
            imageUrl,
            timeAgo,
            summary,
            source: src
          });
        }
      });

      return results;
    }, source);
  } catch (err) {
    console.error(`Erro ao raspar ${pageUrl}:`, err.message);
    return [];
  }
}

export async function scrapeAndSyncImirante() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    const allArticles = [];
    for (const p of IMIRANTE_PAGES) {
      const articles = await scrapePage(page, p.url, p.source);
      allArticles.push(...articles);
    }

    // Remover duplicatas
    const seen = new Set();
    const unique = allArticles.filter(a => {
      if (!a.url || seen.has(a.url)) return false;
      seen.add(a.url);
      return true;
    });

    const itemsToInsert = [];
    for (const article of unique) {
      if (!article.title) continue;
      const regionId = detectRegion(`${article.title} ${article.url}`); // usamos título e url

      itemsToInsert.push({
        region_id: regionId,
        category:  'Imirante',
        title:     stripHtml(article.title),
        source:    stripHtml(article.source),
        timeAgo:   stripHtml(article.timeAgo),
        summary:   stripHtml(article.summary),
        url:       safeUrl(article.url),
        imageUrl:  safeUrl(article.imageUrl),
        content:   'Conteúdo disponível no link original.'
      });
    }

    let insertedCount = 0;
    for (const item of itemsToInsert) {
      if (!item.url) continue;
      const { data: existing } = await supabase.from('news').select('id').eq('url', item.url).maybeSingle();
      if (!existing) {
        const { error } = await supabase.from('news').insert([item]);
        if (!error) insertedCount++;
      }
    }

    return {
      message: 'Sincronização Imirante finalizada.',
      totalScraped: unique.length,
      foundArticles: itemsToInsert.length,
      insertedArticles: insertedCount
    };

  } finally {
    await browser.close();
  }
}
