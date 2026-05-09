import puppeteer from 'puppeteer';
import supabase from '../database/db.js';
import { detectRegion } from '../utils/regionDetector.js';

const G1_PAGES = [
  { url: 'https://g1.globo.com/ma/maranhao/videos-jmtv-1-edicao/', source: 'G1 - JMTV 1ª Edição' },
  { url: 'https://g1.globo.com/ma/maranhao/ultimas-noticias/', source: 'G1 - Últimas Notícias MA' }
];

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let lastHeight = document.body.scrollHeight;
      let attempts = 0;
      const timer = setInterval(() => {
        window.scrollBy(0, 900);
        attempts++;
        const newHeight = document.body.scrollHeight;
        if (newHeight === lastHeight || attempts >= 25) {
          clearInterval(timer);
          resolve();
        }
        lastHeight = newHeight;
      }, 350);
    });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.evaluate(() => window.scrollTo(0, 0));
}

async function scrapePage(page, pageUrl, source) {
  try {
    await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('.bastian-feed-item', { timeout: 15000 });
    await autoScroll(page);

    return await page.evaluate((src) => {
      const results = [];
      const seen = new Set();

      function add(title, url, imageUrl, timeAgo, summary) {
        if (!url || !url.includes('g1.globo.com') || seen.has(url)) return;
        seen.add(url);
        results.push({
          title: title?.trim() || '',
          url,
          imageUrl: imageUrl || null,
          timeAgo: timeAgo?.trim() || 'Recente',
          summary: summary?.trim() || '',
          source: src
        });
      }

      // 1. Feed principal — artigos padrão
      document.querySelectorAll('.bastian-feed-item[data-type="materia"]').forEach(item => {
        const link = item.querySelector('a.feed-post-link');
        const img  = item.querySelector('.bstn-fd-picture-image');
        const time = item.querySelector('.feed-post-datetime');
        const summ = item.querySelector('.feed-post-body-resumo p');
        if (link) add(link.textContent, link.href, img?.src, time?.textContent, summ?.textContent);
      });

      // 2. Artigos relacionados dentro do feed principal
      document.querySelectorAll('.bstn-related .bstn-relateditem a.bstn-relatedtext').forEach(link => {
        const time = link.querySelector('.feed-post-datetime')?.textContent;
        add(link.textContent, link.href, null, time, '');
      });

      // 3. Playlists de vídeo
      document.querySelectorAll('.post-playlist .media-wrapper-slider').forEach(wrapper => {
        const title = wrapper.querySelector('.feed-text-wrapper-slider a')?.textContent;
        const img   = wrapper.querySelector('.thumbnail-image');
        const imgUrl = img ? img.style.backgroundImage.replace(/url\(["']?|["']?\)/g, '') : null;
        add(title, wrapper.href, imgUrl, 'Recente', '');
      });

      // 4. Mais Lidas (coluna direita)
      document.querySelectorAll('.bastian-feed-item[data-type="post-mais-lidas"] .post-mais-lidas__section a').forEach(link => {
        const title = link.querySelector('.post-mais-lidas__title')?.textContent;
        add(title, link.href, null, 'Recente', '');
      });

      // 5. Seções agrupadas — Educação, Concursos, Cultura, etc. (coluna direita)
      document.querySelectorAll('.bastian-feed-item[data-type="post-agrupador-materia"] ul li div a[href]').forEach(link => {
        const img = link.closest('li')?.querySelector('img');
        add(link.textContent, link.href, img?.src, 'Recente', '');
      });

      return results;
    }, source);
  } catch (err) {
    console.error(`Erro ao raspar ${pageUrl}:`, err.message);
    return [];
  }
}

export async function scrapeAndSyncG1() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    const allArticles = [];
    for (const g1Page of G1_PAGES) {
      const articles = await scrapePage(page, g1Page.url, g1Page.source);
      allArticles.push(...articles);
    }

    // Remover duplicatas por URL
    const seen = new Set();
    const unique = allArticles.filter(a => {
      if (!a.url || seen.has(a.url)) return false;
      seen.add(a.url);
      return true;
    });

    const itemsToInsert = [];
    for (const article of unique) {
      if (!article.title) continue;
      const regionId = detectRegion(`${article.title} ${article.summary} ${article.url}`);

      itemsToInsert.push({
        region_id: regionId,
        category:  'G1 Maranhão',
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
      message: 'Sincronização G1 finalizada.',
      totalScraped: unique.length,
      foundArticles: itemsToInsert.length,
      insertedArticles: insertedCount
    };

  } finally {
    await browser.close();
  }
}
