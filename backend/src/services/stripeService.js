const Stripe = require('stripe');
const data = require('./dataService');

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

async function createPaymentIntent({ amount, currency = 'usd', paymentMethod = 'card', orderId, customerEmail }) {
  if (stripe && paymentMethod === 'card') {
    const intent = await stripe.paymentIntents.create({
      amount,
      currency,
      receipt_email: customerEmail,
      automatic_payment_methods: { enabled: true },
      metadata: { orderId: String(orderId) }
    });

    return {
      provider: 'stripe',
      id: intent.id,
      clientSecret: intent.client_secret,
      amount: intent.amount,
      currency: intent.currency,
      paymentMethod,
      status: intent.status
    };
  }

  return {
    provider: 'demo',
    clientSecret: `demo_secret_${Date.now()}`,
    amount,
    currency,
    paymentMethod,
    status: paymentMethod === 'cod' ? 'cash_on_delivery' : 'succeeded'
  };
}

async function handleStripeWebhook(req, res) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.json({ success: true, received: true, mode: 'demo-webhook' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).json({ success: false, message: `Webhook signature failed: ${error.message}` });
  }

  const intent = event.data.object;
  const orderId = intent.metadata?.orderId;
  if (!orderId) return res.json({ success: true, received: true, ignored: true });

  const order = await data.orders.findById(orderId);
  if (!order) return res.json({ success: true, received: true, missingOrder: orderId });
  if ((order.stripeEventIds || []).includes(event.id)) return res.json({ success: true, received: true, duplicate: true });

  const statusByEvent = {
    'payment_intent.succeeded': 'paid',
    'payment_intent.payment_failed': 'failed',
    'charge.refunded': 'refunded'
  };

  const paymentStatus = statusByEvent[event.type] || order.paymentStatus;
  await data.orders.update(orderId, {
    paymentStatus,
    stripePaymentIntentId: intent.id || order.stripePaymentIntentId,
    stripeEventIds: [...(order.stripeEventIds || []), event.id]
  });

  return res.json({ success: true, received: true, type: event.type });
}

module.exports = { createPaymentIntent, handleStripeWebhook };
