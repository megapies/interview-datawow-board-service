import * as mongoose from 'mongoose';

export const CommentSchema = new mongoose.Schema({
  text_value: String,
  user_id: String,
  post_id: String,
  created_at: Date,
  updated_at: Date,
});
