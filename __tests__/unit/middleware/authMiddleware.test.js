// __tests__/unit/middleware/authMiddleware.test.js

import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { authorization, authMiddleware } from '../../../src/infrastructure/http/middlewares/auth.js';

describe('Auth Middleware', () => {
    let mockReq;
    let mockRes;
    let nextFunction;

    beforeEach(() => {
        mockReq = {
            headers: {},
            user: null
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        nextFunction = jest.fn();
    });

    describe('authorization', () => {
        it('should fail when no authorization header is present', () => {
            authorization(mockReq, mockRes, nextFunction);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Token não fornecido' });
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should fail with malformed token', () => {
            mockReq.headers.authorization = 'InvalidToken';
            authorization(mockReq, mockRes, nextFunction);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Token mal formatado' });
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should pass with valid token', () => {
            process.env.JWT_SECRET = 'test-secret';
            const token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET);
            mockReq.headers.authorization = `Bearer ${token}`;
            
            authorization(mockReq, mockRes, nextFunction);
            
            expect(nextFunction).toHaveBeenCalled();
            expect(mockReq.user).toBeDefined();
            expect(mockReq.user.role).toBe('admin');
        });
    });

    describe('authMiddleware', () => {
        it('should allow access for authorized role', () => {
            mockReq.user = { role: 'admin' };
            const middleware = authMiddleware(['admin']);
            
            middleware(mockReq, mockRes, nextFunction);
            
            expect(nextFunction).toHaveBeenCalled();
        });

        it('should deny access for unauthorized role', () => {
            mockReq.user = { role: 'user' };
            const middleware = authMiddleware(['admin']);
            
            middleware(mockReq, mockRes, nextFunction);
            
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Acesso não autorizado' });
            expect(nextFunction).not.toHaveBeenCalled();
        });

        it('should fail when user is not authenticated', () => {
            const middleware = authMiddleware(['admin']);
            
            middleware(mockReq, mockRes, nextFunction);
            
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Usuário não autenticado' });
            expect(nextFunction).not.toHaveBeenCalled();
        });
    });
});