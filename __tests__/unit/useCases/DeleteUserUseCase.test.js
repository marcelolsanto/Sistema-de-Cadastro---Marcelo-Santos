// __tests__/unit/useCases/DeleteUserUseCase.test.js
import { jest } from '@jest/globals';
import { DeleteUserUseCase } from '../../../src/application/useCases/user/DeleteUserUseCase.js';

describe('DeleteUserUseCase', () => {
    let mockUserRepository;
    let deleteUserUseCase;

    beforeEach(() => {
        mockUserRepository = {
            delete: jest.fn()
        };

        deleteUserUseCase = new DeleteUserUseCase(mockUserRepository);
    });

    it('should delete user successfully', async () => {
        const userId = 1;
        const mockDeleteResult = { message: 'Usuário removido com sucesso' };

        mockUserRepository.delete.mockResolvedValue(mockDeleteResult);

        const result = await deleteUserUseCase.execute(userId);

        expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
        expect(result).toEqual(mockDeleteResult);
    });

    it('should throw error if no id is provided', async () => {
        await expect(deleteUserUseCase.execute()).rejects.toThrow('ID do usuário é obrigatório');
    });

    it('should handle delete error', async () => {
        const userId = 1;
        mockUserRepository.delete.mockRejectedValue(new Error('Usuário não encontrado'));

        await expect(deleteUserUseCase.execute(userId)).rejects.toThrow('Usuário não encontrado');
    });
});