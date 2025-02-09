// src/infrastructure/http/routes/userRoutes.js
import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { authMiddleware, authorize } from '../middlewares/auth.js';


export const userRoutes = Router();
const userController = new UserController();

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
userRoutes.get('/', 
    authMiddleware, 
    authorize(['admin', 'vendedores', 'fornecedores', 'liberadores', 'medidores']), 
    (req, res) => userController.getAllUsers(req, res)
);
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
userRoutes.get('/:id', 
    authMiddleware, 
    authorize([], true), 
    (req, res) => userController.getUserById(req, res)
);
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
userRoutes.post('/', 
    authMiddleware,
    authorize(['admin']), 
    (req, res) => userController.create(req, res)
);

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
userRoutes.put('/:id', 
    authMiddleware, 
    authorize([], true), 
    (req, res) => userController.update(req, res)
);
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
userRoutes.delete('/:id', 
    authMiddleware, 
    authorize(['admin', 'lojas']), 
    (req, res) => userController.delete(req, res)
);

export default userRoutes;