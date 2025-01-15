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

  randomAvatar() {
    const seed = Math.floor(Math.random() * 100000);
    return `https://api.dicebear.com/9.x/lorelei/svg?seed=${seed}`;
  }

  async findOrCreate(username: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      const userData = {
        username,
        avatar: this.randomAvatar(),
        created_at: new Date(),
        updated_at: new Date(),
      };
      console.log('Creating user', userData);
      const newUser = await this.userModel.create(userData);
      return newUser;
    }
    return user;
  }
}
