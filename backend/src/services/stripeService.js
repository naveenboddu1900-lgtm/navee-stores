function createPaymentIntent({ amount, currency = 'usd', paymentMethod = 'card' }) {
  return {
    provider: 'demo',
    clientSecret: `demo_secret_${Date.now()}`,
    amount,
    currency,
    paymentMethod,
    status: paymentMethod === 'cod' ? 'pay_on_delivery' : 'captured'
  };
}

module.exports = { createPaymentIntent };
