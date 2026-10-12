import { prisma } from '../../../../shared/infrastructure/database/prisma.js';
import { User } from '../../domain/entities/User.js';
import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { UserMapper } from './UserMapper.js';

export class PrismaUserRepository implements IUserRepository {
  public async findById(id: string): Promise<User | null> {
    const raw = await prisma.user.findUnique({
      where: { id },
    });
    return raw ? UserMapper.toDomain(raw) : null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const raw = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    return raw ? UserMapper.toDomain(raw) : null;
  }

  public async save(user: User): Promise<void> {
    const data = UserMapper.toPersistence(user);
    await prisma.user.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  public async count(): Promise<number> {
    return prisma.user.count();
  }
}
