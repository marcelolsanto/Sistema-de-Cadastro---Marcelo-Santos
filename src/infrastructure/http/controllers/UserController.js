// src/infrastructure/http/controllers/UserController.js
import { BaseController } from './BaseController.js';
import { AuthService } from '../../../domain/services/AuthService.js';
import { SequelizeUserRepository } from '../../database/repositories/sequelize/SequelizeUserRepository.js';
import { UserModel } from '../../database/models/sequelize/UserModel.js';
import { UpdateUserUseCase } from '../../../application/useCases/user/UpdateUserUseCase.js';
import { DeleteUserUseCase } from '../../../application/useCases/user/DeleteUserUseCase.js';
import { GetAllUsersUseCase } from '../../../application/useCases/user/GetAllUsersUseCase.js';
import { CreateUserUseCase } from '../../../application/useCases/user/CreateUserUseCase.js';

export class UserController extends BaseController {
    constructor() {
        super();
        this.userRepository = new SequelizeUserRepository(UserModel);
        this.authService = new AuthService();
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const userData = req.body;
    
            const updateUserUseCase = new UpdateUserUseCase(
                this.userRepository, 
                this.authService
            );
    
            const updatedUser = await updateUserUseCase.execute(id, userData);
    
            // Retornar resposta de sucesso
            return this.success(res, updatedUser, 200, 'Usuário atualizado com sucesso');
        } catch (error) {
            console.error('Erro na atualização:', error);
            return this.handleError(res, error);
        }
    }

    async create(req, res) {
        try {
            const createUserUseCase = new CreateUserUseCase(
                this.userRepository,
                this.authService
            );

            const user = await createUserUseCase.execute(req.body);
            return this.success(res, user, 201);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            const deleteUserUseCase = new DeleteUserUseCase(this.userRepository);
            const result = await deleteUserUseCase.execute(id);

            return this.success(res, result, 200, 'Usuário removido com sucesso');
        } catch (error) {
            console.error('Erro na exclusão:', error);
            return this.handleError(res, error);
        }
    }

    // src/infrastructure/http/controllers/UserController.js
    async getAllUsers(req, res) {
        try {
            const getAllUsersUseCase = new GetAllUsersUseCase(this.userRepository);

            const users = await getAllUsersUseCase.execute();

            // Se não houver usuários, retornar array vazio em vez de erro
            return this.success(res, users || []);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const user = await this.userRepository.findById(id);

            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            return this.success(res, user);
        } catch (error) {
            return this.handleError(res, error);
        }
    }
    
}