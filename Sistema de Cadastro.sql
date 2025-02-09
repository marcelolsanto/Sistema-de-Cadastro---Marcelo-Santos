-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS measurement_system;
USE measurement_system;

-- Tabela de Usuários
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('solicitante', 'liberador', 'medidor') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- Índice para otimização de consultas por email
    INDEX idx_users_email (email)
);

-- Tabela de Clientes
CREATE TABLE clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    cpf_cnpj VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- Índice para otimização de consultas por CPF/CNPJ
    INDEX idx_clients_cpf_cnpj (cpf_cnpj)
);

-- Tabela de Endereços
CREATE TABLE addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    street VARCHAR(100) NOT NULL,
    number VARCHAR(20) NOT NULL,
    complement VARCHAR(100),
    neighborhood VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Tabela de Solicitações
CREATE TABLE requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    address_id INT NOT NULL,
    status ENUM('pendente', 'liberada', 'agendada', 'medida', 'finalizada', 'cancelada') NOT NULL,
    description TEXT,
    created_by INT NOT NULL,
    assigned_to INT,
    scheduled_date DATETIME,
    deadline DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (address_id) REFERENCES addresses(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- Tabela de Ambientes
CREATE TABLE environments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    measurements TEXT,
    observations TEXT,
    FOREIGN KEY (request_id) REFERENCES requests(id)
);

-- Tabela de Arquivos
CREATE TABLE files (
    id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT NOT NULL,
    environment_id INT,
    type ENUM('pdf', 'jpg', 'promob', 'video', 'technical_drawing') NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES requests(id),
    FOREIGN KEY (environment_id) REFERENCES environments(id)
);

-- Tabela de Histórico
CREATE TABLE history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT NOT NULL,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES requests(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela de Notificações
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    request_id INT NOT NULL,
    type ENUM('email', 'sms') NOT NULL,
    message TEXT NOT NULL,
    sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (request_id) REFERENCES requests(id)
);

-- Índices para otimização
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_client ON requests(client_id);
CREATE INDEX idx_files_request ON files(request_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);


-- Inserir cliente
INSERT INTO clients (name, email, phone, cpf_cnpj, created_at, updated_at)
VALUES ('José Pereira', 'jose@email.com', '1177777777', '456.789.123-00', NOW(), NOW());

-- Pegar o ID do último cliente inserido
SET @client_id = LAST_INSERT_ID();

-- Inserir endereço
INSERT INTO addresses (client_id, street, number, complement, neighborhood, city, state, zip_code)
VALUES (@client_id, 'Rua dos Pinheiros', '789', 'Casa 2', 'Pinheiros', 'São Paulo', 'SP', '05678-901');

select * from clients;


-- Primeiro crie um medidor
INSERT INTO users (
    username,
    password_hash,
    email,
    phone,
    role,
    created_at,
    updated_at
)
VALUES (
    'maria.medidor',
    'hash_da_senha_aqui',  -- Use a função get_password_hash do Python para gerar
    'maria.medidor@empresa.com',
    '11998877665',
    'medidor',
    NOW(),
    NOW()
);

select * from users;

