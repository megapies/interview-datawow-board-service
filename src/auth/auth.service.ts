import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string): Promise<any> {
    const user = await this.usersService.findOrCreate(username);
    console.log('User', user);
    const payload = { sub: user.id, id: user.id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      id: user.id,
      access_token: accessToken,
      username: user.username,
      avatar: user.avatar,
    };
  }
}
