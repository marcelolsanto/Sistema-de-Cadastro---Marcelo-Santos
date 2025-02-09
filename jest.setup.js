// jest.setup.js
import dotenv from 'dotenv';
import { jest } from '@jest/globals';

// Configura variáveis de ambiente para teste
process.env.NODE_ENV = 'test';
dotenv.config({ path: '.env.test' }); // Ajuste o caminho conforme necessário

// Configurar variáveis de ambiente padrão para testes
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';
process.env.NODE_ENV = 'test';

// Configurações globais de teste
jest.setTimeout(10000); // Aumentar timeout padrão se necessário