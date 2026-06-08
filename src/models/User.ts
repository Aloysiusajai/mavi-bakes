import { Schema, models, model, type Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  email: string;
  passwordHash: string;
  name?: string;
  createdAt?: Date;
}

interface UserModel extends Model<IUser> {
  createUser(email: string, password: string, name?: string): Promise<IUser & { _id: unknown }>;
}

const UserSchema = new Schema<IUser, UserModel>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });

// helper to create password hash
UserSchema.statics.createUser = async function(email: string, password: string, name?: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return this.create({ email, passwordHash: hash, name });
}

const User = (models.User as UserModel | undefined) || model<IUser, UserModel>('User', UserSchema);

export default User;
