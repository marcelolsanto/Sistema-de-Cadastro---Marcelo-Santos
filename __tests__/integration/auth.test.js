// __tests__/integration/auth.test.js
const { describe, it, expect, beforeAll, beforeEach } = global;
import request from 'supertest';
import { app } from '../../src/interfaces/http/api/server.js';
import { sequelize } from '../../src/infrastructure/database/config/database.js';
import { AuthService } from '../../src/domain/services/AuthService.js';
import { UserModel } from '../../src/infrastructure/database/models/sequelize/UserModel.js';

describe('Auth Routes', () => {
    let authService;
    let adminToken;
    let nonAdminToken;

    beforeAll(async () => {
        authService = new AuthService();

        try {
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
            await sequelize.sync({ force: true });
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        } catch (error) {
            console.error('Falha na configuração do teste:', error);
            throw error;
        }
    });

    beforeEach(async () => {
        try {
            // Limpar todos os modelos
            await Promise.all(
                Object.values(sequelize.models).map(model =>
                    model.destroy({
                        where: {},
                        force: true,
                        truncate: { cascade: true }
                    })
                )
            );

            // Criar usuário admin
            const adminData = {
                nome: 'Admin User',
                email: 'admin@example.com',
                cpf: '12345678900',
                senha: 'admin123',
                tipo: 'admin'
            };

            const senha_hash = await authService.hashPassword(adminData.senha);
            const adminUser = await UserModel.create({
                ...adminData,
                senha_hash
            });

            // Criar usuário não-admin
            const userData = {
                nome: 'Regular User',
                email: 'user@example.com',
                cpf: '98765432100',
                senha: 'user123',
                tipo: 'cliente'
            };

            const userSenha_hash = await authService.hashPassword(userData.senha);
            const user = await UserModel.create({
                ...userData,
                senha_hash: userSenha_hash
            });

            // Gerar tokens
            adminToken = authService.generateToken(adminUser);
            nonAdminToken = authService.generateToken(user);
        } catch (error) {
            console.error('Falha na preparação do teste:', error);
            throw error;
        }
    });

    it('should register a new user', async () => {
        const userData = {
            nome: 'Test User',
            email: 'test@example.com',
            cpf: '32145678945',
            senha: 'test123',
            tipo: 'cliente'
        };

        const response = await request(app)
            .post('/api/auth/register')
            .send(userData);

        expect(response.status).toBe(201);
        
        // Verificar a estrutura da resposta
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Operação realizada com sucesso');
        expect(response.body).toHaveProperty('data');
        
        // Verificar o ID dentro do data
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.email).toBe(userData.email);
    });

    it('should retrieve all users with admin token', async () => {
        // Adicionar alguns usuários
        const usersToAdd = [
            {
                nome: 'User 1',
                email: 'user1@example.com',
                cpf: '11111111111',
                senha: 'password1',
                tipo: 'cliente'
            }
        ];

        // Adicionar usuários
        for (const userData of usersToAdd) {
            const senha_hash = await authService.hashPassword(userData.senha);
            await UserModel.create({
                ...userData,
                senha_hash
            });
        }

        const response = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${adminToken}`);

        console.log('Resposta da busca de usuários:', response.status, response.body);

        // Verificar status da resposta
        expect(response.status).toBe(200);
        
        // Verificar a estrutura da resposta
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Operação realizada com sucesso');
        expect(response.body).toHaveProperty('data');
        
        // Verificar se data é um array
        expect(Array.isArray(response.body.data)).toBe(true);
        
        // Verificar se há usuários
        expect(response.body.data.length).toBeGreaterThan(0);
        
        // Verificar estrutura de um usuário
        const firstUser = response.body.data[0];
        expect(firstUser).toHaveProperty('id');
        expect(firstUser).toHaveProperty('nome');
        expect(firstUser).toHaveProperty('email');
    });

    it('should not allow non-admin users to retrieve users', async () => {
        const response = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${nonAdminToken}`);

        console.log('Resposta de usuário não-admin:', response.status, response.body);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('error', 'Acesso não autorizado');
    });

    it('should delete user with admin token', async () => {
        // Primeiro, criar um usuário para deletar
        const userData = {
            nome: 'User to Delete',
            email: 'delete@example.com',
            cpf: '99999999999',
            senha: 'password123',
            tipo: 'cliente'
        };
    
        const senha_hash = await authService.hashPassword(userData.senha);
        const userToDelete = await UserModel.create({
            ...userData,
            senha_hash
        });
    
        const response = await request(app)
            .delete(`/api/users/${userToDelete.id}`)
            .set('Authorization', `Bearer ${adminToken}`);
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Usuário removido com sucesso');
    
        // Verificar se o usuário foi realmente deletado
        const deletedUser = await UserModel.findByPk(userToDelete.id);
        expect(deletedUser).toBeNull();
    });
    
    it('should not allow non-admin users to delete users', async () => {
        const response = await request(app)
            .delete('/api/users/1')
            .set('Authorization', `Bearer ${nonAdminToken}`);
    
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('error', 'Acesso não autorizado');
    });
});