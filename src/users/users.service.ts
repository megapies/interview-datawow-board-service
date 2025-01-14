import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Inject } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
  ) {}

  async findOrCreate(username: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      const newUser = await this.userModel.create({
        username,
        created_at: new Date(),
        updated_at: new Date(),
      });
      return newUser;
    }
    return user;
  }
}
