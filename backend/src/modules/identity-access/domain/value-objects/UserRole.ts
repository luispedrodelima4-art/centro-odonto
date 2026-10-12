export enum UserRoleType {
  ADMIN = 'ADMIN',
  DENTIST = 'DENTIST',
  RECEPTIONIST = 'RECEPTIONIST',
  FINANCIAL = 'FINANCIAL',
}

export const VALID_ROLES = Object.values(UserRoleType);
