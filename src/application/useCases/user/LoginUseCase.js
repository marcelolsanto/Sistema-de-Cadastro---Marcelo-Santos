export class LoginUseCase {
    constructor(userRepository, authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    async execute({ email, senha }) {
        // Encontrar usuário pelo email
        const user = await this.userRepository.findByEmail(email);
        
        // Verificar se usuário existe
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        // Comparar senha
        const senhaCorreta = await this.authService.comparePassword(senha, user.senha_hash);
        
        if (!senhaCorreta) {
            throw new Error('Senha incorreta');
        }

        // Gerar token JWT (se necessário)
        const token = this.authService.generateToken(user);

        // Retornar usuário ou token
        return {
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                tipo: user.tipo
            },
            token
        };
    }
}