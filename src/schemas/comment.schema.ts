import * as mongoose from 'mongoose';

export const CommentSchema = new mongoose.Schema({
  text_value: String,
  user_id: mongoose.Schema.Types.ObjectId,
  post_id: mongoose.Schema.Types.ObjectId,
  created_at: Date,
  updated_at: Date,
});
