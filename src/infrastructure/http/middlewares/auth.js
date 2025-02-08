// src/infrastructure/http/middlewares/auth.js
import { AuthService } from '../../../domain/services/AuthService.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const [, token] = authHeader.split(' ');

        const authService = new AuthService();
        const decoded = authService.verifyToken(token);

        req.userId = decoded.id;
        req.userType = decoded.tipo;

        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};

export const authorize = (allowedRoles = [], selfAccessOnly = false) => {
    return (req, res, next) => {
        // Tipos de usuários com permissão de administrador
        const adminRoles = ['lojas', 'fornecedores', 'vendedores', 'liberadores', 'medidores'];

        // Verificar se o usuário tem permissão por papel
        const hasRolePermission = allowedRoles.length === 0 || 
            allowedRoles.includes(req.userType) || 
            (adminRoles.includes(req.userType) && allowedRoles.includes('admin'));

        // Verificar acesso próprio
        const requestedUserId = parseInt(req.params.id);
        const isSelfAccess = requestedUserId === req.userId;

        // Lógica de autorização
        if (selfAccessOnly) {
            // Se for acesso próprio, permite
            if (isSelfAccess) {
                return next();
            }
            return res.status(403).json({ error: 'Acesso não autorizado' });
        }

        // Verificar permissão de papel e administrador
        if (hasRolePermission || (adminRoles.includes(req.userType) && !selfAccessOnly)) {
            return next();
        }

        return res.status(403).json({ error: 'Acesso não autorizado' });
    };
};