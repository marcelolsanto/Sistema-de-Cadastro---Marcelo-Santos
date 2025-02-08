// src/domain/services/AuthService.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
    async hashPassword(senha) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(senha, salt);
    }

    async comparePassword(senhaPlena, senhaHash) {
        return bcrypt.compare(senhaPlena, senhaHash);
    }

    generateToken(user) {
        return jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                tipo: user.tipo 
            }, 
            process.env.JWT_SECRET || 'seu_segredo_aqui', 
            { expiresIn: '1h' }
        );
    }

    verifyToken(token) {
        try {
            return jwt.verify(
                token, 
                process.env.JWT_SECRET || 'seu_segredo_aqui'
            );
        } catch (error) {
            throw new Error('Token inválido');
        }
    }
}