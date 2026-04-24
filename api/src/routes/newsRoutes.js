const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Lista todas as notícias com paginação e filtros
 *     description: >
 *       Retorna notícias paginadas ordenadas da mais recente para a mais antiga.
 *       Filtre por região ou categoria via query string.
 *     tags:
 *       - Notícias
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Itens por página (máx. recomendado 50)
 *       - in: query
 *         name: region_id
 *         schema:
 *           type: string
 *         description: "Filtra por região (1=São Luís, 2=Raposa, 3=Paço do Lumiar, 4=São José de Ribamar)"
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtra por categoria (busca parcial, ex: G1)
 *     responses:
 *       200:
 *         description: Lista paginada de notícias
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: integer
 *                   example: 120
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 12
 *                 totalPages:
 *                   type: integer
 *                   example: 10
 *       500:
 *         description: Erro no banco de dados
 */
router.get('/', newsController.listNews);

/**
 * @swagger
 * /api/news/external/g1/sync:
 *   post:
 *     summary: Sincroniza notícias do G1 Maranhão com o banco de dados
 *     description: >
 *       Usa Puppeteer (headless Chrome) para raspar as páginas G1 - JMTV 1ª Edição e
 *       G1 - Últimas Notícias MA. Extrai artigos de 5 tipos de widget por página
 *       (feed principal, artigos relacionados, playlists, Mais Lidas e seções agrupadas)
 *       e aplica auto-scroll para carregar conteúdo lazy-loaded.
 *
 *       Distribuição por região — keywords detectadas no título, resumo e URL
 *       (ordem de prioridade: São José de Ribamar → Paço do Lumiar → Raposa → São Luís).
 *       Artigos sem cidade explícita são atribuídos a São Luís como fallback.
 *       Notícias já existentes (por URL) não são duplicadas.
 *
 *       **Execução automática:** este mesmo robô roda automaticamente a cada hora
 *       (cron `0 * * * *`) e também na inicialização do servidor. Não é necessário
 *       chamá-lo manualmente em produção — use-o apenas para forçar uma sincronização
 *       imediata fora do ciclo agendado.
 *     tags:
 *       - Sincronização
 *     responses:
 *       200:
 *         description: Relatório da sincronização
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sincronização G1 finalizada.
 *                 totalScraped:
 *                   type: integer
 *                   description: Total de artigos únicos coletados nas páginas
 *                   example: 48
 *                 foundArticles:
 *                   type: integer
 *                   description: Artigos com região detectada prontos para inserção
 *                   example: 48
 *                 insertedArticles:
 *                   type: integer
 *                   description: Artigos novos efetivamente inseridos no banco
 *                   example: 5
 *       500:
 *         description: Erro no scraping ou no banco de dados
 */
router.post('/external/g1/sync', newsController.syncG1News);

/**
 * @swagger
 * /api/news/{id}:
 *   get:
 *     summary: Busca uma notícia pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico da notícia
 *     responses:
 *       200:
 *         description: Dados da notícia
 *       404:
 *         description: Notícia não encontrada
 */
router.get('/:id', newsController.getNewsById);

/**
 * @swagger
 * /api/news:
 *   post:
 *     summary: Cria uma notícia manualmente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - region_id
 *               - title
 *               - content
 *             properties:
 *               region_id:
 *                 type: string
 *                 example: "1"
 *               category:
 *                 type: string
 *                 example: G1 Maranhão
 *               title:
 *                 type: string
 *               source:
 *                 type: string
 *               summary:
 *                 type: string
 *               url:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notícia criada com sucesso
 *       400:
 *         description: Campos obrigatórios ausentes
 */
router.post('/', newsController.createNews);

/**
 * @swagger
 * /api/news/{id}:
 *   put:
 *     summary: Atualiza uma notícia existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *               title:
 *                 type: string
 *               source:
 *                 type: string
 *               summary:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notícia atualizada com sucesso
 *       404:
 *         description: Notícia não encontrada
 */
router.put('/:id', newsController.updateNews);

/**
 * @swagger
 * /api/news/{id}:
 *   delete:
 *     summary: Deleta uma notícia pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notícia deletada com sucesso
 *       404:
 *         description: Notícia não encontrada
 */
router.delete('/:id', newsController.deleteNews);

module.exports = router;
