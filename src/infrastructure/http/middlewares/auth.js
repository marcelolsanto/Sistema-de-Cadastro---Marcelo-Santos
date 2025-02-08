// src/infrastructure/http/middlewares/auth.js
import { AuthService } from '../../../domain/services/AuthService.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            console.log('Token não fornecido');
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const [, token] = authHeader.split(' ');
        console.log('Token recebido:', token);

        const authService = new AuthService();
        const decoded = authService.verifyToken(token);
        console.log('Token decodificado:', decoded);

        req.userId = decoded.id;
        req.userType = decoded.tipo;

        return next();
    } catch (error) {
        console.error('Erro de autenticação:', error);
        return res.status(401).json({ error: 'Token inválido' });
    }
};

export const authorize = (roles = []) => {
    return (req, res, next) => {
        console.log('Tipo de usuário:', req.userType);
        console.log('Roles permitidas:', roles);

        if (!roles.includes(req.userType)) {
            console.log('Acesso não autorizado');
            return res.status(403).json({ error: 'Acesso não autorizado' });
        }
        next();
    };
};