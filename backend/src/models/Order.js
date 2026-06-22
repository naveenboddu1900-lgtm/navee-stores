const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: { type: [orderItemSchema], validate: [(items) => items.length > 0, 'Order must contain items'] },
  subtotal: { type: Number, required: true, min: 0 },
  tax: { type: Number, default: 0, min: 0 },
  shipping: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'usd', uppercase: false },
  paymentMethod: { type: String, enum: ['card', 'upi', 'net_banking', 'wallet', 'cod'], default: 'card', index: true },
  paymentProvider: { type: String, enum: ['stripe', 'demo', 'manual'], default: 'demo' },
  stripePaymentIntentId: { type: String, index: true, sparse: true },
  stripeEventIds: { type: [String], default: [] },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending', index: true },
  fulfillmentStatus: { type: String, enum: ['queued', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'queued', index: true },
  shippingAddress: {
    fullName: { type: String, required: true },
    line1: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true }
  }
}, { timestamps: true });

orderSchema.index({ storeId: 1, createdAt: -1 });
orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
