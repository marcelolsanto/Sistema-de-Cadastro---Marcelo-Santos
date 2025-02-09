// src/application/useCases/user/GetUserByIdUseCase.js
export class GetUserByIdUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(id) {
        if (!id) {
            throw new Error('ID do usuário é obrigatório');
        }

        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        // Remover campos sensíveis
        const { senha_hash, ...userData } = user;
        return userData;
    }
}