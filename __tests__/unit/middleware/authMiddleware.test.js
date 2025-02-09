// __tests__/unit/middleware/authMiddleware.test.js
import { jest } from '@jest/globals';
import { authorize } from '../../../src/infrastructure/http/middlewares/auth.js';

describe('Authorization Middleware', () => {
    let mockReq, mockRes, nextFunction;

    beforeEach(() => {
        nextFunction = jest.fn();
        mockReq = {
            userId: 1,
            userType: '',
            params: { id: 1 },
            path: '/api/users' // Adicionar path para testar rotas
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    const testCases = [
        { 
            userType: 'admin', 
            allowedRoles: ['admin'], 
            expectedNextCalls: 1 
        },
        { 
            userType: 'vendedor', 
            allowedRoles: ['vendedores'], 
            expectedNextCalls: 1 
        },
        { 
            userType: 'cliente', 
            allowedRoles: ['admin'], 
            expectedNextCalls: 0 
        }
    ];

    testCases.forEach(({ userType, allowedRoles, expectedNextCalls }) => {
        it(`should ${expectedNextCalls > 0 ? 'allow' : 'deny'} ${userType} access`, () => {
            mockReq.userType = userType;
            mockReq.userId = 1;

            const middlewareFunc = authorize(allowedRoles);
            middlewareFunc(mockReq, mockRes, nextFunction);

            if (expectedNextCalls > 0) {
                expect(nextFunction).toHaveBeenCalledTimes(expectedNextCalls);
            } else {
                expect(mockRes.status).toHaveBeenCalledWith(403);
                expect(mockRes.json).toHaveBeenCalledWith({ error: 'Acesso não autorizado' });
            }
        });
    });
});