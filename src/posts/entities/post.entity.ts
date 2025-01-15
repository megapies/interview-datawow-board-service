import { Types } from 'mongoose';
export class Post {
  id: string;
  title: string;
  community: string;
  text_value: string;
  created_at: Date;
  updated_at: Date;
  user_id: Types.ObjectId;
}
