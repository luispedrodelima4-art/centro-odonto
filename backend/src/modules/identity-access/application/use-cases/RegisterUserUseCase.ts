import { IUseCase } from '../../../../shared/application/IUseCase.js';
import { Result } from '../../../../shared/domain/Result.js';
import { User } from '../../domain/entities/User.js';
import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { Email } from '../../domain/value-objects/Email.js';
import { UserRoleType } from '../../domain/value-objects/UserRole.js';
import { AuthResponseDTO, RegisterUserDTO } from '../dtos/AuthDTOs.js';
import { IPasswordHasher } from '../services/IPasswordHasher.js';
import { ITokenService } from '../services/ITokenService.js';

export class RegisterUserUseCase implements IUseCase<RegisterUserDTO, Result<AuthResponseDTO>> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService
  ) {}

  public async execute(request: RegisterUserDTO): Promise<Result<AuthResponseDTO>> {
    const emailResult = Email.create(request.email);
    if (emailResult.isFailure) {
      return Result.fail(emailResult.getError());
    }

    if (!request.password || request.password.length < 6) {
      return Result.fail('Password must be at least 6 characters.');
    }

    const email = emailResult.getValue();
    const existingUser = await this.userRepository.findByEmail(email.value);
    if (existingUser) {
      return Result.fail('A user with this email address already exists.');
    }

    // If there are zero users in the clinic, make the first user ADMIN
    const totalUsers = await this.userRepository.count();
    const assignedRole = totalUsers === 0 ? UserRoleType.ADMIN : request.role;

    const passwordHash = await this.passwordHasher.hash(request.password);

    const userResult = User.create({
      name: request.name,
      email,
      passwordHash,
      role: assignedRole,
      councilId: request.councilId,
    });

    if (userResult.isFailure) {
      return Result.fail(userResult.getError());
    }

    const user = userResult.getValue();
    await this.userRepository.save(user);

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
