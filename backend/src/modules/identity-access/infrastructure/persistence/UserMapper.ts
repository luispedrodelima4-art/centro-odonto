import { User as PrismaUser } from '@prisma/client';
import { UniqueEntityId } from '../../../../shared/domain/Identifier.js';
import { User } from '../../domain/entities/User.js';
import { Email } from '../../domain/value-objects/Email.js';
import { UserRoleType } from '../../domain/value-objects/UserRole.js';

export class UserMapper {
  public static toDomain(raw: PrismaUser): User {
    const emailResult = Email.create(raw.email);
    if (emailResult.isFailure) {
      throw new Error(`Corrupted email in database: ${raw.email}`);
    }

    const userResult = User.create(
      {
        name: raw.name,
        email: emailResult.getValue(),
        passwordHash: raw.passwordHash,
        role: raw.role as UserRoleType,
        councilId: raw.councilId ?? undefined,
        isActive: raw.isActive,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    );

    if (userResult.isFailure) {
      throw new Error(`Failed to reconstitute user aggregate: ${userResult.getError()}`);
    }

    return userResult.getValue();
  }

  public static toPersistence(user: User): PrismaUser {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email.value,
      passwordHash: user.passwordHash,
      role: user.role,
      councilId: user.councilId ?? null,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
