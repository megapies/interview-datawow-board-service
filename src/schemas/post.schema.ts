import * as mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema({
  title: String,
  text_value: String,
  community: String, // todo enum or reference
  user_id: mongoose.Schema.Types.ObjectId,
  created_at: Date,
  updated_at: Date,
});
