export interface UserProfileResponse {
  id: number;
  name: string;
  email: string;
  // password: string;
  headline: string | null;
  avatarURL: string | null;
}
