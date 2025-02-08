// __tests__/unit/service/AuthService.test.js
import { jest } from '@jest/globals';
import { AuthService } from '../../../src/domain/services/AuthService.js';
import bcrypt from 'bcrypt';

describe('AuthService', () => {
    let authService;

    beforeEach(() => {
        authService = new AuthService();
    });

    describe('hashPassword', () => {
        it('should hash password correctly', async () => {
            const senha = 'testpassword';
            const hashedPassword = await authService.hashPassword(senha);

            expect(hashedPassword).toBeTruthy();
            expect(hashedPassword).not.toBe(senha);
        });
    });

    describe('comparePassword', () => {
        it('should return true for correct password', async () => {
            const senha = 'testpassword';
            const hashedPassword = await bcrypt.hash(senha, 10);

            const result = await authService.comparePassword(senha, hashedPassword);
            expect(result).toBe(true);
        });

        it('should return false for incorrect password', async () => {
            const senha = 'testpassword';
            const incorrectSenha = 'wrongpassword';
            const hashedPassword = await bcrypt.hash(senha, 10);

            const result = await authService.comparePassword(incorrectSenha, hashedPassword);
            expect(result).toBe(false);
        });
    });

    describe('generateToken', () => {
        it('should generate a valid token', () => {
            const user = {
                id: 1,
                email: 'test@example.com',
                tipo: 'admin'
            };

            const token = authService.generateToken(user);
            expect(token).toBeTruthy();
        });
    });
});