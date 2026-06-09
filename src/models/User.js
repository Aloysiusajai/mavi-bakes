import { Schema, models, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });

// helper to create password hash
UserSchema.statics.createUser = async function(email, password, name) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return this.create({ email, passwordHash: hash, name });
}

const User = models.User || model('User', UserSchema);

export default User;
