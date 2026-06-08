import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var _mongoose: Cached | undefined;
}

const cached: Cached = global._mongoose || { conn: null, promise: null };

if (!cached.promise) {
  cached.promise = mongoose.connect(uri).then((m) => m);
}

if (!global._mongoose) global._mongoose = cached;

export default async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  cached.conn = await cached.promise;
  return cached.conn;
}
