const API_URL = import.meta.env.VITE_API_URL || '/api'
const REQUEST_TIMEOUT_MS = 15000
const STATIC_DEMO = import.meta.env.VITE_STATIC_DEMO === 'true'
const STATIC_STATE_KEY = 'marketPlaceStaticStateV2'

function getToken() {
  return localStorage.getItem('redx_token')
}

export async function api(path, options = {}) {
  if (STATIC_DEMO) return demoApi(path, options)

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), options.timeout || REQUEST_TIMEOUT_MS)
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.message || 'Request failed')
    return data
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('Request timed out', { cause: error })
    throw error
  } finally {
    window.clearTimeout(timeout)
  }
}

export function money(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value || 0)
}

const demoUsers = [
  { id: 'admin-demo', name: 'Platform Admin', email: 'admin@redx.dev', password: 'Password123!', role: 'super_admin', status: 'active' },
  { id: 'vendor-demo', name: 'Navee Vendor', email: 'vendor@redx.dev', password: 'Password123!', role: 'vendor', storeId: 'naveen-mobile-store', status: 'active' },
  { id: 'customer-demo', name: 'Casey Customer', email: 'customer@redx.dev', password: 'Password123!', role: 'customer', status: 'active' }
]

const seedStores = [
  ['Market Place Goods', 'market-place-goods', 'growth', '#2f6f6a'],
  ['Naveen Mobile Store', 'naveen-mobile-store', 'scale', '#0f4c81'],
  ['Andhra Smart Mobiles', 'andhra-smart-mobiles', 'growth', '#2563eb'],
  ['Budget Phone Bazaar', 'budget-phone-bazaar', 'starter', '#16a34a'],
  ['Northline Apparel', 'northline-apparel', 'starter', '#1f7a8c'],
  ['Urban Desk Supply', 'urban-desk-supply', 'growth', '#3f6f3f'],
  ['Circuit Home Tech', 'circuit-home-tech', 'scale', '#2556a3'],
  ['Pulse Gaming Store', 'pulse-gaming-store', 'scale', '#7e22ce']
].map(([name, slug, plan, brandColor], index) => ({
  id: slug,
  name,
  slug,
  plan,
  brandColor,
  status: 'active',
  currency: 'USD',
  ownerId: index === 0 ? 'vendor-demo' : `vendor-${index}`
}))

