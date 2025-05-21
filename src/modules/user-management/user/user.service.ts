import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { DatabaseService } from 'src/core/database/database.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await bcrypt.hash(data.password_hash, 10);

    const userData = {
      ...data,
      password_hash: hashedPassword,
    };

    const user = await this.db.prismaClient.user.create({ data: userData });

    // Return only the fields defined in UserResponseDto
    const {
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
