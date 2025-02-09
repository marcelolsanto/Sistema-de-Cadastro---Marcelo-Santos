// __tests__/integration/auth.test.js
import request from 'supertest';
import { app } from '../../src/interfaces/http/api/server.js';
import { sequelize } from '../../src/infrastructure/database/config/database.js';
import { AuthService } from '../../src/domain/services/AuthService.js';
import { UserModel } from '../../src/infrastructure/database/models/sequelize/UserModel.js';

it(`${tipo} should ${expectedStatus === 200 ? 'access' : 'be forbidden from'} user list`, async () => {
    console.log(`Testando ${tipo} com token: ${tokens[tipo]}`);
    console.log(`Tipo de usuário: ${tipo}`);
    
    const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${tokens[tipo]}`);

    console.log(`Resposta para ${tipo}:`, response.status, response.body);

    expect(response.status).toBe(expectedStatus);
});

describe('User Authorization Tests', () => {
    let authService;
    let tokens = {};
    let userIds = {};
    
    const userTypes = [
        { 
            tipo: 'admin', 
            email: 'admin@example.com',
            nome: 'Admin Teste',
            cpf: '12345678900'
        },
        { 
            tipo: 'cliente', 
            email: 'cliente@example.com',
            nome: 'Cliente Teste',
            cpf: '98765432100'
        },
        { 
            tipo: 'vendedor', 
            email: 'vendedor@example.com',
            nome: 'Vendedor Teste',
            cpf: '45678912300'
        },
        { 
            tipo: 'fornecedor', 
            email: 'fornecedor@example.com',
            nome: 'Fornecedor Teste',
            cpf: '78912345600'
        },
        { 
            tipo: 'liberador', 
            email: 'liberador@example.com',
            nome: 'Liberador Teste',
            cpf: '23456789100'
        },
        { 
            tipo: 'medidor', 
            email: 'medidor@example.com',
            nome: 'Medidor Teste',
            cpf: '56789123400'
        }
    ];

    beforeAll(async () => {
        authService = new AuthService();

        try {
            // Desabilitar verificações de chave estrangeira
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
            
            // Sincronizar modelos com opção de força
            await sequelize.sync({ force: true });
            
            // Reabilitar verificações de chave estrangeira
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

            // Criar usuários para teste
            for (const userData of userTypes) {
                const senha_hash = await authService.hashPassword('senha123');
                
                const user = await UserModel.create({
                    ...userData,
                    senha_hash: senha_hash
                });

                // Gerar token para cada usuário
                tokens[userData.tipo] = authService.generateToken(user);
                userIds[userData.tipo] = user.id;
            }
        } catch (error) {
            console.error('Erro na configuração do banco de dados:', error);
            throw error;
        }
    });

    // Teste de criação de usuários
    describe('User Creation Validation', () => {
        it('should create users with correct attributes', async () => {
            for (const userData of userTypes) {
                const user = await UserModel.findOne({ 
                    where: { email: userData.email } 
                });

                expect(user).toBeTruthy();
                expect(user.nome).toBe(userData.nome);
                expect(user.email).toBe(userData.email);
                expect(user.cpf).toBe(userData.cpf);
                expect(user.tipo).toBe(userData.tipo);
            }
        });
    });

    // Testes de autorização para lista de usuários
    describe('GET /api/users', () => {
        const testCases = [
            { tipo: 'admin', expectedStatus: 200 },
            { tipo: 'vendedor', expectedStatus: 200 },
            { tipo: 'fornecedor', expectedStatus: 200 },
            { tipo: 'liberador', expectedStatus: 200 },
            { tipo: 'medidor', expectedStatus: 200 },
            { tipo: 'cliente', expectedStatus: 403 }
        ];

        testCases.forEach(({ tipo, expectedStatus }) => {
            it(`${tipo} should ${expectedStatus === 200 ? 'access' : 'be forbidden from'} user list`, async () => {
                const response = await request(app)
                    .get('/api/users')
                    .set('Authorization', `Bearer ${tokens[tipo]}`);

                expect(response.status).toBe(expectedStatus);
            });
        });
    });

    // Testes de autorização para busca de usuário por ID
    describe('GET /api/users/:id', () => {
        const testCases = [
            { 
                userType: 'admin', 
                targetType: 'cliente', 
                expectedStatus: 200 
            },
            { 
                userType: 'cliente', 
                targetType: 'cliente', 
                expectedStatus: 200 
            },
            { 
                userType: 'cliente', 
                targetType: 'vendedor', 
                expectedStatus: 403 
            }
        ];

        testCases.forEach(({ userType, targetType, expectedStatus }) => {
            it(`${userType} should ${expectedStatus === 200 ? 'access' : 'be forbidden from'} ${targetType}'s data`, async () => {
                const response = await request(app)
                    .get(`/api/users/${userIds[targetType]}`)
                    .set('Authorization', `Bearer ${tokens[userType]}`);

                expect(response.status).toBe(expectedStatus);
            });
        });
    });

    // Testes de autorização para atualização de usuário
    describe('PUT /api/users/:id', () => {
        const testCases = [
            { 
                userType: 'cliente', 
                targetType: 'cliente', 
                expectedStatus: 200,
                updateData: { nome: 'Novo Nome Cliente' }
            },
            { 
                userType: 'cliente', 
                targetType: 'vendedor', 
                expectedStatus: 403,
                updateData: { nome: 'Tentativa de Atualização Inválida' }
            },
            { 
                userType: 'admin', 
                targetType: 'cliente', 
                expectedStatus: 403,
                updateData: { nome: 'Tentativa de Atualização por Admin' }
            }
        ];

        testCases.forEach(({ userType, targetType, expectedStatus, updateData }) => {
            it(`${userType} should ${expectedStatus === 200 ? 'update' : 'be forbidden from updating'} ${targetType}'s data`, async () => {
                const response = await request(app)
                    .put(`/api/users/${userIds[targetType]}`)
                    .set('Authorization', `Bearer ${tokens[userType]}`)
                    .send(updateData);

                expect(response.status).toBe(expectedStatus);
            });
        });
    });

    // Testes de autorização para exclusão de usuário
    describe('DELETE /api/users/:id', () => {
        const testCases = [
            { 
                userType: 'admin', 
                targetType: 'cliente', 
                expectedStatus: 200 
            },
            { 
                userType: 'cliente', 
                targetType: 'cliente', 
                expectedStatus: 403 
            },
            { 
                userType: 'vendedor', 
                targetType: 'cliente', 
                expectedStatus: 403 
            }
        ];

        testCases.forEach(({ userType, targetType, expectedStatus }) => {
            it(`${userType} should ${expectedStatus === 200 ? 'delete' : 'be forbidden from deleting'} ${targetType}'s account`, async () => {
                const response = await request(app)
                    .delete(`/api/users/${userIds[targetType]}`)
                    .set('Authorization', `Bearer ${tokens[userType]}`);

                expect(response.status).toBe(expectedStatus);
            });
        });
    });
});