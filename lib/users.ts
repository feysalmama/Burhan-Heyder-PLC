import apiClient from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  roles?: Role[];
  permissions?: Permission[];
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
  password_confirmation: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

class UserService {
  async getUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get('/users');
      return response.data.data || response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getUser(id: number): Promise<User> {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async createUser(userData: CreateUserData): Promise<User> {
    try {
      const response = await apiClient.post('/users', userData);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async updateUser(id: number, userData: UpdateUserData): Promise<User> {
    try {
      const response = await apiClient.put(`/users/${id}`, userData);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await apiClient.delete(`/users/${id}`);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async assignRoles(userId: number, roleIds: number[]): Promise<void> {
    try {
      await apiClient.post(`/users/${userId}/roles`, { roles: roleIds });
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async revokeRole(userId: number, roleId: number): Promise<void> {
    try {
      await apiClient.delete(`/users/${userId}/roles/${roleId}`);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async givePermission(userId: number, permissionIds: number[]): Promise<void> {
    try {
      await apiClient.post(`/users/${userId}/permissions`, { permissions: permissionIds });
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async revokePermission(userId: number, permissionId: number): Promise<void> {
    try {
      await apiClient.delete(`/users/${userId}/permissions/${permissionId}`);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): ApiError {
    if (error.response?.data) {
      return {
        message: error.response.data.message || 'An error occurred',
        errors: error.response.data.errors,
      };
    }
    
    return {
      message: error.message || 'Network error occurred',
    };
  }
}

export const userService = new UserService();