const seedProducts = [
  ['Navee X1 5G Mobile', 'Fast 5G smartphone with AMOLED display, 128GB storage, and all-day battery.', 'Mobiles', 18999, 38, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80'],
  ['Navee Pro Max Mobile', 'Premium camera phone with flagship performance and 256GB storage.', 'Mobiles', 42999, 18, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80'],
  ['Andhra A5 Smart Phone', 'Affordable Android mobile with large display and reliable daily performance.', 'Mobiles', 12999, 46, 'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=900&q=80'],
  ['Budget 5G Phone', 'Value 5G mobile with dual SIM support and fast charging.', 'Mobiles', 10999, 72, 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=900&q=80'],
  ['Command Hoodie', 'Premium cotton fleece hoodie built for daily operators.', 'Apparel', 1499, 38, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80'],
  ['Ops Desk Mat', 'Large stitched desk mat for focused work setups and stores.', 'Workspace', 1299, 54, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80'],
  ['Smart Home Hub', 'Compact controller for lights, sensors, and home automations.', 'Electronics', 4999, 19, 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80'],
  ['RGB Keyboard', 'Mechanical keyboard with hot-swappable switches and RGB modes.', 'Gaming', 2999, 29, 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=900&q=80'],
  ['Launch Backpack', 'Weather-resistant backpack for founders, vendors, and travel.', 'Bags', 2599, 21, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80'],
  ['Studio Headphones', 'Closed-back headphones tuned for calls, music, and editing.', 'Audio', 3499, 26, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80'],
  ['Signal Bottle', 'Insulated steel bottle with matte finish and durable cap.', 'Accessories', 1199, 70, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80'],
  ['Minimal Task Lamp', 'Dimmable aluminum lamp for retail counters and desks.', 'Workspace', 1699, 32, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80']
].map(([title, description, category, price, stock, imageUrl], index) => {
  const store = seedStores[index % seedStores.length]
  const id = slugify(title)
  return {
    id,
    title,
    slug: id,
    description,
    category,
    price,
    stock,
    imageUrl,
    status: 'active',
    storeId: store.id,
    storeName: store.name,
    vendorId: store.ownerId,
    rating: 4.3 + (index % 5) / 10,
    reviewCount: 18 + index * 3,
    brand: store.name,
    sku: `NV-${String(index + 1).padStart(4, '0')}`
  }
})

const seedOrders = [
  {
    id: 'order-demo-1',
    storeId: 'market-place-goods',
    customerId: 'customer-demo',
    items: [{ productId: 'navee-x1-5g-mobile', title: 'Navee X1 5G Mobile', quantity: 1, unitPrice: 18999 }],
    subtotal: 18999,
    shipping: 100,
    tax: 1520,
    total: 20619,
    currency: 'usd',
    paymentMethod: 'card',
    paymentProvider: 'demo',
    paymentStatus: 'paid',
    fulfillmentStatus: 'queued',
    createdAt: new Date().toISOString()
  }
]

function slugify(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function publicUser(user) {
  if (!user) return null
  const safeUser = { ...user }
  delete safeUser.password
  return safeUser
}

function initialState() {
  const extraUsers = seedStores.slice(1).map((store, index) => ({
    id: `vendor-${index + 1}`,
    name: `${store.name} Owner`,
    email: `${store.slug}@redx.dev`,
    password: 'Password123!',
    role: 'vendor',
    storeId: store.id,
    status: 'active'
  }))

  return {
    users: [...demoUsers, ...extraUsers],
    stores: seedStores,
    products: seedProducts,
    orders: seedOrders
  }
}

function getState() {
  const stored = localStorage.getItem(STATIC_STATE_KEY)
  if (stored) return JSON.parse(stored)
  const state = initialState()
  saveState(state)
  return state
}

function saveState(state) {
  localStorage.setItem(STATIC_STATE_KEY, JSON.stringify(state))
}

function currentUser(state) {
  const token = getToken() || ''
  const userId = token.replace('demo-token-', '')
  return state.users.find((user) => user.id === userId)
}

function requireUser(state) {
  const user = currentUser(state)
  if (!user) throw new Error('Please sign in to continue')
  return user
}

function allow(user, roles) {
  if (!roles.includes(user.role)) throw new Error('You do not have access to this resource')
}

function analytics(state, user) {
  const storeId = user.role === 'vendor' ? user.storeId : null
  const orders = storeId ? state.orders.filter((order) => order.storeId === storeId) : state.orders
  const products = storeId ? state.products.filter((product) => product.storeId === storeId) : state.products
  const paidOrders = orders.filter((order) => order.paymentStatus === 'paid')
  const revenue = paidOrders.reduce((sum, order) => sum + Number(order.total || 0), 0)
  const chart = Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))
    return {
      date: date.toISOString().slice(0, 10),
      revenue: index === 6 ? revenue : Math.round(revenue * (index + 1) / 12),
      orders: index === 6 ? orders.length : Math.max(0, Math.round(index / 2))
    }
  })
  const fulfillmentCounts = orders.reduce((counts, order) => {
    counts[order.fulfillmentStatus] = (counts[order.fulfillmentStatus] || 0) + 1
    return counts
  }, {})

  return {
    revenue,
    orders: orders.length,
    products: products.length,
    tenants: state.stores.length,
    users: state.users.length,
    averageOrderValue: paidOrders.length ? revenue / paidOrders.length : 0,
    chart,
    fulfillment: Object.entries(fulfillmentCounts).map(([name, value]) => ({ name, value }))
  }
}

function orderCharges(items, shipping = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const tax = Math.round(subtotal * 0.08)
  return {
    subtotal,
    shipping,
    tax,
    total: subtotal + shipping + tax
  }
}

async function demoApi(path, options = {}) {
  await Promise.resolve()
  const method = String(options.method || 'GET').toUpperCase()
  const state = getState()

  if (path === '/auth/login' && method === 'POST') {
    const user = state.users.find((item) => item.email === options.body?.email && item.password === options.body?.password)
    if (!user) throw new Error('Invalid email or password')
    return { success: true, user: publicUser(user), token: `demo-token-${user.id}` }
  }

  if (path === '/auth/register' && method === 'POST') {
    const { name, email, password } = options.body || {}
    if (!name || !email || !password || password.length < 8) throw new Error('Name, valid email, and 8+ character password are required')
    const user = { id: `customer-${Date.now()}`, name, email, password, role: 'customer', status: 'active' }
    state.users.push(user)
    saveState(state)
    return { success: true, user: publicUser(user), token: `demo-token-${user.id}` }
  }

  if (path === '/auth/me') return { success: true, user: publicUser(requireUser(state)) }
  if (path === '/stores') return { success: true, stores: state.stores }
  if (path.startsWith('/stores/')) {
    const store = state.stores.find((item) => item.id === path.split('/').pop())
    if (!store) throw new Error('Store not found')
    return { success: true, store }
  }
  if (path === '/products') return { success: true, products: state.products.filter((product) => product.status === 'active') }
  if (path.startsWith('/products/')) {
    const product = state.products.find((item) => item.id === path.split('/').pop())
    if (!product) throw new Error('Product not found')
    return { success: true, product }
  }

  if (path === '/orders') {
    const user = requireUser(state)
    const orders = user.role === 'customer'
      ? state.orders.filter((order) => order.customerId === user.id)
      : user.role === 'vendor'
        ? state.orders.filter((order) => order.storeId === user.storeId)
        : state.orders
    return { success: true, orders }
  }

  if (path === '/checkout' && method === 'POST') {
    const user = requireUser(state)
    const items = options.body?.items || []
    if (!items.length) throw new Error('Checkout requires at least one cart item')
    const orderItems = items.map((item) => {
      const product = state.products.find((entry) => entry.id === item.productId)
      if (!product) throw new Error('One or more products are unavailable')
      return { productId: product.id, title: product.title, quantity: item.quantity, unitPrice: product.price, storeId: product.storeId }
    })
    const grouped = orderItems.reduce((groups, item) => {
      groups[item.storeId] ||= []
      groups[item.storeId].push(item)
      return groups
    }, {})
    const orders = Object.entries(grouped).map(([storeId, storeItems], index) => {
      const charges = orderCharges(storeItems, index === 0 ? 100 : 0)
      return {
      id: `order-${Date.now()}-${index + 1}`,
      storeId,
      customerId: user.id,
      items: storeItems,
      ...charges,
      currency: 'usd',
      paymentMethod: options.body?.paymentMethod || 'card',
      paymentProvider: 'demo',
      paymentStatus: options.body?.paymentMethod === 'cod' ? 'pending' : 'paid',
      fulfillmentStatus: 'queued',
      shippingAddress: options.body?.shippingAddress,
      createdAt: new Date().toISOString()
      }
    })
    state.orders.push(...orders)
    saveState(state)
    return { success: true, order: orders[0], orders, payment: { provider: 'demo', clientSecret: `demo_secret_${Date.now()}` } }
  }

  if (path === '/analytics/summary') {
    const user = requireUser(state)
    allow(user, ['vendor', 'super_admin'])
    return { success: true, summary: analytics(state, user) }
  }

  if (path === '/admin/users') {
    const user = requireUser(state)
    allow(user, ['super_admin'])
    return { success: true, users: state.users.map(publicUser) }
  }

  if (path === '/admin/stores' && method === 'POST') {
    const user = requireUser(state)
    allow(user, ['super_admin'])
    const payload = options.body || {}
    const owner = {
      id: `vendor-${Date.now()}`,
      name: payload.ownerName,
      email: payload.ownerEmail,
      password: payload.password || 'Password123!',
      role: 'vendor',
      status: 'active',
      storeId: payload.slug
    }
    const store = {
      id: payload.slug,
      name: payload.storeName,
      slug: payload.slug,
      ownerId: owner.id,
      plan: payload.plan || 'starter',
      status: 'active',
      currency: payload.currency || 'USD',
      brandColor: payload.brandColor || '#e9372f'
    }
    state.users.push(owner)
    state.stores.push(store)
    saveState(state)
    return { success: true, store, owner: publicUser(owner) }
  }

  if (path === '/vendor/products' && method === 'POST') {
    const user = requireUser(state)
    allow(user, ['vendor', 'super_admin'])
    const payload = options.body || {}
    const storeId = user.role === 'vendor' ? user.storeId : payload.storeId || state.stores[0].id
    const store = state.stores.find((item) => item.id === storeId) || state.stores[0]
    const product = {
      id: `${slugify(payload.title || 'product')}-${Date.now()}`,
      ...payload,
      price: Number(payload.price || 0),
      stock: Number(payload.stock || 0),
      status: payload.status || 'active',
      storeId: store.id,
      storeName: store.name,
      vendorId: user.id
    }
    state.products.unshift(product)
    saveState(state)
    return { success: true, product }
  }

  const productDelete = path.match(/^\/vendor\/products\/(.+)$/)
  if (productDelete && method === 'DELETE') {
    const user = requireUser(state)
    allow(user, ['vendor', 'super_admin'])
    const product = state.products.find((item) => item.id === productDelete[1])
    if (!product) throw new Error('Product not found in your tenant')
    product.status = 'archived'
    saveState(state)
    return { success: true, product }
  }

  const orderPatch = path.match(/^\/vendor\/orders\/(.+)$/)
  if (orderPatch && method === 'PATCH') {
    const user = requireUser(state)
    allow(user, ['vendor', 'super_admin'])
    const order = state.orders.find((item) => item.id === orderPatch[1])
    if (!order) throw new Error('Order not found in your tenant')
    order.fulfillmentStatus = options.body?.fulfillmentStatus || order.fulfillmentStatus
    saveState(state)
    return { success: true, order }
  }

  throw new Error('Demo endpoint not found')
}
