import { Injectable } from '@nestjs/common';
import { UserResponseDto } from '../auth/dto/user-response.dto';
import { DatabaseService } from 'src/core/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

  async findByUuid(uuid: string): Promise<UserResponseDto> {
    const user = await this.db.client.profile.findUnique({
      where: { uuid },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const {
      email,
      phone_number,
      username,
      first_name,
      last_name,
      language,
      timezone,
      status,
      email_verified,
      phone_verified,
      last_login_at,
      failed_login_attempts,
      last_failed_login_at,
    } = user;

    return {
      uuid,
      email,
      phone_number,
      username,
      first_name,
      last_name,
      language,
      timezone,
      status,
      email_verified,
      phone_verified,
      last_login_at,
      failed_login_attempts,
      last_failed_login_at,
    };
  }
}
