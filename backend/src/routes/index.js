const router = require('express').Router();
const bcrypt = require('bcryptjs');
const data = require('../services/dataService');
const { protect, allowRoles } = require('../middleware/authMiddleware');
const { issueToken } = require('../services/tokenService');
const { createPaymentIntent, handleStripeWebhook } = require('../services/stripeService');
const { mediaUploadPlaceholder } = require('../services/storageService');
const { sendOrderConfirmation } = require('../services/mailService');

function publicUser(user) {
  return { ...user, password: undefined };
}

function enforceTenant(req, storeId) {
  if (req.user.role === 'super_admin') return true;
  return String(req.user.storeId || '') === String(storeId || '');
}

function validateShippingAddress(address = {}) {
  const requiredFields = ['fullName', 'line1', 'city', 'country', 'phone'];
  return requiredFields.every((field) => String(address[field] || '').trim().length > 0);
}

router.post('/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await data.users.findByEmail(email || '', true);
    if (!user || !(await bcrypt.compare(password || '', user.password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }
    res.json({ success: true, user: publicUser(user), token: issueToken(user) });
  } catch (error) {
    next(error);
  }
});

router.post('/auth/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) {
      res.status(400);
      throw new Error('Name, valid email, and 8+ character password are required');
    }
    const user = await data.users.create({ name, email, password, role: 'customer' });
    res.status(201).json({ success: true, user: publicUser(user), token: issueToken(user) });
  } catch (error) {
    next(error);
  }
});

