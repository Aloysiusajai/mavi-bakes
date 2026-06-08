const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String },
  cakeName: { type: String, required: true },
  cakeWeight: { type: mongoose.Schema.Types.Mixed },
  quantity: { type: Number, default: 1 },
  customMessage: { type: String },
  deliveryDate: { type: Date },
  deliveryAddress: { type: String },
  totalPrice: { type: Number },
  orderId: { type: String },
  status: { type: String, default: 'Pending' },
  thankYouSent: { type: Boolean, default: false },
  cakeReadySent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

// helper to build a query by id or orderId
function queryByIdOrOrderId(id) {
  if (mongoose.Types.ObjectId.isValid(id)) return { _id: id };
  return { orderId: id };
}

// Create order (used by frontend when customers place orders)
router.post('/', async (req, res) => {
  try {
    const payload = req.body || {};
    const o = new Order({
      customerName: payload.customerName,
      phoneNumber: payload.phoneNumber || payload.phone || payload.contact,
      email: payload.email,
      cakeName: payload.cakeName,
      cakeWeight: payload.cakeWeight,
      quantity: payload.quantity || 1,
      customMessage: payload.customMessage || payload.message,
      deliveryDate: payload.deliveryDate ? new Date(payload.deliveryDate) : undefined,
      deliveryAddress: payload.deliveryAddress || payload.address,
      totalPrice: payload.totalPrice || payload.price,
      orderId: payload.orderId,
    });
    await o.save();
    res.status(201).json(o);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Unable to create order' });
  }
});

// List orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.json(orders.map(o => ({ ...o, id: o._id })));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Unable to list orders' });
  }
});

// Mark thank-you sent
router.put('/:id/thank-you', async (req, res) => {
  try {
    const q = queryByIdOrOrderId(req.params.id);
    const o = await Order.findOneAndUpdate(q, { thankYouSent: true }, { new: true });
    if (!o) return res.status(404).json({ error: 'Order not found' });
    res.json(o);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Unable to update order' });
  }
});

// Mark ready and set cakeReadySent
router.put('/:id/ready', async (req, res) => {
  try {
    const q = queryByIdOrOrderId(req.params.id);
    const o = await Order.findOneAndUpdate(q, { status: 'Ready', cakeReadySent: true }, { new: true });
    if (!o) return res.status(404).json({ error: 'Order not found' });
    res.json(o);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Unable to update order' });
  }
});

module.exports = router;
