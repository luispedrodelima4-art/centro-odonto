import { Router } from 'express';
import { AuthenticateUserUseCase } from '../../application/use-cases/AuthenticateUserUseCase.js';
import { GetMeUseCase } from '../../application/use-cases/GetMeUseCase.js';
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { PrismaUserRepository } from '../persistence/PrismaUserRepository.js';
import { BcryptPasswordHasher } from '../services/BcryptPasswordHasher.js';
import { JwtTokenService } from '../services/JwtTokenService.js';
import { AuthController } from './AuthController.js';

export const authRouter = Router();

// Composition root / Dependency injection for IAM
const userRepository = new PrismaUserRepository();
const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService();

const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher, tokenService);
const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository, passwordHasher, tokenService);
const getMeUseCase = new GetMeUseCase(userRepository);

const authController = new AuthController(
  registerUserUseCase,
  authenticateUserUseCase,
  getMeUseCase
);

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.get('/me', authMiddleware, authController.getMe);
