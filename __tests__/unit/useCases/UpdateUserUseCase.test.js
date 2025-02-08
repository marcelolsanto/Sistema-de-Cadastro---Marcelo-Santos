// __tests__/unit/useCases/UpdateUserUseCase.test.js
import { jest } from '@jest/globals';
import { UpdateUserUseCase } from '../../../src/application/useCases/user/UpdateUserUseCase.js';

describe('UpdateUserUseCase', () => {
    let mockUserRepository;
    let mockAuthService;
    let updateUserUseCase;

    beforeEach(() => {
        mockUserRepository = {
            update: jest.fn()
        };

        mockAuthService = {
            hashPassword: jest.fn().mockImplementation((senha) => {
                // Simula o hash da senha
                return Promise.resolve(`hashed_${senha}`);
            })
        };

        updateUserUseCase = new UpdateUserUseCase(
            mockUserRepository, 
            mockAuthService
        );
    });

    it('should update user successfully', async () => {
        const userId = 1;
        const userData = {
            nome: 'Updated Name',
            email: 'updated@example.com'
        };

        const mockUpdatedUser = {
            id: userId,
            ...userData
        };

        mockUserRepository.update.mockResolvedValue(mockUpdatedUser);

        const updatedUser = await updateUserUseCase.execute(userId, userData);

        expect(mockUserRepository.update).toHaveBeenCalledWith(userId, userData);
        expect(updatedUser).toEqual(mockUpdatedUser);
    });

    it('should hash password when updating', async () => {
        const userId = 1;
        const userData = {
            nome: 'Updated Name',
            senha: 'newpassword'
        };

        const mockUpdatedUser = {
            id: userId,
            nome: 'Updated Name'
        };

        mockUserRepository.update.mockResolvedValue(mockUpdatedUser);

        const result = await updateUserUseCase.execute(userId, userData);

        // Verificar que hashPassword foi chamado com a senha
        expect(mockAuthService.hashPassword).toHaveBeenCalledWith(userData.senha);
        
        // Verificar que o repositório foi chamado com os dados corretos
        expect(mockUserRepository.update).toHaveBeenCalledWith(
            userId, 
            {
                nome: 'Updated Name',
                senha_hash: `hashed_${userData.senha}`
            }
        );
    });

    it('should throw error if no id is provided', async () => {
        await expect(updateUserUseCase.execute(null, {})).rejects.toThrow('ID do usuário é obrigatório');
    });
});