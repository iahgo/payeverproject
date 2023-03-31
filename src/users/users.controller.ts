import { Body, Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return { message: 'User created successfully', user };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return { message: 'User found', user };
  }

  @Get(':id/avatar')
  async findAvatar(@Param('id') id: string) {
    const avatar = await this.usersService.findAvatar(id);
    return { message: 'Avatar found', avatar };
  }

  @Delete(':id/avatar')
  async deleteAvatar(@Param('id') id: string) {
    await this.usersService.deleteAvatar(id);
    return { message: 'Avatar deleted' };
  }
}
