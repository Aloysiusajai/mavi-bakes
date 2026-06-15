import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import connectToDatabase from "./mongodb";
import Order from "@/models/Order";

const FALLBACK_FILE = path.join(process.cwd(), "orders.json");

// Ensure fallback file exists
function readFallback() {
  if (process.env.NODE_ENV === "production" || process.env.VERCEL === "1") {
    return [];
  }
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
  if (process.env.NODE_ENV === "production" || process.env.VERCEL === "1") {
    return;
  }
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(orders, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write fallback orders:", err);
  }
}

export async function getOrders() {
  let dbOrders = [];
  let dbSuccess = false;
  try {
    await connectToDatabase();
    dbOrders = await Order.find().sort({ createdAt: -1 }).lean();
    dbSuccess = true;
  } catch (err) {
    console.warn(
      "MongoDB query failed, falling back to local JSON database:",
      err.message || err,
    );
  }

  const localOrders = readFallback();

  if (dbSuccess) {
    const dbIds = new Set(dbOrders.map(o => String(o._id || o.id)));
    const toSync = localOrders.filter(o => !dbIds.has(String(o._id || o.id)));

    if (toSync.length > 0) {
      console.log(`Syncing ${toSync.length} offline orders to MongoDB...`);
      for (const order of toSync) {
        try {
          await Order.create({
            _id: order._id || order.id,
            customerName: order.customerName,
            phoneNumber: order.phoneNumber,
            email: order.email,
            cakeName: order.cakeName,
            cakeWeight: order.cakeWeight,
            quantity: order.quantity,
            customMessage: order.customMessage,
            deliveryDate: order.deliveryDate ? new Date(order.deliveryDate) : undefined,
            deliveryAddress: order.deliveryAddress,
            totalPrice: order.totalPrice,
            status: order.status || "Pending",
            thankYouSent: order.thankYouSent || false,
            cakeReadySent: order.cakeReadySent || false,
            createdAt: order.createdAt ? new Date(order.createdAt) : new Date(),
            updatedAt: order.updatedAt ? new Date(order.updatedAt) : new Date(),
          });
        } catch (syncErr) {
          console.error(`Failed to sync order ${order._id || order.id}:`, syncErr);
        }
      }
      try {
        dbOrders = await Order.find().sort({ createdAt: -1 }).lean();
      } catch (e) {
        // ignore
      }
    }
    return dbOrders;
  }

  return localOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
    const doc = await Order.findById(id).lean();
    if (doc) return doc;
    throw new Error("Order not found in MongoDB");
  } catch (err) {
    console.warn(
      "MongoDB findById failed or not found, falling back to local JSON database:",
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
    const doc = await Order.findByIdAndUpdate(id, update, { new: true }).lean();
    if (doc) return doc;
    throw new Error("Order not found in MongoDB");
  } catch (err) {
    console.warn(
      "MongoDB update failed or not found, falling back to local JSON database:",
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
    const doc = await Order.findByIdAndDelete(id).lean();
    if (doc) return doc;
    throw new Error("Order not found in MongoDB");
  } catch (err) {
    console.warn(
      "MongoDB delete failed or not found, falling back to local JSON database:",
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
