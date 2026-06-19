const nodemailer = require('nodemailer');

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_PORT) === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

async function sendOrderConfirmation(order, customer = {}) {
  const transporter = getTransporter();
  if (transporter && customer.email) {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || 'Market Place <no-reply@marketplace.local>',
      to: customer.email,
      subject: `Order confirmation ${order.id || order._id}`,
      text: `Thanks for shopping with Market Place. Your order total is ${order.total} ${order.currency || 'usd'} and payment status is ${order.paymentStatus}.`
    });
    return { delivered: true, mode: 'smtp' };
  }

  return {
    delivered: false,
    mode: 'demo',
    message: `Order ${order.id || order._id} confirmation queued`
  };
}

module.exports = { sendOrderConfirmation };
