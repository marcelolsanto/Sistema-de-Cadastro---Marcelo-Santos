// src/docs/paths/authPaths.js
/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome: { type: 'string' }
 *               email: { type: 'string' }
 *               cpf: { type: 'string' }
 *               senha: { type: 'string' }
 *               tipo: { 
 *                 type: 'string', 
 *                 enum: ['admin', 'vendedor', 'cliente', 'fornecedor', 'medidor', 'liberador']
 *               }
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: 'boolean' }
 *                 data: { $ref: '#/components/schemas/Usuario' }
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 */
export default {};