const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { isMongoMode } = require('../config/db');
const User = require('../models/User');
const Store = require('../models/Store');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { demoStores, demoProducts, slugify } = require('../config/demoCatalog');

const memory = { users: [], stores: [], products: [], orders: [] };

function id() {
  return new mongoose.Types.ObjectId().toString();
}

function serialize(doc) {
  if (!doc) return null;
  const item = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  return { ...item, id: item._id?.toString?.() || item.id, _id: item._id?.toString?.() || item._id };
}

async function ensureMemorySeed() {
  if (memory.users.length) return;

  const adminId = id();
  const vendorId = id();
  const customerId = id();
  const storeId = id();
  const password = await bcrypt.hash('Password123!', 12);

  memory.users.push(
    { id: adminId, _id: adminId, name: 'Market Place Admin', email: 'admin@redx.dev', password, role: 'super_admin', status: 'active' },
    { id: vendorId, _id: vendorId, name: 'Avery Vendor', email: 'vendor@redx.dev', password, role: 'vendor', storeId, status: 'active' },
    { id: customerId, _id: customerId, name: 'Casey Customer', email: 'customer@redx.dev', password, role: 'customer', status: 'active' }
  );

  const primaryStore = {
    id: storeId,
    _id: storeId,
    name: 'Market Place Goods',
    slug: 'market-place-goods',
    ownerId: vendorId,
    plan: 'growth',
    status: 'active',
    currency: 'USD',
    brandColor: '#2f6f6a',
    createdAt: new Date().toISOString()
  };
  memory.stores.push(primaryStore);

  const seededStores = [primaryStore];
  for (const [index, [name, slug, plan, brandColor]] of demoStores.slice(1).entries()) {
    const tenantVendorId = id();
    const tenantStoreId = id();
    memory.users.push({
      id: tenantVendorId,
      _id: tenantVendorId,
      name: `${name} Vendor`,
      email: `vendor${index + 2}@redx.dev`,
      password,
      role: 'vendor',
      storeId: tenantStoreId,
      status: 'active'
    });
    const store = {
      id: tenantStoreId,
      _id: tenantStoreId,
      name,
      slug,
      ownerId: tenantVendorId,
      plan,
      status: 'active',
      currency: 'USD',
      brandColor,
      createdAt: new Date(Date.now() - (index + 1) * 86400000).toISOString()
    };
    memory.stores.push(store);
    seededStores.push(store);
  }

  demoProducts.forEach(([title, description, category, price, stock, imageUrl], index) => {
    const store = seededStores[index % seededStores.length];
    memory.products.push({
      id: id(),
      _id: id(),
      storeId: store.id,
      vendorId: store.ownerId,
      title,
      slug: slugify(title),
      description,
      category,
      price,
      stock,
      imageUrl,
      status: 'active',
      tags: [category.toLowerCase()],
      createdAt: new Date().toISOString()
    });
  });

  const first = memory.products[0];
  const demoSubtotal = first.price * 2;
  const demoShipping = 100;
  const demoTax = Math.round(demoSubtotal * 0.08);
  memory.orders.push({
    id: id(),
    _id: id(),
    storeId,
    customerId,
    items: [{ productId: first.id, title: first.title, quantity: 2, unitPrice: first.price }],
    subtotal: demoSubtotal,
    shipping: demoShipping,
    tax: demoTax,
    total: demoSubtotal + demoShipping + demoTax,
    paymentStatus: 'paid',
    fulfillmentStatus: 'processing',
    shippingAddress: { fullName: 'Casey Customer', line1: '14 Market Street', city: 'Austin', country: 'USA', phone: '+1 555 0132' },
    createdAt: new Date().toISOString()
  });
}

const users = {
  async findByEmail(email, includePassword = false) {
    if (isMongoMode()) {
      const query = User.findOne({ email: email.toLowerCase() });
      if (includePassword) query.select('+password');
      return serialize(await query);
    }
    await ensureMemorySeed();
    const user = memory.users.find((item) => item.email === email.toLowerCase());
    if (!user) return null;
    return includePassword ? user : { ...user, password: undefined };
  },
  async findById(userId) {
    if (isMongoMode()) return serialize(await User.findById(userId));
    await ensureMemorySeed();
    const user = memory.users.find((item) => item.id === userId || item._id === userId);
    return user ? { ...user, password: undefined } : null;
  },
  async create(input) {
    if (isMongoMode()) return serialize(await User.create(input));
    await ensureMemorySeed();
    const existing = memory.users.find((item) => item.email === input.email.toLowerCase());
    if (existing) throw new Error('Email is already registered');
    const user = { id: id(), _id: id(), ...input, email: input.email.toLowerCase(), password: await bcrypt.hash(input.password, 12), status: 'active' };
    memory.users.push(user);
    return { ...user, password: undefined };
  },
  async update(userId, input) {
    if (isMongoMode()) return serialize(await User.findByIdAndUpdate(userId, input, { new: true, runValidators: true }));
    await ensureMemorySeed();
    const user = memory.users.find((item) => item.id === userId || item._id === userId);
    if (!user) return null;
    Object.assign(user, input);
    return { ...user, password: undefined };
  },
  async list() {
    if (isMongoMode()) return (await User.find().sort({ createdAt: -1 })).map(serialize);
    await ensureMemorySeed();
    return memory.users.map((user) => ({ ...user, password: undefined }));
  }
};

