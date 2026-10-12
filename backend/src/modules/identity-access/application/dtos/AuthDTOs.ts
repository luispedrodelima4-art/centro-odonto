import { UserRoleType } from '../../domain/value-objects/UserRole.js';

export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
  role: UserRoleType;
  councilId?: string | undefined;
}

export interface AuthenticateUserDTO {
  email: string;
  password: string;
}

export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  councilId?: string | undefined;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponseDTO {
  accessToken: string;
  user: UserResponseDTO;
}
