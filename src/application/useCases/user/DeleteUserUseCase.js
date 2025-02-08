export class DeleteUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(id) {
        // Validar se o ID foi fornecido
        if (!id) {
            throw new Error('ID do usuário é obrigatório');
        }

        // Executar a exclusão
        return await this.userRepository.delete(id);
    }
}