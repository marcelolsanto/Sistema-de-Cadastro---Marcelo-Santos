// __tests__/unit/useCases/GetAllUsersUseCase.test.js
import { jest } from '@jest/globals';
import { GetAllUsersUseCase } from '../../../src/application/useCases/user/GetAllUsersUseCase.js';

describe('GetAllUsersUseCase', () => {
    let mockUserRepository;
    let getAllUsersUseCase;

    beforeEach(() => {
        mockUserRepository = {
            findAll: jest.fn()
        };

        getAllUsersUseCase = new GetAllUsersUseCase(mockUserRepository);
    });

    it('should retrieve all users', async () => {
        const mockUsers = [
            { id: 1, nome: 'User 1', email: 'user1@example.com' },
            { id: 2, nome: 'User 2', email: 'user2@example.com' }
        ];

        mockUserRepository.findAll.mockResolvedValue(mockUsers);

        const users = await getAllUsersUseCase.execute();

        expect(mockUserRepository.findAll).toHaveBeenCalled();
        expect(users).toEqual(mockUsers);
        expect(users.length).toBe(2);
    });

    it('should throw an error if repository fails', async () => {
        mockUserRepository.findAll.mockRejectedValue(new Error('Database error'));

        await expect(getAllUsersUseCase.execute()).rejects.toThrow('Erro ao buscar usuários: Database error');
    });
});