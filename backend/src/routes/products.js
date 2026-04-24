const express = require('express');
const { products } = require('../data/seed');

const router = express.Router();

router.get('/', (req, res) => {
  const { category, search, sort, page, limit } = req.query;
  let result = [...products];

  if (category) {
    result = result.filter((product) => product.category === String(category));
  }

  if (search) {
    const query = String(search).toLowerCase();
    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
  }

  if (sort === 'price_asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === 'name_asc') {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  const pageNumber = Number(page || 1);
  const limitNumber = Number(limit || result.length);
  const start = (Math.max(pageNumber, 1) - 1) * Math.max(limitNumber, 1);
  const end = start + Math.max(limitNumber, 1);

  return res.status(200).json(result.slice(start, end));
});

router.get('/:id', (req, res) => {
  const product = products.find((item) => item.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  return res.status(200).json(product);
});

module.exports = router;
