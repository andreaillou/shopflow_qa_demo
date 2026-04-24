const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { cartItems, products } = require("../data/seed");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

const toCartResponse = (item) => {
  const product = products.find(
    (candidate) => candidate.id === item.product_id,
  );
  return {
    id: item.id,
    product_id: item.product_id,
    product,
    quantity: item.quantity,
  };
};

router.get("/", (req, res) => {
  const response = cartItems
    .filter((item) => item.user_id === req.userId)
    .map(toCartResponse)
    .filter((item) => Boolean(item.product));

  return res.status(200).json(response);
});

router.post("/", (req, res) => {
  const { product_id: productId, quantity } = req.body || {};
  const qty = Number(quantity);

  if (!productId || !Number.isFinite(qty) || qty < 1) {
    return res.status(400).json({ message: "Invalid cart payload" });
  }

  const product = products.find((item) => item.id === String(productId));
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const existing = cartItems.find(
    (item) => item.user_id === req.userId && item.product_id === product.id,
  );

  if (existing) {
    existing.quantity += qty;
    return res.status(200).json(toCartResponse(existing));
  }

  const newItem = {
    id: uuidv4(),
    user_id: req.userId,
    product_id: product.id,
    quantity: qty,
  };
  cartItems.push(newItem);

  return res.status(201).json(toCartResponse(newItem));
});

router.patch("/:id", (req, res) => {
  const { quantity } = req.body || {};
  const qty = Number(quantity);

  if (!Number.isFinite(qty) || qty < 1) {
    return res.status(400).json({ message: "Quantity must be >= 1" });
  }

  const cartItem = cartItems.find(
    (item) => item.id === req.params.id && item.user_id === req.userId,
  );
  if (!cartItem) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  cartItem.quantity = qty;
  return res.status(200).json(toCartResponse(cartItem));
});

router.delete("/:id", (req, res) => {
  const index = cartItems.findIndex(
    (item) => item.id === req.params.id && item.user_id === req.userId,
  );
  if (index === -1) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  cartItems.splice(index, 1);
  return res.status(204).send();
});

router.delete("/", (req, res) => {
  for (let i = cartItems.length - 1; i >= 0; i -= 1) {
    if (cartItems[i].user_id === req.userId) {
      cartItems.splice(i, 1);
    }
  }
  return res.status(204).send();
});

module.exports = router;
