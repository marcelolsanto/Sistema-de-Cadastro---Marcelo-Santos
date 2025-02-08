// __tests__/unit/repositories/UserRepository.test.js
import { jest } from '@jest/globals';
const { describe, it, expect, beforeEach } = global;
import { SequelizeUserRepository } from '../../../src/infrastructure/database/repositories/sequelize/SequelizeUserRepository.js';
import { User } from '../../../src/domain/entities/User.js';

describe('SequelizeUserRepository', () => {
    let repository;
    let mockUserModel;

    beforeEach(() => {
        mockUserModel = {
            findByPk: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn()
        };
        repository = new SequelizeUserRepository(mockUserModel);
    });

    describe('findById', () => {
        it('should return user when found', async () => {
            const mockData = {
                id: 1,
                nome: 'Test User',
                email: 'test@example.com',
                cpf: '12345678900',
                tipo: 'admin',
                toJSON: () => ({
                    id: 1,
                    nome: 'Test User',
                    email: 'test@example.com',
                    cpf: '12345678900',
                    tipo: 'admin'
                })
            };

            mockUserModel.findByPk.mockResolvedValue(mockData);
            const result = await repository.findById(1);

            expect(mockUserModel.findByPk).toHaveBeenCalledWith(1);
            expect(result).toBeInstanceOf(User);
            expect(result.id).toBe(1);
        });
    });
});