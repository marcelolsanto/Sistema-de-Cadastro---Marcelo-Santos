// __tests__/integration/auth.test.js
import { jest } from '@jest/globals';
import request from 'supertest';
import dotenv from 'dotenv';
import { UserModel } from '../../src/infrastructure/database/models/sequelize/UserModel.js';
import { AuthService } from '../../src/domain/services/AuthService.js';

dotenv.config();

import app from '../../src/interfaces/http/api/server.js';
import { authorization } from '../../src/infrastructure/http/middlewares/auth.js';

describe('Authentication Integration Tests', () => {
    const userTypes = ['admin', 'vendedor', 'cliente'];
    const tokens = {};
    const authService = new AuthService();

    it('deve retornar 401 se o header de autorização não for fornecido', async () => {
        const req = { headers: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        await authorization(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token não fornecido' });
        expect(next).not.toHaveBeenCalled();
    });

    beforeAll(async () => {
        try {
            await UserModel.destroy({ 
                where: {},
                force: true 
            });

            for (const role of userTypes) {
                const hashedPassword = await authService.hashPassword('password123');
                
                await UserModel.create({
                    nome: `Test ${role}`,
                    email: `${role}@test.com`,
                    senha_hash: hashedPassword,
                    tipo: role,
                    cpf: `${Math.floor(10000000000 + Math.random() * 90000000000)}`,
                    tipoUsuario: role,
                    role: role,
                    status: 'ativo'
                });
                
                const loginResponse = await request(app)
                    .post('/api/auth/login')
                    .send({
                        email: `${role}@test.com`,
                        senha: 'password123'
                    });
                
                console.log(`Login response for ${role}:`, {
                    status: loginResponse.status,
                    body: loginResponse.body
                });
                
                if (loginResponse.body?.data?.token) {
                    tokens[role] = loginResponse.body.data.token;
                } else {
                    console.error(`Failed to get token for ${role}:`, loginResponse.body);
                    console.error(`Login failed for ${role} with status:`, loginResponse.status);
                }
            }

            console.log('Final tokens:', tokens);

        } catch (error) {
            console.error('Setup failed:', error);
            throw error;
        }
    });

    afterAll(async () => {
        try {
            await UserModel.destroy({ 
                where: {},
                force: true
            });
        } catch (error) {
            console.error('Cleanup failed:', error);
        }
    });

    test('admin should access user list', async () => {
        const response = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${tokens.admin}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('vendedor should access user list', async () => {
        const response = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${tokens.vendedor}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('cliente should be forbidden from user list', async () => {
        const response = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${tokens.cliente}`);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('error', 'Acesso não autorizado');
    });

    describe('Auth Middleware', () => {
        it('should fail when no authorization header is present', async () => {
            const response = await request(app)
                .get('/api/users');

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ error: 'Token não fornecido' });
        });

        it('should pass with valid token', async () => {
            const response = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${tokens.admin}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        it('should fail with invalid token', async () => {
            const response = await request(app)
                .get('/api/users')
                .set('Authorization', 'Bearer invalid-token');

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ error: 'Token inválido' });
        });
    });
});