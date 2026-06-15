import mongoose from 'mongoose';

const cached = global._mongoose || { conn: null, promise: null };

if (!global._mongoose) global._mongoose = cached;

export default async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable in .env.local');
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // reset cached promise on failure to allow retries
    throw e;
  }
  
  return cached.conn;
}
