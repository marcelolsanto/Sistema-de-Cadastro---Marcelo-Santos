// src/application/useCases/user/LoginUseCase.js
export class LoginUseCase {
    constructor(userRepository, authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    async execute({ email, senha }) {
        const user = await this.userRepository.findByEmail(email);
        
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const senhaCorreta = await this.authService.comparePassword(senha, user.senha_hash);
        
        if (!senhaCorreta) {
            throw new Error('Senha incorreta');
        }

        const token = this.authService.generateToken({
            id: user.id,
            email: user.email,
            tipo: user.tipo  // Garantir que o tipo está sendo passado
        });

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