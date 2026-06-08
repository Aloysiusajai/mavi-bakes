import { cookies } from 'next/headers';
import mongoose from 'mongoose';

import connectToDatabase from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import Order from '@/models/Order';

type OrderRouteContext = {
  params: Promise<{ id: string }>;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  if (!token) throw new Error('Unauthorized');

  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin' || decoded.email !== process.env.ADMIN_EMAIL) {
    throw new Error('Unauthorized');
  }
}

type LeanOrder = Record<string, unknown> & {
  _id: { toString: () => string };
};

function normalizeOrder(doc: LeanOrder) {
  return { ...doc, id: doc._id.toString() };
}

async function getOrderId(context: OrderRouteContext) {
  const { id } = await context.params;
  return id;
}

export async function GET(_req: Request, context: OrderRouteContext) {
  try {
    const id = await getOrderId(context);
    if (!mongoose.Types.ObjectId.isValid(id)) return json({ error: 'Invalid id' }, 400);

    await connectToDatabase();
    const doc = await Order.findById(id).lean();
    if (!doc) return json({ error: 'Not found' }, 404);

    return json(normalizeOrder(doc as LeanOrder));
  } catch (err) {
    console.error(err);
    return json({ error: 'Internal Server Error' }, 500);
  }
}

export async function PUT(req: Request, context: OrderRouteContext) {
  try {
    await requireAdmin();

    const id = await getOrderId(context);
    if (!mongoose.Types.ObjectId.isValid(id)) return json({ error: 'Invalid id' }, 400);

    const body = (await req.json()) as Record<string, unknown>;
    const allowed = [
      'status',
      'thankYouSent',
      'cakeReadySent',
      'customerName',
      'phoneNumber',
      'email',
      'deliveryAddress',
      'deliveryDate',
      'customMessage',
      'cakeName',
      'cakeWeight',
      'quantity',
      'totalPrice',
    ];
    const update: Record<string, unknown> = {};

    for (const key of allowed) {
      if (body[key] !== undefined) update[key] = body[key];
    }
    if (update.deliveryDate) update.deliveryDate = new Date(update.deliveryDate as string);

    await connectToDatabase();
    const doc = await Order.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!doc) return json({ error: 'Not found' }, 404);

    return json(normalizeOrder(doc as LeanOrder));
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') return json({ error: 'Unauthorized' }, 401);
    console.error(err);
    return json({ error: 'Internal Server Error' }, 500);
  }
}

export async function DELETE(_req: Request, context: OrderRouteContext) {
  try {
    await requireAdmin();

    const id = await getOrderId(context);
    if (!mongoose.Types.ObjectId.isValid(id)) return json({ error: 'Invalid id' }, 400);

    await connectToDatabase();
    const doc = await Order.findByIdAndDelete(id).lean();
    if (!doc) return json({ error: 'Not found' }, 404);

    return json({ success: true, id });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') return json({ error: 'Unauthorized' }, 401);
    console.error(err);
    return json({ error: 'Internal Server Error' }, 500);
  }
}