router.get('/auth/me', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

router.get('/stores', async (req, res, next) => {
  try {
    res.json({ success: true, stores: await data.stores.list() });
  } catch (error) {
    next(error);
  }
});

router.get('/stores/:id', async (req, res, next) => {
  try {
    const store = await data.stores.findById(req.params.id);
    if (!store) {
      res.status(404);
      throw new Error('Store not found');
    }
    res.json({ success: true, store });
  } catch (error) {
    next(error);
  }
});

router.get('/products', async (req, res, next) => {
  try {
    const products = await data.products.list({ status: req.query.status || 'active', category: req.query.category, storeId: req.query.storeId });
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
});

router.get('/products/:id', async (req, res, next) => {
  try {
    const product = await data.products.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
});

router.post('/vendor/products', protect, allowRoles('vendor', 'super_admin'), async (req, res, next) => {
  try {
    const storeId = req.user.role === 'vendor' ? req.user.storeId : req.body.storeId;
    if (!storeId || !enforceTenant(req, storeId)) {
      res.status(403);
      throw new Error('Vendor must create products inside their assigned store');
    }
    const product = await data.products.create({
      ...req.body,
      storeId,
      vendorId: req.user.id || req.user._id,
      slug: (req.body.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    });
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
});

router.patch('/vendor/products/:id', protect, allowRoles('vendor', 'super_admin'), async (req, res, next) => {
  try {
    const product = await data.products.findById(req.params.id);
    if (!product || !enforceTenant(req, product.storeId)) {
      res.status(404);
      throw new Error('Product not found in your tenant');
    }
    const updated = await data.products.update(req.params.id, req.body);
    res.json({ success: true, product: updated });
  } catch (error) {
    next(error);
  }
});

router.delete('/vendor/products/:id', protect, allowRoles('vendor', 'super_admin'), async (req, res, next) => {
  try {
    const product = await data.products.findById(req.params.id);
    if (!product || !enforceTenant(req, product.storeId)) {
      res.status(404);
      throw new Error('Product not found in your tenant');
    }
    const archived = await data.products.remove(req.params.id);
    res.json({ success: true, product: archived });
  } catch (error) {
    next(error);
  }
});

router.get('/orders', protect, async (req, res, next) => {
  try {
    const filters = {};
    if (req.user.role === 'vendor') filters.storeId = req.user.storeId;
    if (req.user.role === 'customer') filters.customerId = req.user.id || req.user._id;
    res.json({ success: true, orders: await data.orders.list(filters) });
  } catch (error) {
    next(error);
  }
});

router.patch('/vendor/orders/:id', protect, allowRoles('vendor', 'super_admin'), async (req, res, next) => {
  try {
    const orders = await data.orders.list(req.user.role === 'vendor' ? { storeId: req.user.storeId } : {});
    const order = orders.find((item) => String(item.id || item._id) === String(req.params.id));
    if (!order) {
      res.status(404);
      throw new Error('Order not found in your tenant');
    }
    const updated = await data.orders.update(req.params.id, {
      fulfillmentStatus: req.body.fulfillmentStatus || order.fulfillmentStatus,
      paymentStatus: req.body.paymentStatus || order.paymentStatus
    });
    res.json({ success: true, order: updated });
  } catch (error) {
    next(error);
  }
});

router.post('/checkout', protect, allowRoles('customer', 'vendor', 'super_admin'), async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod = 'card' } = req.body;
    const allowedMethods = ['card', 'upi', 'net_banking', 'wallet', 'cod'];
    if (!Array.isArray(items) || !items.length) {
      res.status(400);
      throw new Error('Checkout requires at least one cart item');
    }
    if (!allowedMethods.includes(paymentMethod)) {
      res.status(400);
      throw new Error('Unsupported payment method');
    }
    if (!validateShippingAddress(shippingAddress)) {
      res.status(400);
      throw new Error('Complete shipping address is required');
    }

    const orderItems = [];
    let total = 0;
    let storeId = null;

    for (const item of items) {
      const product = await data.products.findById(item.productId);
      if (!product || product.status !== 'active') {
        res.status(400);
        throw new Error('One or more products are unavailable');
      }
      if (!storeId) storeId = product.storeId;
      if (String(storeId) !== String(product.storeId)) {
        res.status(400);
        throw new Error('Cart can only checkout products from one tenant store at a time');
      }
      const quantity = Math.max(1, Number(item.quantity || 1));
      orderItems.push({ productId: product.id || product._id, title: product.title, quantity, unitPrice: product.price });
      total += product.price * quantity;
    }

    const order = await data.orders.create({
      storeId,
      customerId: req.user.id || req.user._id,
      items: orderItems,
      total,
      currency: 'usd',
      paymentMethod,
      paymentProvider: paymentMethod === 'card' && process.env.STRIPE_SECRET_KEY ? 'stripe' : 'demo',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      fulfillmentStatus: 'queued',
      shippingAddress
    });
    const payment = await createPaymentIntent({
      amount: Math.round(total * 100),
      currency: 'usd',
      paymentMethod,
      orderId: order.id || order._id,
      customerEmail: req.user.email
    });
    const paymentStatus = payment.provider === 'stripe' ? 'pending' : order.paymentStatus;
    const updatedOrder = await data.orders.update(order.id || order._id, {
      paymentProvider: payment.provider,
      stripePaymentIntentId: payment.id,
      paymentStatus
    });
    const mail = await sendOrderConfirmation(updatedOrder || order, req.user);
    res.status(201).json({ success: true, order: updatedOrder || order, payment, mail });
  } catch (error) {
    next(error);
  }
});

router.get('/analytics/summary', protect, allowRoles('vendor', 'super_admin'), async (req, res, next) => {
  try {
    const storeId = req.user.role === 'vendor' ? req.user.storeId : req.query.storeId;
    const [orders, products, stores, users] = await Promise.all([
      data.orders.list(storeId ? { storeId } : {}),
      data.products.list(storeId ? { storeId } : {}),
      data.stores.list(),
      data.users.list()
    ]);
    const paidOrders = orders.filter((order) => order.paymentStatus === 'paid');
    const revenue = paidOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const byDay = new Map();
    for (let index = 6; index >= 0; index -= 1) {
      const date = new Date();
      date.setDate(date.getDate() - index);
      const key = date.toISOString().slice(0, 10);
      byDay.set(key, { date: key, revenue: 0, orders: 0 });
    }
    orders.forEach((order) => {
      const key = new Date(order.createdAt || Date.now()).toISOString().slice(0, 10);
      if (!byDay.has(key)) byDay.set(key, { date: key, revenue: 0, orders: 0 });
      const bucket = byDay.get(key);
      bucket.orders += 1;
      if (order.paymentStatus === 'paid') bucket.revenue += Number(order.total || 0);
    });
    const statusCounts = orders.reduce((counts, order) => {
      counts[order.fulfillmentStatus] = (counts[order.fulfillmentStatus] || 0) + 1;
      return counts;
    }, {});
    res.json({
      success: true,
      summary: {
        revenue,
        orders: orders.length,
        products: products.length,
        tenants: stores.length,
        users: users.length,
        averageOrderValue: paidOrders.length ? revenue / paidOrders.length : 0,
        chart: Array.from(byDay.values()).sort((a, b) => a.date.localeCompare(b.date)),
        fulfillment: Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/integrations/upload-placeholder', protect, allowRoles('vendor', 'super_admin'), (req, res) => {
  res.json({ success: true, upload: mediaUploadPlaceholder(req.body.fileName || 'product-image') });
});

router.post('/integrations/stripe/webhook', expressRawJson, handleStripeWebhook);

router.get('/admin/users', protect, allowRoles('super_admin'), async (req, res, next) => {
  try {
    res.json({ success: true, users: await data.users.list() });
  } catch (error) {
    next(error);
  }
});

router.post('/admin/stores', protect, allowRoles('super_admin'), async (req, res, next) => {
  try {
    const { ownerName, ownerEmail, storeName, slug, plan } = req.body;
    if (!ownerName || !ownerEmail || !storeName || !slug) {
      res.status(400);
      throw new Error('Owner name, owner email, store name, and slug are required');
    }
    const owner = await data.users.create({
      name: ownerName,
      email: ownerEmail,
      password: req.body.password || 'Password123!',
      role: 'vendor'
    });
    const store = await data.stores.create({
      name: storeName,
      slug,
      ownerId: owner.id || owner._id,
      plan: plan || 'starter',
      status: 'active',
      currency: req.body.currency || 'USD',
      brandColor: req.body.brandColor || '#e9372f'
    });
    await data.users.update(owner.id || owner._id, { storeId: store.id || store._id });
    res.status(201).json({ success: true, store, owner: { ...owner, storeId: store.id || store._id } });
  } catch (error) {
    next(error);
  }
});

router.patch('/admin/stores/:id', protect, allowRoles('super_admin'), async (req, res, next) => {
  try {
    const store = await data.stores.update(req.params.id, req.body);
    if (!store) {
      res.status(404);
      throw new Error('Store not found');
    }
    res.json({ success: true, store });
  } catch (error) {
    next(error);
  }
});

function expressRawJson(req, res, next) {
  next();
}

module.exports = router;
