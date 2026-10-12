import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthenticateUserUseCase } from '../../application/use-cases/AuthenticateUserUseCase.js';
import { GetMeUseCase } from '../../application/use-cases/GetMeUseCase.js';
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase.js';
import { UserRoleType } from '../../domain/value-objects/UserRole.js';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters'),
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must have at least 6 characters'),
  role: z.nativeEnum(UserRoleType, {
    errorMap: () => ({ message: 'Role must be one of: ADMIN, DENTIST, RECEPTIONIST, FINANCIAL' }),
  }),
  councilId: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
    private readonly getMeUseCase: GetMeUseCase
  ) {}

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation failed',
          issues: parsed.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
        });
        return;
      }

      const result = await this.registerUserUseCase.execute(parsed.data);
      if (result.isFailure) {
        res.status(400).json({ error: result.getError() });
        return;
      }

      res.status(201).json(result.getValue());
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ error: 'Internal server error during registration.' });
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation failed',
          issues: parsed.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
        });
        return;
      }

      const result = await this.authenticateUserUseCase.execute(parsed.data);
      if (result.isFailure) {
        res.status(401).json({ error: result.getError() });
        return;
      }

      res.status(200).json(result.getValue());
    } catch (error) {
      console.error('Error during authentication:', error);
      res.status(500).json({ error: 'Internal server error during authentication.' });
    }
  };

  public getMe = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Unauthorized.' });
        return;
      }

      const result = await this.getMeUseCase.execute(req.user.userId);
      if (result.isFailure) {
        res.status(404).json({ error: result.getError() });
        return;
      }

      res.status(200).json({ user: result.getValue() });
    } catch (error) {
      console.error('Error fetching current user:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
}
