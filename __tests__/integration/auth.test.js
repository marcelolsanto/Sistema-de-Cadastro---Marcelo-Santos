// __tests__/integration/auth.test.js
import { jest } from '@jest/globals';
import request from 'supertest';
import dotenv from 'dotenv';
import { UserModel } from '../../src/infrastructure/database/models/sequelize/UserModel.js';
import { AuthService } from '../../src/domain/services/AuthService.js';

// Carregar variáveis de ambiente antes de importar o app
dotenv.config();

import app from '../../src/interfaces/http/api/server.js';
// Importa o middleware authorization diretamente do caminho correto
import { authorization } from '../../src/infrastructure/http/middlewares/auth.js';

describe('Authentication Integration Tests', () => {
    const userTypes = ['admin', 'vendedor', 'cliente'];
    const tokens = {};

    it('deve retornar 401 se o header de autorização não for fornecido aqui', () => {
        // Arrange: Cria mocks para req, res e next
        const req = { headers: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        // Act: Chama o middleware
        authorization(req, res, next);

        // Assert: Verifica se os métodos foram chamados corretamente
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token não fornecido' });
        expect(next).not.toHaveBeenCalled();
    });

    beforeAll(async () => {
        // Configuração dos usuários para os testes de integração
        for (const role of userTypes) {
            const hashedPassword = await AuthService.hashPassword('password123');
            
            const user = await UserModel.create({
                nome: `Test ${role}`,
                email: `${role}@test.com`,
                senha: hashedPassword,
                cpf: `${Math.floor(10000000000 + Math.random() * 90000000000)}`,
                tipoUsuario: role,
                telefone: '11999999999',
                dataNascimento: new Date('1990-01-01'),
                endereco: 'Rua Teste, 123',
                cidade: 'São Paulo',
                estado: 'SP',
                role: role
            });
            
            const response = await request(app)
                .post('/api/login')
                .send({
                    email: `${role}@test.com`,
                    senha: 'password123'
                });
            
            tokens[role] = response.body.token;
        }
    });

    afterAll(async () => {
        await UserModel.destroy({ 
            where: {},
            force: true
        });
    });

    describe('Access Control', () => {
        const endpoints = {
            users: '/api/users'
        };

        for (const tipo of userTypes) {
            const expectedStatus = ['admin', 'vendedor'].includes(tipo) ? 200 : 403;

            test(`${tipo} should ${expectedStatus === 200 ? 'access' : 'be forbidden from'} user list`, async () => {
                const response = await request(app)
                    .get(endpoints.users)
                    .set('Authorization', `Bearer ${tokens[tipo]}`);

                expect(response.status).toBe(expectedStatus);
            });
        }
    });
});