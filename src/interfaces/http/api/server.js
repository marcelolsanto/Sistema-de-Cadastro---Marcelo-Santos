// src/interfaces/http/api/server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Importando o arquivo swagger.config.js com caminho relativo correto
import { swaggerConfig } from '../../../../swagger.config.js';

import authRoutes from '../../../infrastructure/http/routes/authRoutes.js';
import userRoutes from '../../../infrastructure/http/routes/userRoutes.js';
import { testConnection, initDatabase } from '../../../infrastructure/database/config/database.js';

dotenv.config();

export const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// Configuração do Swagger
const swaggerSpec = swaggerJsdoc(swaggerConfig);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  const startServer = async () => {
    try {
      await initDatabase();
      await testConnection();
      app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`API disponível em: http://localhost:${PORT}/api`);
        console.log(`Documentação Swagger disponível em: http://localhost:${PORT}/api-docs`);
      });
    } catch (error) {
      console.error('Erro ao iniciar servidor:', error);
      process.exit(1);
    }
  };
  startServer();
}
