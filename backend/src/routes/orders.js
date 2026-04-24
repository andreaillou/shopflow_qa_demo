const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { cartItems, orders, products, promoCodes } = require('../data/seed');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.post('/', (req, res) => {
  const userCart = cartItems.filter((item) => item.user_id === req.userId);
  if (userCart.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  let promoCodeId = null;
  let discountPercent = 0;

  const requestedPromo = req.body && req.body.promo_code ? String(req.body.promo_code) : '';
  if (requestedPromo) {
    const promo = promoCodes.find(
      (candidate) => candidate.code.toLowerCase() === requestedPromo.toLowerCase()
    );
    const isValid =
      promo && promo.is_active && new Date(promo.expires_at).getTime() > Date.now();

    if (!isValid) {
      return res.status(400).json({ message: 'Promo code is invalid' });
    }

    promoCodeId = promo.id;
    discountPercent = promo.discount_percent;
  }

  const orderId = uuidv4();
  const createdAt = new Date().toISOString();

  const items = userCart.map((cartItem) => {
    const product = products.find((candidate) => candidate.id === cartItem.product_id);
    const price = Number(product ? product.price : 0);
    const lineTotal = Number((price * cartItem.quantity).toFixed(2));
    return {
      id: uuidv4(),
      order_id: orderId,
      product_id: cartItem.product_id,
      product_name_at_purchase: product ? product.name : 'Unknown product',
      price_at_purchase: price,
      quantity: cartItem.quantity,
      line_total: lineTotal,
    };
  });

  const subtotal = Number(items.reduce((sum, item) => sum + item.line_total, 0).toFixed(2));
  const discountAmount = Number(((subtotal * discountPercent) / 100).toFixed(2));
  const totalAfterDiscount = Number((subtotal - discountAmount).toFixed(2));

  const order = {
    id: orderId,
    user_id: req.userId,
    promo_code_id: promoCodeId,
    subtotal_before_discount: subtotal,
    discount_amount: discountAmount,
    total_after_discount: totalAfterDiscount,
    status: 'confirmed',
    created_at: createdAt,
    items,
  };

  orders.push(order);

  for (let i = cartItems.length - 1; i >= 0; i -= 1) {
    if (cartItems[i].user_id === req.userId) {
      cartItems.splice(i, 1);
    }
  }

  return res.status(201).json(order);
});

module.exports = router;
