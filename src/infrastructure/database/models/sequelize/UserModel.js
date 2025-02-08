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
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: {
        type: DataTypes.ENUM('admin', 'vendedor', 'liberador', 'cliente', 'fornecedor', 'medidor'),
        allowNull: false
    }
}, {
    tableName: 'usuarios',
    timestamps: true,
    underscored: true
});