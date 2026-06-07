const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  cakeName: { type: String, required: true },
  orderId: { type: String, required: true, unique: true },
  status: { type: String, default: 'Pending' },
  thankYouSent: { type: Boolean, default: false },
  cakeReadySent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

// Create order (used by frontend when customers place orders)
router.post('/', async (req, res) => {
  try {
    const { customerName, phone, cakeName, orderId } = req.body;
    const o = new Order({ customerName, phone, cakeName, orderId });
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
    res.json(orders);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Unable to list orders' });
  }
});

// Mark thank-you sent
router.put('/:id/thank-you', async (req, res) => {
  try {
    const o = await Order.findOneAndUpdate({ orderId: req.params.id }, { thankYouSent: true }, { new: true });
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
    const o = await Order.findOneAndUpdate({ orderId: req.params.id }, { status: 'Ready', cakeReadySent: true }, { new: true });
    if (!o) return res.status(404).json({ error: 'Order not found' });
    res.json(o);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Unable to update order' });
  }
});

module.exports = router;
