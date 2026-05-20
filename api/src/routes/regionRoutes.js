import express from 'express';
import * as regionController from '../controllers/regionController.js';
import validateRegionId from '../middlewares/validateRegionId.js';

function validatePagination(req, res, next) {
  let { page = '1', limit = '20' } = req.query;
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);
  if (isNaN(page) || page < 1) return res.status(400).json({ error: 'page deve ser um inteiro >= 1.' });
  if (isNaN(limit) || limit < 1 || limit > 100) return res.status(400).json({ error: 'limit deve ser um inteiro entre 1 e 100.' });
  req.query.page = page;
  req.query.limit = limit;
  next();
}

const router = express.Router();

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
router.get('/:id/data', validateRegionId(), regionController.getRegionData);

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
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página (começa em 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Itens por página (máx 100)
 *     responses:
 *       200:
 *         description: Página de notícias da região
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 region_id:
 *                   type: string
 *                   example: "2"
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 20
 *                 total:
 *                   type: integer
 *                   example: 142
 *                 articles:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Parâmetros inválidos
 */
router.get('/:id/news', validateRegionId({ allowAll: true }), validatePagination, regionController.getRegionNews);

export default router;
