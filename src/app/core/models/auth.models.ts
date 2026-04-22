// Lo que enviamos a Spring Boot
export interface LoginRequest {
  email: string;
  password: string;
}

// Lo que recibimos de Spring Boot
export interface AuthResponse {
  token: string;
}