const stores = {
  async list() {
    if (isMongoMode()) return (await Store.find().sort({ createdAt: -1 })).map(serialize);
    await ensureMemorySeed();
    return memory.stores;
  },
  async findById(storeId) {
    if (isMongoMode()) return serialize(await Store.findById(storeId));
    await ensureMemorySeed();
    return memory.stores.find((item) => item.id === storeId || item._id === storeId);
  },
  async create(input) {
    if (isMongoMode()) return serialize(await Store.create(input));
    await ensureMemorySeed();
    const store = { id: id(), _id: id(), ...input, createdAt: new Date().toISOString() };
    memory.stores.push(store);
    return store;
  },
  async update(storeId, input) {
    if (isMongoMode()) return serialize(await Store.findByIdAndUpdate(storeId, input, { new: true, runValidators: true }));
    await ensureMemorySeed();
    const store = memory.stores.find((item) => item.id === storeId || item._id === storeId);
    if (!store) return null;
    Object.assign(store, input);
    return store;
  }
};

const products = {
  async list(filters = {}) {
    if (isMongoMode()) {
      const query = {};
      if (filters.storeId) query.storeId = filters.storeId;
      if (filters.status) query.status = filters.status;
      if (filters.category) query.category = filters.category;
      return (await Product.find(query).sort({ createdAt: -1 })).map(serialize);
    }
    await ensureMemorySeed();
    return memory.products.filter((product) => {
      if (filters.storeId && product.storeId !== filters.storeId) return false;
      if (filters.status && product.status !== filters.status) return false;
      if (filters.category && product.category !== filters.category) return false;
      return true;
    });
  },
  async findById(productId) {
    if (isMongoMode()) return serialize(await Product.findById(productId));
    await ensureMemorySeed();
    return memory.products.find((item) => item.id === productId || item._id === productId);
  },
  async create(input) {
    if (isMongoMode()) return serialize(await Product.create(input));
    await ensureMemorySeed();
    const product = { id: id(), _id: id(), ...input, createdAt: new Date().toISOString() };
    memory.products.push(product);
    return product;
  },
  async update(productId, input) {
    if (isMongoMode()) return serialize(await Product.findByIdAndUpdate(productId, input, { new: true, runValidators: true }));
    await ensureMemorySeed();
    const product = memory.products.find((item) => item.id === productId || item._id === productId);
    if (!product) return null;
    Object.assign(product, input);
    return product;
  },
  async remove(productId) {
    if (isMongoMode()) return serialize(await Product.findByIdAndUpdate(productId, { status: 'archived' }, { new: true }));
    await ensureMemorySeed();
    const product = memory.products.find((item) => item.id === productId || item._id === productId);
    if (!product) return null;
    product.status = 'archived';
    return product;
  }
};

const orders = {
  async findById(orderId) {
    if (isMongoMode()) return serialize(await Order.findById(orderId));
    await ensureMemorySeed();
    return memory.orders.find((item) => item.id === orderId || item._id === orderId);
  },
  async list(filters = {}) {
    if (isMongoMode()) {
      const query = {};
      if (filters.storeId) query.storeId = filters.storeId;
      if (filters.customerId) query.customerId = filters.customerId;
      return (await Order.find(query).sort({ createdAt: -1 })).map(serialize);
    }
    await ensureMemorySeed();
    return memory.orders.filter((order) => {
      if (filters.storeId && order.storeId !== filters.storeId) return false;
      if (filters.customerId && order.customerId !== filters.customerId) return false;
      return true;
    });
  },
  async create(input) {
    if (isMongoMode()) return serialize(await Order.create(input));
    await ensureMemorySeed();
    const order = { id: id(), _id: id(), ...input, createdAt: new Date().toISOString() };
    memory.orders.push(order);
    return order;
  },
  async update(orderId, input) {
    if (isMongoMode()) return serialize(await Order.findByIdAndUpdate(orderId, input, { new: true, runValidators: true }));
    await ensureMemorySeed();
    const order = memory.orders.find((item) => item.id === orderId || item._id === orderId);
    if (!order) return null;
    Object.assign(order, input);
    return order;
  }
};

module.exports = { ensureMemorySeed, users, stores, products, orders };
