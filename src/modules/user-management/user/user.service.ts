import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(data.password_hash, 10);

    // Replace the plain password with the hashed one
    const userData = {
      ...data,
      password_hash: hashedPassword,
    };

    return this.prisma.user.create({ data: userData });
  }
}
