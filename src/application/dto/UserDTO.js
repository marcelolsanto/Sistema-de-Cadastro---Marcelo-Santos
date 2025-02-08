// src/application/dto/UserDTO.js
export class CreateUserDTO {
    constructor(data) {
        this.nome = data.nome;
        this.email = data.email;
        this.cpf = data.cpf;
        this.senha = data.senha;
        this.tipo = data.tipo;
    }
}

export class UpdateUserDTO {
    constructor(data) {
        this.nome = data.nome;
        this.email = data.email;
        this.senha = data.senha;
        this.tipo = data.tipo;
    }
}

export class UserResponseDTO {
    constructor(user) {
        this.id = user.id;
        this.nome = user.nome;
        this.email = user.email;
        this.cpf = user.cpf;
        this.tipo = user.tipo;
    }
}