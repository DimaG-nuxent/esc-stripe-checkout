const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { totalAmount } = req.body; // Получаем сумму из корзины

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'eur', // Укажите свою валюту
            product_data: { name: 'Order Payment' },
            unit_amount: totalAmount * 100, // Stripe считает в центах
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: 'https://your-site.com/success',
        cancel_url: 'https://your-site.com/cart',
      });

      res.status(200).json({ url: session.url });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
