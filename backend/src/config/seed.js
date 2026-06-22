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

  const admin = await User.findOneAndUpdate(
    { email: 'admin@redx.dev' },
    { $setOnInsert: { name: 'Market Place Admin', password: 'Password123!', role: 'super_admin', status: 'active' } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  await User.findOneAndUpdate(
    { email: 'customer@redx.dev' },
    { $setOnInsert: { name: 'Casey Customer', password: 'Password123!', role: 'customer', status: 'active' } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const seededStores = [];
  for (const [index, [name, slug, plan, brandColor]] of demoStores.entries()) {
    const email = index === 0 ? 'vendor@redx.dev' : `vendor${index + 1}@redx.dev`;
    const owner = await User.findOneAndUpdate(
      { email },
      { $setOnInsert: { name: `${name} Vendor`, password: 'Password123!', role: 'vendor', status: 'active' } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    const tenantStore = await Store.findOneAndUpdate(
      { slug },
      {
        name,
        slug,
        ownerId: owner._id,
        plan,
        status: 'active',
        currency: 'USD',
        brandColor
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    owner.storeId = tenantStore._id;
    await owner.save();
    seededStores.push({ store: tenantStore, owner });
  }

  for (const [index, [title, description, category, price, stock, imageUrl]] of demoProducts.entries()) {
    const tenant = seededStores[index % seededStores.length];
    const slug = slugify(title);
    await Product.findOneAndUpdate(
      { storeId: tenant.store._id, slug },
      {
        storeId: tenant.store._id,
        vendorId: tenant.owner._id,
        title,
        slug,
        description,
        category,
        price,
        stock,
        imageUrl,
        status: 'active',
        tags: [category.toLowerCase()]
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  await Product.updateMany({ price: { $lte: 1000 } }, { $set: { price: 1001 } });

  console.log(`MongoDB demo catalog refreshed for ${admin.email}.`);
}

if (require.main === module) {
  require('dotenv').config();
  const { connectDatabase } = require('./db');
  connectDatabase().then(seedDemoData).then(() => process.exit(0));
}

module.exports = { seedDemoData };
