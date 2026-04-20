import apiClient from "./api";
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse,
} from "shortlink-shared";

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/api/auth/login",
      data
    );
    if (!response.data.success) {
      throw new Error(response.data.error || "Login failed");
    }
    return response.data.data!;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/api/auth/register",
      data
    );
    if (!response.data.success) {
      throw new Error(response.data.error || "Registration failed");
    }
    return response.data.data!;
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<ApiResponse<{ user: User }>>(
      "/api/auth/me"
    );
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to get user");
    }
    return response.data.data!.user;
  },

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export default authService;
