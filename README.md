________________________________________
#Documentação do Projeto: Sistema de Cadastro API
1. Introdução
•	Nome do Projeto: Sistema de Cadastro API
•	Descrição:
API para o cadastro de usuários, permitindo registrar, autenticar, listar, atualizar e excluir usuários. A aplicação utiliza JWT para autenticação e segue princípios de Clean Architecture.
•	Tecnologias Utilizadas:
o	Backend: Node.js, Express
o	Banco de Dados: MySQL (usando Sequelize como ORM)
o	Autenticação: JWT
o	Documentação de API: Swagger (swagger-jsdoc e swagger-ui-express)
o	Testes: Jest, Supertest
o	Outras Dependências: Helmet, Cors, bcrypt, inversify, yup, entre outras
________________________________________
2. Arquitetura do Projeto
A aplicação foi estruturada seguindo os conceitos de Clean Architecture, dividindo as responsabilidades em diferentes camadas:
•	Domain (Domínio):
Contém as entidades (por exemplo, User em src/domain/entities/User.js), interfaces/repositórios (como IUserRepository em src/domain/repositories/IUserRepository.js) e DTOs (em src/application/dto/UserDTO.js).
•	Application (Casos de Uso):
Implementa a lógica de negócio através dos casos de uso, por exemplo:
o	Criação de usuário: CreateUserUseCase
o	Atualização de usuário: UpdateUserUseCase
o	Exclusão de usuário: DeleteUserUseCase
o	Autenticação/Login: LoginUseCase
o	Listagem de usuários: GetAllUsersUseCase
(Arquivos localizados em src/application/useCases/user/)
•	Infrastructure (Infraestrutura):
Responsável por detalhes de implementação, como:
o	HTTP: 
	Controllers: AuthController.js, UserController.js, BaseController.js (em src/infrastructure/http/controllers/)
	Rotas: authRoutes.js e userRoutes.js (em src/infrastructure/http/routes/)
	Middlewares: Arquivo de autenticação e autorização (auth.js em src/infrastructure/http/middlewares/)
o	Banco de Dados: 
	Configuração do Sequelize e conexão com o banco (em src/infrastructure/database/config/database.js)
	Modelos, por exemplo, UserModel.js (em src/infrastructure/database/models/sequelize/)
	Repositórios (exemplo: SequelizeUserRepository)
•	Configuração e Ferramentas:
o	Babel: Configurado para compatibilidade com a versão atual do Node (arquivo de configuração Babel – o conteúdo JSON que define os presets).
o	Testes: Configuração do Jest (jest.setup.js e jest.config.js)
o	Documentação de API: Configuração do Swagger (em swagger.config.js e nos arquivos JSON que definem o OpenAPI)
o	Gerenciamento de Dependências e Scripts: package.json
________________________________________
3. Pré-requisitos e Instalação
3.1. Pré-requisitos
•	Node.js: Versão recomendada (por exemplo, 14 ou superior)
•	MySQL: Acesso a um banco de dados MySQL (certifique-se de ter as credenciais corretas)
3.2. Instalação
1.	Clone o repositório:
2.	git clone <url-do-repositório>
3.	cd sistema-de-cadastro---marcelo-santos
4.	Instale as dependências:
5.	npm install
6.	Configure as variáveis de ambiente:
Edite os arquivos .env (para desenvolvimento) e .env.test (para testes) conforme os exemplos fornecidos. As variáveis necessárias incluem:
o	NODE_ENV
o	PORT
o	Banco de Dados: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT
o	JWT: JWT_SECRET, JWT_EXPIRES_IN
o	Bcrypt: BCRYPT_SALT_ROUNDS
7.	Realize as migrações e seeds (se aplicável):
8.	npm run migrate
9.	npm run seed
10.	Inicie a aplicação:
o	Modo desenvolvimento: 
o	npm run dev
o	Modo produção: 
o	npm start
________________________________________
4. Variáveis de Ambiente
As variáveis de ambiente são configuradas através dos arquivos .env e .env.test. Alguns exemplos:
# .env (desenvolvimento)
NODE_ENV=development
PORT=5000

# Configuração do banco de dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua senha.
DB_NAME=seu banco
DB_PORT=3306

# Configuração JWT
JWT_SECRET=<sua_chave_jwt>
JWT_EXPIRES_IN=1h

