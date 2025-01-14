import * as mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema({
  title: String,
  text_value: String,
  user_id: String,
  created_at: Date,
  updated_at: Date,
});
