import apiClient from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  responsibility?: string;
  email_verified_at?: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
  roles: Role[];
  permissions: Permission[];
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  responsibility?: string;
  roles?: string[];
  permissions?: string[];
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  responsibility?: string;
  roles?: string[];
  permissions?: string[];
}

export interface UsersResponse {
  data: User[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

class UserService {
  // Get all users with pagination and search
  async getUsers(page = 1, perPage = 15, search = ''): Promise<UsersResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    
    if (search) {
      params.append('q', search);
    }

    const response = await apiClient.get(`/users?${params.toString()}`);
    return response.data;
  }

  // Get single user
  async getUser(id: number): Promise<User> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  }

  // Create new user
  async createUser(userData: CreateUserData): Promise<User> {
    const response = await apiClient.post('/users', userData);
    return response.data;
  }

  // Update user
  async updateUser(id: number, userData: UpdateUserData): Promise<User> {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  }

  // Delete user
  async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }

  // Assign roles to user
  async assignRoles(userId: number, roles: string[]): Promise<User> {
    const response = await apiClient.post(`/users/${userId}/roles`, { roles });
    return response.data;
  }

  // Revoke role from user
  async revokeRole(userId: number, role: string): Promise<User> {
    const response = await apiClient.delete(`/users/${userId}/roles/${role}`);
    return response.data;
  }

  // Give permission to user
  async givePermission(userId: number, permissions: string[]): Promise<User> {
    const response = await apiClient.post(`/users/${userId}/permissions`, { permissions });
    return response.data;
  }

  // Revoke permission from user
  async revokePermission(userId: number, permission: string): Promise<User> {
    const response = await apiClient.delete(`/users/${userId}/permissions/${permission}`);
    return response.data;
  }
}

export const userService = new UserService();
