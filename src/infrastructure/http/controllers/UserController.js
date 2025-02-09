// src/infrastructure/http/controllers/UserController.js
import { BaseController } from './BaseController.js';
import { SequelizeUserRepository } from '../../database/repositories/sequelize/SequelizeUserRepository.js';
import { UserModel } from '../../database/models/sequelize/UserModel.js';
import { AuthService } from '../../../domain/services/AuthService.js';
import { GetAllUsersUseCase } from '../../../application/useCases/user/GetAllUsersUseCase.js';
import { GetUserByIdUseCase } from '../../../application/useCases/user/GetUserByIdUseCase.js';
import { UpdateUserUseCase } from '../../../application/useCases/user/UpdateUserUseCase.js';
import { DeleteUserUseCase } from '../../../application/useCases/user/DeleteUserUseCase.js';

export class UserController extends BaseController {
    constructor() {
        super();
        this.userRepository = new SequelizeUserRepository(UserModel);
        this.authService = new AuthService();
    }

    async getAllUsers(req, res) {
        try {
            const getAllUsersUseCase = new GetAllUsersUseCase(this.userRepository);
            const users = await getAllUsersUseCase.execute();
            return this.success(res, users);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            return this.handleError(res, error);
        }
    }

    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const getUserByIdUseCase = new GetUserByIdUseCase(this.userRepository);
            const user = await getUserByIdUseCase.execute(id);
            return this.success(res, user);
        } catch (error) {
            console.error('Erro ao buscar usuário por ID:', error);
            return this.handleError(res, error);
        }
    }

    async create(req, res) {
        try {
            const userData = req.body;
            const createUserUseCase = new CreateUserUseCase(
                this.userRepository, 
                this.authService
            );
            const user = await createUserUseCase.execute(userData);
            return this.success(res, user, 201);
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            return this.handleError(res, error);
        }
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

            return this.success(res, updatedUser, 200, 'Usuário atualizado com sucesso');
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
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
            console.error('Erro ao deletar usuário:', error);
            return this.handleError(res, error);
        }
    }
}