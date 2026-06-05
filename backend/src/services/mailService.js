async function sendOrderConfirmation(order) {
  return {
    delivered: false,
    mode: 'demo',
    message: `Order ${order.id || order._id} confirmation queued`
  };
}

module.exports = { sendOrderConfirmation };
