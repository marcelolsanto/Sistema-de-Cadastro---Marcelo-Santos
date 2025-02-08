// src/infrastructure/database/config/database.test.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../../../.env.test') });

const testConfig = {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    logging: false,
    define: {
        timestamps: true,
        underscored: true
    }
};

export const testSequelize = new Sequelize(testConfig);

export const initTestDatabase = async () => {
    try {
        // Tenta criar o banco se não existir
        const tempSequelize = new Sequelize({
            ...testConfig,
            database: null
        });

        await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`);
        await tempSequelize.close();

        // Conecta ao banco de teste
        await testSequelize.authenticate();
        
        // Sincroniza os modelos
        await testSequelize.sync({ force: true });
        
        console.log('Test database initialized successfully');
    } catch (error) {
        console.error('Failed to initialize test database:', error);
        throw error;
    }
};