// src/infrastructure/http/controllers/AuthController.js
import { BaseController } from './BaseController.js';
import { CreateUserUseCase } from '../../../application/useCases/user/CreateUserUseCase.js';
import { LoginUseCase } from '../../../application/useCases/user/LoginUseCase.js';
import { AuthService } from '../../../domain/services/AuthService.js';
import { SequelizeUserRepository } from '../../database/repositories/sequelize/SequelizeUserRepository.js';
import { UserModel } from '../../database/models/sequelize/UserModel.js';

export class AuthController extends BaseController {
    constructor() {
        super();
        this.userRepository = new SequelizeUserRepository(UserModel);
        this.authService = new AuthService();
    }

    async register(req, res) {
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

    async login(req, res) {
        try {
            const loginUseCase = new LoginUseCase(
                this.userRepository,
                this.authService
            );
            
            const result = await loginUseCase.execute(req.body);
            return this.success(res, result);
        } catch (error) {
            return this.handleError(res, error);
        }
    }
}