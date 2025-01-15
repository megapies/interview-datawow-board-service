import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: String,
  avatar: String,
  created_at: Date,
  updated_at: Date,
});
