const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

/**
 * @swagger
 * /api/news/external/g1/sync:
 *   post:
 *     summary: Sincroniza notícias do G1 Maranhão com o banco de dados
 *     description: >
 *       Busca notícias da API interna do G1 (JMTV 1ª Edição) e salva no banco apenas
 *       as que mencionam São Luís, Raposa, Paço do Lumiar ou São José de Ribamar.
 *       Notícias já existentes (por URL) não são duplicadas.
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
 *                 foundArticles:
 *                   type: integer
 *                   example: 3
 *                 insertedArticles:
 *                   type: integer
 *                   example: 2
 *       500:
 *         description: Erro ao acessar a API do G1 ou o banco de dados
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
