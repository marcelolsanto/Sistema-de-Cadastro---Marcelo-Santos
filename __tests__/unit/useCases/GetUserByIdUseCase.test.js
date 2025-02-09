// __tests__/unit/useCases/GetUserByIdUseCase.test.js
import { jest } from '@jest/globals';
import { GetUserByIdUseCase } from '../../../src/application/useCases/user/GetUserByIdUseCase.js';

describe('GetUserByIdUseCase', () => {
    let mockUserRepository;
    let getUserByIdUseCase;

    beforeEach(() => {
        mockUserRepository = {
            findById: jest.fn()
        };

        getUserByIdUseCase = new GetUserByIdUseCase(mockUserRepository);
    });

    it('should retrieve user by id', async () => {
        const mockUser = {
            id: 1,
            nome: 'Test User',
            email: 'test@example.com',
            tipo: 'cliente',
            senha_hash: 'hashed_password'
        };

        mockUserRepository.findById.mockResolvedValue(mockUser);

        const user = await getUserByIdUseCase.execute(1);

        expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
        expect(user).toEqual({
            id: 1,
            nome: 'Test User',
            email: 'test@example.com',
            tipo: 'cliente'
        });
        expect(user).not.toHaveProperty('senha_hash');
    });

    it('should throw error if no id is provided', async () => {
        await expect(getUserByIdUseCase.execute()).rejects.toThrow('ID do usuário é obrigatório');
    });

    it('should throw error if user is not found', async () => {
        mockUserRepository.findById.mockResolvedValue(null);

        await expect(getUserByIdUseCase.execute(999)).rejects.toThrow('Usuário não encontrado');
    });
});