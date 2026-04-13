const Parser = require('rss-parser');
const parser = new Parser();

/**
 * Extrai notícias hiperlocais usando o RSS do G1 Maranhão
 */
async function fetchLatestNews(limit = 5) {
    try {
        const url = 'https://g1.globo.com/rss/g1/ma/maranhao/';
        const feed = await parser.parseURL(url);
        
        const qtd = Math.max(3, Math.min(limit, 5));
        
        // Formatamos para que a estrutura visual combine com o que o Frontend já esperava
        const formattedItems = feed.items.slice(0, qtd).map(item => {
            // Arrumando a Data do PubDate do RSS
            let dateStr = new Date(item.pubDate).toLocaleDateString('pt-BR');
            return {
                id: item.guid || Math.random().toString(),
                titulo: item.title,
                introducao: item.contentSnippet || 'Leia mais na íntegra...',
                data_publicacao: dateStr,
                editorias: 'G1 Maranhão',
                link: item.link
            };
        });

        return formattedItems;
    } catch (error) {
        throw new Error('Erro ao processar dados da integração RSS: ' + error.message);
    }
}

module.exports = {
  fetchLatestNews
};
