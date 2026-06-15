import { getOrders, createOrder } from "@/lib/orderService";

function validate(body) {
  const errors = [];
  if (!body.customerName) errors.push("customerName is required");
  if (!body.phoneNumber) errors.push("phoneNumber is required");
  if (!body.cakeName) errors.push("cakeName is required");
  if (!body.quantity || typeof body.quantity !== "number")
    errors.push("quantity must be a number");
  if (!body.deliveryAddress) errors.push("deliveryAddress is required");
  if (body.totalPrice === undefined || typeof body.totalPrice !== "number")
    errors.push("totalPrice must be a number");
  return errors;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const errors = validate(body);
    if (errors.length) {
      return new Response(JSON.stringify({ errors }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const doc = await createOrder({
      customerName: body.customerName,
      phoneNumber: body.phoneNumber,
      email: body.email,
      cakeName: body.cakeName,
      cakeWeight: body.cakeWeight,
      quantity: body.quantity,
      customMessage: body.customMessage,
      deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : undefined,
      deliveryAddress: body.deliveryAddress,
      totalPrice: body.totalPrice,
    });

    const docObj = typeof doc.toObject === "function" ? doc.toObject() : doc;
    const result = { ...docObj, id: (docObj._id || docObj.id).toString() };
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET() {
  try {
    const docs = await getOrders();
    const mapped = docs.map((d) => {
      const docObj = typeof d.toObject === "function" ? d.toObject() : d;
      return { ...docObj, id: (docObj._id || docObj.id).toString() };
    });
    return new Response(JSON.stringify(mapped), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

