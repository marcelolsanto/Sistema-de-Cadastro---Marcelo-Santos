// src/infrastructure/http/routes/userRoutes.js

import express from 'express';
import { authorization, authMiddleware } from '../middlewares/auth.js';
import { UserController } from '../controllers/UserController.js';

const router = express.Router();
const userController = new UserController();

// Wrapper para tratar erros assíncronos
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Endpoints para gerenciamento de usuários
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 */
// Rota para listar usuários - acessível para admin, vendedores, fornecedores, liberadores, medidores
router.get('/',authorization,authMiddleware(['admin', 'vendedor', 'liberador', 'fornecedor', 'medidor', 'loja', 'cliente']),
    asyncHandler((req, res) => userController.getAllUsers(req, res))
);
router.get('/', authorization,authMiddleware
    (['admin', 'vendedor', 'liberador', 'fornecedor', 'medidor', 'loja', 'cliente']), userController.getAllUsers);
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtém um usuário pelo ID
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário a ser buscado
 *     responses:
 *       200:
 *         description: Dados do usuário retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuário não encontrado
 */
// Rota para buscar usuário por ID - acesso próprio ou admin
// Rota para buscar usuário por ID
router.get('/:id', authorization,authMiddleware(['admin', 'vendedor']),userController.getUserById);
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               cpf:
 *                 type: string
 *               senha:
 *                 type: string
 *               tipo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Erro na criação do usuário
 */
// Outras rotas mantidas como estavam
router.post('/', authMiddleware, authorization(['admin']), userController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza os dados de um usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               cpf:
 *                 type: string
 *               senha:
 *                 type: string
 *               tipo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Erro na atualização dos dados
 *       404:
 *         description: Usuário não encontrado
 */
// Rota para atualizar usuário
router.put('/:id', authorization, authMiddleware(['admin']),userController.updateUser);
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Exclui um usuário pelo ID
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário a ser excluído
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
// Rota para deletar usuário
router.delete('/:id', 
    authorization,
    authMiddleware(['admin']),
    asyncHandler((req, res) => userController.deleteUser(req, res))
);

export default userRoutes;