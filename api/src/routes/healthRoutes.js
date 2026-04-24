/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Verifica se a API está online
 *     description: >
 *       Endpoint de health check para uso por qualquer frontend ou serviço externo.
 *       Retorna status `ok` e o timestamp atual. Útil para verificar conectividade
 *       antes de fazer outras requisições.
 *     tags:
 *       - Utilitários
 *     responses:
 *       200:
 *         description: API online
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-04-24T10:00:00.000Z"
 */
