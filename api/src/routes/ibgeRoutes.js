import express from 'express';
import { listIbgeNews } from '../controllers/ibgeController.js';

const router = express.Router();

/**
 * @swagger
 * /api/ibge/news:
 *   get:
 *     summary: Retorna notícias recentes da Agência de Notícias do IBGE
 *     description: >
 *       Realiza uma chamada HTTP para a API pública do IBGE
 *       (https://servicodados.ibge.gov.br/api/v3/noticias/) e retorna
 *       entre 3 e 5 notícias mapeadas para o formato interno da aplicação.
 *
 *       Os dados são obtidos em tempo real — sem cache.
 *       Campos mapeados: id, title, summary, link, publishedAt, image, editorias, available.
 *     tags:
 *       - Integrações Externas
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 3
 *           maximum: 5
 *           default: 5
 *         description: "Quantidade de notícias a retornar (mínimo: 3, máximo: 5)"
 *     responses:
 *       200:
 *         description: Lista de notícias do IBGE mapeadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 source:
 *                   type: string
 *                   example: "IBGE — Agência de Notícias"
 *                 total:
 *                   type: integer
 *                   example: 5
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
 *                       link:
 *                         type: string
 *                         nullable: true
 *                       publishedAt:
 *                         type: string
 *                         nullable: true
 *                       image:
 *                         type: string
 *                         nullable: true
 *                       editorias:
 *                         type: array
 *                         items:
 *                           type: string
 *                       available:
 *                         type: boolean
 *                         description: "false se o artigo não possui link externo"
 *       503:
 *         description: "API do IBGE indisponível ou timeout"
 *       500:
 *         description: Erro interno ao processar a resposta
 */
router.get('/news', listIbgeNews);

export default router;
