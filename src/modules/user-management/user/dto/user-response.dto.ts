export class UserResponseDto {
    uuid: string;
    email: string;
    phone_number?: string | null;
    username?: string | null;
    first_name: string;
    last_name: string;
    language: string;
    timezone: string;
    status: string;
    email_verified?: boolean;
    phone_verified?: boolean;
    last_login_at?: Date | null;
    failed_login_attempts?: number;
    last_failed_login_at?: Date | null;
  }
  