# Bcrypt
BCRYPT_SALT_ROUNDS=12
Observação: Nunca compartilhe seus arquivos .env reais em repositórios públicos.
________________________________________
5. API Documentation (Swagger)
A documentação da API é gerada com Swagger e pode ser acessada via a rota /api-docs.
5.1. Configuração do Swagger
•	Arquivo de Configuração: swagger.config.js
Este arquivo define: 
o	OpenAPI version: 3.0.0
o	Informações da API: Título, versão e descrição
o	Servidor: Exemplo de URL http://localhost:5000/api
o	Security Schemes: Configuração do Bearer Token (JWT)
o	Schemas: Modelos de resposta, como Usuario e ErroResposta
o	Caminhos (paths): São definidos nos arquivos de rotas (por exemplo, ./src/infrastructure/http/routes/*.js)
5.2. Endpoints Principais
•	Autenticação:
o	POST /api/auth/register:
Registra um novo usuário.
Request Body (JSON):
o	{
o	  "nome": "string",
o	  "email": "string",
o	  "cpf": "string",
o	  "senha": "string",
o	  "tipo": "string"
o	}
Resposta: Status 201 com mensagem de sucesso.
o	POST /api/auth/login:
Realiza a autenticação do usuário e retorna um token JWT.
•	Usuários (Rotas Protegidas – somente para usuários do tipo admin):
o	GET /api/users: Lista todos os usuários.
o	GET /api/users/{id}: Retorna os dados de um usuário específico.
o	PUT /api/users/{id}: Atualiza os dados de um usuário.
o	DELETE /api/users/{id}: Exclui um usuário.
Segurança:
As rotas de usuários exigem a presença de um token JWT válido no cabeçalho da requisição (exemplo: Authorization: Bearer <token>). A validação e a autorização são realizadas pelos middlewares (authMiddleware e authorize em src/infrastructure/http/middlewares/auth.js).
________________________________________
6. Estrutura de Pastas
A seguir, um resumo dos principais diretórios e arquivos do projeto:
├── .babelrc                   # Configuração do Babel
├── .env                       # Variáveis de ambiente (desenvolvimento)
├── .env.example               # Exemplo de variáveis de ambiente
├── .env.test                  # Variáveis de ambiente para testes
├── jest.config.js             # Configuração do Jest
├── jest.setup.js              # Setup do Jest
├── package.json               # Dependências e scripts
├── swagger.config.js          # Configuração do Swagger
├── src/
│   ├── application/
│   │   ├── dto/
│   │   │   └── UserDTO.js     # Definições de DTOs
│   │   └── useCases/
│   │       └── user/
│   │           ├── CreateUserUseCase.js
│   │           ├── DeleteUserUseCase.js
│   │           ├── GetAllUsersUseCase.js
│   │           ├── LoginUseCase.js
│   │           └── UpdateUserUseCase.js
│   ├── domain/
│   │   ├── entities/
│   │   │   └── User.js        # Entidade de Usuário
│   │   └── repositories/
│   │       └── IUserRepository.js
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── config/
│   │   │   │   └── database.js  # Configuração do Sequelize
│   │   │   └── models/
│   │   │       └── sequelize/
│   │   │           └── UserModel.js
│   │   └── http/
│   │       ├── controllers/
│   │       │   ├── AuthController.js
│   │       │   ├── BaseController.js
│   │       │   └── UserController.js
│   │       ├── middlewares/
│   │       │   └── auth.js        # Middleware de autenticação e autorização
│   │       └── routes/
│   │           ├── authRoutes.js
│   │           └── userRoutes.js
│   └── interfaces/
│       └── http/
│           └── api/
│               └── server.js    # Ponto de entrada da aplicação
└── ... (outros arquivos, como .gitignore, arquivos de migração, etc.)
________________________________________
7. Testes
7.1. Configuração do Jest
•	Arquivos: 
o	jest.setup.js: Configura as variáveis de ambiente para os testes.
o	jest.config.js: Define o ambiente de teste, transformação de arquivos e padrão de busca dos testes.
7.2. Executando os Testes
Utilize os seguintes comandos:
•	Para rodar todos os testes: 
•	npm run test
•	Para rodar os testes em modo watch: 
•	npm run test:watch
•	Para gerar relatório de cobertura: 
•	npm run test:coverage
________________________________________
8. Iniciando o Servidor
O ponto de entrada da aplicação é o arquivo src/interfaces/http/api/server.js, que:
•	Configura os middlewares (CORS, Helmet, JSON parser);
•	Inicializa as conexões com o banco de dados (através de initDatabase e testConnection);
•	Registra as rotas de autenticação e usuários;
•	Configura a documentação Swagger (disponível em /api-docs);
•	Inicia o servidor na porta definida pela variável de ambiente PORT.
Para iniciar o servidor, execute:
npm run dev
Você deverá ver mensagens como:
Servidor rodando na porta 5000
http://localhost:5000/api
Documentação Swagger: http://localhost:5000/api-docs
________________________________________
9. Considerações Finais
•	Segurança:
As rotas protegidas utilizam JWT para autenticação e verificam se o usuário possui a role necessária (por exemplo, admin) por meio dos middlewares authMiddleware e authorize.
•	Clean Architecture:
A separação das camadas (domínio, aplicação e infraestrutura) facilita a manutenção, testes e evolução do sistema.
•	Melhorias Futuras:
o	Implementar uma camada de validação de dados (por exemplo, utilizando Yup ou Joi) antes de chamar os casos de uso.
o	Adicionar testes unitários e de integração para cobrir os principais fluxos de negócio.
o	Documentar outros endpoints e possíveis mensagens de erro de forma detalhada no Swagger.
________________________________________
10. Referências aos Arquivos Utilizados
•	Configuração do Babel: Conteúdo do arquivo JSON que define os presets.
•	Swagger: Arquivos swagger.config.js e os arquivos JSON de definição de API.
•	Scripts e Dependências: Arquivo package.json.
•	Testes: Arquivos jest.setup.js e jest.config.js.
•	Rotas e Controllers: 
o	src/interfaces/http/routes/authRoutes.js
o	src/interfaces/http/routes/userRoutes.js
o	src/infrastructure/http/controllers/AuthController.js
o	src/infrastructure/http/controllers/UserController.js
o	src/infrastructure/http/controllers/BaseController.js
•	Middleware de Autenticação: src/infrastructure/http/middlewares/auth.js
•	Banco de Dados e Modelos: 
o	src/infrastructure/database/config/database.js
o	src/infrastructure/database/models/sequelize/UserModel.js
•	Casos de Uso e Entidades: 
o	src/application/useCases/user/
o	src/domain/entities/User.js
o	src/domain/repositories/IUserRepository.js
•	DTOs: src/application/dto/UserDTO.js
