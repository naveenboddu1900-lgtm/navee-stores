const demoStores = [
  ['Market Place Goods', 'market-place-goods', 'growth', '#2f6f6a'],
  ['Naveen Mobile Store', 'naveen-mobile-store', 'scale', '#0f4c81'],
  ['Andhra Smart Mobiles', 'andhra-smart-mobiles', 'growth', '#2563eb'],
  ['Budget Phone Bazaar', 'budget-phone-bazaar', 'starter', '#16a34a'],
  ['Northline Apparel', 'northline-apparel', 'starter', '#1f7a8c'],
  ['Urban Desk Supply', 'urban-desk-supply', 'growth', '#3f6f3f'],
  ['Peak Trail Goods', 'peak-trail-goods', 'scale', '#6b4f2a'],
  ['Nova Beauty Lab', 'nova-beauty-lab', 'growth', '#b83280'],
  ['Circuit Home Tech', 'circuit-home-tech', 'scale', '#2556a3'],
  ['Mosaic Kitchen Co', 'mosaic-kitchen-co', 'starter', '#c16622'],
  ['Aster Kids Market', 'aster-kids-market', 'growth', '#7c5cc4'],
  ['Forge Fitness Supply', 'forge-fitness-supply', 'scale', '#2f4f4f'],
  ['Lumen Wellness', 'lumen-wellness', 'growth', '#0f766e'],
  ['Harbor Pet House', 'harbor-pet-house', 'starter', '#8a5a44'],
  ['Atlas Travel Store', 'atlas-travel-store', 'growth', '#31572c'],
  ['Bright School Shop', 'bright-school-shop', 'starter', '#c49a00'],
  ['Echo Audio Works', 'echo-audio-works', 'scale', '#4b5563'],
  ['Fresh Pantry Direct', 'fresh-pantry-direct', 'growth', '#4d7c0f'],
  ['Indigo Art Supply', 'indigo-art-supply', 'starter', '#4338ca'],
  ['Summit Outdoor Co', 'summit-outdoor-co', 'scale', '#57534e'],
  ['Metro Footwear', 'metro-footwear', 'growth', '#991b1b'],
  ['Craft Lane Gifts', 'craft-lane-gifts', 'starter', '#be185d'],
  ['Zenith Office Hub', 'zenith-office-hub', 'growth', '#0369a1'],
  ['Pulse Gaming Store', 'pulse-gaming-store', 'scale', '#7e22ce']
];

const demoProducts = [
  ['Navee X1 5G Mobile', 'Fast 5G smartphone with AMOLED display, 128GB storage, and all-day battery.', 'Mobiles', 18999, 38, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80'],
  ['Navee Pro Max Mobile', 'Premium camera phone with flagship performance and 256GB storage.', 'Mobiles', 42999, 18, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80'],
  ['Andhra A5 Smart Phone', 'Affordable Android mobile with large display and reliable daily performance.', 'Mobiles', 12999, 46, 'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=900&q=80'],
  ['Budget 5G Phone', 'Value 5G mobile with dual SIM support and fast charging.', 'Mobiles', 10999, 72, 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=900&q=80'],
  ['Command Hoodie', 'Premium cotton fleece hoodie built for daily operators.', 'Apparel', 1499, 38, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80'],
  ['Ops Desk Mat', 'Large stitched desk mat for focused work setups and stores.', 'Workspace', 1299, 54, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80'],
  ['Launch Backpack', 'Weather-resistant backpack for founders, vendors, and travel.', 'Bags', 2599, 21, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80'],
  ['Signal Bottle', 'Insulated steel bottle with matte finish and durable cap.', 'Accessories', 1199, 70, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80'],
  ['Northline Overshirt', 'Structured overshirt with soft twill and reinforced seams.', 'Apparel', 1799, 44, 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80'],
  ['Minimal Task Lamp', 'Dimmable aluminum lamp for retail counters and desks.', 'Workspace', 1699, 32, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80'],
  ['Trail Flask Set', 'Two insulated flasks made for weekend stock and outdoor bundles.', 'Outdoor', 1399, 65, 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=80'],
  ['Botanical Face Kit', 'Daily skincare kit with cleanser, serum, and moisturizer.', 'Beauty', 2199, 28, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80'],
  ['Smart Home Hub', 'Compact controller for lights, sensors, and home automations.', 'Electronics', 4999, 19, 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80'],
  ['Stoneware Dinner Set', 'Six-piece glazed dinner set for modern kitchen tables.', 'Kitchen', 2499, 24, 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=900&q=80'],
  ['Kids Explorer Pack', 'Lightweight activity backpack with safe pockets and bright trims.', 'Kids', 1299, 58, 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80'],
  ['Resistance Band Pro', 'Stackable resistance kit with handles, anchors, and carry bag.', 'Fitness', 1199, 83, 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=900&q=80'],
  ['Studio Headphones', 'Closed-back headphones tuned for calls, music, and editing.', 'Audio', 3499, 26, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80'],
  ['RGB Keyboard', 'Mechanical keyboard with hot-swappable switches and RGB modes.', 'Gaming', 2999, 29, 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=900&q=80']
];

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

module.exports = { demoStores, demoProducts, slugify };
