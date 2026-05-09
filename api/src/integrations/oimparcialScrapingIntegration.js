import puppeteer from 'puppeteer';
import supabase from '../database/db.js';
import { detectRegion } from '../utils/regionDetector.js';
import * as newsService from '../services/newsService.js';

const OIMPARCIAL_PAGES = [
  { url: 'https://oimparcial.com.br/?s=s%C3%A3o+lu%C3%ADs', source: 'O Imparcial - Busca São Luís' },
  { url: 'https://oimparcial.com.br/?s=raposa', source: 'O Imparcial - Busca Raposa' },
  { url: 'https://oimparcial.com.br/?s=pa%C3%A7o+do+lumiar', source: 'O Imparcial - Busca Paço do Lumiar' },
  { url: 'https://oimparcial.com.br/?s=s%C3%A3o+jos%C3%A9+de+ribamar', source: 'O Imparcial - Busca S. J. Ribamar' },
];

// Helper para remover HTML residual
function stripHtml(htmlStr) {
  if (!htmlStr) return '';
  return htmlStr.replace(/<[^>]+>/g, '').trim();
}

// Converter URLs para formato absoluto se necessário
function safeUrl(href) {
  if (!href) return null;
  if (href.startsWith('//')) return 'https:' + href;
  if (href.startsWith('/')) return 'https://oimparcial.com.br' + href;
  return href;
}

export async function scrapeAndSyncOImparcial() {
  console.log('[O Imparcial] Iniciando sincronização via Puppeteer...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  let totalScraped = 0;
  let insertedArticles = 0;
  const newArticles = [];

  try {
    for (const pageInfo of OIMPARCIAL_PAGES) {
      console.log(`\n[O Imparcial] Acessando ${pageInfo.source}: ${pageInfo.url}`);
      const page = await browser.newPage();
      
      try {
        await page.goto(pageInfo.url, { waitUntil: 'networkidle2', timeout: 60000 });
        
        // Espera para dar tempo da busca do Google Custom Search Engine (CSE) carregar os resultados
        await new Promise(r => setTimeout(r, 8000));

        // Tentar pegar os artigos gerados pelo CSE (com a estrutura enviada pelo usuário)
        const articles = await page.evaluate(() => {
          const results = [];
          
          // Buscar pela estrutura do GSC
          const gscItems = document.querySelectorAll('.gsc-webResult.gsc-result');
          if (gscItems && gscItems.length > 0) {
            gscItems.forEach(el => {
              // Pegar o link e o título
              const titleLinkEl = el.querySelector('a.gs-title');
              if (!titleLinkEl) return;
              
              const title = titleLinkEl.innerText;
              const url = titleLinkEl.href;
              
              // Pegar resumo
              const summaryEl = el.querySelector('.gs-snippet');
              const summary = summaryEl ? summaryEl.innerText : '';
              
              // Pegar imagem
              const imgEl = el.querySelector('img.gs-image');
              const imageUrl = imgEl ? imgEl.src : null;
              
              // Pegar possível data ou chapéu
              const chapeu = 'Notícias';
              
              if (title && url) {
                results.push({
                  title,
                  url,
                  summary,
                  imageUrl,
                  category: chapeu,
                  timeAgo: 'Recente'
                });
              }
            });
            return results;
          }

          // Fallback caso encontre o grid de notícias normal do O Imparcial
          document.querySelectorAll('article').forEach(article => {
            const titleEl = article.querySelector('.entry-title a, h2 a, h3 a');
            if (!titleEl) return;
            
            const title = titleEl.innerText;
            const url = titleEl.href;
            const summaryEl = article.querySelector('.entry-summary, p');
            const summary = summaryEl ? summaryEl.innerText : '';
            const imgEl = article.querySelector('img');
            const imageUrl = imgEl ? imgEl.src : null;
            
            const categoryEl = article.querySelector('.cat-links a');
            const category = categoryEl ? categoryEl.innerText : 'Notícias';
            
            results.push({
              title,
              url,
              summary,
              imageUrl,
              category,
              timeAgo: 'Recente'
            });
          });

          return results;
        });

        console.log(`[O Imparcial] Encontrados ${articles.length} artigos na página.`);
        totalScraped += articles.length;

        for (const item of articles) {
          const cleanTitle = stripHtml(item.title);
          const cleanSummary = stripHtml(item.summary);
          const urlStr = safeUrl(item.url);
          const imgUrlStr = safeUrl(item.imageUrl);
          
          // Para o Google CSE, muitas vezes a URL vai ser uma URL de redirect do google.
          // O Imparcial CSE links geralmente apontam pro próprio site, mas vamos pular se não tiver nada válido
          if (!cleanTitle || !urlStr) continue;

          // Detectar a região com base no título e sumário
          const match = detectRegion(cleanTitle, cleanSummary, urlStr);
          if (match) {
            newArticles.push({
              region_id: match.region_id,
              category: item.category || 'Notícias',
              title: cleanTitle,
              source: 'O Imparcial',
              timeAgo: item.timeAgo,
              summary: cleanSummary,
              content: cleanSummary || 'Leia mais no site de O Imparcial.',
              url: urlStr,
              imageUrl: imgUrlStr
            });
          }
        }
      } catch (pageErr) {
        console.error(`[O Imparcial] Erro ao processar página ${pageInfo.url}:`, pageErr.message);
      } finally {
        await page.close();
      }
    }

    console.log(`\n[O Imparcial] Total de artigos encontrados (bruto): ${totalScraped}`);
    console.log(`[O Imparcial] Artigos mapeados por região válidos: ${newArticles.length}`);

    // Persistir no banco se houver artigos novos
    if (newArticles.length > 0) {
      const { data: existingData } = await supabase.from('news').select('url');
      const existingUrls = existingData ? existingData.map(n => n.url) : [];

      for (const art of newArticles) {
        // Checar se a notícia já existe pela URL
        if (existingUrls.includes(art.url)) {
          // console.log(`[O Imparcial] Já existe: ${art.title}`);
          continue;
        }
        
        try {
          await newsService.createNews(art);
          insertedArticles++;
          console.log(`[O Imparcial] Inserido: [${art.region_id}] ${art.title}`);
        } catch (insertErr) {
          console.error(`[O Imparcial] Erro ao inserir "${art.title}":`, insertErr.message);
        }
      }
    }

    console.log(`\n[O Imparcial] Sincronização concluída. ${insertedArticles} novas inseridas.`);
    return {
      message: 'Scraping d\'O Imparcial finalizado com sucesso.',
      totalScraped,
      foundArticles: newArticles.length,
      insertedArticles
    };
  } catch (err) {
    console.error('[O Imparcial] Falha no processo de scraping:', err);
    throw err;
  } finally {
    await browser.close();
  }
}
