import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
  import { CreateUserDto } from './dto/create-user.dto';
  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
  
  @ApiTags('Users')
  @Controller('users')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    async create(@Body() createUserDto: CreateUserDto) {
      return this.userService.create(createUserDto);
    }
  }
  