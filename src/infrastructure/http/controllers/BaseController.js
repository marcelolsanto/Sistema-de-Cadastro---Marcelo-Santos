// src/infrastructure/http/controllers/BaseController.js
export class BaseController {
    success(res, data, statusCode = 200, message = 'Operação realizada com sucesso') {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    handleError(res, error) {
        // Mapeamento de erros
        const errorMap = {
            'Usuário não encontrado': 404,
            'Email já cadastrado': 409,
            'Dados inválidos': 400,
            'Sem permissão': 403
        };

        // Determinar código de status do erro
        const statusCode = errorMap[error.message] || 500;

        // Log de erro detalhado
        console.error('Erro no controlador:', error);

        return res.status(statusCode).json({
            success: false,
            error: error.message || 'Erro interno do servidor'
        });
    }
}