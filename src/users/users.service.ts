import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { MailJob } from '../mail.jobs';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectQueue('mail') private readonly mailQueue: Queue,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    const user = await createdUser.save();

    await this.mailQueue.add('send', {
      to: user.email,
      subject: 'Welcome to our app',
      text: `Hi ${user.firstName}, welcome to our app!`,
    });

    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await axios
      .get(`https://reqres.in/api/users/${id}`)
      .then((response) => response.data);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
  async findAvatar(userId: string): Promise<string> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    if (!user.avatar) {
      try {
        const response = await axios.get(
          `https://reqres.in/api/users/${userId}`,
        );
        const avatarData = response.data?.data?.avatar;
        if (!avatarData) {
          throw new Error('Unable to get avatar data from external API');
        }
        const avatar = await this.saveAvatar(avatarData);
        user.avatar = avatar;
        await user.save();
        return avatar;
      } catch (error) {
        throw new Error(`Error fetching avatar data: ${error.message}`);
      }
    }
    return user.avatar;
  }

  async saveAvatar(avatarData: string): Promise<string> {
    try {
      const buffer = Buffer.from(avatarData, 'base64');
      const hash = buffer.toString('hex');
      return hash;
    } catch (error) {
      throw new Error(`Error saving avatar: ${error.message}`);
    }
  }

  async deleteAvatar(userId: string): Promise<void> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    if (!user.avatar) {
      throw new NotFoundException(
        `Avatar for user with id ${userId} not found`,
      );
    }
    await this.userModel.deleteOne({ _id: userId }).exec();
  }
}
