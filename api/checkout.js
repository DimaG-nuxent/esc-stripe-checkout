const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    // Разрешаем запросы (CORS)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Позже можно заменить на ваш домен framer
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Предварительная проверка браузера (Preflight request)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        try {
            const { totalAmount } = req.body;

            if (!totalAmount) {
                return res.status(400).json({ error: "Missing totalAmount" });
            }

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'eur',
                        product_data: { name: 'Order Payment' },
                        unit_amount: Math.round(totalAmount * 100), 
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: 'https://e-s-c.framer.website/cart/succes', // Замените на реальный
                cancel_url: 'https://e-s-c.framer.website/',    // Замените на реальный
            });

            res.status(200).json({ url: session.url });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else {
        // Если кто-то просто зайдет по ссылке в браузере (GET-запрос)
        res.status(200).send("API is running. Please use POST to checkout.");
    }
};
