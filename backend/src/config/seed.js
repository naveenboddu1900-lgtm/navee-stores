const User = require('../models/User');
const Store = require('../models/Store');
const Product = require('../models/Product');
const { isMongoMode } = require('./db');
const data = require('../services/dataService');
const { demoStores, demoProducts, slugify } = require('./demoCatalog');

function productDetails({ title, category, store, index }) {
  const colors = ['Graphite', 'Teal', 'Ivory', 'Navy', 'Forest', 'Sand'];
  return {
    sku: `${store.slug.toUpperCase().slice(0, 4)}-${String(index + 1).padStart(4, '0')}`,
    brand: store.name,
    rating: Number((4.1 + ((index % 8) * 0.06)).toFixed(1)),
    reviewCount: 18 + ((index * 13) % 420),
    highlights: [
      `Selected by ${store.name}`,
      `Best for ${category.toLowerCase()} buyers`,
      'Quality checked before dispatch',
      'Ready for secure NAVEE checkout'
    ],
    specifications: {
      material: category === 'Electronics' || category === 'Audio' ? 'Aluminum and engineered polymer' : 'Premium everyday materials',
      color: colors[index % colors.length],
      weight: `${0.4 + (index % 9) * 0.2} kg`,
      origin: 'NAVEE verified vendor'
    },
    shipping: {
      delivery: `${2 + (index % 5)}-${4 + (index % 5)} business days`,
      fee: index % 3 === 0 ? 'Free delivery' : '$4 standard delivery',
      returnPolicy: '7-day return available'
    },
    warranty: index % 4 === 0 ? '1-year seller warranty' : '6-month seller warranty',
    tags: [category.toLowerCase(), title.toLowerCase().split(' ')[0], store.slug]
  };
}

async function seedDemoData() {
  if (!isMongoMode()) {
    await data.ensureMemorySeed();
    return;
  }

  const existing = await User.findOne({ email: 'admin@redx.dev' });
  if (existing) return;

  const admin = await User.create({ name: 'RED_X Admin', email: 'admin@redx.dev', password: 'Password123!', role: 'super_admin' });
  const vendor = await User.create({ name: 'Avery Vendor', email: 'vendor@redx.dev', password: 'Password123!', role: 'vendor' });
  await User.create({ name: 'Casey Customer', email: 'customer@redx.dev', password: 'Password123!', role: 'customer' });

  const [primaryName, primarySlug, primaryPlan, primaryColor] = demoStores[0];
  const store = await Store.create({
    name: primaryName,
    slug: primarySlug,
    ownerId: vendor._id,
    plan: primaryPlan,
    status: 'active',
    currency: 'USD',
    brandColor: primaryColor
  });

  vendor.storeId = store._id;
  await vendor.save();

  const seededStores = [{ store, owner: vendor }];
  for (const [index, [name, slug, plan, brandColor]] of demoStores.slice(1).entries()) {
    const owner = await User.create({
      name: `${name} Vendor`,
      email: `vendor${index + 2}@redx.dev`,
      password: 'Password123!',
      role: 'vendor'
    });
    const tenantStore = await Store.create({
      name,
      slug,
      ownerId: owner._id,
      plan,
      status: 'active',
      currency: 'USD',
      brandColor
    });
    owner.storeId = tenantStore._id;
    await owner.save();
    seededStores.push({ store: tenantStore, owner });
  }

  await Product.insertMany(demoProducts.map(([title, description, category, price, stock, imageUrl, productStoreSlug], index) => {
    const tenant = seededStores.find(({ store }) => store.slug === productStoreSlug) || seededStores[index % seededStores.length];
    const storeInfo = { name: tenant.store.name, slug: tenant.store.slug };
    return {
      storeId: tenant.store._id,
      vendorId: tenant.owner._id,
      title,
      slug: slugify(title),
      description,
      category,
      price,
      stock,
      imageUrl,
      status: 'active',
      ...productDetails({ title, category, store: storeInfo, index })
    };
  }));

  console.log(`MongoDB seeded for ${admin.email}.`);
}

if (require.main === module) {
  require('dotenv').config();
  const { connectDatabase } = require('./db');
  connectDatabase().then(seedDemoData).then(() => process.exit(0));
}

module.exports = { seedDemoData };
