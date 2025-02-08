import { jest } from '@jest/globals';
import { CreateUserUseCase } from '../../../src/application/useCases/user/CreateUserUseCase.js';

describe('CreateUserUseCase', () => {
    let mockUserRepository;
    let mockAuthService;
    let createUserUseCase;

    beforeEach(() => {
        // Mock do repositório de usuários
        mockUserRepository = {
            findByEmail: jest.fn(),
            create: jest.fn()
        };

        // Mock do serviço de autenticação
        mockAuthService = {
            hashPassword: jest.fn().mockResolvedValue('hashed_password')
        };

        // Criar a instância do use case com os mocks
        createUserUseCase = new CreateUserUseCase(mockUserRepository, mockAuthService);
    });

    it('should create user successfully', async () => {
        // Dados do usuário para teste
        const userData = {
            nome: 'Test User',
            email: 'test@example.com',
            cpf: '12345678900',
            senha: 'password123',
            tipo: 'admin'
        };

        // Configurar comportamento dos mocks
        mockUserRepository.findByEmail.mockResolvedValue(null);
        mockUserRepository.create.mockResolvedValue({
            ...userData,
            senha_hash: 'hashed_password'
        });

        // Executar o caso de uso
        const result = await createUserUseCase.execute(userData);

        // Verificações
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
        expect(mockAuthService.hashPassword).toHaveBeenCalledWith(userData.senha);
        expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
            nome: userData.nome,
            email: userData.email,
            cpf: userData.cpf,
            tipo: userData.tipo,
            senha_hash: 'hashed_password'
        }));
        expect(result).toBeDefined();
    });
});