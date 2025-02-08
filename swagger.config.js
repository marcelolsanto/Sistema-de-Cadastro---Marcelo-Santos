// swagger.config.js
export const swaggerConfig = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Sistema de Cadastro API',
        version: '1.0.0',
        description: 'API para sistema de cadastro de usuários'
      },
      servers: [
        {
          url: 'http://localhost:5000/api'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        },
        schemas: {
          Usuario: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              nome: { type: 'string' },
              email: { type: 'string' },
              cpf: { type: 'string' },
              tipo: { type: 'string' }
            }
          },
          ErroResposta: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              error: { type: 'string' }
            }
          }
        }
      }
    },
    // Indique onde estão os comentários JSDoc das rotas para que o swagger-jsdoc os leia
    apis: [
      './src/infrastructure/http/routes/*.js',
      './src/docs/paths/*.js'
    ]
  };