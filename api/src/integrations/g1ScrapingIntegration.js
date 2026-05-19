import axios from 'axios';
import * as cheerio from 'cheerio';
import { publicClient, adminClient } from '../database/db.js';
import { stripHtml, safeUrl } from '../utils/sanitize.js';

const G1_PAGES = [
  { url: 'https://g1.globo.com/ma/maranhao/videos-jmtv-1-edicao/', source: 'G1 - JMTV 1ª Edição' },
  { url: 'https://g1.globo.com/ma/maranhao/ultimas-noticias/', source: 'G1 - Últimas Notícias MA' }
];

// Ordem importa: cidades mais específicas primeiro para evitar falso match com São Luís
const REGIONS_MAP = [
  { regionId: '4', keywords: ['são josé de ribamar', 'sao jose de ribamar', 'sao-jose-de-ribamar', 'são jose de ribamar', 'sao josé de ribamar', 'ribamar'] },
  { regionId: '3', keywords: ['paço do lumiar', 'paco do lumiar', 'paco-do-lumiar', 'paço-do-lumiar'] },
  { regionId: '2', keywords: ['raposa'] },
  { regionId: '1', keywords: ['são luís', 'sao luis', 'são luis', 'sao luís', 'sao-luis', 'são-luís'] }
];

const HTTP_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
};

function detectRegion(text) {
  const lower = text.toLowerCase();
  for (const region of REGIONS_MAP) {
    if (region.keywords.some(kw => lower.includes(kw))) {
      return region.regionId;
    }
  }
  return '1'; // fallback: São Luís (cobertura geral do MA)
}

/**
 * Faz o fetch da página G1 e extrai artigos usando cheerio (sem browser headless).
 * Compatível com ambientes serverless (Vercel, Railway, etc.).
 */
async function scrapePage(pageUrl, source) {
  try {
    const { data: html } = await axios.get(pageUrl, {
      headers: HTTP_HEADERS,
      timeout: 20000,
    });

    const $ = cheerio.load(html);
    const results = [];
    const seen = new Set();

    function add(title, url, imageUrl, timeAgo, summary) {
      if (!url || !url.includes('g1.globo.com') || seen.has(url)) return;
      seen.add(url);
      results.push({
        title:    title?.trim() || '',
        url,
        imageUrl: imageUrl || null,
        timeAgo:  timeAgo?.trim() || 'Recente',
        summary:  summary?.trim() || '',
        source
      });
    }

    // 1. Feed principal — artigos padrão
    $('[data-type="materia"]').each((_, item) => {
      const link    = $(item).find('a.feed-post-link');
      const img     = $(item).find('.bstn-fd-picture-image');
      const time    = $(item).find('.feed-post-datetime');
      const summary = $(item).find('.feed-post-body-resumo p');
      if (link.length) {
        add(link.text(), link.attr('href'), img.attr('src'), time.text(), summary.text());
      }
    });

    // 2. Artigos relacionados dentro do feed principal
    $('.bstn-related .bstn-relateditem a.bstn-relatedtext').each((_, link) => {
      const time = $(link).find('.feed-post-datetime').text();
      add($(link).text(), $(link).attr('href'), null, time, '');
    });

    // 3. Mais Lidas
    $('[data-type="post-mais-lidas"] .post-mais-lidas__section a').each((_, link) => {
      const title = $(link).find('.post-mais-lidas__title').text();
      add(title, $(link).attr('href'), null, 'Recente', '');
    });

    // 4. Seções agrupadas — Educação, Concursos, Cultura, etc.
    $('[data-type="post-agrupador-materia"] ul li div a[href]').each((_, link) => {
      const img = $(link).closest('li').find('img');
      add($(link).text(), $(link).attr('href'), img.attr('src'), 'Recente', '');
    });

    return results;
  } catch (err) {
    console.error(`Erro ao raspar ${pageUrl}:`, err.message);
    return [];
  }
}

export async function scrapeAndSyncG1() {
  const allArticles = [];

  for (const g1Page of G1_PAGES) {
    const articles = await scrapePage(g1Page.url, g1Page.source);
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
    const { data: existing } = await publicClient.from('news').select('id').eq('url', item.url).maybeSingle();
    if (!existing) {
      const { error } = await adminClient.from('news').insert([item]);
      if (!error) insertedCount++;
    }
  }

  return {
    message: 'Sincronização G1 finalizada.',
    totalScraped: unique.length,
    foundArticles: itemsToInsert.length,
    insertedArticles: insertedCount
  };
}
