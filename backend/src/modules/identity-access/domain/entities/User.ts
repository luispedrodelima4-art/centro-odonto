import { AggregateRoot } from '../../../../shared/domain/AggregateRoot.js';
import { UniqueEntityId } from '../../../../shared/domain/Identifier.js';
import { Result } from '../../../../shared/domain/Result.js';
import { Email } from '../value-objects/Email.js';
import { UserRoleType, VALID_ROLES } from '../value-objects/UserRole.js';

export interface UserProps {
  name: string;
  email: Email;
  passwordHash: string;
  role: UserRoleType;
  councilId?: string | undefined; // CRO for dentists
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps, id?: UniqueEntityId) {
    super(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  get email(): Email {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get role(): UserRoleType {
    return this.props.role;
  }

  get councilId(): string | undefined {
    return this.props.councilId;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public changePassword(newPasswordHash: string): Result<void> {
    if (!newPasswordHash || newPasswordHash.trim().length === 0) {
      return Result.fail('Password hash is required.');
    }

    this.props.passwordHash = newPasswordHash;
    this.props.updatedAt = new Date();
    return Result.ok();
  }

  public deactivate(): Result<void> {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
    return Result.ok();
  }

  public activate(): Result<void> {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
    return Result.ok();
  }

  public updateProfile(name: string, councilId?: string): Result<void> {
    if (!name || name.trim().length < 2) {
      return Result.fail('User name must contain at least 2 characters.');
    }

    this.props.name = name.trim();
    this.props.councilId = councilId?.trim();
    this.props.updatedAt = new Date();
    return Result.ok();
  }

  public static create(
    props: {
      name: string;
      email: Email;
      passwordHash: string;
      role: UserRoleType;
      councilId?: string | undefined;
      isActive?: boolean | undefined;
      createdAt?: Date | undefined;
      updatedAt?: Date | undefined;
    },
    id?: UniqueEntityId
  ): Result<User> {
    if (!props.name || props.name.trim().length < 2) {
      return Result.fail<User>('User name must have at least 2 characters.');
    }

    if (!props.passwordHash || props.passwordHash.trim().length === 0) {
      return Result.fail<User>('Password hash is required.');
    }

    if (!VALID_ROLES.includes(props.role)) {
      return Result.fail<User>(`Invalid user role. Allowed: ${VALID_ROLES.join(', ')}`);
    }

    if (props.role === UserRoleType.DENTIST && props.councilId && props.councilId.trim().length === 0) {
      return Result.fail<User>('Dentist professional council ID (CRO) must be valid if provided.');
    }

    const user = new User(
      {
        name: props.name.trim(),
        email: props.email,
        passwordHash: props.passwordHash,
        role: props.role,
        councilId: props.councilId?.trim(),
        isActive: props.isActive ?? true,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id
    );

    return Result.ok<User>(user);
  }
}
