// src/domain/entities/User.js
export class User {
    constructor({id, nome, email, cpf, senha_hash, tipo}) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.cpf = cpf;
        this.senha_hash = senha_hash;
        this.tipo = tipo;
    }

    isAdmin() {
        return this.tipo === 'admin';
    }

    toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            email: this.email,
            cpf: this.cpf,
            tipo: this.tipo
        };
    }
}