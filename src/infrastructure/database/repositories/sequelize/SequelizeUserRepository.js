// src/infrastructure/database/repositories/sequelize/SequelizeUserRepository.js
import { User } from '../../../../domain/entities/User.js';

export class SequelizeUserRepository {
    constructor(UserModel) {
        this.UserModel = UserModel;
    }

    async findById(id) {
        try {
            const user = await this.UserModel.findByPk(id);
            if (!user) return null;
            return new User(user.toJSON());
        } catch (error) {
            throw new Error(`Erro ao buscar usuário: ${error.message}`);
        }
    }

    async findByEmail(email) {
        try {
            const user = await this.UserModel.findOne({ where: { email } });
            if (!user) return null;
            return new User(user.toJSON());
        } catch (error) {
            throw new Error(`Erro ao buscar usuário por email: ${error.message}`);
        }
    }

    async create(userData) {
        try {
            // Validar dados antes de criar
            const validationErrors = this.validateUserData(userData);
            if (validationErrors.length > 0) {
                throw new Error(validationErrors.join(', '));
            }

            const user = await this.UserModel.create(userData);
            return user.toJSON();
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw new Error(`Erro ao criar usuário: ${error.message}`);
        }
    }

    validateUserData(userData) {
        const errors = [];

        // Validações personalizadas
        if (!userData.nome) errors.push('Nome é obrigatório');
        if (!userData.email) errors.push('Email é obrigatório');
        if (!userData.cpf) errors.push('CPF é obrigatório');
        if (!userData.senha_hash) errors.push('Senha é obrigatória');
        if (!userData.tipo) errors.push('Tipo de usuário é obrigatório');

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (userData.email && !emailRegex.test(userData.email)) {
            errors.push('Email inválido');
        }

        // Validar CPF (formato básico)
        const cpfRegex = /^\d{11}$/;
        if (userData.cpf && !cpfRegex.test(userData.cpf)) {
            errors.push('CPF inválido');
        }

        // Validar tipo de usuário
        const tiposValidos = ['admin', 'vendedor', 'liberador', 'cliente', 'fornecedor', 'medidor'];
        if (userData.tipo && !tiposValidos.includes(userData.tipo)) {
            errors.push('Tipo de usuário inválido');
        }

        return errors;
    }

    async findAll() {
        try {
            const users = await this.UserModel.findAll({
                attributes: { 
                    exclude: ['senha_hash'] // Exclui a senha por segurança
                }
            });
            return users.map(user => user.toJSON());
        } catch (error) {
            throw new Error(`Erro ao buscar todos os usuários: ${error.message}`);
        }
    }

    async update(id, userData) {
        try {
            // Remover ID se estiver presente nos dados
            delete userData.id;
    
            // Realizar a atualização
            const [updatedRowsCount, updatedRows] = await this.UserModel.update(
                userData, 
                { 
                    where: { id },
                    returning: true // Retorna os dados atualizados
                }
            );
    
            // Verificar se a atualização foi bem-sucedida
            if (updatedRowsCount === 0) {
                throw new Error('Usuário não encontrado');
            }
    
            // Recuperar o usuário atualizado
            const updatedUser = await this.UserModel.findByPk(id);
    
            // Verificar se o usuário foi encontrado
            if (!updatedUser) {
                throw new Error('Usuário não encontrado após atualização');
            }
    
            // Retornar o usuário atualizado sem campos sensíveis
            const userResponse = updatedUser.toJSON();
            delete userResponse.senha_hash;
    
            return userResponse;
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            throw new Error(`Erro ao atualizar usuário: ${error.message}`);
        }
    }

    // src/infrastructure/database/repositories/sequelize/SequelizeUserRepository.js
    async delete(id) {
    try {
        const deletedRowsCount = await this.UserModel.destroy({
            where: { id }
        });

        if (deletedRowsCount === 0) {
            throw new Error('Usuário não encontrado');
        }

        return { message: 'Usuário removido com sucesso' };
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        throw new Error(`Erro ao deletar usuário: ${error.message}`);
    }
}
}