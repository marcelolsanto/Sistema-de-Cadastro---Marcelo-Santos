// src/infrastructure/http/middlewares/auth.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authorization = (req, res, next) => {
    if (!req.headers || !req.headers.authorization) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const [bearer, token] = req.headers.authorization.split(' ');

    if (bearer !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Token mal formatado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};

export const authMiddleware = (allowedRoles) => (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: 'Acesso não autorizado'
                // Removidos os campos extras para manter consistência com os testes
            });
        }

        next();
    } catch (error) {
        console.error('Erro de autorização:', error);
        return res.status(500).json({ error: 'Erro interno de autorização' });
    }
};