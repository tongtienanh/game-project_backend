import { LoginRequest } from './../requests/login.request';

export interface AuthService {
  login(request: LoginRequest);
  findById(userId: number);

  getPermissionByRoleIds(roleIds: number[]);
}
export const AuthService = Symbol('AuthService');
