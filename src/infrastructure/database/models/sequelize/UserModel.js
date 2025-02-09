// src/infrastructure/database/models/sequelize/UserModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

export const UserModel = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'Nome é obrigatório' },
            notEmpty: { msg: 'Nome não pode estar vazio' }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: { msg: 'Email inválido' },
            notNull: { msg: 'Email é obrigatório' }
        }
    },
    cpf: {
        type: DataTypes.STRING(11),
        allowNull: false,
        unique: true,
        validate: {
            notNull: { msg: 'CPF é obrigatório' },
            len: { args: [11, 11], msg: 'CPF deve ter 11 caracteres' }
        }
    },
    senha_hash: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'Senha é obrigatória' },
            notEmpty: { msg: 'Senha não pode estar vazia' }
        }
    },
    tipo: {
        type: DataTypes.ENUM('admin', 'vendedor', 'liberador', 'cliente', 'fornecedor', 'medidor'),
        allowNull: false,
        validate: {
            notNull: { msg: 'Tipo de usuário é obrigatório' },
            isIn: {
                args: [['admin', 'vendedor', 'liberador', 'cliente', 'fornecedor', 'medidor']],
                msg: 'Tipo de usuário inválido'
            }
        }
    }
}, {
    tableName: 'usuarios', // Nome exato da tabela no banco de dados
    underscored: true, // Usar snake_case para created_at e updated_at
    timestamps: true, // Habilitar created_at e updated_at
    paranoid: false, // Não usar soft delete
    
    // Hooks para validações adicionais
    hooks: {
        beforeValidate: (user) => {
            // Normalizar dados antes da validação
            if (user.email) user.email = user.email.toLowerCase().trim();
            if (user.cpf) user.cpf = user.cpf.replace(/\D/g, '');
        }
    }
});