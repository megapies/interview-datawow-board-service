import { Mongoose } from 'mongoose';
import { UserSchema } from '../schemas/user.shema';

export const userProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('User', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
