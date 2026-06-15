import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import connectToDatabase from "./mongodb";
import Order from "@/models/Order";

const FALLBACK_FILE = path.join(process.cwd(), "orders.json");

// Ensure fallback file exists
function readFallback() {
  try {
    if (!fs.existsSync(FALLBACK_FILE)) {
      return [];
    }
    const data = fs.readFileSync(FALLBACK_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Failed to read fallback orders:", err);
    return [];
  }
}

function writeFallback(orders) {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(orders, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write fallback orders:", err);
  }
}

export async function getOrders() {
  try {
    await connectToDatabase();
    return await Order.find().sort({ createdAt: -1 }).lean();
  } catch (err) {
    console.warn(
      "MongoDB query failed, falling back to local JSON database:",
      err.message || err,
    );
    const orders = readFallback();
    // Sort by createdAt desc
    return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

export async function createOrder(data) {
  try {
    await connectToDatabase();
    return await Order.create(data);
  } catch (err) {
    console.warn(
      "MongoDB save failed, falling back to local JSON database:",
      err.message || err,
    );
    const orders = readFallback();
    const newDoc = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...data,
      status: data.status || "Pending",
      thankYouSent: data.thankYouSent || false,
      cakeReadySent: data.cakeReadySent || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orders.unshift(newDoc);
    writeFallback(orders);
    return newDoc;
  }
}

export async function getOrderById(id) {
  try {
    await connectToDatabase();
    return await Order.findById(id).lean();
  } catch (err) {
    console.warn(
      "MongoDB findById failed, falling back to local JSON database:",
      err.message || err,
    );
    const orders = readFallback();
    const found = orders.find(
      (o) => String(o._id) === id || String(o.id) === id,
    );
    return found || null;
  }
}

export async function updateOrder(id, update) {
  try {
    await connectToDatabase();
    return await Order.findByIdAndUpdate(id, update, { new: true }).lean();
  } catch (err) {
    console.warn(
      "MongoDB update failed, falling back to local JSON database:",
      err.message || err,
    );
    const orders = readFallback();
    const index = orders.findIndex(
      (o) => String(o._id) === id || String(o.id) === id,
    );
    if (index === -1) return null;

    const updated = {
      ...orders[index],
      ...update,
      updatedAt: new Date().toISOString(),
    };
    orders[index] = updated;
    writeFallback(orders);
    return updated;
  }
}

export async function deleteOrder(id) {
  try {
    await connectToDatabase();
    return await Order.findByIdAndDelete(id).lean();
  } catch (err) {
    console.warn(
      "MongoDB delete failed, falling back to local JSON database:",
      err.message || err,
    );
    const orders = readFallback();
    const index = orders.findIndex(
      (o) => String(o._id) === id || String(o.id) === id,
    );
    if (index === -1) return null;
    const deleted = orders[index];
    const filtered = orders.filter(
      (o) => String(o._id) !== id && String(o.id) !== id,
    );
    writeFallback(filtered);
    return deleted;
  }
}
