// src/infrastructure/http/controllers/BaseController.js
export class BaseController {
    constructor() {
        // Bind do this para os métodos terem acesso ao contexto
        this.handleError = this.handleError.bind(this);
    }

    handleError(res, error) {
        console.error(error);
        // Mapeamento de erros
    const errorMap = {
        'Usuário não encontrado': 404,
        'ID do usuário é obrigatório': 400,
        'Nome e email são obrigatórios': 400
    };

    const statusCode = errorMap[error.message] || 500;

    return res.status(statusCode).json({
        success: false,
        error: error.message || 'Erro interno do servidor'
    })
    }

    success(res, data, status = 200) {
        return res.status(status).json(data);
    }

    // src/infrastructure/http/controllers/BaseController.js
    success(res, data, statusCode = 200, message = 'Operação realizada com sucesso') {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
    }
}