export class CreateUserUseCase {
    constructor(userRepository, authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    async execute(dto) {
        // Verificação de email existente
        const userExists = await this.userRepository.findByEmail(dto.email);
        if (userExists) {
            throw new Error('Usuário já existe');
        }

        // Hash da senha
        const senha_hash = await this.authService.hashPassword(dto.senha);

        // Cria usuário
        const user = await this.userRepository.create({
            ...dto,
            senha_hash, // Mudança aqui
            senha: undefined // Opcional: remover campo de senha original
        });

        return user;
    }
}