// src/infrastructure/http/middlewares/auth.js
import jwt from 'jsonwebtoken';
import { AuthService } from '../../../domain/services/AuthService.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const [, token] = authHeader.split(' ');

        if (!token) {
            return res.status(401).json({ error: 'Token inválido' });
        }

        const authService = new AuthService();
        const decoded = authService.verifyToken(token);

        req.userId = decoded.id;
        req.userType = decoded.tipo;

        return next();
    } catch (error) {
        console.error('Erro de autenticação:', error);
        return res.status(401).json({ error: 'Token inválido' });
    }
};

export const authorize = (allowedRoles = [], selfAccessOnly = false) => {
    return (req, res, next) => {
        // Tipos de usuários com permissão administrativa
        const adminRoles = [
            'admin', 
            'lojas', 
            'fornecedores', 
            'vendedores', 
            'liberadores', 
            'medidores'
        ];

        // Usuários que podem acessar lista de usuários
        const userListRoles = [
            'admin', 
            'vendedores', 
            'fornecedores', 
            'liberadores', 
            'medidores'
        ];

        // Verificar se o usuário tem permissão por papel
        const hasRolePermission = 
            allowedRoles.length === 0 || 
            allowedRoles.includes(req.userType) || 
            (req.path === '/api/users' && userListRoles.includes(req.userType)) ||
            (adminRoles.includes(req.userType) && 
                (allowedRoles.includes('admin') || allowedRoles.length === 0));

        // Verificar acesso próprio
        const requestedUserId = parseInt(req.params.id);
        const isSelfAccess = requestedUserId === req.userId;

        // Lógica de autorização para acesso próprio
        if (selfAccessOnly) {
            if (isSelfAccess) {
                return next();
            }
            return res.status(403).json({ error: 'Acesso não autorizado' });
        }

        // Verificar permissão de papel e administrador
        if (hasRolePermission) {
            return next();
        }

        return res.status(403).json({ error: 'Acesso não autorizado' });
    };
};