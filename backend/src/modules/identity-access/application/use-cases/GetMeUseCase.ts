import { IUseCase } from '../../../../shared/application/IUseCase.js';
import { Result } from '../../../../shared/domain/Result.js';
import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { UserResponseDTO } from '../dtos/AuthDTOs.js';

export class GetMeUseCase implements IUseCase<string, Result<UserResponseDTO>> {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(userId: string): Promise<Result<UserResponseDTO>> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return Result.fail('User not found.');
    }

    return Result.ok<UserResponseDTO>({
      id: user.id.toString(),
      name: user.name,
      email: user.email.value,
      role: user.role,
      councilId: user.councilId,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
    });
  }
}
