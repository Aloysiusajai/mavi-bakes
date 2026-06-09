import { Schema, models, model } from 'mongoose';

const OrderSchema = new Schema(
  {
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    cakeName: { type: String, required: true },
    cakeWeight: { type: Schema.Types.Mixed },
    quantity: { type: Number, required: true },
    customMessage: { type: String },
    deliveryDate: { type: Date },
    deliveryAddress: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered'],
      default: 'Pending',
    },
    thankYouSent: { type: Boolean, default: false },
    cakeReadySent: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const Order = models.Order || model('Order', OrderSchema);

export default Order;
