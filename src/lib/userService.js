import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import connectToDatabase from "./mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const FALLBACK_USERS_FILE = path.join(process.cwd(), "users.json");

function readFallbackUsers() {
  try {
    if (!fs.existsSync(FALLBACK_USERS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(FALLBACK_USERS_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Failed to read fallback users:", err);
    return [];
  }
}

function writeFallbackUsers(users) {
  try {
    fs.writeFileSync(FALLBACK_USERS_FILE, JSON.stringify(users, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write fallback users:", err);
  }
}

export async function findUserByEmail(email) {
  const cleanEmail = String(email).trim().toLowerCase();
  try {
    await connectToDatabase();
    return await User.findOne({ email: cleanEmail }).lean();
  } catch (err) {
    console.warn(
      "MongoDB findOne failed for User, falling back to local JSON database:",
      err.message || err,
    );
    const users = readFallbackUsers();
    const found = users.find((u) => u.email === cleanEmail);
    return found || null;
  }
}

export async function createUser(email, password, name) {
  const cleanEmail = String(email).trim().toLowerCase();
  try {
    await connectToDatabase();
    // Static helper method inside Mongoose User model
    const doc = await User.createUser(cleanEmail, password, name);
    return typeof doc.toObject === "function" ? doc.toObject() : doc;
  } catch (err) {
    console.warn(
      "MongoDB createUser failed, falling back to local JSON database:",
      err.message || err,
    );
    const users = readFallbackUsers();
    
    // Check if email already exists in local DB
    const existing = users.find((u) => u.email === cleanEmail);
    if (existing) {
      throw new Error("Email already registered in local database");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    const newUser = {
      _id: new mongoose.Types.ObjectId().toString(),
      email: cleanEmail,
      passwordHash: hash,
      name: name || "",
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    writeFallbackUsers(users);
    return newUser;
  }
}
