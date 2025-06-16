export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface RegisterSuccessResponse {
  message: string;
}

export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginSuccessResponse {
  token: string;
}
