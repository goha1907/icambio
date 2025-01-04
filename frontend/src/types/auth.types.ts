export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    access: string;
    refresh: string;
  }
  
  export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    password2: string;
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;
  }