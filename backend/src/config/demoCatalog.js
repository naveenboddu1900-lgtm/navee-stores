const demoStores = [
  ['Market Place Goods', 'market-place-goods', 'growth', '#2f6f6a'],
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
  ['Command Hoodie', 'Premium cotton fleece hoodie built for daily operators.', 'Apparel', 68, 38, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80'],
  ['Ops Desk Mat', 'Large stitched desk mat for focused work setups and stores.', 'Workspace', 36, 54, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80'],
  ['Launch Backpack', 'Weather-resistant backpack for founders, vendors, and travel.', 'Bags', 112, 21, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80'],
  ['Signal Bottle', 'Insulated steel bottle with matte finish and durable cap.', 'Accessories', 28, 70, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80'],
  ['Northline Overshirt', 'Structured overshirt with soft twill and reinforced seams.', 'Apparel', 74, 44, 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80'],
  ['Minimal Task Lamp', 'Dimmable aluminum lamp for retail counters and desks.', 'Workspace', 59, 32, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80'],
  ['Trail Flask Set', 'Two insulated flasks made for weekend stock and outdoor bundles.', 'Outdoor', 42, 65, 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=80'],
  ['Botanical Face Kit', 'Daily skincare kit with cleanser, serum, and moisturizer.', 'Beauty', 86, 28, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80'],
  ['Smart Home Hub', 'Compact controller for lights, sensors, and home automations.', 'Electronics', 129, 19, 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80'],
  ['Stoneware Dinner Set', 'Six-piece glazed dinner set for modern kitchen tables.', 'Kitchen', 95, 24, 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=900&q=80'],
  ['Kids Explorer Pack', 'Lightweight activity backpack with safe pockets and bright trims.', 'Kids', 39, 58, 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80'],
  ['Resistance Band Pro', 'Stackable resistance kit with handles, anchors, and carry bag.', 'Fitness', 46, 83, 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=900&q=80'],
  ['Sleep Ritual Candle', 'Soy wax candle blended for calm evening routines.', 'Wellness', 31, 77, 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=80'],
  ['Pet Travel Bowl', 'Collapsible silicone bowl set with leak-safe carrier clip.', 'Pets', 22, 96, 'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?auto=format&fit=crop&w=900&q=80'],
  ['Carry-On Organizer', 'Compression packing cube kit for frequent travel.', 'Travel', 52, 47, 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80'],
  ['Student Study Bundle', 'Notebook, pen set, planner, and index cards for school shops.', 'School', 27, 120, 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80'],
  ['Studio Headphones', 'Closed-back headphones tuned for calls, music, and editing.', 'Audio', 118, 26, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80'],
  ['Organic Pantry Box', 'Curated grains, spices, and pantry staples for weekly cooking.', 'Grocery', 64, 35, 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80'],
  ['Acrylic Paint Set', 'Twenty-four color acrylic kit with brushes and mixing tray.', 'Art', 34, 68, 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80'],
  ['Camp Lantern Duo', 'Rechargeable lantern pair with warm and bright lighting modes.', 'Outdoor', 73, 31, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80'],
  ['Everyday Sneakers', 'Breathable knit sneakers with cushioned streetwear sole.', 'Footwear', 89, 52, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80'],
  ['Handmade Gift Box', 'Small-batch candle, card, and ceramic keepsake gift bundle.', 'Gifts', 48, 40, 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=80'],
  ['Ergo Monitor Stand', 'Steel and wood monitor riser with cable pass-through.', 'Office', 57, 33, 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80'],
  ['RGB Keyboard', 'Mechanical keyboard with hot-swappable switches and RGB modes.', 'Gaming', 104, 29, 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=900&q=80'],
  ['Vendor POS Scanner', 'USB barcode scanner for warehouse and checkout operations.', 'Retail Tech', 79, 25, 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=900&q=80'],
  ['Checkout Receipt Printer', 'Compact thermal printer for small business counters.', 'Retail Tech', 142, 17, 'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?auto=format&fit=crop&w=900&q=80'],
  ['Premium Yoga Mat', 'Non-slip natural rubber mat with alignment marks.', 'Fitness', 69, 61, 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=900&q=80'],
  ['Ceramic Pour Over', 'Slow coffee dripper with reusable stainless filter.', 'Kitchen', 44, 48, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80'],
  ['Desk Cable Kit', 'Magnetic cable ties, clips, and under-desk tray bundle.', 'Workspace', 25, 90, 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80'],
  ['Founder Notebook', 'Hardcover planning notebook with dotted pages and goal spreads.', 'Office', 19, 110, 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80']
];

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

module.exports = { demoStores, demoProducts, slugify };
