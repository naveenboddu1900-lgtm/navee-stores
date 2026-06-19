const User = require('../models/User');
const Store = require('../models/Store');
const Product = require('../models/Product');
const { isMongoMode } = require('./db');
const data = require('../services/dataService');
const { demoStores, demoProducts, slugify } = require('./demoCatalog');

async function seedDemoData() {
  if (!isMongoMode()) {
    await data.ensureMemorySeed();
    return;
  }

  const existing = await User.findOne({ email: 'admin@redx.dev' });
  if (existing) return;

  const admin = await User.create({ name: 'Market Place Admin', email: 'admin@redx.dev', password: 'Password123!', role: 'super_admin' });
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

  await Product.insertMany(demoProducts.map(([title, description, category, price, stock, imageUrl], index) => {
    const tenant = seededStores[index % seededStores.length];
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
      tags: [category.toLowerCase()]
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
