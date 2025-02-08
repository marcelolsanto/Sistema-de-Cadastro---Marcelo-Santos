// __tests__/unit/useCases/LoginUseCase.test.js
import { jest } from '@jest/globals';
import { LoginUseCase } from '../../../src/application/useCases/user/LoginUseCase.js';

describe('LoginUseCase', () => {
    let mockUserRepository;
    let mockAuthService;
    let loginUseCase;

    beforeEach(() => {
        mockUserRepository = {
            findByEmail: jest.fn()
        };

        mockAuthService = {
            comparePassword: jest.fn(),
            generateToken: jest.fn()
        };

        loginUseCase = new LoginUseCase(mockUserRepository, mockAuthService);
    });

    it('should login successfully', async () => {
        const userData = {
            id: 1,
            nome: 'Test User',
            email: 'test@example.com',
            senha_hash: 'hashed_password',
            tipo: 'admin'
        };

        const loginData = {
            email: 'test@example.com',
            senha: 'password123'
        };

        mockUserRepository.findByEmail.mockResolvedValue(userData);
        mockAuthService.comparePassword.mockResolvedValue(true);
        mockAuthService.generateToken.mockReturnValue('fake_token');

        const result = await loginUseCase.execute(loginData);

        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginData.email);
        expect(mockAuthService.comparePassword).toHaveBeenCalledWith(loginData.senha, userData.senha_hash);
        expect(result.user.email).toBe(userData.email);
        expect(result).toHaveProperty('token');
    });

    it('should throw error for non-existent user', async () => {
        const loginData = {
            email: 'nonexistent@example.com',
            senha: 'password123'
        };

        mockUserRepository.findByEmail.mockResolvedValue(null);

        await expect(loginUseCase.execute(loginData)).rejects.toThrow('Usuário não encontrado');
    });

    it('should throw error for incorrect password', async () => {
        const userData = {
            id: 1,
            nome: 'Test User',
            email: 'test@example.com',
            senha_hash: 'hashed_password',
            tipo: 'admin'
        };

        const loginData = {
            email: 'test@example.com',
            senha: 'wrong_password'
        };

        mockUserRepository.findByEmail.mockResolvedValue(userData);
        mockAuthService.comparePassword.mockResolvedValue(false);

        await expect(loginUseCase.execute(loginData)).rejects.toThrow('Senha incorreta');
    });
});