// src/application/useCases/user/UpdateUserUseCase.js
export class UpdateUserUseCase {
    constructor(userRepository, authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    async execute(id, userData) {
        // Validações podem ser adicionadas aqui
        if (!id) {
            throw new Error('ID do usuário é obrigatório');
        }
    
        // Preparar dados para atualização
        const updateData = { ...userData };
    
        // Remover ID se estiver presente nos dados
        delete updateData.id;
    
        // Se senha estiver sendo atualizada, fazer hash
        if (updateData.senha) {
            const senha_hash = await this.authService.hashPassword(updateData.senha);
            delete updateData.senha;
            updateData.senha_hash = senha_hash;
        }
    
        // Atualizar usuário
        return await this.userRepository.update(id, updateData);
    }
}