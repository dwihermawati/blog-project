export interface UserProfileResponse {
  id: number;
  name: string;
  email: string;
  // password: string;
  headline: string | null;
  avatarUrl: string | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordSuccessResponse {
  message: string;
}
