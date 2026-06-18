export interface Role {
  code: string;
  name: string;
}

export interface Staff {
  id: number;
  fullName: string;
  phone: string;
  position: string;
}

export interface User {
  id: number;
  username: string;
  role: Role;
  staff: Staff | null;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: Omit<User, 'staff'>;
}

export interface RefreshResponse {
  accessToken: string;
}
