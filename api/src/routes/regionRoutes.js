const express = require('express');
const router = express.Router();
const regionController = require('../controllers/regionController');

/**
 * @swagger
 * /api/regions:
 *   get:
 *     summary: Retorna todas as regiões cadastradas
 *     description: Lista as regiões disponíveis (São Luís, Raposa, Paço do Lumiar, São José de Ribamar). Não inclui a região "all".
 *     responses:
 *       200:
 *         description: Lista de regiões
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "2"
 *                   name:
 *                     type: string
 *                     example: Raposa
 *                   uf:
 *                     type: string
 *                     example: MA
 */
router.get('/', regionController.getAllRegions);

/**
 * @swagger
 * /api/regions/{id}/data:
 *   get:
 *     summary: Retorna dados socioeconômicos de uma região
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID da região (1=São Luís, 2=Raposa, 3=Paço do Lumiar, 4=São José de Ribamar, all=Ilha)"
 *     responses:
 *       200:
 *         description: Dados socioeconômicos (população, IDH, renda média, PIB)
 *       404:
 *         description: Dados não encontrados para esta região
 */
router.get('/:id/data', regionController.getRegionData);

/**
 * @swagger
 * /api/regions/{id}/news:
 *   get:
 *     summary: Retorna as notícias de uma região
 *     description: >
 *       Busca notícias do banco filtradas por region_id. Retorna array vazio se não houver
 *       notícias — use POST /api/news/external/g1/sync para popular o banco primeiro.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID da região (1=São Luís, 2=Raposa, 3=Paço do Lumiar, 4=São José de Ribamar, all=Todas)"
 *     responses:
 *       200:
 *         description: Lista de notícias da região (pode ser array vazio)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 region_id:
 *                   type: string
 *                   example: "2"
 *                 articles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       summary:
 *                         type: string
 *                       source:
 *                         type: string
 *                       timeAgo:
 *                         type: string
 *                       url:
 *                         type: string
 *                       imageUrl:
 *                         type: string
 *                       category:
 *                         type: string
 */
router.get('/:id/news', regionController.getRegionNews);

module.exports = router;
