import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from '../src/users/users.service';
import { User } from '../src/users/schemas/user.schema';
import { NotFoundException } from '@nestjs/common';
import { Queue } from 'bull';

const mockUserModel = () => ({
  find: jest.fn(),
  findById: jest.fn(),
  deleteOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockMailQueue = () => ({
  add: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let userModel: jest.Mocked<any>;
  let mailQueue: jest.Mocked<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useFactory: mockUserModel,
        },
        {
          provide: 'BullQueue_mail',
          useFactory: mockMailQueue,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get(getModelToken('User'));
    mailQueue = module.get('BullQueue_mail');
  });

  describe('create', () => {
    it('should create a user', async () => {
      const user: any = {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        avatar: null,
      };
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };
      userModel.create.mockReturnValue(user);

      const result = await service.create(createUserDto);

      expect(userModel.create).toHaveBeenCalledWith(createUserDto);
      expect(mailQueue.add).toHaveBeenCalledWith('send', {
        to: 'john.doe@example.com',
        subject: 'Welcome to our app',
        text: 'Hi John, welcome to our app!',
      });
      expect(result).toEqual(user);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: any = [
        {
          _id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          avatar: null,
        },
        {
          _id: '2',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
          avatar: null,
        },
      ];
      userModel.find.mockReturnValue(users);

      const result = await service.findAll();

      expect(userModel.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user with the specified id', async () => {
      const user: any = {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        avatar: null,
      };
      userModel.findById.mockReturnValue(user);

      const result = await service.findOne('1');

      expect(userModel.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(user);
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      userModel.findById.mockReturnValue(null);

      expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });
});
