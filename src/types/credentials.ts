export interface Credentials {
  user_id: string;
  access_token: string;
  refresh_token: string;
  timestamp: number;
  cookie?: string;
}