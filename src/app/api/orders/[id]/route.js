import { cookies } from "next/headers";
import mongoose from "mongoose";

import { getOrderById, updateOrder, deleteOrder } from "@/lib/orderService";
import { verifyToken } from "@/lib/jwt";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) throw new Error("Unauthorized");

  const decoded = verifyToken(token);
  if (
    !decoded ||
    decoded.role !== "admin" ||
    decoded.email !== process.env.ADMIN_EMAIL
  ) {
    throw new Error("Unauthorized");
  }
}

function normalizeOrder(doc) {
  const docObj = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return { ...docObj, id: (docObj._id || docObj.id).toString() };
}

async function getOrderId(context) {
  const { id } = await context.params;
  return id;
}

export async function GET(_req, context) {
  try {
    const id = await getOrderId(context);
    if (!id)
      return json({ error: "Invalid id" }, 400);

    const doc = await getOrderById(id);
    if (!doc) return json({ error: "Not found" }, 404);

    return json(normalizeOrder(doc));
  } catch (err) {
    console.error(err);
    return json({ error: "Internal Server Error" }, 500);
  }
}

export async function PUT(req, context) {
  try {
    await requireAdmin();

    const id = await getOrderId(context);
    if (!id)
      return json({ error: "Invalid id" }, 400);

    const body = await req.json();
    const allowed = [
      "status",
      "thankYouSent",
      "cakeReadySent",
      "customerName",
      "phoneNumber",
      "email",
      "deliveryAddress",
      "deliveryDate",
      "customMessage",
      "cakeName",
      "cakeWeight",
      "quantity",
      "totalPrice",
    ];
    const update = {};

    for (const key of allowed) {
      if (body[key] !== undefined) update[key] = body[key];
    }
    if (update.deliveryDate)
      update.deliveryDate = new Date(update.deliveryDate);

    const doc = await updateOrder(id, update);
    if (!doc) return json({ error: "Not found" }, 404);

    return json(normalizeOrder(doc));
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized")
      return json({ error: "Unauthorized" }, 401);
    console.error(err);
    return json({ error: "Internal Server Error" }, 500);
  }
}

export async function DELETE(_req, context) {
  try {
    await requireAdmin();

    const id = await getOrderId(context);
    if (!id)
      return json({ error: "Invalid id" }, 400);

    const doc = await deleteOrder(id);
    if (!doc) return json({ error: "Not found" }, 404);

    return json({ success: true, id });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized")
      return json({ error: "Unauthorized" }, 401);
    console.error(err);
    return json({ error: "Internal Server Error" }, 500);
  }
}

