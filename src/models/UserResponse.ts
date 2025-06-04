export interface UserResponseDto {
  id: number;
  numberID: string;
  fullName: string;
  email: string;
  role: RoleType;
}

export interface RegisterUserDto {
  email: string;
  fullName: string;
  role: RoleType;
  numberID: string;
}

export type RoleType = 'ADMINISTRADOR' | 'SUPERVISOR' | 'OPERADOR';