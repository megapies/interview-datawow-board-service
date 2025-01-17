import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
// import { UsersController } from './users.controller';
import { userProviders } from './users.providers';
import { DatabaseModule } from '../database.module';

@Module({
  imports: [DatabaseModule],
  // controllers: [UsersController],
  providers: [UsersService, ...userProviders],
  exports: [UsersService, ...userProviders],
})
export class UsersModule {}
