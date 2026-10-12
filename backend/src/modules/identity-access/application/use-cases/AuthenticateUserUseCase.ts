import { IUseCase } from '../../../../shared/application/IUseCase.js';
import { Result } from '../../../../shared/domain/Result.js';
import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { AuthResponseDTO, AuthenticateUserDTO } from '../dtos/AuthDTOs.js';
import { IPasswordHasher } from '../services/IPasswordHasher.js';
import { ITokenService } from '../services/ITokenService.js';

export class AuthenticateUserUseCase implements IUseCase<AuthenticateUserDTO, Result<AuthResponseDTO>> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService
  ) {}

  public async execute(request: AuthenticateUserDTO): Promise<Result<AuthResponseDTO>> {
    const normalizedEmail = request.email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(normalizedEmail);

    if (!user) {
      return Result.fail('Invalid email or password.');
    }

    if (!user.isActive) {
      return Result.fail('User account has been deactivated. Contact an administrator.');
    }

    const isPasswordValid = await this.passwordHasher.compare(request.password, user.passwordHash);
    if (!isPasswordValid) {
      return Result.fail('Invalid email or password.');
    }

    const accessToken = this.tokenService.generateAccessToken({
      userId: user.id.toString(),
      email: user.email.value,
      role: user.role,
      name: user.name,
    });

    return Result.ok<AuthResponseDTO>({
      accessToken,
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email.value,
        role: user.role,
        councilId: user.councilId,
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString(),
      },
    });
  }
}
