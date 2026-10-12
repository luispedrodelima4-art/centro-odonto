import bcrypt from 'bcrypt';
import { IPasswordHasher } from '../../application/services/IPasswordHasher.js';

export class BcryptPasswordHasher implements IPasswordHasher {
  private readonly saltRounds = 10;

  public async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  public async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
