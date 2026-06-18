export interface StaffRecord {
  id: number;
  fullName: string;
  phone?: string;
  position?: string;
  status: 'DANG_LAM' | 'NGHI_VIEC' | 'TAM_NGHI';
  user?: {
    id: number;
    username: string;
    status: string;
    role: {
      code: string;
      name: string;
    };
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffDto {
  full_name: string;
  phone?: string;
  position?: string;
  status?: 'DANG_LAM' | 'NGHI_VIEC' | 'TAM_NGHI';
  user: {
    username: string;
    password: string;
    role_id: number;
  };
}

export interface UpdateStaffDto {
  full_name?: string;
  phone?: string;
  position?: string;
  status?: 'DANG_LAM' | 'NGHI_VIEC' | 'TAM_NGHI';
}

export interface UserRecord {
  id: number;
  username: string;
  status: 'ACTIVE' | 'INACTIVE';
  role: {
    code: string;
    name: string;
  };
  staff?: {
    id: number;
    fullName: string;
    phone: string;
    position: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  username: string;
  password: string;
  role_id: number;
  staff_id?: number;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateUserDto {
  username?: string;
  password?: string;
  role_id?: number;
  staff_id?: number;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface RoleRecord {
  id: number;
  code: string;
  name: string;
}
