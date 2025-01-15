import { Types } from 'mongoose';

export class Comment {
  id: string;
  text_value: string;
  created_at: Date;
  updated_at: Date;
  post_id: Types.ObjectId;
  user_id: Types.ObjectId;
}
